<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comentario;
use App\Models\Videometraje;

class ComentarioController extends Controller
{
    // Mostrar todos los comentario de un video con información del usuario
    public function index(int $id)
    {
        $comentarios = Comentario::with('usuario:id,name')
            ->where('id_video', $id)
            ->orderByDesc('created_at')
            ->get();
 
        return response()->json($comentarios);
    }
 
    // Crear un comentario
    public function store(Request $request, int $id)
    {
        Videometraje::findOrFail($id);
 
        $data = $request->validate([
            'contenido' => 'required|string|max:1000',
        ]);
 
        $comentario = Comentario::create([
            'id_video'  => $id,
            'id_user'   => $request->user()->id,
            'contenido' => $data['contenido'],
        ]);
 
        return response()->json($comentario->load('usuario:id,name'), 201);
    }
 
    // Eliminar comentario con validación para administradores
    public function destroy(Request $request, int $id)
    {
        $comentario = Comentario::findOrFail($id);
 
        if ($comentario->id_user !== $request->user()->id && !$request->user()->esAdmin()) {
            abort(403, 'No tienes permiso para eliminar este comentario.');
        }
 
        $comentario->delete();
 
        return response()->json(['message' => 'Comentario eliminado.']);
    }
}
