<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\User;

class Comentario extends Model
{
    protected $table      = 'comentario';
    protected $primaryKey = 'id_comentario';

    protected $hidden = ['created_at', 'updated_at'];

    // Añadir un campo extra llamado 'fecha'
    protected $appends = ['fecha'];

    public function getFechaAttribute()
    {
        // Devolvemos el valor de created_at con un formato específico
        return $this->created_at;
    }

    protected $fillable = [
        'id_video',
        'id_user',
        'contenido',
    ];

    public function videometraje()
    {
        return $this->belongsTo(Videometraje::class, 'id_video');
    }
 
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}