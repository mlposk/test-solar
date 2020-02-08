<?php
include_once("class/Query.php");

if (isset($_POST['limit']) && isset($_POST['offset'])) {
    echo json_encode(array("rows" => Query::getRows($_POST['limit'], $_POST['offset'])), JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(array("total" => Query::getCount()[0]), JSON_UNESCAPED_UNICODE);
}