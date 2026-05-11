<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

use App\User;

use App\Models\Genero;
use App\Models\Director;
use App\Models\Obra;
use App\Models\Videometraje;
use App\Models\PeliVideo;
use App\Models\Comentario;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $usuario = User::create([
            'name'     => 'Guille',
            'email'    => 'guille@example.com',
            'password' => Hash::make('password'),
            'rol'      => 'administrador',
        ]);

        $cienciaFi = Genero::create(['nombre' => 'Ciencia Ficción']);
        $drama     = Genero::create(['nombre' => 'Drama']);

        // ---- Directores ----
        $kirk = Director::create([
            'nombre'           => 'Kirk Jones',
            'fecha_nacimiento' => '1964-10-31',
            'biografia'        => 'Director y guionista británico, conocido por combinar humor y emoción en películas como Despertando a Ned (1998), Nanny McPhee (2005) y Todos están bien (2009). Estudió en la Escuela de Cine de Newport y destaca por su estilo naturalista.',
            'img'              => 'https://storage.celluloid.com/directores/kirk.jpg',
        ]);

        $nolan = Director::create([
            'nombre'           => 'Christopher Nolan',
            'fecha_nacimiento' => '1970-07-30',
            'biografia'        => 'Director, guionista y productor británico-estadounidense, reconocido por revolucionar el cine contemporáneo con narrativas no lineales, estructuras temporales complejas y el uso de efectos prácticos.',
            'img'              => 'https://storage.celluloid.com/directores/nolan.jpg',
        ]);

        $kubrick = Director::create([
            'nombre'           => 'Stanley Kubrick',
            'fecha_nacimiento' => '1928-07-26',
            'biografia'        => 'Director y productor estadounidense, considerado uno de los más influyentes de la historia del cine.',
            'img'              => 'https://storage.celluloid.com/directores/kubrick.jpg'
        ]);

        // ---- Obras ----
        $iSwear = Obra::create([
            'titulo'      => 'I Swear',
            'sinopsis'    => 'Basada en una extraordinaria historia real, nos narra el viaje de superación de John Davidson aprendiendo a convivir con el Síndrome de Tourette. John se enfrentará con valor y humor a los prejuicios, al rechazo y a sus propios miedos, descubriendo que la valentía y la humanidad pueden ser más fuertes que cualquier obstáculo.',
            'poster'      => 'https://storage.celluloid.com/obras/i-swear.png',
            'id_genero'   => $drama->id,
            'id_director' => $kirk->id,
        ]);

        $odisea = Obra::create([
            'titulo'      => '2001: A Space Odyssey',
            'sinopsis'    => 'Tras el descubrimiento de un misterioso monolito enterrado bajo la superficie lunar, un viaje a Júpiter degenera cuando la IA del barco empieza a mostrar comportamiento hostil.',
            'poster'      => 'https://storage.celluloid.com/obras/a-space-odyssey.png',
            'id_genero'   => $cienciaFi->id,
            'id_director' => $kubrick->id,
        ]);

        $inception = Obra::create([
            'titulo'      => 'Inception',
            'sinopsis'    => 'Un ladrón que roba secretos corporativos mediante el uso de la tecnología de compartir sueños recibe la tarea inversa de plantar una idea en la mente de un CEO.',
            'poster'      => 'https://storage.celluloid.com/posters/inception.jpg',
            'id_genero'   => $cienciaFi->id,
            'id_director' => $nolan->id,
        ]);

        // ---- Videometraje ----
        $videoISwear = Videometraje::create([
            'url_video' => 'https://f003.backblazeb2.com/file/celluloid-free/peliculas/gtXJMOjHQbJxdX2TWHvJ7xtHb90A6TGOOLGLokrx.mkv',
            'duracion'  => 7260, // 2h 1min
            'nombre'    => 'I Swear (2025)',
        ]);

        $videoOdisea = Videometraje::create([
            'url_video' => 'https://storage.celluloid.com/videos/2001-space-odyssey.mp4',
            'duracion'  => 8940, // 2h 29min
            'nombre'    => '2001: A Space Odyssey (1968)',
        ]);

        $videoInception = Videometraje::create([
            'url_video' => 'https://storage.celluloid.com/videos/inception.mp4',
            'duracion'  => 8880, // 2h 28min
            'nombre'    => 'Inception (2010)',
        ]);

        PeliVideo::create([
            'id_video' => $videoISwear->id,
            'id_obra'  => $iSwear->id,
        ]);

        PeliVideo::create([
            'id_video' => $videoOdisea->id,
            'id_obra'  => $odisea->id,
        ]);

        PeliVideo::create([
            'id_video' => $videoInception->id,
            'id_obra'  => $inception->id,
        ]);

        Comentario::create([
            'id_video'  => $videoOdisea->id,
            'id_user'   => $usuario->id,
            'contenido' => 'Una película que se adelantó décadas a su tiempo.',
        ]);

        $usuario->puntuaciones()->attach($videoOdisea->id, ['valor' => 5]);
    }
}
