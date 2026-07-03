<?php
// $host="10.0.10.78";
// $host="127.0.0.1";
// $port=3306;
// $socket="";
// $db     = "templays_juta";
// $user   = "templays_alemarchena";
// $pass   = "Picapiedra2887";

// $conn = new mysqli($host, $user, $pass, $db);
// if ($conn->connect_error) {
//   http_response_code(500);
//   echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
//   exit;
// }

$env = getenv('APP_ENV');

if ($env === 'docker') {
    // Configuración para Docker
    $host = getenv('DB_HOST');
    $user = getenv('DB_USER');
    $password = getenv('DB_PASSWORD');
    $db = getenv('DB_NAME');
} else {
    // Configuración para producción (Hostinger)
    $host = "127.0.0.1";
    $db = "templays_juta";
    $user = "templays_alemarchena";
    $password = "Picapiedra2887";
}

$conn = new mysqli($host, $user, $password, $db);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}



?>
