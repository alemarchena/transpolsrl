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

$baseUrlArchivos = "";
$rutaFisicaArchivos = "";

if ($host === 'localhost:8000') {
    $baseUrlArchivos = "$protocolo://$host/uploads/bonos/";
    $rutaFisicaArchivos = "/var/www/html/uploads/bonos/";
} else {
    $baseUrlArchivos = "$protocolo://$host/transpolsrlv1/server/uploads/bonos/";
    $rutaFisicaArchivos = $_SERVER['DOCUMENT_ROOT'] . "/transpolsrlv1/server/uploads/bonos/";
}

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

// 🔴 LEER EL TIPO DE BONO (por defecto 'todos')
$tipoBono = $data["tipoBono"] ?? 'todos';

/**
 * Función auxiliar para construir la condición sobre pb.mes según el tipo de bono.
 */
function obtenerCondicionMes($tipoBono, $mesInicio, $mesFin, $conn) {
    $meses = [
        1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
        5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
        9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
    ];
    
    // Construir lista de meses en el rango (solo para mensual y todos)
    $mesesFiltrar = [];
    for ($i = $mesInicio; $i <= $mesFin; $i++) {
        if (isset($meses[$i])) {
            $mesesFiltrar[] = "'" . $conn->real_escape_string($meses[$i]) . "'";
        }
    }
    $mesesSql = implode(",", $mesesFiltrar);
    
    if ($tipoBono === 'mensual') {
        return "pb.mes IN ($mesesSql)";
    } elseif ($tipoBono === 'sac1') {
        return "pb.mes = 'Sac1'";
    } elseif ($tipoBono === 'sac2') {
        return "pb.mes = 'Sac2'";
    } else { // 'todos'
        $condiciones = [];
        if (!empty($mesesSql)) {
            $condiciones[] = "pb.mes IN ($mesesSql)";
        }
        $condiciones[] = "pb.mes IN ('Sac1', 'Sac2')";
        return "(" . implode(" OR ", $condiciones) . ")";
    }
}

switch ($action) {
  case "get":
    $anio = (int)($data["anio"] ?? 0);
    $mesInicio = (int)($data["mesInicio"] ?? 1);
    $mesFin = (int)($data["mesFin"] ?? 12);
    $pagina = max(1, (int)($data["pagina"] ?? 1));
    $limite = max(1, (int)($data["limite"] ?? 20));
    $offset = ($pagina - 1) * $limite;

    // Si el año es inválido, devolver vacío
    if ($anio <= 0) {
        echo json_encode(["success" => true, "data" => [], "total" => 0]);
        exit;
    }

    // Obtener condición de mes según el tipo de bono
    $condicionMes = obtenerCondicionMes($tipoBono, $mesInicio, $mesFin, $conn);

    // Si es mensual y el rango no es válido, devolver vacío
    if ($tipoBono === 'mensual' && ($mesInicio <= 0 || $mesFin <= 0 || $mesInicio > $mesFin)) {
        echo json_encode(["success" => true, "data" => [], "total" => 0]);
        exit;
    }

    // Total de personas ACTIVAS (sin filtrar por bonos, solo el universo)
    $totalRes = $conn->query("SELECT COUNT(*) AS total FROM tpersonas WHERE inactivo = 0");
    $total = ($totalRes && $totalRes->num_rows > 0) ? (int)$totalRes->fetch_assoc()["total"] : 0;

    // Consulta principal: LEFT JOIN para mostrar todas las personas aunque no tengan bono en el período
    $query = "
        SELECT p.id AS idPersona, CONCAT(p.apellido, ', ', p.nombre) AS persona,
               pb.id AS idBono, pb.mes, pb.anio, pb.archivo_url, pb.firmado_por, pb.firmado_fecha
        FROM tpersonas p
        LEFT JOIN tpersonasbonos pb
            ON pb.idPersona = p.id
            AND pb.anio = '$anio'
            AND $condicionMes
        WHERE p.inactivo = 0
        ORDER BY p.apellido ASC, p.nombre ASC, pb.anio DESC,
                 FIELD(pb.mes, 'Enero','Febrero','Marzo','Abril',
                               'Mayo','Junio','Julio','Agosto',
                               'Septiembre','Octubre','Noviembre','Diciembre',
                               'Sac1','Sac2') ASC
        LIMIT $limite OFFSET $offset
    ";

    $res = $conn->query($query);
    $dataFinal = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];

    foreach ($dataFinal as &$registro) {
        if (!empty($registro['archivo_url'])) {
            $registro['archivo_url'] = $baseUrlArchivos . $registro['archivo_url'];
        }
    }
    unset($registro);

    echo json_encode([
        "success" => true,
        "data" => $dataFinal,
        "total" => $total
    ]);
    break;

  case "getEstadisticas":
    $anio = (int)($data["anio"] ?? 0);
    $mesInicio = (int)($data["mesInicio"] ?? 1);
    $mesFin = (int)($data["mesFin"] ?? 12);

    if ($anio <= 0) {
        echo json_encode([
            "success" => true,
            "estadisticas" => ["total" => 0, "firmados" => 0, "pendientes" => 0]
        ]);
        exit;
    }

    $condicionMes = obtenerCondicionMes($tipoBono, $mesInicio, $mesFin, $conn);

    if ($tipoBono === 'mensual' && ($mesInicio <= 0 || $mesFin <= 0 || $mesInicio > $mesFin)) {
        echo json_encode([
            "success" => true,
            "estadisticas" => ["total" => 0, "firmados" => 0, "pendientes" => 0]
        ]);
        exit;
    }

    // Estadísticas solo con personas ACTIVAS y aplicando el filtro
    $queryEstadisticas = "
        SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN pb.firmado_por IS NOT NULL THEN 1 ELSE 0 END) AS firmados,
            SUM(CASE WHEN pb.firmado_por IS NULL AND pb.id IS NOT NULL THEN 1 ELSE 0 END) AS pendientes
        FROM tpersonas p
        LEFT JOIN tpersonasbonos pb
            ON pb.idPersona = p.id
            AND pb.anio = '$anio'
            AND $condicionMes
        WHERE p.inactivo = 0
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
    $anio = (int)($data["anio"] ?? 0);
    $mesInicio = (int)($data["mesInicio"] ?? 1);
    $mesFin = (int)($data["mesFin"] ?? 12);

    if ($anio <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Año inválido"]);
        exit;
    }

    $condicionMes = obtenerCondicionMes($tipoBono, $mesInicio, $mesFin, $conn);

    if ($tipoBono === 'mensual' && ($mesInicio <= 0 || $mesFin <= 0 || $mesInicio > $mesFin)) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Rango de meses inválido"]);
        exit;
    }

    $query = "
        SELECT CONCAT(p.apellido, ', ', p.nombre) AS persona, pb.archivo_url
        FROM tpersonas p
        INNER JOIN tpersonasbonos pb ON pb.idPersona = p.id
        WHERE p.inactivo = 0
            AND pb.anio = '$anio'
            AND $condicionMes
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
        echo json_encode(["success" => false, "error" => "No se encontraron archivos físicos"]);
        break;
    }

    // Enviar ZIP
    header('Content-Type: application/zip');
    $nombreZip = "bonos_firmados_{$anio}_{$mesInicio}_{$mesFin}" . ($tipoBono !== 'todos' ? "_{$tipoBono}" : "") . ".zip";
    header('Content-Disposition: attachment; filename="' . $nombreZip . '"');
    header('Content-Length: ' . filesize($zipFilename));
    readfile($zipFilename);
    unlink($zipFilename);
    break;

  default:
    echo json_encode(["success" => false, "error" => "Acción no válida", "data" => [], "total" => 0]);
}