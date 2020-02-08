<?php
if (isset($_POST['array1']) && isset($_POST['array2'])) {
    write('../data/array-1.json',  $_POST['array1']);
    write('../data/array-2.json', $_POST['array2']);
}

function write($fileName, $data)
{
    $file = fopen($fileName, 'w') or die('Невозможно открыть файл: ' . $fileName);
    fwrite($file, json_encode($data));
    fclose($file);
}