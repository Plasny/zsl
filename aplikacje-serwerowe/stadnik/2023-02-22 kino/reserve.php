<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kino - rezerwacja</title>
</head>

<body>
    <div class="container">
        <?php
        include "db-settings.php";

        if (empty($_POST['user']) || empty($_POST['seats']) || empty($_POST['seance'])) {
            echo 'Nie wybrałeś miejsc lub wystąpił inny problem';
            exit;
        }

        $user_id = $_POST['user'];
        $movie_id = $_POST['seance'];

        foreach ($_POST['seats'] as $row_seat) {
            $row_seat = explode("-", $row_seat, 2);
            $row = $row_seat[0];
            $seat = $row_seat[1];

            $stmt = $conn->prepare("INSERT INTO reservations (user_id, seance_id, row, seat) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("iiii", $user_id, $movie_id, $row, $seat);
            $stmt->execute();
        }

        echo "<p>Twoje miejsca zostały zarezerwowane. Zostaniesz przekierowany na stronę główną za 5 sekund.</p>";
        header("Refresh: 5; url=index.php");
        ?>
    </div>
</body>

</html>