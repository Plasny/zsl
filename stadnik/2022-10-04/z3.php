<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Zadanie 3</title>
</head>
<body>
    <br>
    <form>
        <label for="text">Wprowadź tekst:</label>
        <input type="text" name="text" value="tekst do zamiany">
        <input type="submit">
    </form>
    <p><i>Nie działa z polskimi znakami</i></p>

    <hr><br>

    <?php
        if (isset($_GET['text'])) {
            $text = $_GET['text'];
            // echo $text;

            $text_arr = explode(" ",$text);
            // echo count($text_arr);

            for($i=0; $i<count($text_arr); $i++) {
                if(strlen($text_arr[$i])%2 != 0) {
                    $text_arr[$i] = ucfirst(strrev(ucfirst(strrev($text_arr[$i]))));
                }
                echo $text_arr[$i].' ';
            }
        }
    ?>
    
</body>
</html>
