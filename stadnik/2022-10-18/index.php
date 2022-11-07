<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>MYSQL - tabela</title>

    <style>
        table {
            border-collapse: collapse;
        }

        td,
        th {
            border: 2px solid black;
            padding: 5px;
        }

        input[value="delete"] {
            width: 100%;
        }

    </style>
</head>

<body>

    <form>
        <label for='name'>Podaj imię:</label>
        <input type='text' name='name'><br>
        <label for='surname'>Podaj nazwisko:</label>
        <input type='text' name='surname'><br>
        <label for='pension'>Podaj pensje:</label>
        <input type='number' name='pension'><br>
        <input type='submit' value='add' name='operation'>
    </form>

        <hr>

    <?php
        /// sprawdzenie czy jest połączenie do bazy danych
        $conn = @new mysqli('localhost','root', '', 'p');

        if($conn->connect_errno)
            echo "<h3 style='color:red;  '>Brak połączenia z bazą danych</h3>";
        else {
            echo "<h3 style='color:green;'>Jest połączenie z bazą danych</h3>";
            $conn->query('SET NAMES UTF8');


            /// jeśli jest to sprawdzamy czy mamy jakieś zapytanie
            if(isset($_GET['operation'])) {
                switch($_GET['operation']) {
                    case 'add':
                    $name = $_GET['name'];
                    $surname = $_GET['surname'];
                    $pension = $_GET['pension'];
                    $conn->query("INSERT INTO pracownicy_4ib(name, surname, pension)VALUES('$name','$surname','$pension')");
                    break;
                    case 'delete':
                        echo $_GET['id'];
                        break;
                }
            }

            /// wyciągamy dane z bazy danych
            $rs = $conn->query('SELECT id, name, surname, pension FROM pracownicy_4ib'); 

            /// tworzenie tabeli z rekordami bazy danych
            if($rs->num_rows>0) {
                echo '<table> <tr> <th>Imie</th><th>Nazwisko</th><th>Pensja</th><th>Usuń Rekord</th> </tr>';
                while ($rec = $rs->fetch_assoc()) {
                    echo "<tr> 
                        <td hidden> <input type='hidden' name='id' value='".$rec['id']."'></td>
                        <td>".$rec['name']."</td>
                        <td>".$rec['surname']."</td>
                        <td>".$rec['pension']."</td>
                        <td> <input type='submit' value='delete' name='operation'> </td></tr>";
                }
                echo '</table>';
            }

            $rs->close();
        }
    ?>


</body>
</html>
