<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$body = json_decode(file_get_contents("php://input"), true);
$action = $body["action"] ?? "";

if ($action === "get") {
    $busqueda = $conn->real_escape_string($body["busqueda"] ?? "");
    
    $sql = "
        SELECT DISTINCT
            v.id as idVehiculo,
            v.numerointerno,
            v.patente,
            v.marca,
            v.modelo,
            v.anio,
            v.inactivo,
            v.kmfrecuenciacambioaceite,
            (SELECT kmActuales FROM tuso WHERE idVehiculo = v.id ORDER BY fecha DESC, hora DESC LIMIT 1) as kmActual,
            sv.idserviciomonitoreable,
            sm.nombre as nombreServicioMonitoreable,
            sm.acumulable as esAcumulable,
            sv.idArticulo,
            a.nombre as nombreArticulo
        FROM tvehiculos v
        INNER JOIN tserviciosvehiculo sv ON sv.idVehiculo = v.id
        INNER JOIN tserviciosmonitoreables sm ON sv.idserviciomonitoreable = sm.id
        INNER JOIN tarticulos a ON sv.idArticulo = a.id
        WHERE sv.idserviciomonitoreable != 0 AND v.inactivo = 0
          AND sv.idserviciomonitoreable IS NOT NULL
    ";
    
    if (!empty($busqueda)) {
        $sql .= " AND (v.numerointerno LIKE '%$busqueda%' OR v.patente LIKE '%$busqueda%' OR v.marca LIKE '%$busqueda%' OR v.modelo LIKE '%$busqueda%')";
    }
    
    $sql .= " ORDER BY v.patente, sm.nombre, a.nombre";
    
    $resServicios = $conn->query($sql);
    
    $resultado = [];
    
    while ($row = $resServicios->fetch_assoc()) {
        $idVehiculo = $row['idVehiculo'];
        $kmActual = $row['kmActual'] ?? 0;
        $kmFrecuencia = $row['kmfrecuenciacambioaceite'] ?? 0;
        $idServicioMonitoreable = $row['idserviciomonitoreable'];
        $idArticulo = $row['idArticulo'];
        $esAcumulable = $row['esAcumulable'] ?? 0;

        // Calcular promedio de km por día del vehículo
        $sqlPromedio = "
            SELECT 
                MIN(fecha) as fechaInicio,
                MAX(fecha) as fechaFin,
                MIN(kmActuales) as kmInicio,
                MAX(kmActuales) as kmFin
            FROM tuso
            WHERE idVehiculo = $idVehiculo
        ";
        $resPromedio = $conn->query($sqlPromedio);
        $dataPromedio = $resPromedio->fetch_assoc();
        
        $promedioKmPorDia = 100; // Default
        if ($dataPromedio && $dataPromedio['fechaInicio'] && $dataPromedio['fechaFin']) {
            $fechaInicio = new DateTime($dataPromedio['fechaInicio']);
            $fechaFin = new DateTime($dataPromedio['fechaFin']);
            $dias = $fechaInicio->diff($fechaFin)->days;
            
            if ($dias > 0) {
                $kmRecorridos = $dataPromedio['kmFin'] - $dataPromedio['kmInicio'];
                $promedioKmPorDia = $kmRecorridos / $dias;
            }
        }
        
        // Buscar el último servicio de este servicio monitoreable + artículo para este vehículo
        $sqlUltimoServicio = "
            SELECT 
                kmRecorridos as ultimoKmServicio,
                fecha_servicio as fechaUltimoServicio
            FROM tserviciosvehiculo
            WHERE idVehiculo = $idVehiculo 
              AND idserviciomonitoreable = $idServicioMonitoreable
              AND idArticulo = $idArticulo
            ORDER BY fecha_servicio DESC, id DESC
            LIMIT 1
        ";
        $resUltimoServicio = $conn->query($sqlUltimoServicio);
        $dataServicio = $resUltimoServicio->fetch_assoc();
        
        $ultimoKmServicio = $dataServicio['ultimoKmServicio'] ?? null;
        $fechaUltimoServicio = $dataServicio['fechaUltimoServicio'] ?? null;
        
        // Criterios para "Sin datos"
        $faltaKmActual = ($kmActual == 0 || $kmActual === null);
        $faltaFrecuencia = ($kmFrecuencia == 0 || $kmFrecuencia === null);
        $sinServicioPrevio = ($ultimoKmServicio === null || $fechaUltimoServicio === null);
        $datosInconsistentes = (!$faltaKmActual && !$sinServicioPrevio && $kmActual < $ultimoKmServicio);
        
        if ($faltaKmActual || $faltaFrecuencia || $sinServicioPrevio || $datosInconsistentes) {
            $resultado[] = [
                'idVehiculo' => $idVehiculo,
                'numerointerno' => $row['numerointerno'],
                'patente' => $row['patente'],
                'marca' => $row['marca'],
                'modelo' => $row['modelo'],
                'anio' => $row['anio'],
                'kmActual' => $kmActual > 0 ? $kmActual : null,
                'idArticulo' => $idArticulo,
                'nombreArticulo' => $row['nombreArticulo'],
                'idServicioMonitoreable' => $idServicioMonitoreable,
                'nombreServicioMonitoreable' => $row['nombreServicioMonitoreable'],
                'ultimoKmServicio' => $ultimoKmServicio,
                'fechaUltimoServicio' => $fechaUltimoServicio,
                'kmProximoServicio' => null,
                'kmFaltantes' => null,
                'diasFaltantes' => null,
                'estado' => 'Sin datos',
                'colorEstado' => 'gray',
                'promedioKmPorDia' => round($promedioKmPorDia, 2)
            ];
            continue;
        }
        
        // Calcular valores normales
        if ($esAcumulable == 1) {
            $kmAcumuladoComponente = $kmActual - $ultimoKmServicio;
            
            // Para acumulables no calculamos próximo servicio ni km faltantes
            $kmProximoServicio = null;
            $kmFaltantes = null;
            
        } else {
            // Para servicios no acumulables: usar el método tradicional (km actual - km último servicio)
            $kmProximoServicio = $ultimoKmServicio + $kmFrecuencia;
            $kmFaltantes = $kmProximoServicio - $kmActual;
            $kmAcumuladoComponente = null;
        }
        
        $diasFaltantes = 0;
        $estado = 'Al día';
        $colorEstado = 'green';
        
        if ($esAcumulable != 1) {
            if ($kmFaltantes <= 0) {
                $estado = 'Vencido';
                $colorEstado = 'red';
                $diasFaltantes = 0;
            } elseif ($promedioKmPorDia > 0) {
                $diasFaltantes = ceil($kmFaltantes / $promedioKmPorDia);
                
                if ($diasFaltantes <= 7) {
                    $estado = 'Urgente';
                    $colorEstado = 'orange';
                } elseif ($diasFaltantes <= 30) {
                    $estado = 'Próximo';
                    $colorEstado = 'yellow';
                }
            }
        } else {
            // Para acumulables no hay estado de vencimiento
            $estado = 'Acumulativo';
            $colorEstado = 'purple';
            $diasFaltantes = null;
        }
        
        $resultado[] = [
            'idVehiculo' => $idVehiculo,
            'numerointerno' => $row['numerointerno'],
            'patente' => $row['patente'],
            'marca' => $row['marca'],
            'modelo' => $row['modelo'],
            'anio' => $row['anio'],
            'kmActual' => $kmActual,
            'idArticulo' => $idArticulo,
            'nombreArticulo' => $row['nombreArticulo'],
            'idServicioMonitoreable' => $idServicioMonitoreable,
            'nombreServicioMonitoreable' => $row['nombreServicioMonitoreable'],
            'esAcumulable' => $esAcumulable,
            'ultimoKmServicio' => $ultimoKmServicio,
            'fechaUltimoServicio' => $fechaUltimoServicio,
            'kmProximoServicio' => $kmProximoServicio,
            'kmFaltantes' => $kmFaltantes,
            'kmAcumulados' => $kmAcumuladoComponente, // Agregado para servicios acumulables
            'diasFaltantes' => $diasFaltantes,
            'estado' => $estado,
            'colorEstado' => $colorEstado,
            'promedioKmPorDia' => round($promedioKmPorDia, 2)
        ];
    }
    
    echo json_encode(["data" => $resultado]);
    
} else {
    echo json_encode(["error" => "Acción no válida"]);
}
?>
