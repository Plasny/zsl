<?php
$movie = 'nie wybrano';
if (isset($_POST['seance'])) {
    $movie_arr = explode("-", $_POST['seance'], 2);
    $movie = $movie_arr[0];
    $movie_name = $movie_arr[1];
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo "Kino - seansy - $movie_name" ?></title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/seats.css">
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
        <?php
        if (!isset($_POST['seance'])) {
            $time = 5;
            echo "<p class='error'>Nie wybrano seansu za $time sekund nastąpi przekierowanie na stronę z ich listą.</p>";
            header("Refresh: $time; url=seances.php");
            exit;
        }
        ?>

        <h2>Wybierz miejsca</h2>

        <div>
            <div class="screen"></div>
            <form method="POST" action="./reserve.php">
                <?php
                include "db-settings.php";

                $rows = 15;
                $places_in_row = 20;
                $middle = $places_in_row / 2;

                $reserved;
                for ($i = 1; $i <= $rows; $i++) {
                    for ($j = 1; $j <= $places_in_row; $j++) {
                        $reserved[$i][$j] = false;
                    }
                }

                $stmt = $conn->prepare("SELECT row, seat FROM reservations WHERE seance_id=?");
                $stmt->bind_param("i", $movie);
                $stmt->execute();
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc()) {
                    $reserved[$row["row"]][$row["seat"]] = true;
                }

                for ($i = 1; $i <= $rows; $i++) {
                    echo "<div class='row'><p class='rowNr'>$i</p>";
                    for ($j = 1; $j <= $places_in_row; $j++) {
                        // get records for given movie and check if there is one with a given id to make it gray
                        if ($reserved[$i][$j] == true) {
                            $type = "taken";
                            echo "<div style='display: inline-block;'>
                            <input type='checkbox' name='seats[]' id='$i-$j' value='$i-$j' disabled>
                            <label class='$type' for='$i-$j'>$j</label>
                            </div>";
                        } else {
                            $type = "available";
                            echo "<div style='display: inline-block;'>
                            <input type='checkbox' name='seats[]' id='$i-$j' value='$i-$j'>
                            <label class='$type' for='$i-$j'>$j</label>
                            </div>";
                        }

                        if ($j == round($middle)) {
                            echo '<div class="corridor"></div>';
                        }
                    }
                    echo "<p class='rowNr'>$i</p></div>";
                }

                echo "<input type='hidden' name='seance' value='$movie'>";
                if (isset($_SESSION['user'])) {
                    echo "<input type='hidden' name='user' value='$_SESSION[user]'>";
                    echo "<input type='submit'>";
                } else {
                    echo "<p class='info'>Musisz być zalogowany, aby mieć możliwość zarezerwowania miejsca.</p>";
                }
                ?>
            </form>
        </div>
    </div>
</body>

</html>