<?php


class Task
{
    public $accountID;
    public $firstName;
    public $patronymic;
    public $lastName;
    public $birthday;
    public $balance;

    public function __construct ($accountID, $firstName, $patronymic, $lastName, $birthday, $balance)
    {
        $this->accountID = $accountID;
        $this->firstName = $firstName;
        $this->patronymic = $patronymic;
        $this->lastName = $lastName;
        $this->birthday = $birthday;
        $this->balance = $balance;
    }
}