<?php
 
return [
 
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */
 
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
 
    'allowed_methods' => ['*'],
 
    'allowed_origins' => [
        'https://laravel-production-f510.up.railway.app',
    ],
 
    'allowed_origins_patterns' => [],
 
    'allowed_headers' => ['*'],
 
    'exposed_headers' => [],
 
    'max_age' => 0,
 
    // Obligatorio para que Sanctum pueda enviar y recibir cookies
    'supports_credentials' => true,
 
];