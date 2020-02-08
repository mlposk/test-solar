<?php


class Database
{
    protected $host;
    protected $userName;
    protected $password;
    protected $dbName;
    protected $connection = null;

    public function __construct($host, $userName, $password, $dbName)
    {
        $this->host = $host;
        $this->userName = $userName;
        $this->password = $password;
        $this->dbName = $dbName;
    }

    public function __destruct()
    {
        if($this->connection != null) {
            $this->closeConnection();
        }
    }
    protected function makeConnection()
    {
        $this->connection = new mysqli
        (
            $this->host,
            $this->userName,
            $this->password,
            $this->dbName
        );

        $this->connection->set_charset("utf8");

        if($this->connection->connect_error) {
            echo "Fail. Info: " . $this->connection->connect_error;
        }
    }

    protected function closeConnection()
    {
        if ($this->connection != null) {
            $this->connection->close();
            $this->connection = null;
        }
    }

    public function executeQuery($query, $params)
    {
        $this->makeConnection();
        if($params != null){
            $queryParts = preg_split("/\?/", $query);

            if(count($queryParts) != count($params) + 1) {
                return false;
            }

            $finalQuery = $queryParts[0];
            for($i = 0; $i < count($params); $i++) {
                $finalQuery = $finalQuery . $this->cleanParams($params[$i]) . $queryParts[$i + 1];
            }
            $query = $finalQuery;
        }
        return $this->connection->query($query);
    }

    protected function cleanParams($params)
    {
        return $this->connection->real_escape_string($params);
    }
}