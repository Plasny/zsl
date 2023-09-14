<?php
function addRecord()
{
    $title = $_POST['title'];
    $description = "";
    if (isset($_POST['description'])) {
        $description = $_POST['description'];
    }

    include "../db-settings.php";
    $stmt = $conn->prepare("INSERT INTO movies(title, description) VALUES(?,?)");
    $stmt->bind_param("ss", $title, $description);
    $stmt->execute();

    echo "<script>alert('dodano film')</script>";
}

if (isset($_POST['title'])) {
    addRecord();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administratora - dodanie filmu</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/admin.css">
</head>

<body>
    <ul class="navBar">
        <li><a href="index.php">Panel administratora</a></li>
        <li><a href="../seances.php">Seanse</a></li>
    </ul>
    <div class="container">
        <div class="sidebar">
            <a href="./add_movie.php">Dodaj film</a>
            <a href="./add_seance.php">Dodaj seans</a>
        </div>
        <main>
            <form method="POST">
                <div>
                    <label for="title">Podaj nazwe filmu</label>
                    <input type="text" id="title" name="title" required>
                </div>
                <div>
                    <label for="title">Dodaj jego opis</label>
                    <input type="text" id="description" name="description">
                </div>
                <input type="submit">
            </form>
        </main>
    </div>
</body>

</html>