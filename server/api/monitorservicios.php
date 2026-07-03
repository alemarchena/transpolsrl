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
            sm.id as idserviciomonitoreable,
            sm.nombre as nombreServicioMonitoreable,
            sm.acumulable as esAcumulable
        FROM tvehiculos v
        INNER JOIN tserviciosvehiculo sv ON sv.idVehiculo = v.id
        INNER JOIN tserviciosmonitoreables sm ON sv.idserviciomonitoreable = sm.id
        WHERE sv.idserviciomonitoreable != 0 AND v.inactivo = 0
          AND sv.idserviciomonitoreable IS NOT NULL
    ";
    
    if (!empty($busqueda)) {
        $sql .= " AND (v.numerointerno LIKE '%$busqueda%' OR v.patente LIKE '%$busqueda%' OR v.marca LIKE '%$busqueda%' OR v.modelo LIKE '%$busqueda%')";
    }
    
    $sql .= " ORDER BY v.patente, sm.nombre";
    
    $resServicios = $conn->query($sql);
    
    $resultado = [];
    $procesados = []; // Para evitar duplicados por combinación Vehículo + ServicioMonitoreable
    
    while ($row = $resServicios->fetch_assoc()) {
        $idVehiculo = $row['idVehiculo'];
        $kmActual = $row['kmActual'] ?? 0;
        $kmFrecuencia = $row['kmfrecuenciacambioaceite'] ?? 0;
        $idServicioMonitoreable = $row['idserviciomonitoreable'];
        $esAcumulable = $row['esAcumulable'] ?? 0;
        
        // Clave única: Vehículo + Servicio Monitoreable (sin importar artículo)
        $claveUnica = $idVehiculo . '_' . $idServicioMonitoreable;
        
        // Si ya procesamos esta combinación, saltamos
        if (isset($procesados[$claveUnica])) {
            continue;
        }
        $procesados[$claveUnica] = true;
        
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
        
        // 🔥 IMPORTANTE: Buscar el último servicio SOLO por Vehículo + ServicioMonitoreable
        // Sin importar el artículo ni la categoría
        $sqlUltimoServicio = "
            SELECT 
                kmRecorridos as ultimoKmServicio,
                fecha_servicio as fechaUltimoServicio,
                idArticulo as idArticuloUsado
            FROM tserviciosvehiculo
            WHERE idVehiculo = $idVehiculo 
              AND idserviciomonitoreable = $idServicioMonitoreable
            ORDER BY fecha_servicio DESC, id DESC
            LIMIT 1
        ";
        
        $resUltimoServicio = $conn->query($sqlUltimoServicio);
        $dataServicio = $resUltimoServicio->fetch_assoc();
        
        $ultimoKmServicio = $dataServicio['ultimoKmServicio'] ?? null;
        $fechaUltimoServicio = $dataServicio['fechaUltimoServicio'] ?? null;
        $idArticuloUsado = $dataServicio['idArticuloUsado'] ?? null;
        
        // Obtener nombre del artículo usado (si existe)
        $nombreArticuloUsado = null;
        if ($idArticuloUsado) {
            $sqlArticulo = "SELECT nombre FROM tarticulos WHERE id = $idArticuloUsado";
            $resArticulo = $conn->query($sqlArticulo);
            if ($resArticulo && $rowArt = $resArticulo->fetch_assoc()) {
                $nombreArticuloUsado = $rowArt['nombre'];
            }
        }
        
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
                'idServicioMonitoreable' => $idServicioMonitoreable,
                'nombreServicioMonitoreable' => $row['nombreServicioMonitoreable'],
                'ultimoKmServicio' => $ultimoKmServicio,
                'fechaUltimoServicio' => $fechaUltimoServicio,
                'ultimoArticuloUsado' => $nombreArticuloUsado,
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
            $kmProximoServicio = null;
            $kmFaltantes = null;
        } else {
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
            'idServicioMonitoreable' => $idServicioMonitoreable,
            'nombreServicioMonitoreable' => $row['nombreServicioMonitoreable'],
            'esAcumulable' => $esAcumulable,
            'ultimoKmServicio' => $ultimoKmServicio,
            'fechaUltimoServicio' => $fechaUltimoServicio,
            'ultimoArticuloUsado' => $nombreArticuloUsado,
            'kmProximoServicio' => $kmProximoServicio,
            'kmFaltantes' => $kmFaltantes,
            'kmAcumulados' => $kmAcumuladoComponente,
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