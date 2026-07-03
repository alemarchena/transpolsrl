<?php
require_once("../config/headers.php");
require_once("../config/db.php");
require_once __DIR__ . '/../vendor/autoload.php';

$data = $_POST ?: json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

$protocolo = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];

$BASE_URL = "";

if ($host === 'localhost:8000') {
    $BASE_URL = "$protocolo://$host/uploads/documentospersona/";
} else {
    $BASE_URL = "$protocolo://$host/transpolsrlv1/server/uploads/documentospersona/";
}

$carpetaFisicaBase = __DIR__ . "/../uploads/documentospersona/";

function obtenerNombreCarpeta($conn, $idPersona) {
    $result = $conn->query("SELECT nombre, apellido FROM tpersonas WHERE id = $idPersona");
    if ($persona = $result->fetch_assoc()) {
        $nombreCarpeta = $persona['nombre'] . "_" . $persona['apellido'];
        $nombreCarpeta = strtolower($nombreCarpeta);
        $nombreCarpeta = preg_replace('/[^a-z0-9_]/', '', $nombreCarpeta);
        return $nombreCarpeta;
    }
    return $idPersona;
}

function normalizarDocumentos($docs, $nombreCarpeta, $baseUrl) {
    foreach ($docs as &$doc) {
        $doc["archivoUrl"] = $baseUrl . $nombreCarpeta . "/" . $doc['archivo'];
    }
    return $docs;
}

try {
    if (!is_dir($carpetaFisicaBase)) {
        mkdir($carpetaFisicaBase, 0777, true);
    }

    switch ($action) {
        case "get":
            $idPersona = intval($data["idPersona"]);
            $nombreCarpeta = obtenerNombreCarpeta($conn, $idPersona);
            $docs = $conn->query("SELECT * FROM tdocumentospersona WHERE idPersona = $idPersona ORDER BY fechaSubida DESC");
            $docsArray = $docs->fetch_all(MYSQLI_ASSOC);
            echo json_encode([
                "success" => true,
                "documentos" => normalizarDocumentos($docsArray, $nombreCarpeta, $BASE_URL)
            ]);
            break;

        case "upload":
            $idPersona = intval($_POST["idPersona"]);
            $nombre = $conn->real_escape_string($_POST["nombre"] ?? "");

            if (!isset($_FILES["archivo"])) {
                error_log("Error upload: No se encontró 'archivo' en \$_FILES. Keys disponibles: " . implode(", ", array_keys($_FILES)));
                echo json_encode(["success" => false, "error" => "No se recibió el archivo en el servidor"]);
                exit;
            }

            $errorCode = $_FILES["archivo"]["error"];
            if ($errorCode !== UPLOAD_ERR_OK) {
                $errorMessages = [
                    UPLOAD_ERR_INI_SIZE => "El archivo excede el tamaño máximo permitido por PHP",
                    UPLOAD_ERR_FORM_SIZE => "El archivo excede el tamaño máximo del formulario",
                    UPLOAD_ERR_PARTIAL => "El archivo se subió parcialmente",
                    UPLOAD_ERR_NO_FILE => "No se seleccionó ningún archivo",
                    UPLOAD_ERR_NO_TMP_DIR => "Falta el directorio temporal",
                    UPLOAD_ERR_CANT_WRITE => "Error al escribir el archivo en disco",
                    UPLOAD_ERR_EXTENSION => "Una extensión de PHP detuvo la subida"
                ];
                $mensajeError = $errorMessages[$errorCode] ?? "Error desconocido al subir archivo (código: $errorCode)";
                error_log("Error upload: " . $mensajeError);
                echo json_encode(["success" => false, "error" => $mensajeError]);
                exit;
            }

            $maxSize = 10 * 1024 * 1024;
            if ($_FILES["archivo"]["size"] > $maxSize) {
                echo json_encode(["success" => false, "error" => "El archivo es demasiado grande (máximo 10MB)"]);
                exit;
            }

            $nombreCarpeta = obtenerNombreCarpeta($conn, $idPersona);
            $dir = $carpetaFisicaBase . $nombreCarpeta;
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
            }

            $nombreArchivo = basename($_FILES["archivo"]["name"]);
            $destino = "$dir/$nombreArchivo";
            
            if (!move_uploaded_file($_FILES["archivo"]["tmp_name"], $destino)) {
                error_log("Error al mover el archivo: " . $_FILES["archivo"]["tmp_name"] . " a " . $destino);
                error_log("Permisos del directorio: " . substr(sprintf('%o', fileperms($dir)), -4));
                echo json_encode(["success" => false, "error" => "No se pudo guardar el archivo en el servidor"]);
                exit;
            }
            
            $nombreArchivoEsc = $conn->real_escape_string($nombreArchivo);
            $conn->query("INSERT INTO tdocumentospersona (idPersona, nombre, archivo)
                         VALUES ($idPersona, '$nombre', '$nombreArchivoEsc')");
            
            $docs = $conn->query("SELECT * FROM tdocumentospersona WHERE idPersona = $idPersona ORDER BY fechaSubida DESC");
            $docsArray = $docs->fetch_all(MYSQLI_ASSOC);
            echo json_encode(["success" => true, "documentos" => normalizarDocumentos($docsArray, $nombreCarpeta, $BASE_URL)]);
            break;

        case "delete":
            $id = intval($data["id"]);
            $doc = $conn->query("SELECT * FROM tdocumentospersona WHERE id = $id")->fetch_assoc();
            if ($doc) {
                $nombreCarpeta = obtenerNombreCarpeta($conn, $doc["idPersona"]);
                $path = $carpetaFisicaBase . "$nombreCarpeta/{$doc["archivo"]}";
                if (file_exists($path)) {
                    unlink($path);
                }
                $conn->query("DELETE FROM tdocumentospersona WHERE id = $id");
                
                $docs = $conn->query("SELECT * FROM tdocumentospersona WHERE idPersona = {$doc["idPersona"]} ORDER BY fechaSubida DESC");
                $docsArray = $docs->fetch_all(MYSQLI_ASSOC);
                echo json_encode(["success" => true, "documentos" => normalizarDocumentos($docsArray, $nombreCarpeta, $BASE_URL)]);
            } else {
                echo json_encode(["success" => false, "error" => "Documento no encontrado"]);
            }
            break;

        default:
            throw new Exception("Acción no válida: " . $action);
    }
} catch (Exception $e) {
    error_log("Error en documentospersona.php: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
