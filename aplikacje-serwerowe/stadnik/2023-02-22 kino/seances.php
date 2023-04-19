<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kino - Seansy</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/table.css">
</head>

<body>
    <ul class="navBar">
        <li><a href="movies.php">Seanse</a></li>
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
        <form method="POST" action="seats.php">
            <table>
                <tr>
                    <th>Tytuł seansu</th>
                    <th>Data</th>
                    <th>Godzina</th>
                    <th></th>
                </tr>
                <?php
                include 'db-settings.php';
                $result = $conn->query("SELECT s.id, m.title, date, time FROM seances s INNER JOIN movies m ON s.movie_id = m.id ORDER BY date, time asc");
                while ($row = $result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>$row[title]</td>";
                    echo "<td>$row[date]</td>";
                    echo "<td>$row[time]</td>";
                    echo "<td><button type='submit' name='seance' value='$row[id]-$row[title]'>Wybierz</button></td>";
                    echo "</tr>";
                }
                ?>
            </table>

        </form>
    </div>
</body>

</html>