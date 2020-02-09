<?php
include_once("class/Query.php");

if (isset($_POST['tasks'])) {
    foreach ($_POST['tasks'] as $index => $name) {
        Query::insertTask(array_values($name));
    }
    echo json_encode(array("total" => Query::getCount()[0]), JSON_UNESCAPED_UNICODE);
}
