<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kino - Strona Główna</title>
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <ul class="navBar">
        <li><a href="seances.php">Seanse</a></li>
        <?php
        session_start();
        if (isset($_SESSION['user'])) {
            echo '<li><a href="logout.php">Logout</a></li>';
        } else {
            echo '<li><a href="login.php">Login</a></li>';
        }
        ?>
    </ul>

    <div class="container">
        <h1>Strona Główna</h1>
    </div>
</body>

</html>