<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form</title>
</head>
<body>
    <form method="get" action="">
        <input name="text" type="text">
        <input type="submit">
    </form>

    <?php
        if ($_GET) {
            echo $_GET['text'];
        }
    ?>
	
	<br><hr><br>
	
	<?php
		echo "Przed sortowaniem: <br>";
		for($i=0;$i<10;$i++) {
			$tab[$i] = rand(0,100);
			echo $tab[$i].'<br>';
		}
		
		sort($tab);
		echo "Po sortowaniu: <br>";
		for ($i=0;$i<10;$i++)
			echo $tab[$i].'<br>';
	?>

	<br><hr><br>

    <?php
        function gwiazdki() {
            for($i=0;$i<10;$i++)
                echo '*';
            echo '<br>';
        }

        gwiazdki();
        echo 'test1<br>';
        gwiazdki();
        echo 'test2<br>';
        gwiazdki();
    ?>
			
</body>
</html>