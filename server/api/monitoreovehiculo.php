<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);
$action = $request["action"] ?? '';
$page = isset($request["page"]) ? (int)$request["page"] : 1;
$limit = 20;
$offset = ($page - 1) * $limit;
$busqueda = $conn->real_escape_string($request["busqueda"] ?? "");
$filtro = $conn->real_escape_string($request["filtro"] ?? "todos");

$ordenCampo = $conn->real_escape_string($request["ordenCampo"] ?? "");
$ordenAsc = isset($request["ordenAsc"]) && $request["ordenAsc"] == false ? "DESC" : "ASC";
$camposPermitidos = [
    "patente" => "v.patente",
    "marca" => "v.marca",
    "modelo" => "v.modelo",
    "anio" => "v.anio",
    "obligacion" => "ov.nombre",
    "lotiene" => "vv.lotiene",
    "fechaVencimiento" => "vv.fecha"
];

$ordenSQL = isset($camposPermitidos[$ordenCampo]) ? "ORDER BY {$camposPermitidos[$ordenCampo]} $ordenAsc" : "ORDER BY v.patente ASC";

if ($action === "get") {
    $where = "WHERE ov.lotiene = 1 and v.inactivo = 0";

    if (!empty($busqueda)) {
        $where .= " AND (v.numerointerno LIKE '%$busqueda%' OR v.patente LIKE '%$busqueda%' OR v.marca LIKE '%$busqueda%' OR v.modelo LIKE '%$busqueda%' OR v.anio LIKE '%$busqueda%' OR ov.nombre LIKE '%$busqueda%')";
    }

    if ($filtro === "vencidos") {
        $where .= " AND vv.fecha IS NOT NULL AND vv.fecha < CURDATE()";
    } elseif ($filtro === "proximos") {
        $where .= " AND vv.fecha IS NOT NULL AND vv.fecha BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)";
    }


    $countQuery = "
        SELECT COUNT(*) AS total
        FROM tvehiculos v
        JOIN tvencimientosvehiculos vv ON vv.idVehiculo = v.id
        JOIN tobligacionesvehiculo ov ON ov.id = vv.idObligacionVehiculo
        $where
    ";
    $totalRes = $conn->query($countQuery);
    $total = $totalRes->fetch_assoc()["total"] ?? 0;

    $query = "
        SELECT
            v.numerointerno,
            v.patente,
            v.marca,
            v.modelo,
            v.anio,
            ov.nombre AS obligacion,
            vv.lotiene,
            vv.fecha,
            v.inactivo,
            DATEDIFF(vv.fecha, CURDATE()) AS diasRestantes
        FROM tvehiculos v
        JOIN tvencimientosvehiculos vv ON vv.idVehiculo = v.id
        JOIN tobligacionesvehiculo ov ON ov.id = vv.idObligacionVehiculo
        $where
        $ordenSQL
        LIMIT $limit OFFSET $offset
    ";

    $res = $conn->query($query);
    $datos = [];

    while ($row = $res->fetch_assoc()) {
        $fecha = $row["fecha"];
        $diasRestantes = is_null($fecha) ? null : (int)$row["diasRestantes"];
        $estado = "Sin fecha";

        if (!is_null($fecha)) {
            $anios = floor(abs($diasRestantes) / 365);
            $restoDias = abs($diasRestantes) % 365;

            if ($diasRestantes <= 0) {
                $estado = $anios >= 1
                    ? "VENCIDA hace $anios año(s) y $restoDias días"
                    : "VENCIDA hace $restoDias días";
            } else {
                $estado = $anios >= 1
                    ? "$anios año(s) y $restoDias días restantes"
                    : "$diasRestantes días restantes";
            }
        }

        $color = match (true) {
            is_null($fecha) => "black",
            $diasRestantes <= 1 => "red",
            $diasRestantes <= 15 => "orange",
            $diasRestantes <= 30 => "yellow",
            $diasRestantes > 30 => "green",
            default => "green"
        };

        $datos[] = [
            "numerointerno" => $row["numerointerno"],
            "patente" => $row["patente"],
            "marca" => $row["marca"],
            "modelo" => $row["modelo"],
            "anio" => $row["anio"],
            "obligacion" => $row["obligacion"],
            "lotiene" => $row["lotiene"],
            "fechaVencimiento" => $fecha ?? "",
            "estado" => $estado,
            "color" => $color
        ];
    }

    echo json_encode([
        "data" => $datos,
        "total" => $total,
        "pagina" => $page
    ]);
} elseif ($action === "getAllForExport") {
    $where = "WHERE ov.lotiene = 1";

    if (!empty($busqueda)) {
        $where .= " AND (v.numerointerno LIKE '%$busqueda%' OR v.patente LIKE '%$busqueda%' OR v.marca LIKE '%$busqueda%' OR v.modelo LIKE '%$busqueda%' OR v.anio LIKE '%$busqueda%' OR ov.nombre LIKE '%$busqueda%')";
    }

    if ($filtro === "vencidos") {
        $where .= " AND vv.fecha IS NOT NULL AND vv.fecha < CURDATE()";
    } elseif ($filtro === "proximos") {
        $where .= " AND vv.fecha IS NOT NULL AND vv.fecha BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)";
    }

    $query = "
        SELECT
            v.numerointerno,
            v.patente,
            v.marca,
            v.modelo,
            v.anio,
            ov.nombre AS obligacion,
            vv.lotiene,
            vv.fecha,
            DATEDIFF(vv.fecha, CURDATE()) AS diasRestantes
        FROM tvehiculos v
        JOIN tvencimientosvehiculos vv ON vv.idVehiculo = v.id
        JOIN tobligacionesvehiculo ov ON ov.id = vv.idObligacionVehiculo
        $where
        $ordenSQL
    ";

    $res = $conn->query($query);
    $datos = [];

    while ($row = $res->fetch_assoc()) {
        $fecha = $row["fecha"];
        $diasRestantes = is_null($fecha) ? null : (int)$row["diasRestantes"];
        $estado = "Sin fecha";

        if (!is_null($fecha)) {
            $anios = floor(abs($diasRestantes) / 365);
            $restoDias = abs($diasRestantes) % 365;

            if ($diasRestantes <= 0) {
                $estado = $anios >= 1
                    ? "VENCIDA hace $anios año(s) y $restoDias días"
                    : "VENCIDA hace $restoDias días";
            } else {
                $estado = $anios >= 1
                    ? "$anios año(s) y $restoDias días restantes"
                    : "$diasRestantes días restantes";
            }
        }

        $color = match (true) {
            is_null($fecha) => "black",
            $diasRestantes <= 1 => "red",
            $diasRestantes <= 15 => "orange",
            $diasRestantes <= 30 => "yellow",
            $diasRestantes > 30 => "green",
            default => "green"
        };

        $datos[] = [
            "numerointerno" => $row["numerointerno"],
            "patente" => $row["patente"],
            "marca" => $row["marca"],
            "modelo" => $row["modelo"],
            "anio" => $row["anio"],
            "obligacion" => $row["obligacion"],
            "lotiene" => $row["lotiene"],
            "fechaVencimiento" => $fecha ?? "",
            "estado" => $estado,
            "color" => $color
        ];
    }

    echo json_encode(["data" => $datos]);
} else {
    echo json_encode(["error" => "Acción no válida"]);
}
