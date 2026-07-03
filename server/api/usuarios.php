<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once("../config/headers.php");
require_once("../config/db.php");

header('Content-Type: application/json; charset=utf-8');

$postData = file_get_contents("php://input");
$post = json_decode($postData, true);

if (json_last_error() !== JSON_ERROR_NONE) {
  echo json_encode(["success" => false, "error" => "Error al decodificar JSON: " . json_last_error_msg()]);
  exit;
}

if (!$post || !isset($post["action"])) {
  echo json_encode(["success" => false, "error" => "JSON malformado o acción no enviada"]);
  exit;
}

$action = $post["action"];

switch ($action)
{
  case "get":
    $res = $conn->query("SELECT email,nombre, userid FROM tusuarios ORDER BY email");
    echo $res
      ? json_encode($res->fetch_all(MYSQLI_ASSOC))
      : json_encode(["success" => false, "error" => $conn->error]);
    break;

  case "getPermisos":
    $email = $conn->real_escape_string($post['email']);
    $sql = "
      SELECT ruta FROM tpermisos_detalle
      WHERE idPermiso = (
        SELECT idPermisos FROM tusuarios WHERE email = '$email'
      )
      UNION
      SELECT ruta FROM tpermisos_usuario_extra WHERE email = '$email'
    ";
    $res = $conn->query($sql);
    echo $res
      ? json_encode($res->fetch_all(MYSQLI_ASSOC))
      : json_encode(["success" => false, "error" => $conn->error]);
    break;

  case "getPermisosTodos":
    $res = $conn->query("SELECT id, nombre FROM tpermisos ORDER BY nombre");
    echo $res
      ? json_encode($res->fetch_all(MYSQLI_ASSOC))
      : json_encode(["success" => false, "error" => $conn->error]);
    break;

  case "getDetallePermiso":
    $idPermiso = intval($post["idPermiso"]);
    $res = $conn->query("SELECT id, ruta FROM tpermisos_detalle WHERE idPermiso = $idPermiso ORDER BY ruta");
    echo $res
      ? json_encode($res->fetch_all(MYSQLI_ASSOC))
      : json_encode(["success" => false, "error" => $conn->error]);
    break;

  case "insertPermiso":
    $nombre = $conn->real_escape_string($post["nombre"]);
    $res = $conn->query("INSERT INTO tpermisos (nombre) VALUES ('$nombre')");
    echo json_encode(["success" => $res, "error" => $conn->error]);
    break;

  case "updatePermiso":
    $id = intval($post["id"]);
    $nombre = $conn->real_escape_string($post["nombre"]);
    $res = $conn->query("UPDATE tpermisos SET nombre = '$nombre' WHERE id = $id");
    echo json_encode(["success" => $res, "error" => $conn->error]);
    break;

  case "agregarRuta":
    $idPermiso = intval($post["idPermiso"]);
    $ruta = $conn->real_escape_string($post["ruta"]);
    $res = $conn->query("INSERT INTO tpermisos_detalle (idPermiso, ruta) VALUES ($idPermiso, '$ruta')");
    echo json_encode(["success" => $res, "error" => $conn->error]);
    break;

  case "eliminarRuta":
    $id = intval($post["id"]);
    $res = $conn->query("DELETE FROM tpermisos_detalle WHERE id = $id");
    echo json_encode(["success" => $res, "error" => $conn->error]);
    break;

  case "delete":
    $email = $conn->real_escape_string($post['email']);
    $res = $conn->query("DELETE FROM tusuarios WHERE email = '$email'");
    echo json_encode(["success" => $res, "error" => $conn->error]);
    break;

  case "verificarOInsertar":
    
    date_default_timezone_set('America/Argentina/Mendoza');


    if (!$post["email"]) {
      echo json_encode(["success" => false, "error" => "Faltan datos obligatorios"]);
      exit;
    }

    $userid = $conn->real_escape_string($post["userid"]);
    $email = $conn->real_escape_string($post['email']);
    $nombre = isset($post['nombre']) ? $conn->real_escape_string($post['nombre']) : '';

    // Buscar si el email ya está registrado
    $check = $conn->query("SELECT * FROM tusuarios WHERE email = '$email'");
    if ($check && $check->num_rows == 0) {
      $sql = "INSERT INTO tusuarios (userid, email, nombre, idPermisos)
              VALUES ('$userid', '$email', '$nombre', 0)";
      $insert = $conn->query($sql);
      if (!$insert) {
        echo json_encode(["success" => false, "error" => $conn->error]);
        exit;
      }
    }

    $fechaHoraIngreso = date('Y-m-d H:i:s');
    $sqlIngreso = "INSERT INTO tusuarios_ingresos (email, fecha_hora_ingreso) 
                   VALUES ('$email', '$fechaHoraIngreso')";
    $conn->query($sqlIngreso);

    // Traer datos por email
    $res = $conn->query("SELECT * FROM tusuarios WHERE email = '$email'");
    if ($res && $res->num_rows > 0) {
      $usuario = $res->fetch_assoc();
      echo json_encode(["success" => true, "usuario" => $usuario]);
    } else {
      echo json_encode([
        "success" => false,
        "error" => "Usuario no encontrado tras inserción",
        "debug" => [
          "email" => $email,
          "rows" => $res ? $res->num_rows : 0,
          "sql" => "SELECT * FROM tusuarios WHERE email = '$email'",
          "conn_error" => $conn->error
        ]
      ]);
    }
    break;

  case "registroingreso":
    
    date_default_timezone_set('America/Argentina/Mendoza');

    if (!$post["email"]) {
      echo json_encode(["success" => false, "error" => "Faltan datos obligatorios"]);
      exit;
    }
    if (!$post["pantalla"]) {
      $pantalla = null;  
    }else{
      $pantalla = $conn->real_escape_string($post['pantalla']);
    }
    
    $emailingreso = $conn->real_escape_string($post['email']);
    
    $fechaHoraIngresopantalla = date('Y-m-d H:i:s');
    $sqlIngresousuario = "INSERT INTO tusuarios_ingresos (email, pantalla, fecha_hora_ingreso) 
                   VALUES ('$emailingreso','$pantalla','$fechaHoraIngresopantalla')";

    if ($conn->query($sqlIngresousuario)) {
      echo json_encode(["success" => true]);
    } else {
      echo json_encode(["success" => false, "error" => $conn->error]);
    }
    break;

  default:
    echo json_encode(["success" => false, "error" => "Acción inválida"]);
    break;
}
?>
