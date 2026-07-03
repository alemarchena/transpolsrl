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

if ($action === "get") {
    $where = "WHERE orol.loTiene = 1";

    if (!empty($busqueda)) {
        $where .= " AND (p.nombre LIKE '%$busqueda%' OR p.apellido LIKE '%$busqueda%')";
    }

    if ($filtro === "vencidos") {
        $where .= " AND v.fecha IS NOT NULL AND v.fecha < CURDATE()";
    } elseif ($filtro === "proximos") {
        $where .= " AND v.fecha IS NOT NULL AND v.fecha BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)";
    }

    // Total de registros
    $countQuery = "
        SELECT COUNT(*) AS total
        FROM trrhh rr
        INNER JOIN tpersonas p ON rr.idPersona = p.id
        INNER JOIN troles r ON rr.idRol = r.id
        INNER JOIN tobligacionesrol orol ON orol.idRol = r.id
        LEFT JOIN tvencimientos v ON v.idObligacionRol = orol.id AND v.idPersona = p.id
        $where
    ";
    $totalRes = $conn->query($countQuery);
    $total = $totalRes->fetch_assoc()["total"];

    // Consulta paginada
    $query = "
        SELECT
            p.nombre AS personaNombre,
            p.apellido AS personaApellido,
            p.dni,
            r.nombre AS rolNombre,
            orol.nombre AS obligacion,
            v.fecha AS fechaVencimiento,
            v.lotiene,
            DATEDIFF(v.fecha, CURDATE()) AS diasRestantes
        FROM trrhh rr
        INNER JOIN tpersonas p ON rr.idPersona = p.id
        INNER JOIN troles r ON rr.idRol = r.id
        INNER JOIN tobligacionesrol orol ON orol.idRol = r.id
        LEFT JOIN tvencimientos v ON v.idObligacionRol = orol.id AND v.idPersona = p.id
        $where
        ORDER BY p.apellido ASC, p.nombre ASC
        LIMIT $limit OFFSET $offset
    ";

    $res = $conn->query($query);
    $datos = [];

    while ($row = $res->fetch_assoc()) {
        $fecha = $row["fechaVencimiento"];
        $diasRestantes = is_null($fecha) ? null : (int)$row["diasRestantes"];
        $estado = "Sin fecha";

        if (!is_null($fecha)) {
            $anios = floor(abs($diasRestantes) / 365);
            $restoDias = abs($diasRestantes) % 365;

            if ($diasRestantes < 0) {
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
            $diasRestantes < 0 => "red",
            $diasRestantes <= 30 => "blue",
            default => "green"
        };

        $datos[] = [
            "persona" => "{$row["personaApellido"]}, {$row["personaNombre"]}",
            "dni" => $row["dni"],
            "rol" => $row["rolNombre"],
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
} else {
    echo json_encode(["error" => "Acción no válida"]);
}
