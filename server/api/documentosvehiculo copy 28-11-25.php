<?php
require_once("../config/headers.php");
require_once("../config/db.php");
require_once __DIR__ . '/../vendor/autoload.php'; // Asegúrate de que esta línea esté presente

// Detectar si viene por JSON o FORM-DATA
$data = $_POST ?: json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

// --- CAMBIO AQUÍ: Definiciones globales de rutas basadas en el host ---
$protocolo = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];

$BASE_URL = ""; // Inicializar la variable

// Lógica para determinar la URL base de los archivos según el host
if ($host === 'localhost:8000') {
    // Estamos en el entorno Docker
    // La ruta en Docker es directamente /uploads/documentosvehiculo/
    $BASE_URL = "$protocolo://$host/uploads/documentosvehiculo/";
} else {
    // Asumimos que estamos en el entorno de producción (Nuthost)
    // y que la estructura es public_html/transpolsrlv1/server/uploads/documentosvehiculo/
    $BASE_URL = "$protocolo://$host/transpolsrlv1/server/uploads/documentosvehiculo/";
}

// --- DEBUGGING: Añade estas líneas para verificar la URL construida ---
error_log("DEBUG documentosvehiculo.php: Host detectado = " . $host);
error_log("DEBUG documentosvehiculo.php: Base URL de archivos construida = " . $BASE_URL);
// --- FIN DEBUGGING ---

// Carpeta física base donde se guardarán los archivos (esta ruta es correcta y no cambia)
$carpetaFisicaBase = __DIR__ . "/../uploads/documentosvehiculo/";
// --------------------------------------------------------------------

/**
 * Normaliza la lista de documentos añadiendo la URL completa.
 * @param array $docs Array de documentos.
 * @param int $idVehiculo ID del vehículo.
 * @param string $baseUrl URL base para los archivos.
 * @return array Documentos con la URL completa.
 */
function normalizarDocumentos($docs, $idVehiculo, $baseUrl) {
    foreach ($docs as &$doc) {
        // La URL se construye con la $baseUrl y el idVehiculo como subcarpeta
        $doc["archivoUrl"] = $baseUrl . $idVehiculo . "/" . $doc['nombreArchivo'];
    }
    return $docs;
}

try {
    // Asegurarse de que la carpeta física base exista
    if (!is_dir($carpetaFisicaBase)) {
        mkdir($carpetaFisicaBase, 0777, true);
    }

    switch ($action) {
        case "buscarVehiculo":
            $busqueda = $conn->real_escape_string($data["busqueda"]);
            $sql = "SELECT * FROM tvehiculos WHERE patente = '$busqueda' OR numeroInterno = '$busqueda' LIMIT 1";
            $res = $conn->query($sql);
            if ($vehiculo = $res->fetch_assoc()) {
                $idVehiculo = $vehiculo["id"];
                $docs = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE idVehiculo = $idVehiculo ORDER BY fechaSubida DESC");
                $docsArray = $docs->fetch_all(MYSQLI_ASSOC);
                echo json_encode([
                    "success" => true,
                    "vehiculo" => $vehiculo,
                    "documentos" => normalizarDocumentos($docsArray, $idVehiculo, $BASE_URL)
                ]);
            } else {
                echo json_encode(["success" => false, "error" => "Vehículo no encontrado"]);
            }
            break;

        case "subirArchivos":
            $idVehiculo = intval($_POST["idVehiculo"]);
            $descripcion = $conn->real_escape_string($_POST["descripcion"] ?? "");

            // Usar la carpeta física base para construir el directorio de destino
            $dir = $carpetaFisicaBase . $idVehiculo;
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
            }

            if (!isset($_FILES["archivos"]) || !is_array($_FILES["archivos"]["tmp_name"])) {
                throw new Exception("No se recibieron archivos.");
            }

            foreach ($_FILES["archivos"]["tmp_name"] as $i => $tmp) {
                $nombre = basename($_FILES["archivos"]["name"][$i]);
                $destino = "$dir/$nombre";
                
                if (!move_uploaded_file($tmp, $destino)) {
                    error_log("Error al mover el archivo: " . $tmp . " a " . $destino);
                    echo json_encode(["success" => false, "error" => "No se pudo mover el archivo $nombre"]);
                    exit;
                }
                $nombreEsc = $conn->real_escape_string($nombre);
                $conn->query("INSERT INTO tdocumentosvehiculo (idVehiculo, nombreArchivo, descripcion)
                                     VALUES ($idVehiculo, '$nombreEsc', '$descripcion')");
            }
            $docs = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE idVehiculo = $idVehiculo ORDER BY fechaSubida DESC");
            $docsArray = $docs->fetch_all(MYSQLI_ASSOC);
            echo json_encode(["success" => true, "documentos" => normalizarDocumentos($docsArray, $idVehiculo, $BASE_URL)]);
            break;

        case "eliminarDocumento":
            $id = intval($data["id"]);
            $doc = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE id = $id")->fetch_assoc();
            if ($doc) {
                // Usar la carpeta física base para construir la ruta del archivo a eliminar
                $path = $carpetaFisicaBase . "{$doc["idVehiculo"]}/{$doc["nombreArchivo"]}";
                if (file_exists($path)) {
                    unlink($path);
                }
                $conn->query("DELETE FROM tdocumentosvehiculo WHERE id = $id");
                $docs = $conn->query("SELECT * FROM tdocumentosvehiculo WHERE idVehiculo = {$doc["idVehiculo"]} ORDER BY fechaSubida DESC");
                $docsArray = $docs->fetch_all(MYSQLI_ASSOC);
                echo json_encode(["success" => true, "documentos" => normalizarDocumentos($docsArray, $doc["idVehiculo"], $BASE_URL)]);
            } else {
                echo json_encode(["success" => false, "error" => "Documento no encontrado"]);
            }
            break;

        default:
            throw new Exception("Acción no válida: " . $action); // Añadimos $action para depuración
    }
} catch (Exception $e) {
    error_log("Error en documentosvehiculo.php: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>