<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$body = json_decode(file_get_contents("php://input"), true);
$action = $body["action"] ?? "";

if ($action === "get") {
    $busqueda = $conn->real_escape_string($body["busqueda"] ?? "");
    $fechaDesde = $body["fechaDesde"] ?? "";
    $fechaHasta = $body["fechaHasta"] ?? "";

    // Obtener todas las cargas con litros > 0
    $sql = "SELECT 
                u.id,
                u.idVehiculo,
                u.fecha,
                u.hora,
                u.kmActuales,
                u.litros,
                v.numerointerno,
                v.patente,
                v.marca,
                v.modelo,
                v.anio,
                v.inactivo
            FROM tuso u
            INNER JOIN tvehiculos v ON u.idVehiculo = v.id
            WHERE u.litros > 0 and v.inactivo = 0";

    // Filtros de fecha
    if (!empty($fechaDesde) && !empty($fechaHasta)) {
        $fechaDesde = $conn->real_escape_string($fechaDesde);
        $fechaHasta = $conn->real_escape_string($fechaHasta);
        $sql .= " AND u.fecha BETWEEN '$fechaDesde' AND '$fechaHasta'";
    } elseif (!empty($fechaDesde)) {
        $fechaDesde = $conn->real_escape_string($fechaDesde);
        $sql .= " AND u.fecha >= '$fechaDesde'";
    } elseif (!empty($fechaHasta)) {
        $fechaHasta = $conn->real_escape_string($fechaHasta);
        $sql .= " AND u.fecha <= '$fechaHasta'";
    }

    // Búsqueda
    if (!empty($busqueda)) {
        $sql .= " AND (v.numerointerno LIKE '%$busqueda%' 
                    OR v.patente LIKE '%$busqueda%' 
                    OR v.marca LIKE '%$busqueda%' 
                    OR v.modelo LIKE '%$busqueda%')";
    }

    $sql .= " ORDER BY v.id, u.fecha, u.hora";
    $result = $conn->query($sql);
    $registros = $result->fetch_all(MYSQLI_ASSOC);

    // usort($registros, fn($a, $b) => (float)$a['kmActuales'] <=> (float)$b['kmActuales']);

    // Agrupación por vehículo
    $vehiculosData = [];
    $ultimoKmValido = []; // guarda último km válido por vehículo para controlar pares consecutivos

    foreach ($registros as $registro) {

        $vehiculoId = (int)$registro['idVehiculo'];
        $kmActual   = (float)$registro['kmActuales'];
        $litros     = (float)$registro['litros'];

        if (!isset($vehiculosData[$vehiculoId])) {
            $vehiculosData[$vehiculoId] = [
                'idVehiculo' => $vehiculoId,
                'numerointerno' => $registro['numerointerno'],
                'patente' => $registro['patente'],
                'marca' => $registro['marca'],
                'modelo' => $registro['modelo'],
                'anio' => $registro['anio'],
                'totalKmRecorridos' => 0,
                'totalLitros' => 0,
                'cantidadCargas' => 0,
            ];
            $ultimoKmValido[$vehiculoId] = null;
        }

        // Primer registro solo fija base
        if ($ultimoKmValido[$vehiculoId] === null) {
            $ultimoKmValido[$vehiculoId] = $kmActual;
            continue;
        }

        $kmRecorridos = $kmActual - $ultimoKmValido[$vehiculoId];

        if ($kmRecorridos > 0) {

            $consumoTramo = ($litros / $kmRecorridos) * 100;

            if ($consumoTramo > 0 && $consumoTramo < 100) {

                $vehiculosData[$vehiculoId]['totalKmRecorridos'] += $kmRecorridos;
                $vehiculosData[$vehiculoId]['totalLitros'] += $litros;
                $vehiculosData[$vehiculoId]['cantidadCargas']++;
            }
        }

        $ultimoKmValido[$vehiculoId] = $kmActual;
    }



    $resultado = [];

    foreach ($vehiculosData as $vehiculo) {

        $vehiculo['promedioConsumo'] =
            $vehiculo['totalKmRecorridos'] > 0
                ? number_format(
                    ($vehiculo['totalLitros'] / $vehiculo['totalKmRecorridos']) * 100,
                    2, '.', ''
                )
                : null;

        $resultado[] = $vehiculo;
    }


    // Ahora ordenar correctamente por promedio descendente
    usort($resultado, fn($a, $b) => (float)($b['promedioConsumo'] ?? 0) <=> (float)($a['promedioConsumo'] ?? 0));

    echo json_encode(["data" => $resultado]);

} else {
    echo json_encode(["error" => "Acción no válida"]);
}
?>
