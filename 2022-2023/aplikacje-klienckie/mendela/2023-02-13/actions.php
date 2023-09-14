<?php
require(".secrets.php");

header('Content-Type: application/json; charset=utf-8');

$mysqli = new mysqli($host, $user, $pass, $dbname);
$mysqli->query("set names utf8");

if (isset($_POST["action"])) {
    if ($_POST["action"] == "init") {
        $query = "SELECT id, name FROM countries";
        $results = $mysqli->query($query);
        $countries = $results->fetch_all();

        $query = "SELECT id, name FROM alloys";
        $results = $mysqli->query($query);
        $alloys = $results->fetch_all();

        echo '{"countries":' . json_encode($countries) . ', "alloys":' . json_encode($alloys) . '}';
        exit;
    } elseif ($_POST["action"] == "del") {
        $query = "DELETE FROM data WHERE id=?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("i", $_POST["id"]);
        $stmt->execute();
        http_response_code(200);
        exit;
    } elseif ($_POST["action"] == "add") {
        $query = "INSERT INTO data(country_id, denomination, category, alloy_id, year) VALUES (?, ?, ?, ?, ?)";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("issis", $_POST["country_id"], $_POST["denomination"], $_POST["category"], $_POST["alloy_id"], $_POST["year"]);
        $stmt->execute();
        http_response_code(200);
        exit;
    } elseif ($_POST["action"] == "edit") {
        $query = "UPDATE data
            SET country_id=?, denomination=?, category=?, alloy_id=?, year=?
            WHERE id=?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("issisi", $_POST["country_id"], $_POST["denomination"], $_POST["category"], $_POST["alloy_id"], $_POST["year"], $_POST["id"]);
        $stmt->execute();
        http_response_code(200);
        exit;
    }
}
$query = "SELECT data.id, countries.name, data.denomination, data.category, alloys.name, data.year 
        FROM data 
        INNER JOIN countries ON data.country_id=countries.id 
        INNER JOIN alloys ON data.alloy_id=alloys.id";
$results = $mysqli->query($query);
$data = $results->fetch_all();

echo json_encode($data);
