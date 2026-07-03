<?php
require_once("../config/headers.php");
require_once("../config/db.php");
require_once __DIR__ . '/../vendor/autoload.php';

use setasign\Fpdi\Fpdi;
use setasign\Fpdf\Fpdf;

// Detectar si viene por JSON o FORM-DATA
$post = $_SERVER["REQUEST_METHOD"] === "POST" && empty($_FILES)
    ? json_decode(file_get_contents("php://input"), true)
    : $_POST;

$action = $post["action"] ?? "";

// Definiciones globales de rutas basadas en el host
$protocolo = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];

$baseUrlArchivos = "";

// Lógica para determinar la URL base de los archivos según el host
if ($host === 'localhost:8000') {
    $baseUrlArchivos = "$protocolo://$host/uploads/bonos/";
} else {
    $baseUrlArchivos = "$protocolo://$host/transpolsrlv1/server/uploads/bonos/";
}

error_log("DEBUG personasbonos.php: Host detectado = " . $host);
error_log("DEBUG personasbonos.php: Base URL de archivos construida = " . $baseUrlArchivos);

$carpetaFisica = __DIR__ . "/../uploads/bonos/";

try {
    if (!is_dir($carpetaFisica)) {
        mkdir($carpetaFisica, 0777, true);
    }
    
    switch ($action) {
        // 1️⃣ Listar bonos de una persona - MODIFICADO para incluir campos de empresa
        case "getByPersona":
            $idPersona = (int)$post["idPersona"];
            $query = "SELECT pb.id, pb.anio, pb.mes, pb.archivo_url, pb.fecha_creacion,
                             pb.firmado_por, pb.firmado_fecha,
                             pb.firmado_empresa, pb.firmado_empresa_por, pb.firmado_empresa_fecha,
                             p.nombre, p.apellido, p.dni
                      FROM tpersonasbonos pb
                      JOIN tpersonas p ON pb.idPersona = p.id
                      WHERE pb.idPersona = $idPersona
                      ORDER BY pb.anio DESC, FIELD(pb.mes,
                             'Diciembre','Noviembre','Octubre','Septiembre',
                             'Agosto','Julio','Junio','Mayo','Abril','Marzo','Febrero','Enero')";
            $res = $conn->query($query);
            if (!$res) throw new Exception($conn->error);
            $bonos = $res->fetch_all(MYSQLI_ASSOC);
            
            foreach ($bonos as &$bono) {
                $bono['archivo_url'] = $baseUrlArchivos . $bono['archivo_url'];
            }
            unset($bono);
            
            echo json_encode([
                "success" => true,
                "data" => $bonos
            ]);
            break;

        // 2️⃣ Insertar o reemplazar un bono (PDF) - SIN CAMBIOS
        case "insert":
            if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] != 0) {
                throw new Exception("Archivo no recibido");
            }
            $idPersona = (int)$_POST["idPersona"];
            $anio = (int)$_POST["anio"];
            $mes = $conn->real_escape_string($_POST["mes"]);
            
            $persona = $conn->query("SELECT nombre, apellido, dni FROM tpersonas WHERE id = $idPersona")->fetch_assoc();
            if (!$persona) throw new Exception("Persona no encontrada");
            
            $nombre_archivo = strtolower(
                preg_replace('/\s+/', '_',
                    $persona['nombre'] . '_' . $persona['apellido'] . '_' . $persona['dni'] . '_' . $mes . '_' . $anio
                )
            ) . ".pdf";
            $rutaFisica = $carpetaFisica . $nombre_archivo;
            
            if (file_exists($rutaFisica)) unlink($rutaFisica);
            
            if (!move_uploaded_file($_FILES['archivo']['tmp_name'], $rutaFisica)) {
                error_log("Error al mover el archivo: " . $_FILES['archivo']['tmp_name'] . " a " . $rutaFisica);
                throw new Exception("No se pudo mover el archivo");
            }
            
            $res = $conn->query("SELECT id FROM tpersonasbonos
                                 WHERE idPersona = $idPersona AND anio = $anio AND mes = '$mes'");
            if ($res->num_rows > 0) {
                $idBono = $res->fetch_assoc()["id"];
                $query = "UPDATE tpersonasbonos
                         SET archivo_url = '{$conn->real_escape_string($nombre_archivo)}', fecha_creacion = NOW(),
                             firmado_por = NULL, firmado_fecha = NULL,
                             firmado_empresa = 0, firmado_empresa_por = NULL, firmado_empresa_fecha = NULL
                         WHERE id = $idBono";
            } else {
                $query = "INSERT INTO tpersonasbonos (idPersona, anio, mes, archivo_url, fecha_creacion)
                         VALUES ($idPersona, $anio, '$mes', '{$conn->real_escape_string($nombre_archivo)}', NOW())";
            }
            if (!$conn->query($query)) throw new Exception($conn->error);
            echo json_encode(["success" => true]);
            break;

        // 3️⃣ Eliminar un bono - SIN CAMBIOS
        case "delete":
            $id = (int)$post["id"];
            $res = $conn->query("SELECT archivo_url FROM tpersonasbonos WHERE id = $id LIMIT 1");
            if ($res->num_rows > 0) {
                $nombreArchivoEnDB = $res->fetch_assoc()["archivo_url"];
                $archivoFisico = $carpetaFisica . $nombreArchivoEnDB;
                if (file_exists($archivoFisico)) {
                    unlink($archivoFisico);
                }
            }
            if (!$conn->query("DELETE FROM tpersonasbonos WHERE id = $id")) {
                throw new Exception($conn->error);
            }
            echo json_encode(["success" => true]);
            break;

        // 4️⃣ Login - SIN CAMBIOS
        case "login":
            $dni = $conn->real_escape_string($post["dni"]);
            $clave = $post["clave"] ?? "";
            $res = $conn->query("SELECT id, nombre, apellido, clave_hash FROM tpersonas WHERE dni = '$dni' LIMIT 1");
            if ($res->num_rows === 0) throw new Exception("Usuario no encontrado");
            $usuario = $res->fetch_assoc();
            if (empty($usuario["clave_hash"])) throw new Exception("Debe crear su clave");
            if (!password_verify($clave, $usuario["clave_hash"])) throw new Exception("Clave incorrecta");
            unset($usuario["clave_hash"]);
            echo json_encode(["success" => true, "data" => $usuario]);
            break;

        // 5️⃣ Set clave - SIN CAMBIOS
        case "setClave":
            $dni = $conn->real_escape_string($post["dni"]);
            $claveActual = $post["claveActual"] ?? "";
            $claveNueva = $post["claveNueva"] ?? "";
            if (empty($claveNueva)) throw new Exception("Debe ingresar la nueva clave");
            $res = $conn->query("SELECT clave_hash FROM tpersonas WHERE dni = '$dni' LIMIT 1");
            if ($res->num_rows === 0) throw new Exception("Usuario no encontrado");
            $usuario = $res->fetch_assoc();
            if (!empty($usuario["clave_hash"])) {
                if (empty($claveActual) || !password_verify($claveActual, $usuario["clave_hash"])) {
                    throw new Exception("La clave actual es incorrecta");
                }
            }
            $hash = password_hash($claveNueva, PASSWORD_BCRYPT);
            if (!$conn->query("UPDATE tpersonas SET clave_hash = '$hash' WHERE dni = '$dni'")) {
                throw new Exception($conn->error);
            }
            echo json_encode(["success" => true]);
            break;

        // 6️⃣ Reset clave - SIN CAMBIOS
        case "resetClave":
            $idPersona = (int)$post["idPersona"];
            if ($idPersona <= 0) throw new Exception("ID de persona inválido");
            if (!$conn->query("UPDATE tpersonas SET clave_hash = NULL WHERE id = $idPersona")) {
                throw new Exception($conn->error);
            }
            echo json_encode(["success" => true, "msg" => "Clave reseteada"]);
            break;

        // 7️⃣ Buscar persona por DNI - SIN CAMBIOS
        case "buscarPorDni":
            $dni = $conn->real_escape_string($post["dni"]);
            $res = $conn->query("SELECT id FROM tpersonas WHERE dni = '$dni' LIMIT 1");
            if ($res->num_rows === 0) throw new Exception("DNI no encontrado");
            $row = $res->fetch_assoc();
            echo json_encode(["success" => true, "data" => ["idPersona" => $row["id"]]]);
            break;

        // 8️⃣ NUEVA ACCIÓN: Firmar con imagen de empresa
        case "firmarConEmpresa":
            $idBono = (int)$post["idBono"];
            $archivoUrl = $post["archivo_url"] ?? "";
            $idPersona = (int)$post["idPersona"];
            
            if (empty($archivoUrl) || $idPersona <= 0 || $idBono <= 0) {
                throw new Exception("Datos incompletos");
            }
            
            // Obtener datos de la persona y su empresa
            $queryPersona = "SELECT p.nombre, p.apellido, p.id_empresa, e.razon_social, e.imagen_firma 
                             FROM tpersonas p 
                             LEFT JOIN tempresas e ON p.id_empresa = e.id 
                             WHERE p.id = $idPersona";
            $resPersona = $conn->query($queryPersona);
            
            if (!$resPersona || $resPersona->num_rows === 0) {
                throw new Exception("Persona no encontrada");
            }
            
            $persona = $resPersona->fetch_assoc();
            
            if (empty($persona['id_empresa']) || empty($persona['imagen_firma'])) {
                throw new Exception("La persona no tiene una empresa asignada o la empresa no tiene imagen de firma");
            }
            
            // Verificar que el bono no esté ya firmado por empresa
            $queryBono = "SELECT firmado_empresa FROM tpersonasbonos WHERE id = $idBono";
            $resBono = $conn->query($queryBono);
            $bono = $resBono->fetch_assoc();
            
            if ($bono['firmado_empresa'] == 1) {
                throw new Exception("Este bono ya está firmado por la empresa");
            }
            
            // Extraer solo el nombre del archivo de la URL completa
            $nombreArchivoOriginal = basename(parse_url($archivoUrl, PHP_URL_PATH));
            $rutaFisica = $carpetaFisica . $nombreArchivoOriginal;
            
            if (!file_exists($rutaFisica)) {
                throw new Exception("PDF no encontrado (ruta: $rutaFisica)");
            }
            
            // Ruta de la imagen de firma de la empresa
            $rutaImagenFirma = __DIR__ . "/../uploads/firmas/" . $persona['imagen_firma'];
            
            if (!file_exists($rutaImagenFirma)) {
                throw new Exception("Imagen de firma de la empresa no encontrada");
            }
            
            // Firmar el PDF con FPDI usando la imagen de la empresa
            $pdf = new Fpdi();
            $pageCount = $pdf->setSourceFile($rutaFisica);
            
            for ($i = 1; $i <= $pageCount; $i++) {
                $tplId = $pdf->importPage($i);
                $size = $pdf->getTemplateSize($tplId);
                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $pdf->useTemplate($tplId);

                // Solo firmar en la última página
                if ($i == $pageCount) {
                    $pdf->SetFont('Helvetica', '', 8);
                    $pdf->SetTextColor(0, 0, 0);
                    
                    // POSICIÓN DIFERENTE: Firma de empresa en la parte IZQUIERDA
                    $firmaEmpresaX = 280; // 50 unidades desde el borde izquierdo
                    $firmaEmpresaX1 = 240; // Para el texto
                    $firmaEmpresaY = $size['height'] - 25; // 25 unidades desde abajo
                    
                    // Agregar la imagen de firma de la empresa
                    $pdf->Image($rutaImagenFirma, $firmaEmpresaX, $firmaEmpresaY, 50, 20);
                    
                    // Agregar texto informativo
                    $pdf->Text($firmaEmpresaX1, $size['height'] - 22, "Empresa: " . $persona['razon_social']);
                    
                    // Fecha con zona horaria de Argentina
                    $fechaMendoza = new DateTime('now', new DateTimeZone('America/Argentina/Mendoza'));
                    $pdf->Text($firmaEmpresaX1, $size['height'] - 19, "Fecha: " . $fechaMendoza->format('d/m/Y H:i'));
                }
            }
            
            // Guardar el PDF firmado
            $pdf->Output($rutaFisica, "F");
            
            // Cambiar nombre al archivo para evitar caché
            $nombreBase = pathinfo($rutaFisica, PATHINFO_FILENAME);
            $extension = pathinfo($rutaFisica, PATHINFO_EXTENSION);
            $nuevoNombre = $nombreBase . "_empresa_" . time() . "." . $extension;
            $nuevaRutaFisica = dirname($rutaFisica) . "/" . $nuevoNombre;
            
            if (!rename($rutaFisica, $nuevaRutaFisica)) {
                throw new Exception("No se pudo renombrar el archivo firmado");
            }
            
            // Actualizar en base de datos - SOLO los campos de empresa
            $queryUpdate = "UPDATE tpersonasbonos 
                            SET archivo_url = ?, 
                                firmado_empresa = 1, 
                                firmado_empresa_por = ?, 
                                firmado_empresa_fecha = NOW() 
                            WHERE id = ?";
            
            $stmt = $conn->prepare($queryUpdate);
            $firmadoEmpresaPor = $persona['razon_social'];
            $stmt->bind_param("ssi", $nuevoNombre, $firmadoEmpresaPor, $idBono);
            
            if (!$stmt->execute()) {
                throw new Exception("Error al actualizar la base de datos: " . $stmt->error);
            }
            
            echo json_encode([
                "success" => true, 
                "message" => "Bono firmado correctamente por la empresa",
                "nuevoPdf" => $baseUrlArchivos . $nuevoNombre
            ]);
            break;

        // 9️⃣ Firmar PDF (empleado) - MODIFICADO para posición derecha
        case "firmarPdf":
            $archivoUrl = $post["archivo_url"] ?? "";
            $firmaBase64 = $post["firma"] ?? "";
            $usuario = $post["usuario"] ?? "Usuario";
            
            if (empty($archivoUrl) || empty($firmaBase64)) {
                throw new Exception("Datos incompletos");
            }
            
            $nombreArchivoOriginal = basename(parse_url($archivoUrl, PHP_URL_PATH));
            $rutaFisica = $carpetaFisica . $nombreArchivoOriginal;
            
            if (!$rutaFisica || !file_exists($rutaFisica)) {
                throw new Exception("PDF no encontrado (ruta: $rutaFisica)");
            }
            
            // Guardar firma temporal
            $imgFirma = __DIR__ . "/../uploads/temp_firma.png";
            $imgData = explode(",", $firmaBase64);
            file_put_contents($imgFirma, base64_decode($imgData[1]));
            
            // Firmar el PDF con FPDI
            $pdf = new Fpdi();
            $pageCount = $pdf->setSourceFile($rutaFisica);
            
            for ($i = 1; $i <= $pageCount; $i++) {
                $tplId = $pdf->importPage($i);
                $size = $pdf->getTemplateSize($tplId);
                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
                $pdf->useTemplate($tplId);

                if ($i == $pageCount) {
                    $pdf->SetFont('Helvetica', '', 8);
                    $pdf->SetTextColor(0, 0, 0);
                    
                    // POSICIÓN DERECHA para firma del empleado
                    $firmaX = $size['width'] - 250; // 250 unidades desde el borde derecho
                    $firmaX1 = $size['width'] - 270; // Para el texto
                    $firmaY = $size['height'] - 25; // 25 unidades desde abajo
                    
                    $pdf->Image($imgFirma, $firmaX, $firmaY, 50, 20);
                    $pdf->Text($firmaX1, $size['height'] - 22, "Empleado: $usuario");

                    $fechaMendoza = new DateTime('now', new DateTimeZone('America/Argentina/Mendoza'));
                    $pdf->Text($firmaX1, $size['height'] - 19, "Fecha: " . $fechaMendoza->format('d/m/Y H:i'));
                }
            }
            
            $pdf->Output($rutaFisica, "F");
            unlink($imgFirma);
            
            // Cambiar nombre al archivo para evitar caché
            $nombreBase = pathinfo($rutaFisica, PATHINFO_FILENAME);
            $extension = pathinfo($rutaFisica, PATHINFO_EXTENSION);
            $nuevoNombre = $nombreBase . "_empleado_" . time() . "." . $extension;
            $nuevaRutaFisica = dirname($rutaFisica) . "/" . $nuevoNombre;
            
            if (!rename($rutaFisica, $nuevaRutaFisica)) {
                throw new Exception("No se pudo renombrar el archivo firmado");
            }
            
            // Actualizar en base de datos - SOLO los campos del empleado
            $conn->query("UPDATE tpersonasbonos
                         SET archivo_url = '{$conn->real_escape_string($nuevoNombre)}',
                             firmado_por = '{$conn->real_escape_string($usuario)}',
                             firmado_fecha = NOW()
                         WHERE archivo_url = '{$conn->real_escape_string($nombreArchivoOriginal)}'");
            
            echo json_encode(["success" => true, "nuevoPdf" => $baseUrlArchivos . $nuevoNombre]);
            break;

        default:
            throw new Exception("Acción no válida");
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
