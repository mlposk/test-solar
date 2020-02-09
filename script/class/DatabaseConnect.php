<?php
include_once('Database.php');

class DatabaseConnect
{
    private static $connection;

    public static function getDatabase()
    {
        if (self::$connection == null) {
            $host = "localhost";
            $username = "change_me";
            $password = "change_me";
            $dbName = "change_me";
            self::$connection = new Database($host, $username, $password, $dbName);
        }
        return self::$connection;
    }
}