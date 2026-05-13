<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Obra;
use App\Models\Videometraje;
use App\Models\PeliVideo;
use App\Models\SerieVideo;

class ObraController extends Controller
{
    /**
     * Obtener todas las Obras
     */
    public function index(Request $request)
    {
        $nombre = $request['nombre'] ?? '';
        $genero = $request['genero'] ?? '';
        $director = $request['director'] ?? '';

        $obras = Obra::with(['genero', 'director']);

        // Filtrar obras si existe el parámetro nombre, genero o director
        if ($nombre) {
            $obras = $obras->where('titulo', 'like', "%{$nombre}%");
        } elseif ($genero) {
            $obras = $obras->whereHas('genero', fn($q) => $q->where('nombre', 'like', "%{$genero}%"));
        } elseif ($director) {
            $obras = $obras->whereHas('director', fn($q) => $q->where('nombre', 'like', "%{$director}%"));
        } 

        $obras = $obras->orderBy('created_at', 'desc')->get();
        $res_obra = [];

        // Mostrar solo la información necesaria
        foreach($obras as $obra) {
            $res_obra[] = [
                'id' => $obra['id'],
                'titulo' => $obra['titulo'],
                'sinopsis' => $obra['sinopsis'],
                'poster' => $obra['poster'],
                'genero' => [
                    'nombre' => $obra['genero']['nombre']
                ],
                'director' => [
                    'nombre' => $obra['director']['nombre'],
                    'fecha_nacimiento' => $obra['director']['fecha_nacimiento'],
                    'biografia' => $obra['director']['biografia'],
                ],
                'peli_video' => $obra->peliVideo !== null,
                'serie_video' => $obra->capitulosVideo()->exists(),
            ];
        }

        return response()->json($res_obra, 200);
    }

    /**
     * Crear una nueva Obra y Videometraje con relación de PeliVideo o SerieVideo
     * Acepta multipart/form-data con archivo de vídeo para subir a B2
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo'      => 'required|string|max:255',
            'sinopsis'    => 'nullable|string',
            'poster'      => 'nullable|string|url',
            'id_genero'   => 'nullable|exists:genero,id',
            'id_director' => 'required|exists:director,id',
            'tipo'        => 'required|in:pelicula,serie',
            // Película
            'video'       => 'required_if:tipo,pelicula|nullable|file|mimes:mp4,mkv,avi,mov|mimetypes:video/mp4,video/x-matroska,video/x-msvideo,video/avi,video/quicktime|max:2097152',
            'nombre'      => 'nullable|string|max:255',
            // Serie
            'capitulos'             => 'required_if:tipo,serie|nullable|array|min:1',
            'capitulos.*.video'     => 'required|file|mimes:mp4,mkv,avi,mov|mimetypes:video/mp4,video/x-matroska,video/x-msvideo,video/avi,video/quicktime|max:2097152',
            'capitulos.*.nombre'    => 'nullable|string|max:255',
            'capitulos.*.temporada' => 'required|integer|min:1',
            'capitulos.*.episodio'  => 'required|integer|min:1',
        ]);

        $obra = DB::transaction(function () use ($request) {
            $obra = Obra::create([
                'titulo'      => $request->titulo,
                'sinopsis'    => $request->sinopsis,
                'poster'      => $request->poster,
                'id_genero'   => $request->id_genero,
                'id_director' => $request->id_director,
            ]);

            if ($request->tipo === 'pelicula') {
                $url = $this->subirVideo($request->file('video'), 'peliculas');
                $video = Videometraje::create([
                    'url_video' => $url,
                    'duracion'  => 0,
                    'nombre'    => $request->nombre ?? $obra->titulo,
                ]);
                PeliVideo::create(['id_video' => $video->id, 'id_obra' => $obra->id]);
            } else {
                foreach ($request->capitulos as $index => $cap) {
                    $url = $this->subirVideo($request->file("capitulos.{$index}.video"), 'series');
                    $video = Videometraje::create([
                        'url_video' => $url,
                        'duracion'  => 0,
                        'nombre'    => $cap['nombre'] ?? "{$obra->titulo} S{$cap['temporada']}E{$cap['episodio']}",
                    ]);
                    SerieVideo::create([
                        'id_video'  => $video->id,
                        'id_obra'   => $obra->id,
                        'temporada' => $cap['temporada'],
                        'episodio'  => $cap['episodio'],
                    ]);
                }
            }

            return $obra;
        });

        return response()->json(
            $obra->load(['genero', 'director', 'peliVideo.videometraje', 'capitulosVideo.videometraje']),
            201
        );
    }

    /**
     * Obtener Obra por Id
     */
    public function show($id)
    {
        $obra = Obra::with(['genero', 'director', 'peliVideo.videometraje', 'capitulosVideo.videometraje'])
            ->findOrFail($id);

        return response()->json($obra, 200);
    }

    /**
     * Actualizar una Obra
     */
    public function update(Request $request, $id)
    {
        $obra = Obra::findOrFail($id);

        $data = $request->validate([
            'titulo'      => 'sometimes|string|max:255',
            'sinopsis'    => 'sometimes|nullable|string',
            'poster'      => 'sometimes|nullable|string|url',
            'id_genero'   => 'sometimes|exists:genero,id',
            'id_director' => 'sometimes|exists:director,id',
        ]);

        $obra->update($data);

        return response()->json([
            'message' => 'Obra actualizada correctamente',
            'data' => $obra->load(['genero', 'director'])
        ], 200);
    }

    /**
     * Eliminar una Obra
     */
    public function destroy($id)
    {
        $obra = Obra::findOrFail($id);
        $obra->delete();

        return response()->json(['message' => 'Obra eliminada correctamente'], 200);
    }

    /**
     * Sube un archivo de vídeo a Backblaze B2 y devuelve la URL pública
     */
    private function subirVideo($archivo, string $carpeta): string
    {
        $path = $archivo->store($carpeta, 'b2');
        return Storage::disk('b2')->url($path);
    }
}