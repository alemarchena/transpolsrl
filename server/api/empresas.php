<?php
require_once("../config/headers.php");
require_once("../config/db.php");

// Detectar si viene por JSON o FORM-DATA
$post = $_SERVER["REQUEST_METHOD"] === "POST" && empty($_FILES)
    ? json_decode(file_get_contents("php://input"), true)
    : $_POST;

$action = $post["action"] ?? "";

// --- Definiciones globales de rutas basadas en el host ---
$protocolo = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];

$baseUrlArchivos = ""; // Inicializar la variable

// Lógica para determinar la URL base de los archivos según el host
if ($host === 'localhost:8000') {
    // Estamos en el entorno Docker
    $baseUrlArchivos = "$protocolo://$host/uploads/firmas/";
} else {
    // Asumimos que estamos en el entorno de producción (Nuthost)
    $baseUrlArchivos = "$protocolo://$host/transpolsrlv1/server/uploads/firmas/";
}

// --- DEBUGGING ---
error_log("DEBUG empresas.php: Host detectado = " . $host);
error_log("DEBUG empresas.php: Base URL de archivos construida = " . $baseUrlArchivos);

$carpetaFisica = __DIR__ . "/../uploads/firmas/"; // Carpeta física donde se guardarán las firmas

try {
    // Asegurarse de que la carpeta física exista
    if (!is_dir($carpetaFisica)) {
        mkdir($carpetaFisica, 0777, true);
    }

    switch ($action) {
        // 1️⃣ Obtener todas las empresas
        case "get":
            $query = "SELECT id, razon_social, cuit, imagen_firma, fecha_creacion FROM tempresas ORDER BY razon_social ASC";
            $res = $conn->query($query);
            if (!$res) throw new Exception($conn->error);
            $empresas = $res->fetch_all(MYSQLI_ASSOC);
            
            // Construir la URL completa para cada imagen de firma
            foreach ($empresas as &$empresa) {
                if ($empresa['imagen_firma']) {
                    $empresa['imagen_firma_url'] = $baseUrlArchivos . $empresa['imagen_firma'];
                } else {
                    $empresa['imagen_firma_url'] = null;
                }
            }
            unset($empresa);
            
            echo json_encode($empresas);
            break;

        // 2️⃣ Insertar nueva empresa
        case "insert":
            $razon_social = $conn->real_escape_string($post["razon_social"] ?? "");
            $cuit = $conn->real_escape_string($post["cuit"] ?? "");
            
            if (empty($razon_social) || empty($cuit)) {
                throw new Exception("Razón social y CUIT son obligatorios");
            }

            // Verificar si ya existe una empresa con el mismo CUIT
            $checkQuery = "SELECT id FROM tempresas WHERE cuit = '$cuit'";
            $checkRes = $conn->query($checkQuery);
            if ($checkRes->num_rows > 0) {
                throw new Exception("Ya existe una empresa con ese CUIT");
            }

            $imagen_firma = null;
            
            // Procesar imagen de firma si se subió
            if (isset($_FILES['imagen_firma']) && $_FILES['imagen_firma']['error'] == 0) {
                $extension = strtolower(pathinfo($_FILES['imagen_firma']['name'], PATHINFO_EXTENSION));
                if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
                    throw new Exception("Solo se permiten imágenes JPG, PNG o GIF");
                }
                
                // Verificar si es una firma digital creada (nombre específico)
                if (strpos($_FILES['imagen_firma']['name'], 'firma_digital_') === 0) {
                    // Es una firma digital creada, mantener el formato PNG
                    $extension = 'png';
                }
                
                $nombre_archivo = "firma_" . preg_replace('/[^a-zA-Z0-9]/', '_', $cuit) . "_" . time() . "." . $extension;
                $rutaFisica = $carpetaFisica . $nombre_archivo;
                
                if (!move_uploaded_file($_FILES['imagen_firma']['tmp_name'], $rutaFisica)) {
                    throw new Exception("No se pudo guardar la imagen de firma");
                }
                
                $imagen_firma = $nombre_archivo;
            }

            $query = "INSERT INTO tempresas (razon_social, cuit, imagen_firma, fecha_creacion) 
                      VALUES ('$razon_social', '$cuit', " . 
                      ($imagen_firma ? "'$imagen_firma'" : "NULL") . ", NOW())";
            
            if (!$conn->query($query)) {
                throw new Exception($conn->error);
            }
            
            echo json_encode(["success" => true, "message" => "Empresa creada correctamente"]);
            break;

        // 3️⃣ Actualizar empresa
        case "update":
            $id = (int)$post["id"];
            $razon_social = $conn->real_escape_string($post["razon_social"] ?? "");
            $cuit = $conn->real_escape_string($post["cuit"] ?? "");
            
            if (empty($razon_social) || empty($cuit)) {
                throw new Exception("Razón social y CUIT son obligatorios");
            }

            // Verificar si ya existe otra empresa con el mismo CUIT
            $checkQuery = "SELECT id FROM tempresas WHERE cuit = '$cuit' AND id != $id";
            $checkRes = $conn->query($checkQuery);
            if ($checkRes->num_rows > 0) {
                throw new Exception("Ya existe otra empresa con ese CUIT");
            }

            // Obtener datos actuales
            $empresaActual = $conn->query("SELECT imagen_firma FROM tempresas WHERE id = $id")->fetch_assoc();
            if (!$empresaActual) {
                throw new Exception("Empresa no encontrada");
            }

            $imagen_firma = $empresaActual['imagen_firma'];
            
            // Procesar nueva imagen de firma si se subió
            if (isset($_FILES['imagen_firma']) && $_FILES['imagen_firma']['error'] == 0) {
                $extension = strtolower(pathinfo($_FILES['imagen_firma']['name'], PATHINFO_EXTENSION));
                if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
                    throw new Exception("Solo se permiten imágenes JPG, PNG o GIF");
                }
                
                // Verificar si es una firma digital creada (nombre específico)
                if (strpos($_FILES['imagen_firma']['name'], 'firma_digital_') === 0) {
                    // Es una firma digital creada, mantener el formato PNG
                    $extension = 'png';
                }
                
                // Eliminar imagen anterior si existe
                if ($imagen_firma && file_exists($carpetaFisica . $imagen_firma)) {
                    unlink($carpetaFisica . $imagen_firma);
                }
                
                $nombre_archivo = "firma_" . preg_replace('/[^a-zA-Z0-9]/', '_', $cuit) . "_" . time() . "." . $extension;
                $rutaFisica = $carpetaFisica . $nombre_archivo;
                
                if (!move_uploaded_file($_FILES['imagen_firma']['tmp_name'], $rutaFisica)) {
                    throw new Exception("No se pudo guardar la nueva imagen de firma");
                }
                
                $imagen_firma = $nombre_archivo;
            }

            $query = "UPDATE tempresas SET 
                      razon_social = '$razon_social', 
                      cuit = '$cuit', 
                      imagen_firma = " . ($imagen_firma ? "'$imagen_firma'" : "NULL") . "
                      WHERE id = $id";
            
            if (!$conn->query($query)) {
                throw new Exception($conn->error);
            }
            
            echo json_encode(["success" => true, "message" => "Empresa actualizada correctamente"]);
            break;

        // 4️⃣ Eliminar empresa - VALIDACIÓN AGREGADA
        case "delete":
            $id = (int)$post["id"];
            
            // VALIDACIÓN NUEVA: Verificar si hay personas asignadas a esta empresa
            $checkPersonasQuery = "SELECT COUNT(*) as total, 
                                          GROUP_CONCAT(CONCAT(nombre, ' ', apellido) SEPARATOR ', ') as nombres_personas
                                   FROM tpersonas 
                                   WHERE id_empresa = $id";
            $checkPersonasRes = $conn->query($checkPersonasQuery);
            $checkPersonas = $checkPersonasRes->fetch_assoc();
            
            if ($checkPersonas['total'] > 0) {
                $mensaje = "No se puede eliminar la empresa porque tiene " . $checkPersonas['total'] . " persona(s) asignada(s): " . $checkPersonas['nombres_personas'] . ". ";
                $mensaje .= "Primero debe reasignar o eliminar estas personas.";
                throw new Exception($mensaje);
            }
            
            // Obtener datos de la empresa para eliminar la imagen
            $empresa = $conn->query("SELECT imagen_firma FROM tempresas WHERE id = $id")->fetch_assoc();
            if (!$empresa) {
                throw new Exception("Empresa no encontrada");
            }
            
            // Eliminar imagen de firma si existe
            if ($empresa['imagen_firma'] && file_exists($carpetaFisica . $empresa['imagen_firma'])) {
                unlink($carpetaFisica . $empresa['imagen_firma']);
            }
            
            if (!$conn->query("DELETE FROM tempresas WHERE id = $id")) {
                throw new Exception($conn->error);
            }
            
            echo json_encode(["success" => true, "message" => "Empresa eliminada correctamente"]);
            break;

        default:
            throw new Exception("Acción no válida");
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
