<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComentariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comentario', function (Blueprint $table) {
            $table->id('id_comentario');
            $table->unsignedBigInteger('id_video');
            $table->unsignedBigInteger('id_user');
            $table->text('contenido');
            $table->timestamps();
 
            $table->foreign('id_video')
                ->references('id')->on('videometraje')
                ->cascadeOnDelete();
 
            $table->foreign('id_user')
                ->references('id')->on('users')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comentario');
    }
}
