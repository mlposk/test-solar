let jsonTasks;
let totalRows;

function insertData(jsonString) {
    $.ajax({
        url: '../script/insertData.php',
        method: 'POST',
        data: {
            array: jsonString
        }
    });
}

//массив для переноса в базу
function mergeArrays() {
    $.getJSON('../data/array-1.json', array1 => {
        $.getJSON('../data/array-2.json', array2 => {
            let balanceCond = parseInt(array2['4']);
            if (isNaN(balanceCond)) balanceCond = 0; //ассоциативный массив (array-2.json) может не содержать ключа '4', поэтому присваивается значение 0, если ключ не определён
            $.each(array1, (key, value) => {
                let date = new Date();
                date.setFullYear(date.getFullYear() - 21);
                date.setDate(date.getDate() - key);
                insertData({
                    'firstName': 'Василий' + key,
                    'patronymic': 'Александрович' + value,
                    'lastName': 'Пупкин' + (key + 6),
                    'birthday': date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
                    'balance': parseInt(value) + balanceCond
                })
            });
        });
    });
}

//рандом по пределам
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

//генерация и запись в файлы рандомных массивов по условию задания
function generateJSON() {
    let array1 = [];
    let array2 = {};
    while (array1.length < 100) {
        let random = getRandomInt(0, 5685);
        $.inArray(random, array1) < 0 ? array1.push(random) : null;
    }
    $.each(array1, (key, value) => {
        if (((key % 2) !== 0) || ((key % 4) === 0)) {
            let newKey = (key - 23) * 2;
            (value >= 2450) && (value < 4031) ? array2[newKey] = value : null;
        }
    });
    writeJSON(array1, array2)
}

//функция обращения через ajax к обработчику записи файла
function writeJSON(a1, a2) {
    $.ajax({
        url: '../script/writeJSON.php',
        method: 'POST',
        data: {
            array1: a1,
            array2: a2
        }
    })
}

//функция обращения через ajax к обработчику получения данных из базы
function getAllRecords() {
    $.ajax({
        url: '../script/getData.php',
        method: 'POST',
        success: (response) => jsonTasks = JSON.parse(response)
    });
}

//получение количества странц с записями кратных лимиту
function getPagesCount(limit = 8) {
    return limit ? Math.ceil(totalRows / limit) : Math.ceil(totalRows / 8);
}

/*function renderRows(page) {
    getRecords(page);
    $.each(tableContent, (key, value) => {
        tableBody.append('<tr></tr>')
    })
}

function renderCells(){
    $.each($('#tasks tr'), (row) => {
        $.each(tableContent[row], (key, value) => {
            $('#tasks tr').eq(row).append('<td>'+ value +'</td>');
        })
    })
}

function renderTable(page) {
    renderRows(page);
    renderCells();
}

function updateCells(page){
    tableBody.empty();
    renderTable(page)
}*/

$(document).ready(() => {
    getAllRecords();
    mergeArrays();
    $('#addRecords').click(() => addRecords());
    $('#generateJSON').click(() => generateJSON())
});
