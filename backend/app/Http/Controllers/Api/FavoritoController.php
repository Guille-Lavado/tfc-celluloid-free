<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Obra;
use App\Models\Director;

class FavoritoController extends Controller
{
   // Mostrar Obras favoritas de un Usuario
    public function obras(Request $request)
    {
        $favoritos = $request->user()
            ->favoritosObra()
            ->with(['genero', 'director'])
            ->get();
 
        return response()->json($favoritos, 200);
    }
 
    // Alterna el estado de la relación entre una Obra y el Usuaio 
    public function toggleObra(Request $request, int $id)
    {
        $resultado = $request->user()->favoritosObra()->toggle($id);
        $added     = count($resultado['attached']) > 0;
 
        return response()->json([
            'favorito' => $added,
            'obra_id'  => $id,
        ], 200);
    }
 
    // Mostrar Directores favoritas de un Usuario
    public function directores(Request $request)
    {
        $favoritos = $request->user()
            ->favoritosDirector()
            ->get();
 
        return response()->json($favoritos, 200);
    }
 
    // Alterna el estado de la relación entre un Director y el Usuaio
    public function toggleDirector(Request $request, int $id)
    {
        $resultado  = $request->user()->favoritosDirector()->toggle($id);
        $added      = count($resultado['attached']) > 0;
 
        return response()->json([
            'favorito'    => $added,
            'director_id' => $id,
        ], 200);
    }
}
