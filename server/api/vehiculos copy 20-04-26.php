<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "get":
    $res = $conn->query("SELECT * FROM tvehiculos ORDER BY numerointerno ASC");
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    break;

  case "generarClave":
    $intentos = 0;
    $maxIntentos = 100;
    
    do {
      // Generar clave de 5 caracteres alfanuméricos
      $caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin caracteres confusos
      $clave = '';
      for ($i = 0; $i < 5; $i++) {
        $clave .= $caracteres[random_int(0, strlen($caracteres) - 1)];
      }
      
      // Verificar que no exista
      $stmt = $conn->prepare("SELECT id FROM tvehiculos WHERE claveAcceso = ?");
      $stmt->bind_param("s", $clave);
      $stmt->execute();
      $result = $stmt->get_result();
      $existe = $result->num_rows > 0;
      $stmt->close();
      
      $intentos++;
    } while ($existe && $intentos < $maxIntentos);
    
    if ($intentos >= $maxIntentos) {
      echo json_encode(["success" => false, "error" => "No se pudo generar una clave única"]);
    } else {
      echo json_encode(["success" => true, "clave" => $clave]);
    }
    break;

  case "insert":
    $numerointerno = $conn->real_escape_string($data["numerointerno"] ?? "");
    $patente = $conn->real_escape_string($data["patente"] ?? "");
    $marca = $conn->real_escape_string($data["marca"] ?? "");
    $modelo = $conn->real_escape_string($data["modelo"] ?? "");
    $anio = (int)($data["anio"] ?? 0);
    $descripcion = $conn->real_escape_string($data["descripcion"] ?? "");    
    $cantidadbutacas = (int)($data["cantidadbutacas"]?? 0);
    $numerochasis = $conn->real_escape_string($data["numerochasis"]?? "");
    $kmfrecuenciacambioaceite = (int)($data["kmfrecuenciacambioaceite"] ?? 0);
    $esExterno = isset($data["esExterno"]) && $data["esExterno"] ? 1 : 0;
    $claveAcceso = $esExterno && !empty($data["claveAcceso"]) ? $conn->real_escape_string($data["claveAcceso"]) : NULL;

    if ($claveAcceso !== NULL) {
      $stmt = $conn->prepare("SELECT id FROM tvehiculos WHERE claveAcceso = ?");
      $stmt->bind_param("s", $claveAcceso);
      $stmt->execute();
      $result = $stmt->get_result();
      if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "error" => "La clave de acceso ya existe. Por favor, use otra clave."]);
        $stmt->close();
        break;
      }
      $stmt->close();
    }

    $sql = "INSERT INTO tvehiculos (numerointerno, patente, marca, modelo, anio, descripcion, cantidadbutacas, numerochasis, kmfrecuenciacambioaceite, esExterno, claveAcceso)
            VALUES ('$numerointerno', '$patente', '$marca', '$modelo', $anio, '$descripcion', $cantidadbutacas, '$numerochasis', $kmfrecuenciacambioaceite, $esExterno, " . ($claveAcceso ? "'$claveAcceso'" : "NULL") . ")";

    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "update":
    $id = (int)($data["id"] ?? 0);
    $numerointerno = $conn->real_escape_string($data["numerointerno"] ?? "");
    $patente = $conn->real_escape_string($data["patente"] ?? "");
    $marca = $conn->real_escape_string($data["marca"] ?? "");
    $modelo = $conn->real_escape_string($data["modelo"] ?? "");
    $anio = (int)($data["anio"] ?? 0);
    $descripcion = $conn->real_escape_string($data["descripcion"] ?? "");
    $cantidadbutacas = (int)($data["cantidadbutacas"]?? 0);
    $numerochasis = $conn->real_escape_string($data["numerochasis"] ?? "");
    $kmfrecuenciacambioaceite = (int)($data["kmfrecuenciacambioaceite"] ?? 0);
    $esExterno = isset($data["esExterno"]) && $data["esExterno"] ? 1 : 0;
    $claveAcceso = $esExterno && !empty($data["claveAcceso"]) ? $conn->real_escape_string($data["claveAcceso"]) : NULL;

    if ($claveAcceso !== NULL) {
      $stmt = $conn->prepare("SELECT id FROM tvehiculos WHERE claveAcceso = ? AND id != ?");
      $stmt->bind_param("si", $claveAcceso, $id);
      $stmt->execute();
      $result = $stmt->get_result();
      if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "error" => "La clave de acceso ya existe en otro vehículo. Por favor, use otra clave."]);
        $stmt->close();
        break;
      }
      $stmt->close();
    }

    $sql = "UPDATE tvehiculos 
            SET numerointerno = '$numerointerno',
                patente = '$patente',
                marca = '$marca',
                modelo = '$modelo',
                anio = $anio,
                descripcion = '$descripcion',
                cantidadbutacas = $cantidadbutacas,
                numerochasis = '$numerochasis',
                kmfrecuenciacambioaceite = $kmfrecuenciacambioaceite,
                esExterno = $esExterno,
                claveAcceso = " . ($claveAcceso ? "'$claveAcceso'" : "NULL") . "
            WHERE id = $id";

    echo json_encode(["success" => $conn->query($sql)]);
    break;

  case "delete":
    $id = (int)($data["id"] ?? 0);
    $sql = "DELETE FROM tvehiculos WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);
    break;

  default:
    http_response_code(400);
    echo json_encode(["error" => "Acción no válida"]);
    break;
}
?>
