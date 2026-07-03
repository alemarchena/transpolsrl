<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

if ($action === 'get') {
    $busqueda = $data['busqueda'] ?? '';
    $fechaDesde = $data['fechaDesde'] ?? '';
    $fechaHasta = $data['fechaHasta'] ?? '';
    $centroCarga = $data['centroCarga'] ?? '';

    $sql = "SELECT 
                u.*, 
                v.patente, v.marca, v.modelo, v.numerointerno,
                p.nombre as nombrePersona, p.apellido as apellidoPersona,
                pe.nombre as nombreExterno, pe.apellido as apellidoExterno,
                tc.nombrecombustible,
                cc.nombrecentro
            FROM tuso u
            LEFT JOIN tvehiculos v ON u.idVehiculo = v.id
            LEFT JOIN tpersonas p ON u.idPersona = p.id AND u.esPersonaExterna = 0
            LEFT JOIN tpersonasexternas pe ON u.idPersona = pe.id AND u.esPersonaExterna = 1
            LEFT JOIN ttipocombustible tc ON u.tipocombustible = tc.idtipo
            LEFT JOIN tcentrosdecarga cc ON u.centrodecarga = cc.idcentro
            WHERE 1=1";

    if ($busqueda) {
        $busqueda_escape = $conn->real_escape_string($busqueda);
        $sql .= " AND (v.patente LIKE '%$busqueda_escape%' 
                   OR v.marca LIKE '%$busqueda_escape%' 
                   OR v.modelo LIKE '%$busqueda_escape%'
                   OR v.numerointerno LIKE '%$busqueda_escape%'
                   OR p.nombre LIKE '%$busqueda_escape%' 
                   OR p.apellido LIKE '%$busqueda_escape%'
                   OR pe.nombre LIKE '%$busqueda_escape%'
                   OR pe.apellido LIKE '%$busqueda_escape%')";
    }

    if ($fechaDesde) {
        $fechaDesde_escape = $conn->real_escape_string($fechaDesde);
        $sql .= " AND u.fecha >= '$fechaDesde_escape'";
    }

    if ($fechaHasta) {
        $fechaHasta_escape = $conn->real_escape_string($fechaHasta);
        $sql .= " AND u.fecha <= '$fechaHasta_escape'";
    }

    if ($centroCarga) {
        $centroCarga_escape = (int)$centroCarga;
        $sql .= " AND u.centrodecarga = $centroCarga_escape";
    }

    $sql .= " ORDER BY u.fecha DESC, u.hora DESC";

    $result = $conn->query($sql);
    $resultados = $result->fetch_all(MYSQLI_ASSOC);

    foreach ($resultados as &$uso) {
        $vehiculoId = (int)$uso['idVehiculo'];
        $fechaActual = $conn->real_escape_string($uso['fecha']);
        $horaActual = $conn->real_escape_string($uso['hora']);

        $sqlAnterior = "SELECT kmActuales FROM tuso 
                        WHERE idVehiculo = $vehiculoId 
                        AND (fecha < '$fechaActual' OR (fecha = '$fechaActual' AND hora < '$horaActual'))
                        ORDER BY fecha DESC, hora DESC LIMIT 1";

        $resultAnterior = $conn->query($sqlAnterior);
        $anterior = $resultAnterior->fetch_assoc();

        if ($anterior) {
            $uso['kmRecorridos'] = $uso['kmActuales'] - $anterior['kmActuales'];
        } else {
            $uso['kmRecorridos'] = 0;
        }

        // Nueva regla: no calcular consumo si el KM anterior era 0 (primer arranque del vehículo)
        if ($anterior && $anterior['kmActuales'] == 0) {
            $uso['consumo'] = null;
        } 
        // Calcular consumo solo si hay KM recorridos reales y litros válidos
        elseif ($uso['litros'] && $uso['litros'] > 0 && $uso['kmRecorridos'] > 0) {
            $uso['consumo'] = round(($uso['litros'] / $uso['kmRecorridos']) * 100, 2);
        } 
        else {
            $uso['consumo'] = null;
        }

        if ($uso['esPersonaExterna'] == 1) {
            $uso['nombreCompleto'] = $uso['nombreExterno'] . ' ' . $uso['apellidoExterno'];
        } else {
            $uso['nombreCompleto'] = $uso['nombrePersona'] . ' ' . $uso['apellidoPersona'];
        }
    }

    echo json_encode(['data' => $resultados]);
}

if ($data["action"] === "checkRemito") {

    $remito = $data["remito"];
    $fecha = $data["fecha"];

    $stmt = $conn->prepare("SELECT id FROM tuso WHERE remito = ? AND fecha = ?");
    $stmt->bind_param("ss", $remito, $fecha);
    $stmt->execute();
    $result = $stmt->get_result();

    echo json_encode([
        "existe" => $result->num_rows > 0
    ]);
}

if ($action === 'insert') {
    $idVehiculo = (int)$data['idVehiculo'];
    $idPersona = (int)$data['idPersona'];
    $fecha = $conn->real_escape_string($data['fecha']);
    $hora = $conn->real_escape_string($data['hora']);
    $kmActuales = (float)$data['kmActuales'];
    $remito = isset($data['remito']) ? "'" . $conn->real_escape_string($data['remito']) . "'" : "NULL";
    $tipocombustible = isset($data['tipocombustible']) && $data['tipocombustible'] !== '' ? (int)$data['tipocombustible'] : "NULL";
    $litros = isset($data['litros']) && $data['litros'] !== '' ? (float)$data['litros'] : "NULL";
    $montototal = isset($data['montototal']) && $data['montototal'] !== '' ? (float)$data['montototal'] : "NULL";
    $precintoentrada = isset($data['precintoentrada']) ? "'" . $conn->real_escape_string($data['precintoentrada']) . "'" : "NULL";
    $precintosalida = isset($data['precintosalida']) ? "'" . $conn->real_escape_string($data['precintosalida']) . "'" : "NULL";
    $centrodecarga = isset($data['centrodecarga']) && $data['centrodecarga'] !== '' ? (int)$data['centrodecarga'] : "NULL";
    
    $esPersonaExterna = (isset($data['esPersonaExterna']) && $data['esPersonaExterna'] === true) ? 1 : 0;
    
    $sql = "INSERT INTO tuso (
        idVehiculo, idPersona, esPersonaExterna, fecha, hora, kmActuales,
        remito, tipocombustible, litros, montototal, 
        precintoentrada, precintosalida, centrodecarga
    ) VALUES (
        $idVehiculo, $idPersona, $esPersonaExterna, '$fecha', '$hora', $kmActuales,
        $remito, $tipocombustible, $litros, $montototal,
        $precintoentrada, $precintosalida, $centrodecarga
    )";
    
    if ($conn->query($sql)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

if ($action === 'update') {
    $id = (int)$data['id'];
    $idVehiculo = (int)$data['idVehiculo'];
    $idPersona = (int)$data['idPersona'];
    $fecha = $conn->real_escape_string($data['fecha']);
    $hora = $conn->real_escape_string($data['hora']);
    $kmActuales = (float)$data['kmActuales'];
    $remito = isset($data['remito']) ? "'" . $conn->real_escape_string($data['remito']) . "'" : "NULL";
    $tipocombustible = isset($data['tipocombustible']) && $data['tipocombustible'] !== '' ? (int)$data['tipocombustible'] : "NULL";
    $litros = isset($data['litros']) && $data['litros'] !== '' ? (float)$data['litros'] : "NULL";
    $montototal = isset($data['montototal']) && $data['montototal'] !== '' ? (float)$data['montototal'] : "NULL";
    $precintoentrada = isset($data['precintoentrada']) ? "'" . $conn->real_escape_string($data['precintoentrada']) . "'" : "NULL";
    $precintosalida = isset($data['precintosalida']) ? "'" . $conn->real_escape_string($data['precintosalida']) . "'" : "NULL";
    $centrodecarga = isset($data['centrodecarga']) && $data['centrodecarga'] !== '' ? (int)$data['centrodecarga'] : "NULL";
    
    $esPersonaExterna = (isset($data['esPersonaExterna']) && $data['esPersonaExterna'] === true) ? 1 : 0;
    
    $sql = "UPDATE tuso SET 
        idVehiculo = $idVehiculo,
        idPersona = $idPersona,
        esPersonaExterna = $esPersonaExterna,
        fecha = '$fecha',
        hora = '$hora',
        kmActuales = $kmActuales,
        remito = $remito,
        tipocombustible = $tipocombustible,
        litros = $litros,
        montototal = $montototal,
        precintoentrada = $precintoentrada,
        precintosalida = $precintosalida,
        centrodecarga = $centrodecarga
    WHERE id = $id";
    
    if ($conn->query($sql)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

if ($action === 'delete') {
    $id = (int)$data['id'];
    $sql = "DELETE FROM tuso WHERE id = $id";
    
    if ($conn->query($sql)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}
?>
