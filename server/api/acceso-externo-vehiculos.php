<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = $_POST ?: json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

$protocolo = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];

$BASE_URL = "";

if ($host === 'localhost:8000') {
    $BASE_URL = "$protocolo://$host/uploads/documentosvehiculo/";
} else {
    $BASE_URL = "$protocolo://$host/transpolsrlv1/server/uploads/documentosvehiculo/";
}

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
 * Detecta qué carpeta usar: limpia o con espacios (para archivos antiguos)
 */
function obtenerCarpetaReal($carpetaBase, $numeroInterno) {
    $carpetaLimpia = limpiarNombreCarpeta($numeroInterno);
    $rutaLimpia = $carpetaBase . $carpetaLimpia;
    $rutaOriginal = $carpetaBase . $numeroInterno;
    
    if (is_dir($rutaLimpia)) {
        return $carpetaLimpia;
    }
    
    if (is_dir($rutaOriginal)) {
        return $numeroInterno;
    }
    
    return $carpetaLimpia;
}

function normalizarDocumentos($docs, $idVehiculo, $baseUrl) {
    foreach ($docs as &$doc) {
        $doc["archivoUrl"] = $baseUrl . $idVehiculo . "/" . rawurlencode($doc['nombreArchivo']);
    }
    return $docs;
}

try {
    switch ($action) {
        case "validarClave":
            $claveAcceso = $conn->real_escape_string($data["claveAcceso"]);
            
            error_log("[v0] Clave recibida: '" . $claveAcceso . "' (longitud: " . strlen($claveAcceso) . ")");
            
            $sql = "SELECT v.*, v.id as idVehiculo, v.patente, v.marca, v.modelo, v.anio, v.numerointerno 
                    FROM tvehiculos v 
                    WHERE v.claveAcceso = '$claveAcceso' 
                    AND v.esExterno = 1";
            
            error_log("[v0] SQL: " . $sql);
            
            $result = $conn->query($sql);
            
            error_log("[v0] Resultado: " . ($result ? $result->num_rows : "error en query") . " filas");
            
            if ($vehiculo = $result->fetch_assoc()) {
                $idVehiculo = $vehiculo["idVehiculo"];
                $docs = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE idVehiculo = $idVehiculo ORDER BY fechaSubida DESC");
                $documentos = $docs ? $docs->fetch_all(MYSQLI_ASSOC) : [];
                
                $documentos = normalizarDocumentos($documentos, $idVehiculo, $BASE_URL);
                
                echo json_encode([
                    "success" => true,
                    "vehiculo" => $vehiculo,
                    "documentos" => $documentos
                ]);
            } else {
                error_log("[v0] No se encontró vehículo con esa clave");
                echo json_encode([
                    "success" => false,
                    "error" => "Clave de acceso inválida o vehículo no habilitado"
                ]);
            }
            break;
            
        case "upload":
            $claveAcceso = $data["claveAcceso"] ?? "";
            $nombre = $data["nombre"] ?? "";
            $idVehiculo = intval($data["idVehiculo"] ?? 0);
            
            if (empty($claveAcceso) || empty($nombre) || $idVehiculo === 0) {
                throw new Exception("Faltan datos requeridos");
            }
            
            $sql = "SELECT id FROM tvehiculos WHERE id = $idVehiculo AND claveAcceso = '$claveAcceso' AND esExterno = 1";
            $result = $conn->query($sql);
            if (!$result || $result->num_rows === 0) {
                throw new Exception("No autorizado para subir documentos a este vehículo");
            }
            
            if (!isset($_FILES["archivo"])) {
                throw new Exception("No se recibió el archivo");
            }
            
            $file = $_FILES["archivo"];
            
            if ($file["error"] !== UPLOAD_ERR_OK) {
                $errorMsg = match($file["error"]) {
                    UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => "El archivo supera el tamaño máximo permitido (10MB)",
                    UPLOAD_ERR_PARTIAL => "El archivo se subió parcialmente",
                    UPLOAD_ERR_NO_FILE => "No se recibió ningún archivo",
                    UPLOAD_ERR_NO_TMP_DIR => "Falta el directorio temporal",
                    UPLOAD_ERR_CANT_WRITE => "Error al escribir el archivo en disco",
                    default => "Error desconocido al subir el archivo"
                };
                throw new Exception($errorMsg);
            }
            
            $maxSize = 10 * 1024 * 1024;
            if ($file["size"] > $maxSize) {
                throw new Exception("El archivo supera el tamaño máximo de 10MB");
            }
            
            $allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $file["tmp_name"]);
            finfo_close($finfo);
            
            if (!in_array($mimeType, $allowedTypes)) {
                throw new Exception("Tipo de archivo no permitido. Solo PDF, JPG y PNG");
            }
            
            $extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
            $nombreLimpio = preg_replace('/[^a-zA-Z0-9_-]/', '_', $nombre);
            $nombreArchivo = $idVehiculo . "_" . $nombreLimpio . "." . $extension;
            
            $uploadDir = $carpetaFisicaBase . $idVehiculo . "/";
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $destino = $uploadDir . $nombreArchivo;
            
            if (!move_uploaded_file($file["tmp_name"], $destino)) {
                throw new Exception("Error al guardar el archivo");
            }
            
            $stmt = $conn->prepare("INSERT INTO tdocumentosvehiculo (idVehiculo, nombre, nombreArchivo) VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $idVehiculo, $nombre, $nombreArchivo);
            
            if (!$stmt->execute()) {
                unlink($destino);
                throw new Exception("Error al guardar en la base de datos");
            }
            
            $docs = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE idVehiculo = $idVehiculo ORDER BY fechaSubida DESC");
            $documentos = $docs ? $docs->fetch_all(MYSQLI_ASSOC) : [];
            $documentos = normalizarDocumentos($documentos, $idVehiculo, $BASE_URL);
            
            echo json_encode(["success" => true, "documentos" => $documentos]);
            break;
            
        case "delete":
            $claveAcceso = $data["claveAcceso"] ?? "";
            $idDocumento = intval($data["id"] ?? 0);
            $idVehiculo = intval($data["idVehiculo"] ?? 0);
            
            if (empty($claveAcceso) || $idDocumento === 0 || $idVehiculo === 0) {
                throw new Exception("Faltan datos requeridos");
            }
            
            $sql = "SELECT id FROM tvehiculos WHERE id = $idVehiculo AND claveAcceso = '$claveAcceso' AND esExterno = 1";
            $result = $conn->query($sql);
            if (!$result || $result->num_rows === 0) {
                throw new Exception("No autorizado para eliminar documentos de este vehículo");
            }
            
            $doc = $conn->query("SELECT nombreArchivo FROM tdocumentosvehiculo WHERE id = $idDocumento AND idVehiculo = $idVehiculo");
            if (!$doc || $doc->num_rows === 0) {
                throw new Exception("Documento no encontrado");
            }
            
            $documento = $doc->fetch_assoc();
            $archivoPath = $carpetaFisicaBase . $idVehiculo . "/" . $documento["nombreArchivo"];
            
            if (file_exists($archivoPath)) {
                unlink($archivoPath);
            }
            
            $conn->query("DELETE FROM tdocumentosvehiculo WHERE id = $idDocumento");
            
            $docs = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE idVehiculo = $idVehiculo ORDER BY fechaSubida DESC");
            $documentos = $docs ? $docs->fetch_all(MYSQLI_ASSOC) : [];
            $documentos = normalizarDocumentos($documentos, $idVehiculo, $BASE_URL);
            
            echo json_encode(["success" => true, "documentos" => $documentos]);
            break;
            
        default:
            throw new Exception("Acción no válida");
    }
} catch (Exception $e) {
    error_log("Error en acceso-externo-vehiculos.php: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
