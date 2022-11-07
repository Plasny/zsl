<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>2022-09-13</title>
</head>
<body>
    <h1>It works!</h1>
    <?php
        $n1 = 7;
        $n2 = 0;
        $operator = '/';
        $wynik;

        switch($operator) {
            case '-':
                $wynik = $n1 - $n2;
                break;
            case '+':
                $wynik = $n1 + $n2;
                break;
            case '/':
                if ($n2 == 0) {
                    $wynik = 'nie można dzielić przez 0';
                    break;
                }
                $wynik = $n1 / $n2;
                break;
            case '*':
                $wynik = $n1 * $n2;
                break;
        }

        echo $wynik;

        echo $wynik == 1? '<br>jest 1' : '<br>nie jest 1';
    ?>
</body>
</html>