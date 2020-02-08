<?php
include_once('Task.php');
include_once('DatabaseConnect.php');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
class Query
{
    private static function getConnection()
    {
        return DatabaseConnect::getDatabase();
    }

    public static function createTaskTable() {
        $query = "
        create table if not exists task
        (
            id int auto_increment,
            firstName varchar(50) null,
            patronymic varchar(50) null,
            lastName varchar(50) null,
            birthday date null,
            balance int null,
            constraint task_pk
                primary key (id)
        )";
        return self::getConnection()->executeQuery($query, null);
    }

    public static function getRows()
    {
        $query = "select * from task";
        $connection = self::getConnection();
        $results = $connection->executeQuery($query, null);

        $resultsArray = array();

        for($i = 0; $i < $results->num_rows; $i++)
        {
            $row = $results->fetch_array();
            $task = self::convertRowToObject($row);

            $resultsArray[$i] = $task;
        }
        return $resultsArray;
    }

    public static function convertRowToObject($row){
        return new Task(
            $row["id"],
            $row["firstName"],
            $row["patronymic"],
            $row["lastName"],
            $row["birthday"],
            $row["balance"]
        );
    }

    public static function insertTask($task){
        $query = "insert into task(firstName, patronymic, lastName, birthday, balance) values ('?', '?', '?', '?', '?')";
        return self::getConnection()->executeQuery(
            $query, $task);
    }
}