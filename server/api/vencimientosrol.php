<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);
$action = $request["action"] ?? '';

switch ($action) {
  case "get":
    $idPersona = $conn->real_escape_string($request["idPersona"]);

    // Obtener el ID y nombre del rol de la persona
    $rolRes = $conn->query("
      SELECT r.id AS idRol, r.nombre AS nombreRol
      FROM trrhh rr
      INNER JOIN troles r ON rr.idRol = r.id
      WHERE rr.idPersona = $idPersona
    ");

    if ($rolRes->num_rows === 0) {
      echo json_encode([]);
      exit;
    }

    $rolData = $rolRes->fetch_assoc();
    $idRol = $rolData["idRol"];
    $nombreRol = $rolData["nombreRol"];

    // Obligaciones con loTiene = 1 y LEFT JOIN para traer vencimientos
    $query = "
      SELECT o.id AS idObligacionRol, o.nombre, o.vencimiento,
       COALESCE(v.loTiene, o.loTiene) AS loTiene,
             v.id AS idVencimiento, v.fecha,
             '$nombreRol' AS rol
      FROM tobligacionesrol o
      LEFT JOIN tvencimientos v ON o.id = v.idObligacionRol AND v.idPersona = $idPersona
      WHERE o.idRol = $idRol AND o.loTiene = 1
    ";

    $res = $conn->query($query);
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "insert":
    $idPersona = (int) $request["idPersona"];
    $idObligacionRol = (int) $request["idObligacionRol"];
    $fecha = $conn->real_escape_string($request["fecha"]);
    $loTiene = (int) $request["loTiene"];

    // Obtener el idRol desde trrhh
    $resRol = $conn->query("SELECT idRol FROM trrhh WHERE idPersona = $idPersona LIMIT 1");
    $idRol = 0;
    if ($resRol && $resRol->num_rows > 0) {
        $idRol = (int)$resRol->fetch_assoc()["idRol"];
    }

    // Armar query de insert
    if (trim($fecha) === "") {
        $query = "INSERT INTO tvencimientos (idPersona, idObligacionRol, fecha, idRol, loTiene)
                  VALUES ($idPersona, $idObligacionRol, NULL, $idRol, $loTiene)";
    } else {
        $query = "INSERT INTO tvencimientos (idPersona, idObligacionRol, fecha, idRol, loTiene)
                  VALUES ($idPersona, $idObligacionRol, '$fecha', $idRol, $loTiene)";
    }

    echo json_encode(["success" => $conn->query($query)]);
    break;

    case "update":
        $id = (int) $request["id"];
        $idPersona = (int) $request["idPersona"];
        $loTiene = isset($request["loTiene"]) ? (int)$request["loTiene"] : 0;

        // Obtener el idRol desde trrhh
        $resRol = $conn->query("SELECT idRol FROM trrhh WHERE idPersona = $idPersona LIMIT 1");
        $idRol = 0;
        if ($resRol && $resRol->num_rows > 0) {
            $idRol = (int)$resRol->fetch_assoc()["idRol"];
        }

        $fecha = $conn->real_escape_string($request["fecha"]);
        $fecha = ($fecha === "" || $fecha === "0000-00-00") ? "NULL" : "'$fecha'";

        // Actualizamos fecha, loTiene y el idRol correcto
        $query = "UPDATE tvencimientos 
                  SET fecha = $fecha, loTiene = $loTiene, idRol = $idRol
                  WHERE id = $id";

        echo json_encode(["success" => $conn->query($query)]);
        break;


  case "update":
      $id = (int) $request["id"];
      $loTiene = isset($request["loTiene"]) ? (int)$request["loTiene"] : 0;

      $fecha = $conn->real_escape_string($request["fecha"]);
      $fecha = ($fecha === "" || $fecha === "0000-00-00") ? "NULL" : "'$fecha'";

      $query = "UPDATE tvencimientos SET fecha = $fecha, loTiene = $loTiene WHERE id = $id";

      echo json_encode(["success" => $conn->query($query)]);
      break;



  case "delete":
    $id = (int) $request["id"];
    $query = "DELETE FROM tvencimientos WHERE id = $id";
    echo json_encode(["success" => $conn->query($query)]);
    break;

  default:
    echo json_encode(["error" => "Acción no válida"]);
    break;
}
