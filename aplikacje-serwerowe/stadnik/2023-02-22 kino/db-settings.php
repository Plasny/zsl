<?php
define("DB_HOST", "127.0.0.1");
define("DB_USER", "root");
define("DB_PASS", "");
define("DB_NAME", "pp_kino");

$conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);
$conn->query("SET NAMES UTF8");

// function closeDbConn() {
//     $GLOBALS["conn"]->close();
// }
