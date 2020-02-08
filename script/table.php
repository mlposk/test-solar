<?php

$array1 = json_decode(JSON::read("array-1.json"), true);
$array2 = json_decode(JSON::read("array-2.json"), true);
foreach($array1 as $key => $value) {
    $array = array("Василий" . $key, "Александрович" . $value, "Пупкин" . strval($key + 6), date("Y-m-d", strtotime( "-21 years -". $key ." days")), $value + $array2["4"]);
    Query::insertTask($array);
} //слияние двух json и запись в базу

$limit = 8;
$currentPage = 1;

if (isset($_POST["page"]) && $_POST["page"] > 0) $currentPage = $_POST["page"];

$rowsCount = Query::getCount();
$pagesCount = ceil($rowsCount / $limit);

if ($_POST["page"] > $pagesCount) $currentPage = $pagesCount;
if ($_POST["page"] < 1) $currentPage = 1;

$offset = ($currentPage - 1) * $limit;
?>
<table class='responsive-table centered striped'>
    <thead>
    <tr>
        <th>
            #
        </th>
        <th>
            Фамилия
        </th>
        <th>
            Имя
        </th>
        <th>
            Отчество
        </th>
        <th>
            Дата рождения
        </th>
        <th>
            Баланс
        </th>
    </tr>
    </thead>
    <tbody>

    </tbody>
<?php
foreach(Query::getRows($offset, $limit) as $key => $value) {
?>

    <tr>
        <td><?=$value->accountID?></td>
        <td><?=$value->lastName?></td>
        <td><?=$value->firstName?></td>
        <td><?=$value->patronymic?></td>
        <td><?=$value->birthday?></td>
        <td><?=$value->balance?></td>
    </tr>
<?php
}
?>
</table>
<div class='card-content'>
    <ul class='pagination'>
        <?php
        if($currentPage != 1) echo "<li class='waves-effect'><a href='?page=1'><ion-icon name='skip-backward'></ion-icon></a></li>";
        if($currentPage - 2 > 0) echo "<li class='waves-effect'><a href='?page=" . strval($currentPage - 2) . "'>" . ($currentPage - 2) . "</a></li>";
        if($currentPage - 1 > 0) echo "<li class='waves-effect'><a href='?page=" . strval($currentPage - 1) . "'>" . ($currentPage - 1) . "</a></li>";
        echo "<li class='waves-effect active'><a href='?page=" . strval($currentPage) . "'>" . ($currentPage) . "</a></li>";
        if($currentPage + 1 < $pagesCount) echo "<li class='waves-effect'><a href='?page=" . strval($currentPage + 1) . "'>" . ($currentPage + 1) . "</a></li>";
        if($currentPage + 2 < $pagesCount) echo "<li class='waves-effect'><a href='?page=" . strval($currentPage + 2) . "'>" . ($currentPage + 2) . "</a></li>";
        if($currentPage != $pagesCount) echo "<li class='waves-effect'><a href='?page=".strval($pagesCount)."'><ion-icon name='skip-forward'></ion-icon></a></li>";
        ?>
    </ul>
</div>
