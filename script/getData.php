<?php
include_once("class/Query.php");

echo json_encode(Query::getRows(),JSON_UNESCAPED_UNICODE);