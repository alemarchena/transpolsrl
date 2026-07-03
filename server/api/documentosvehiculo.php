<?php
require_once("../config/headers.php");
require_once("../config/db.php");
require_once __DIR__ . '/../vendor/autoload.php';

// Detectar si viene por JSON o FORM-DATA
$data = $_POST ?: json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

// Definiciones globales de rutas basadas en el host
$protocolo = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];

$BASE_URL = "";

if ($host === 'localhost:8000') {
    $BASE_URL = "$protocolo://$host/uploads/documentosvehiculo/";
} else {
    $BASE_URL = "$protocolo://$host/transpolsrlv1/server/uploads/documentosvehiculo/";
}

// Carpeta física base donde se guardarán los archivos
$carpetaFisicaBase = __DIR__ . "/../uploads/documentosvehiculo/";

/**
 * Limpia el numeroInterno para usarlo como nombre de carpeta
 */
function limpiarNombreCarpeta($numeroInterno) {
    $limpio = preg_replace('/[^a-zA-Z0-9]/', '_', $numeroInterno);
    $limpio = preg_replace('/_+/', '_', $limpio);
    return trim($limpio, '_');
}

/**
 * Detecta dónde está realmente un archivo específico
 * Busca en: numeroInterno limpio, numeroInterno original, o ID del vehículo
 */
function detectarCarpetaArchivo($carpetaBase, $numeroInterno, $idVehiculo, $nombreArchivo) {
    // Opción 1: Carpeta con numeroInterno limpio
    $carpetaLimpia = limpiarNombreCarpeta($numeroInterno);
    if (file_exists($carpetaBase . $carpetaLimpia . '/' . $nombreArchivo)) {
        return $carpetaLimpia;
    }
    
    // Opción 2: Carpeta con numeroInterno original (con espacios)
    if (file_exists($carpetaBase . $numeroInterno . '/' . $nombreArchivo)) {
        return $numeroInterno;
    }
    
    // Opción 3: Carpeta antigua con ID del vehículo
    if (file_exists($carpetaBase . $idVehiculo . '/' . $nombreArchivo)) {
        return $idVehiculo;
    }
    
    // Por defecto, retornar carpeta limpia
    return $carpetaLimpia;
}

/**
 * Normaliza la lista de documentos añadiendo la URL completa.
 * Detecta automáticamente dónde está cada archivo
 */
function normalizarDocumentos($docs, $idVehiculo, $baseUrl, $carpetaBase) {
    foreach ($docs as &$doc) {
        $doc["archivoUrl"] = $baseUrl . $idVehiculo . "/" . rawurlencode($doc['nombreArchivo']);
    }
    return $docs;
}

/**
 * Genera un nombre de archivo seguro: idVehiculo_descripcion.extension
 */
function generarNombreArchivo($idVehiculo, $descripcion, $archivoOriginal) {
    $extension = pathinfo($archivoOriginal, PATHINFO_EXTENSION);
    $descripcionLimpia = preg_replace('/[^a-zA-Z0-9]/', '_', $descripcion);
    $descripcionLimpia = preg_replace('/_+/', '_', $descripcionLimpia);
    $descripcionLimpia = trim($descripcionLimpia, '_');
    
    return $idVehiculo . "_" . $descripcionLimpia . "." . $extension;
}

try {
    if (!is_dir($carpetaFisicaBase)) {
        mkdir($carpetaFisicaBase, 0777, true);
    }

    switch ($action) {
        case "buscarVehiculo":
            $busqueda = $conn->real_escape_string($data["busqueda"]);
            $sql = "SELECT * FROM tvehiculos WHERE patente = '$busqueda' OR numerointerno = '$busqueda' LIMIT 1";
            $res = $conn->query($sql);
            if ($vehiculo = $res->fetch_assoc()) {
                $idVehiculo = $vehiculo["id"];
                $docs = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE idVehiculo = $idVehiculo ORDER BY fechaSubida DESC");
                $docsArray = $docs->fetch_all(MYSQLI_ASSOC);
                echo json_encode([
                    "success" => true,
                    "vehiculo" => $vehiculo,
                    "documentos" => normalizarDocumentos($docsArray, $idVehiculo, $BASE_URL, $carpetaFisicaBase)
                ]);
            } else {
                echo json_encode(["success" => false, "error" => "Vehículo no encontrado"]);
            }
            break;

        case "subirArchivos":
            $idVehiculo = intval($_POST["idVehiculo"]);
            $descripcion = $conn->real_escape_string($_POST["descripcion"] ?? "Documento");

            $dir = $carpetaFisicaBase . $idVehiculo;
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
            }

            if (!isset($_FILES["archivos"]) || !is_array($_FILES["archivos"]["tmp_name"])) {
                throw new Exception("No se recibieron archivos.");
            }

            $MAX_FILE_SIZE = 10 * 1024 * 1024;

            foreach ($_FILES["archivos"]["tmp_name"] as $i => $tmp) {
                if ($_FILES["archivos"]["error"][$i] !== UPLOAD_ERR_OK) {
                    $errorMsg = "Error al subir archivo";
                    switch($_FILES["archivos"]["error"][$i]) {
                        case UPLOAD_ERR_INI_SIZE:
                        case UPLOAD_ERR_FORM_SIZE:
                            $errorMsg = "El archivo excede el tamaño máximo permitido";
                            break;
                        case UPLOAD_ERR_NO_FILE:
                            $errorMsg = "No se recibió ningún archivo";
                            break;
                    }
                    throw new Exception($errorMsg);
                }

                if ($_FILES["archivos"]["size"][$i] > $MAX_FILE_SIZE) {
                    $sizeMB = round($_FILES["archivos"]["size"][$i] / (1024 * 1024), 2);
                    throw new Exception("El archivo es muy grande ({$sizeMB}MB). El límite es 10MB.");
                }

                $nombreOriginal = basename($_FILES["archivos"]["name"][$i]);
                $nombreArchivo = generarNombreArchivo($idVehiculo, $descripcion, $nombreOriginal);
                $destino = "$dir/$nombreArchivo";
                
                if (!move_uploaded_file($tmp, $destino)) {
                    error_log("Error al mover el archivo: " . $tmp . " a " . $destino);
                    throw new Exception("No se pudo guardar el archivo");
                }
                
                $nombreEsc = $conn->real_escape_string($nombreArchivo);
                $descripcionEsc = $conn->real_escape_string($descripcion);
                $conn->query("INSERT INTO tdocumentosvehiculo (idVehiculo, nombreArchivo, descripcion)
                                     VALUES ($idVehiculo, '$nombreEsc', '$descripcionEsc')");
            }
            
            $docs = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE idVehiculo = $idVehiculo ORDER BY fechaSubida DESC");
            $docsArray = $docs->fetch_all(MYSQLI_ASSOC);
            echo json_encode(["success" => true, "documentos" => normalizarDocumentos($docsArray, $idVehiculo, $BASE_URL, $carpetaFisicaBase)]);
            break;

        case "eliminarDocumento":
            $id = intval($data["id"]);
            $doc = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE id = $id")->fetch_assoc();
            if ($doc) {
                $path = $carpetaFisicaBase . "{$doc["idVehiculo"]}/{$doc["nombreArchivo"]}";
                
                if (file_exists($path)) {
                    unlink($path);
                }
                $conn->query("DELETE FROM tdocumentosvehiculo WHERE id = $id");
                $docs = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE idVehiculo = {$doc["idVehiculo"]} ORDER BY fechaSubida DESC");
                $docsArray = $docs->fetch_all(MYSQLI_ASSOC);
                echo json_encode(["success" => true, "documentos" => normalizarDocumentos($docsArray, $doc["idVehiculo"], $BASE_URL, $carpetaFisicaBase)]);
            } else {
                echo json_encode(["success" => false, "error" => "Documento no encontrado"]);
            }
            break;

        case "descargarTodos":
            $idVehiculo = intval($data["idVehiculo"]);
            
            $query = "SELECT dv.nombreArchivo, dv.descripcion, dv.idVehiculo, v.patente 
                      FROM tdocumentosvehiculo dv
                      INNER JOIN tvehiculos v ON v.id = dv.idVehiculo
                      WHERE dv.idVehiculo = $idVehiculo
                      ORDER BY dv.fechaSubida DESC";
            
            $res = $conn->query($query);
            $documentos = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];

            if (empty($documentos)) {
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "No hay documentos para descargar"]);
                break;
            }

            $patente = $documentos[0]['patente'] ?? 'vehiculo';

            $zipFilename = tempnam(sys_get_temp_dir(), 'docs_vehiculo_') . '.zip';
            $zip = new ZipArchive();
            
            if ($zip->open($zipFilename, ZipArchive::CREATE) !== TRUE) {
                http_response_code(500);
                echo json_encode(["success" => false, "error" => "No se pudo crear el archivo ZIP"]);
                break;
            }

            $archivosAgregados = 0;
            foreach ($documentos as $doc) {
                $rutaArchivo = $carpetaFisicaBase . $idVehiculo . "/" . $doc['nombreArchivo'];
                
                if (file_exists($rutaArchivo)) {
                    $zip->addFile($rutaArchivo, $doc['nombreArchivo']);
                    $archivosAgregados++;
                }
            }

            $zip->close();

            if ($archivosAgregados === 0) {
                unlink($zipFilename);
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "No se encontraron archivos físicos para descargar"]);
                break;
            }

            header('Content-Type: application/zip');
            header('Content-Disposition: attachment; filename="documentos_' . $patente . '_' . time() . '.zip"');
            header('Content-Length: ' . filesize($zipFilename));
            
            readfile($zipFilename);
            unlink($zipFilename);
            break;

        default:
            throw new Exception("Acción no válida: " . $action);
    }
} catch (Exception $e) {
    error_log("Error en documentosvehiculo.php: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
