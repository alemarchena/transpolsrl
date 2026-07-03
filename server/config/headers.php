<?php
// Permite acceso desde cualquier origen (ajustable según entorno)
header("Access-Control-Allow-Origin: *");

// Permite métodos comunes
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Permite cabeceras específicas (necesario para JSON)
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Respuestas en JSON
header("Content-Type: application/json; charset=UTF-8");

// En caso de ser una solicitud de verificación previa (preflight), finalizar aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
