<?php
require_once("../config/headers.php");
require_once("../config/db.php");

$body = json_decode(file_get_contents("php://input"), true);
$action = $body["action"] ?? "";
$busqueda = $conn->real_escape_string($body["busqueda"] ?? "");

if ($action === "get") {
    $where = "1=1";
    if (!empty($busqueda)) {
        $where .= " AND (razon_social LIKE '%$busqueda%' OR cuit LIKE '%$busqueda%' OR contacto LIKE '%$busqueda%' OR direccion LIKE '%$busqueda%' OR telefono LIKE '%$busqueda%')";
    }

    $sql = "SELECT * FROM tproveedores WHERE $where ORDER BY razon_social ASC";
    $res = $conn->query($sql);
    echo json_encode($res->fetch_all(MYSQLI_ASSOC));

} elseif ($action === "insert") {
    $razon_social = $conn->real_escape_string($body["razon_social"]);
    $cuit = $conn->real_escape_string($body["cuit"]);
    $contacto = $conn->real_escape_string($body["contacto"]);
    $direccion = $conn->real_escape_string($body["direccion"]);
    $telefono = $conn->real_escape_string($body["telefono"]);

    $sql = "INSERT INTO tproveedores (razon_social, cuit, contacto, direccion, telefono)
            VALUES ('$razon_social', '$cuit', '$contacto', '$direccion', '$telefono')";
    echo json_encode(["success" => $conn->query($sql)]);

} elseif ($action === "update") {
    $id = (int)$body["id"];
    $razon_social = $conn->real_escape_string($body["razon_social"]);
    $cuit = $conn->real_escape_string($body["cuit"]);
    $contacto = $conn->real_escape_string($body["contacto"]);
    $direccion = $conn->real_escape_string($body["direccion"]);
    $telefono = $conn->real_escape_string($body["telefono"]);

    $sql = "UPDATE tproveedores SET
            razon_social = '$razon_social',
            cuit = '$cuit',
            contacto = '$contacto',
            direccion = '$direccion',
            telefono = '$telefono'
            WHERE id = $id";
    echo json_encode(["success" => $conn->query($sql)]);

} elseif ($action === "delete") {
    $id = (int)$body["id"];

    // Verificar si el proveedor tiene compras
    $sql_check = "SELECT COUNT(*) AS total FROM tcompras_encabezado WHERE idProveedor = $id";
    $res_check = $conn->query($sql_check);
    $row = $res_check->fetch_assoc();

    if ($row["total"] > 0) {
        echo json_encode([
            "success" => false,
            "error" => "No se puede eliminar: el proveedor tiene compras registradas."
        ]);
        exit;
    }

    // Eliminar si no tiene compras asociadas
    $sql = "DELETE FROM tproveedores WHERE id = $id";
    if ($conn->query($sql)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => "Error al eliminar el proveedor."
        ]);
    }
}

?>
