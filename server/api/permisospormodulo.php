<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$post = json_decode(file_get_contents("php://input"), true);
$action = $post["action"] ?? "";

switch ($action) {
    case "getUsuarios":
        $res = $conn->query("SELECT email, nombre, idPermisos FROM tusuarios ORDER BY email");
        echo json_encode($res ? $res->fetch_all(MYSQLI_ASSOC) : []);
        break;

    case "getPermisos":
        $res = $conn->query("SELECT id, nombre FROM tpermisos ORDER BY nombre");
        echo json_encode($res ? $res->fetch_all(MYSQLI_ASSOC) : []);
        break;

    case "actualizar":
        $email = $conn->real_escape_string($post["email"]);
        $nombre = $conn->real_escape_string($post["nombre"]);
        $idPermisos = (int)$post["idPermisos"];
        $res = $conn->query("UPDATE tusuarios SET nombre = '$nombre', idPermisos = $idPermisos WHERE email = '$email'");
        echo json_encode(["success" => $res, "error" => $conn->error]);
        break;

    default:
        echo json_encode(["success" => false, "error" => "Acción inválida"]);
        break;
}
?>
