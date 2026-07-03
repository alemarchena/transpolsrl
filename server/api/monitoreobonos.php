<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);
$action = $data["action"] ?? "";

try {
    switch ($action) {
        case "get":
            $anio = isset($data["anio"]) ? (int)$data["anio"] : 0;
            $mesInicio = isset($data["mesInicio"]) ? (int)$data["mesInicio"] : 0;
            $mesFin = isset($data["mesFin"]) ? (int)$data["mesFin"] : 0;
            $pagina = isset($data["pagina"]) ? (int)$data["pagina"] : 1;
            $limite = isset($data["limite"]) ? (int)$data["limite"] : 20;
            $offset = ($pagina - 1) * $limite;

            // Si los filtros no son válidos, devolvemos vacío
            if ($anio <= 0 || $mesInicio <= 0 || $mesFin <= 0 || $mesInicio > $mesFin) {
                echo json_encode(["success" => true, "data" => [], "total" => 0]);
                exit;
            }

            // Convertir los meses (número) a nombres (Enero, Febrero, etc.)
            $meses = [
                1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
                5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
                9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
            ];

            // Construir la lista de meses en el rango
            $mesesFiltrar = [];
            for ($i = $mesInicio; $i <= $mesFin; $i++) {
                $mesesFiltrar[] = "'" . $conn->real_escape_string($meses[$i]) . "'";
            }
            $mesesSql = implode(",", $mesesFiltrar);

            // Consulta total
            $totalRes = $conn->query("
                SELECT COUNT(*) AS total
                FROM tpersonasbonos pb
                INNER JOIN tpersonas p ON p.id = pb.idPersona
                WHERE pb.anio = $anio AND pb.mes IN ($mesesSql)
            ");
            $total = ($totalRes) ? (int)$totalRes->fetch_assoc()["total"] : 0;

            // Consulta de datos
            $query = "
                SELECT pb.id, pb.mes, pb.anio, pb.archivo_url,
                       pb.firmado_por, pb.firmado_fecha,
                       CONCAT(p.apellido, ', ', p.nombre) AS persona, pb.idPersona
                FROM tpersonasbonos pb
                INNER JOIN tpersonas p ON p.id = pb.idPersona
                WHERE pb.anio = $anio AND pb.mes IN ($mesesSql)
                ORDER BY p.apellido ASC, pb.anio DESC, 
                         FIELD(pb.mes, 'Enero','Febrero','Marzo','Abril',
                                        'Mayo','Junio','Julio','Agosto',
                                        'Septiembre','Octubre','Noviembre','Diciembre')
                LIMIT $limite OFFSET $offset
            ";

            $res = $conn->query($query);
            if (!$res) throw new Exception($conn->error);

            $data = $res->fetch_all(MYSQLI_ASSOC);

            echo json_encode([
                "success" => true,
                "data" => $data,
                "total" => $total
            ]);
            break;

        default:
            echo json_encode(["success" => false, "error" => "Acción no válida"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
