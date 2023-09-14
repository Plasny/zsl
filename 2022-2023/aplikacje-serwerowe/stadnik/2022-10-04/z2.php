<?php
    define("SIZE", 10);
    
    echo "<table style='border:1px solid black; text-align:center; border-collapse:collapse;'>";
    for($i=1; $i<=SIZE; $i++){
        echo "<tr>";
        for($j=1; $j<=SIZE; $j++){
            if($i==1 || $j==1)
                echo "<th style='border:1px solid black; padding:5px;'>".($i*$j)."</th>";
            else
                echo "<td style='border:1px solid black; padding:5px;'>".($i*$j)."</td>";
        }
        echo "</tr>";
    }
    echo "</table>";
?>