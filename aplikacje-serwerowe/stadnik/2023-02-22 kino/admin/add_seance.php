<?php
function addRecord()
{
    $movie = $_POST['movie'];
    $time = $_POST['time'];
    $date = $_POST['date'];

    include "../db-settings.php";
    $stmt = $conn->prepare("INSERT INTO seances(movie_id, date, time) VALUES(?,?,?)");
    $stmt->bind_param("sss", $movie, $date, $time);
    $stmt->execute();

    echo "<script>alert('dodano seans')</script>";
}


if (isset($_POST['movie'], $_POST['date'], $_POST['time'])) {
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
                    <label for="movie">Wybierz film</label>
                    <select name="movie" required>
                        <?php
                            include "../db-settings.php";
                            $result = $conn->query("SELECT id, title FROM movies");
                            while ($row = $result->fetch_assoc()) {
                                echo "<option value='$row[id]'>$row[title]</option>";
                            }
                        ?>
                    </select>
                </div>
                <div>
                    <label for="date">Wybierz date seansu</label>
                    <input type="date" name="date" required>
                </div>
                <div>
                    <label for="time">Wybierz czas seansu</label>
                    <input type="time" name="time" required>
                </div>
                <input type="submit">
            </form>
        </main>
    </div>
</body>

</html>