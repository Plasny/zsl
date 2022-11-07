<?php
    // próba utworzenia połączenia
    $conn = @new mysqli('localhost','root', '', 'pracownicy');

    if($conn->connect_errno)
        echo "<h3 style='color:red;  '>Brak połączenia z bazą danych</h3>";
    else {
        echo "<h3 style='color:green;'>Jest połączenie z bazą danych</h3>";

        $conn->query('SET NAMES UTF8'); // ustawienie standardu tekstu
        $rs = $conn->query('SELECT imię as name,nazwisko as surname FROM pracownicy'); // pobieranie recordów imienia i nazwiska z bazy danych i utworzenie czegoś ala tablicy z nich

        /*
        $rec = $rs->fetch_assoc();  // pobiera pojedyńczy rekord z tych już pobranych
        echo $rec['name']." ".$rec['surname']."<br>";  // wyświetlenie danych z pobranego rekordu
        // */

        while ($rec = $rs->fetch_assoc()) {
            echo $rec['name']." ".$rec['surname']."<br>";
        }

        $rs->close();   // usunięcie pobranych rekordów
    }
?>
