<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\Videometraje;
use App\Models\Comentario;
use App\Models\Obra;
use App\Models\Director;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'rol',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // convertie automáticamente los valores de la base de datos
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function puntuaciones()
    {
        return $this->belongsToMany(Videometraje::class, 'puntuacion', 'id_user', 'id_video')
             ->withPivot('valor');

    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class, 'id_user');    
    }

    public function favoritosObra()
    {
        return $this->belongsToMany(Obra::class, 'favorito_obra', 'id_usuario', 'id_obra');
    }
 
    public function favoritosDirector()
    {
        return $this->belongsToMany(Director::class, 'favorito_director', 'id_usuario', 'id_director');
    }
}