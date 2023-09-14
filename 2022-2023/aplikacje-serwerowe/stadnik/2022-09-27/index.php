<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form</title>
</head>
<body>
    <form method="GET">
        Imię: <input name="name" type="text"><br>
        Nazwisko: <input name="surname" type="text"><br>
		PESEL: <input name="PESEL" type="text"><br>
		<input type="submit">
    </form>

    <?php
        $test = "testtesttest";
        echo strlen($test);
        echo strpos($test, "e");
        echo ord("s");

        // if (isset($_GET['name'], $_GET['surname'], $_GET['PESEL'])) {
        //     echo 'test';
        // }
    ?>	
</body>
</html>