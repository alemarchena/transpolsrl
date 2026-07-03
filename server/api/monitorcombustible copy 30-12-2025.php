<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$body = json_decode(file_get_contents("php://input"), true);
$action = $body["action"] ?? "";

if ($action === "get") {
    $busqueda = $conn->real_escape_string($body["busqueda"] ?? "");
    $fechaDesde = $body["fechaDesde"] ?? "";
    $fechaHasta = $body["fechaHasta"] ?? "";
    // Paso 1: Obtener todos los registros de uso de vehículos con litros > 0
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
                v.anio
            FROM tuso u
            INNER JOIN tvehiculos v ON u.idVehiculo = v.id
            WHERE u.litros > 0";
    
    // Aplicar filtro de fechas
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
    
    // Aplicar filtro de búsqueda
    if (!empty($busqueda)) {
        $sql .= " AND (v.numerointerno LIKE '%$busqueda%' OR v.patente LIKE '%$busqueda%' OR v.marca LIKE '%$busqueda%' OR v.modelo LIKE '%$busqueda%')";
    }
    
    $sql .= " ORDER BY v.id, u.fecha, u.hora";
    
    $result = $conn->query($sql);
    $registros = $result->fetch_all(MYSQLI_ASSOC);
    
    // Paso 2: Calcular kmRecorridos para cada registro
    $vehiculosData = [];
    
    foreach ($registros as &$registro) {
        $vehiculoId = (int)$registro['idVehiculo'];
        $fechaActual = $conn->real_escape_string($registro['fecha']);
        $horaActual = $conn->real_escape_string($registro['hora']);
        
        // Buscar el registro anterior del mismo vehículo
        $sqlAnterior = "SELECT kmActuales FROM tuso 
                        WHERE idVehiculo = $vehiculoId 
                        AND (fecha < '$fechaActual' OR (fecha = '$fechaActual' AND hora < '$horaActual'))
                        ORDER BY fecha DESC, hora DESC LIMIT 1";
        
        $resultAnterior = $conn->query($sqlAnterior);
        $anterior = $resultAnterior->fetch_assoc();
        
        if ($anterior) {
            $kmRecorridos = $registro['kmActuales'] - $anterior['kmActuales'];
        } else {
            $kmRecorridos = 0;
        }
        
        // MODIFICADO: Filtrar según el parámetro soloConKm
        $incluirRegistro = false;
        // if ($soloConKm) {
            // Solo incluir si kmRecorridos > 0 y litros > 0
            $incluirRegistro = ($kmRecorridos > 0 && $registro['litros'] > 0);
        // } else {
        //     // Incluir todos los que tengan litros > 0
        //     $incluirRegistro = ($registro['litros'] > 0);
        // }
        
        if ($incluirRegistro) {
            // Calcular consumo: (litros / kmRecorridos) * 100
            $consumo = $kmRecorridos > 0 ? ($registro['litros'] / $kmRecorridos) * 100 : 0;
            
            // Agrupar por vehículo
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
            }
            
            $vehiculosData[$vehiculoId]['totalKmRecorridos'] += $kmRecorridos;
            $vehiculosData[$vehiculoId]['totalLitros'] += (float)$registro['litros'];
            $vehiculosData[$vehiculoId]['cantidadCargas']++;
        }
    }
    
    // Paso 3: Calcular el promedio de consumo por vehículo
    $resultado = [];
    foreach ($vehiculosData as $vehiculo) {
        if ($vehiculo['totalLitros'] > 0) {
            // if ($vehiculo['totalKmRecorridos'] > 0) {
            //     $promedioConsumo = ($vehiculo['totalLitros'] / $vehiculo['totalKmRecorridos']) * 100;
            //     $vehiculo['promedioConsumo'] = number_format($promedioConsumo, 2, '.', '');
            // } else {
            //     $vehiculo['promedioConsumo'] = "0.00";
            // }
            if ($vehiculo['totalKmRecorridos'] > 0) {
                $promedioConsumo = ($vehiculo['totalLitros'] / $vehiculo['totalKmRecorridos']) * 100;
                $vehiculo['promedioConsumo'] = ($promedioConsumo < 1) ? null : number_format($promedioConsumo, 2, '.', '');
            } else {
                $vehiculo['promedioConsumo'] = null;
            }

            $resultado[] = $vehiculo;
        }
    }
    
    // Ordenar por promedio de consumo descendente
    usort($resultado, function($a, $b) {
        return (float)$b['promedioConsumo'] <=> (float)$a['promedioConsumo'];
    });
    
    echo json_encode(["data" => $resultado]);
    
} else {
    echo json_encode(["error" => "Acción no válida"]);
}
?>