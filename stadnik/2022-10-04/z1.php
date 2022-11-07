<?php
    for($i=-20; $i<=20; $i++) {
        $values[$i] = 0; 
    }

    for($i=0; $i<30; $i++) {
        $value = rand(-20, 20);
        $values[$value] += 1;
        $table[$i] = $value;
        echo $table[$i]."<br>";
    }

    echo "<br><hr><br>";

    $count = 0;
    for($i=-20; $i<20; $i++) {
        // echo $values[$i]."<br>";
        if($values[$i]>1)
            $count++;
    }

    echo $count." liczb występuje więcej niż raz";

?>