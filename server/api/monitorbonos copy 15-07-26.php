<?php
header("Cache-Control: no-cache, no-store, must-revalidate, max-age=0, private");
header("Pragma: no-cache");
header("Expires: Thu, 01 Jan 1970 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("ETag: \"" . md5(time()) . "\"");

require_once("../config/headers.php");
require_once("../config/db.php");

$protocolo = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];

$baseUrlArchivos = ""; // Inicializar la variable
$rutaFisicaArchivos = ""; // Inicializar la variable

// Lógica para determinar la URL base de los archivos según el host
if ($host === 'localhost:8000') {
    // Estamos en el entorno Docker
    $baseUrlArchivos = "$protocolo://$host/uploads/bonos/";
    $rutaFisicaArchivos = "/var/www/html/uploads/bonos/"; // Ruta física para Docker
} else {
    // Asumimos que estamos en el entorno de producción (Nuthost)
    $baseUrlArchivos = "$protocolo://$host/transpolsrlv1/server/uploads/bonos/";
    $rutaFisicaArchivos = $_SERVER['DOCUMENT_ROOT'] . "/transpolsrlv1/server/uploads/bonos/"; // Ruta física para producción
}

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

switch ($action) {
  case "get":
    $anio = $conn->real_escape_string($data["anio"] ?? "");
    $mesInicio = (int)($data["mesInicio"] ?? 1);
    $mesFin = (int)($data["mesFin"] ?? 12);
    $pagina = max(1, (int)($data["pagina"] ?? 1));
    $limite = max(1, (int)($data["limite"] ?? 20));
    $offset = ($pagina - 1) * $limite;

    // Función para convertir el nombre del mes en número (1 a 12)
    $mesToNum = "FIELD(
        pb.mes, 
        'Enero','Febrero','Marzo','Abril','Mayo','Junio',
        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
      )";

    // Condiciones dinámicas
    $condiciones = [];
    if ($anio != "") $condiciones[] = "pb.anio = '$anio'";
    $condiciones[] = "$mesToNum BETWEEN $mesInicio AND $mesFin";

    $where = count($condiciones) > 0 ? "WHERE " . implode(" AND ", $condiciones) : "";

    // 🔴 MODIFICADO: Total de personas ACTIVAS (inactivo = 0)
    $totalRes = $conn->query("SELECT COUNT(*) AS total FROM tpersonas WHERE inactivo = 0");
    $total = ($totalRes && $totalRes->num_rows > 0) ? (int)$totalRes->fetch_assoc()["total"] : 0;

    // 🔴 MODIFICADO: Consulta principal solo con personas ACTIVAS (inactivo = 0)
    $query = "
      SELECT p.id AS idPersona, CONCAT(p.apellido, ', ', p.nombre) AS persona,
             pb.id AS idBono, pb.mes, pb.anio, pb.archivo_url, pb.firmado_por, pb.firmado_fecha
      FROM tpersonas p
      LEFT JOIN tpersonasbonos pb
        ON pb.idPersona = p.id
        AND pb.anio = '$anio'
        AND $mesToNum BETWEEN $mesInicio AND $mesFin
      WHERE p.inactivo = 0  -- 🔴 SOLO PERSONAS ACTIVAS
      ORDER BY p.apellido ASC, p.nombre ASC, pb.anio DESC, $mesToNum ASC
      LIMIT $limite OFFSET $offset
    ";

    $res = $conn->query($query);
    $dataFinal = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];

    foreach ($dataFinal as &$registro) {
        if (!empty($registro['archivo_url'])) {
            $registro['archivo_url'] = $baseUrlArchivos . $registro['archivo_url'];
        }
    }
    unset($registro); // Romper la referencia del último elemento

    echo json_encode([
      "success" => true,
      "data" => $dataFinal,
      "total" => $total
    ]);
    break;

  case "getEstadisticas":
    $anio = $conn->real_escape_string($data["anio"] ?? "");
    $mesInicio = (int)($data["mesInicio"] ?? 1);
    $mesFin = (int)($data["mesFin"] ?? 12);

    // Función para convertir el nombre del mes en número (1 a 12)
    $mesToNum = "FIELD(
        pb.mes, 
        'Enero','Febrero','Marzo','Abril','Mayo','Junio',
        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
      )";

    // 🔴 MODIFICADO: Estadísticas solo con personas ACTIVAS (inactivo = 0)
    $queryEstadisticas = "
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN pb.firmado_por IS NOT NULL THEN 1 ELSE 0 END) AS firmados,
        SUM(CASE WHEN pb.firmado_por IS NULL AND pb.id IS NOT NULL THEN 1 ELSE 0 END) AS pendientes
      FROM tpersonas p
      LEFT JOIN tpersonasbonos pb
        ON pb.idPersona = p.id
        AND pb.anio = '$anio'
        AND $mesToNum BETWEEN $mesInicio AND $mesFin
      WHERE p.inactivo = 0  -- 🔴 SOLO PERSONAS ACTIVAS
    ";

    $res = $conn->query($queryEstadisticas);
    $estadisticas = $res ? $res->fetch_assoc() : ["total" => 0, "firmados" => 0, "pendientes" => 0];

    $total = (int)$estadisticas["total"];
    $firmados = (int)$estadisticas["firmados"];
    $pendientes = $total - $firmados;

    echo json_encode([
      "success" => true,
      "estadisticas" => [
        "total" => $total,
        "firmados" => $firmados,
        "pendientes" => $pendientes
      ]
    ]);
    break;

  case "descargarPDFsFirmados":
    $anio = $conn->real_escape_string($data["anio"] ?? "");
    $mesInicio = (int)($data["mesInicio"] ?? 1);
    $mesFin = (int)($data["mesFin"] ?? 12);

    // Función para convertir el nombre del mes en número (1 a 12)
    $mesToNum = "FIELD(
        pb.mes, 
        'Enero','Febrero','Marzo','Abril','Mayo','Junio',
        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
      )";

    // 🔴 MODIFICADO: Consulta solo con personas ACTIVAS (inactivo = 0)
    $query = "
      SELECT CONCAT(p.apellido, ', ', p.nombre) AS persona, pb.archivo_url
      FROM tpersonas p
      INNER JOIN tpersonasbonos pb ON pb.idPersona = p.id
      WHERE p.inactivo = 0  -- 🔴 SOLO PERSONAS ACTIVAS
        AND pb.anio = '$anio'
        AND $mesToNum BETWEEN $mesInicio AND $mesFin
        AND pb.firmado_por IS NOT NULL
        AND pb.archivo_url IS NOT NULL
        AND pb.archivo_url != ''
      ORDER BY p.apellido ASC, p.nombre ASC
    ";

    $res = $conn->query($query);
    $archivosFirmados = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];

    if (empty($archivosFirmados)) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "No hay bonos firmados para descargar"]);
        break;
    }

    // Crear archivo ZIP temporal
    $zipFilename = tempnam(sys_get_temp_dir(), 'bonos_firmados_') . '.zip';
    $zip = new ZipArchive();
    
    if ($zip->open($zipFilename, ZipArchive::CREATE) !== TRUE) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "No se pudo crear el archivo ZIP"]);
        break;
    }

    $archivosAgregados = 0;
    foreach ($archivosFirmados as $archivo) {
        $rutaArchivo = $rutaFisicaArchivos . $archivo['archivo_url'];
        
        if (file_exists($rutaArchivo)) {
            $nombreEnZip = $archivo['persona'] . '_' . $archivo['archivo_url'];
            $zip->addFile($rutaArchivo, $nombreEnZip);
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

    // Enviar el archivo ZIP al navegador
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="bonos_firmados_' . $anio . '_' . $mesInicio . '_' . $mesFin . '.zip"');
    header('Content-Length: ' . filesize($zipFilename));
    
    readfile($zipFilename);
    unlink($zipFilename); // Eliminar archivo temporal
    break;

  default:
    echo json_encode(["success" => false, "error" => "Acción no válida", "data" => [], "total" => 0]);
}
?>