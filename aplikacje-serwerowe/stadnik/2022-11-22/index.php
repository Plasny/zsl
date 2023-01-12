<?php
    // change without hesitiation
    $number = 10;
    $range = 50;

    $canvSize = 1000;
    // if you don't know what you're doing than better don't touch this
    $width = $canvSize * 0.9;
    $height = ($canvSize / ($number));
    $offSetLeft = 50;
    $offSetTop = $height * 0.1;
    $offSetBottom = $height - $offSetTop;
    $textSize = 5;
    $textOffSetTop = $offSetBottom / 2 + $textSize;
    $textOffSet = 10;

    $rysunek = imagecreate($canvSize, $canvSize)
        or die("Biblioteka graficzna nie została zainstalowana!");
    $kolorbialy = imagecolorallocate($rysunek, 255, 255, 255);
    $kolorczarny = imagecolorallocate($rysunek, 0, 0, 0);

    $multiplier = $width / $range;

    for ($i = 0; $i < $number; $i++) {
        // $liczby[$i] = rand() % $width;
        $liczby[$i] = rand() % ($range + 1);
    }

    header("Content-type: image/jpeg");

    imagefill($rysunek, 0, 0, $kolorbialy);

    for ($i = 0; $i < $number; $i++) {
        $kolorslupka = imagecolorallocate($rysunek, 255 - 25 * $i, 25 * $i, 25 * $i);

        imagefilledrectangle(
            $rysunek,
            $offSetLeft,
            $i * $height + $offSetTop,
            // $offSetLeft + $liczby[$i],
            $offSetLeft + $liczby[$i] * $multiplier,
            $i * $height + $offSetBottom,
            $kolorslupka
        );

        imagestring(
            $rysunek,
            $textSize,
            $textOffSet,
            $i * $height + $textOffSetTop,
            $i + 1,
            $kolorczarny
        );

        imagestring(
            $rysunek,
            $textSize,
            // $offSetLeft + $liczby[$i] + $textOffSet,
            $offSetLeft + $liczby[$i] * $multiplier + $textOffSet,
            $i * $height + $textOffSetTop,
            $liczby[$i],
            $kolorczarny
        );
    }
    imagejpeg($rysunek);
?>
