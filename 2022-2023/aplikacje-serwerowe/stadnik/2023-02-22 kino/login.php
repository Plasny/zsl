<?php
session_start();

if (isset($_SESSION['user'])) {
    header('Location: index.php');
}

if (isset($_POST['user'], $_POST['pass'])) {
    include 'db-settings.php';
    $stmt = $conn->prepare("SELECT id FROM users WHERE username=? AND passwordHash=SHA1(?)");
    $stmt->bind_param("ss", $_POST['user'], $_POST['pass']);
    $stmt->execute();
    $uid = $stmt->get_result()->fetch_row()[0];

    if ($uid) {
        $_SESSION['user'] = $uid;
        header('Location: index.php');
        exit;
    }

    echo '<span style="color: red">Wrong credentials</span>';
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kino - Login</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/login.css">
</head>

<body>
    <ul class="navBar">
        <li><a href="seances.php">Seanse</a></li>
    </ul>

    <div class="container">
        <form id="loginForm" method="POST">
            <h2>Login</h2>
            <hr>

            <label for="user">Nazwa użytkownika</label>
            <input name="user" type="text" required>

            <label for="pass">Hasło</label>
            <input name="pass" type="password" required>
            <hr>
            <p class="info">Nie posiadasz konta? <a href="registration.php">Zarejestruj się</a></p>

            <input type="submit" value="Zaloguj">
        </form>
    </div>
</body>

</html>