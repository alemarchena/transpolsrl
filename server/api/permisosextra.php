<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$post = json_decode(file_get_contents("php://input"), true);
$action = $post["action"] ?? "";

switch ($action) {
    case "get":
        $res = $conn->query("SELECT * FROM tpermisos_usuario_extra ORDER BY email ASC");
        echo json_encode($res ? $res->fetch_all(MYSQLI_ASSOC) : []);
        break;

    case "add":
        $email = $conn->real_escape_string($post["email"]);
        $ruta = $conn->real_escape_string($post["ruta"]);
        $res = $conn->query("INSERT INTO tpermisos_usuario_extra (email, ruta) VALUES ('$email', '$ruta')");
        echo json_encode(["success" => $res, "error" => $conn->error]);
        break;

    case "delete":
        $id = (int)$post["id"];
        $res = $conn->query("DELETE FROM tpermisos_usuario_extra WHERE id = $id");
        echo json_encode(["success" => $res, "error" => $conn->error]);
        break;

    case "getRutasDisponibles":
        $res = $conn->query("SELECT DISTINCT ruta FROM tpermisos_detalle ORDER BY ruta");
        echo json_encode($res ? $res->fetch_all(MYSQLI_ASSOC) : []);
        break;

    case "getPermisosGenerales":
        $res = $conn->query("SELECT id, nombre FROM tpermisos ORDER BY id ASC");
        echo json_encode($res ? $res->fetch_all(MYSQLI_ASSOC) : []);
        break;

    case "getRutasPorPermiso":
        $id = (int)$post["idPermiso"];
        $res = $conn->query("SELECT id, ruta FROM tpermisos_detalle WHERE idPermiso = $id ORDER BY ruta ASC");
        echo json_encode($res ? $res->fetch_all(MYSQLI_ASSOC) : []);
        break;

    case "addRutaAGrupo":
        $id = (int)$post["idPermiso"];
        $ruta = $conn->real_escape_string($post["ruta"]);
        $res = $conn->query("INSERT INTO tpermisos_detalle (idPermiso, ruta) VALUES ($id, '$ruta')");
        echo json_encode(["success" => $res, "error" => $conn->error]);
        break;

    case "eliminarRutaDeGrupo":
        $id = (int)$post["id"];
        $res = $conn->query("DELETE FROM tpermisos_detalle WHERE id = $id");
        echo json_encode(["success" => $res, "error" => $conn->error]);
        break;

    default:
        echo json_encode(["success" => false, "error" => "Acción inválida"]);
        break;
}
?>
