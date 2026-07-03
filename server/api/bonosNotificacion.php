<?php
require_once("../config/headers.php");
require_once("../config/db.php");


// 🔑 CLAVE DE SERVIDOR DE FIREBASE (FCM) - la agregaremos luego
$FIREBASE_SERVER_KEY = "TU_API_KEY_FIREBASE";

// 1. Traemos todos los bonos sin firmar
$sql = "
    SELECT pb.id, pb.idPersona, tp.nombre, tp.apellido, tp.whatsapp
    FROM tpersonasbonos pb
    JOIN tpersonas tp ON tp.id = pb.idPersona
    WHERE pb.firmado_por IS NULL OR pb.firmado_por = ''
";
$res = $conn->query($sql);

$bonos = $res->fetch_all(MYSQLI_ASSOC);

if (count($bonos) === 0) {
    echo json_encode(["mensaje" => "No hay bonos sin firmar"]);
    exit;
}

// 2. Por ahora solo mostramos los datos
foreach ($bonos as $bono) {
    echo "Bono ID: ".$bono['id']." - Persona: ".$bono['nombre']." ".$bono['apellido']."\n";
}