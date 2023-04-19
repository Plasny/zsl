<?php
session_start();

if (isset($_SESSION['user'])) {
    header('Location: index.php');
    exit;
}

if (isset($_POST['user'], $_POST['phone'], $_POST['pass'])) {
    include 'db-settings.php';
    $stmt = $conn->prepare("SELECT count(*) FROM users WHERE username=?");
    $stmt->bind_param("s", $_POST['user']);
    $stmt->execute();
    $exists = $stmt->get_result()->fetch_row()[0];

    if (!$exists) {
        $stmt = $conn->prepare("INSERT INTO users (username, passwordHash, phone) VALUES (?, SHA1(?), ?)");
        $stmt->bind_param("sss", $_POST['user'], $_POST['pass'], $_POST['phone']);
        $stmt->execute();
        $uid = $stmt->insert_id;
        $_SESSION['user'] = $uid;

        header('Location: login.php');
        exit;
    }

    echo '<span style="color: red">User with a given name already exists</span>';
}
?>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kino - Rejestracja</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/login.css">
</head>

<body>
    <ul class="navBar">
        <li><a href="seances.php">Seanse</a></li>
    </ul>

    <div class="container">
        <form id="loginForm" method="POST">
            <h2>Rejestracja</h2>
            <hr>

            <label for="user">Nazwa użytkownika</label>
            <input name="user" type="text" required>

            <label for="phone">Numer telefonu</label>
            <input name="phone" type="tel" required>

            <label for="pass">Hasło</label>
            <input name="pass" type="password" required>
            <hr>

            <input type="submit" value="Zaloguj">
        </form>
    </div>
</body>

</html>