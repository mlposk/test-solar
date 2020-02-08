<?php
include_once("class/Query.php");


// косяк в том, что когда ajax построчно вносит записи, порядок сбивается.
// поэтому решил сразу в скрипте js передать одним массивом со всеми строками
// через post, но ничего не выходит.

if (isset($_POST['array'])) {
    echo json_decode($_POST['array'], JSON_UNESCAPED_UNICODE);
} else {
    echo 'none';
}