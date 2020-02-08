function insertData() {
    $.getJSON('../data/array-1.json', array1 => {
        $.getJSON('../data/array-2.json', array2 => {
            let array = [];
            let balanceCond = parseInt(array2['4']);
            if (isNaN(balanceCond)) balanceCond = 0; //в массиве 2 может не оказаться элемента с ключом "4"
            $.each(array1, (key, value) => {
                let date = new Date();
                date.setFullYear(date.getFullYear() - 21);
                date.setDate(date.getDate() - key);
                array.push({
                    firstName: 'Василий' + key,
                    patronymic: 'Александрович' + value,
                    lastName: 'Пупкин' + (key + 6),
                    birthday: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
                    balance: parseInt(value) + balanceCond
                });
            });
            console.log(array);
            $.post('../script/insertData.php', { tasks: array });
        });
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
}

function writeJSON() {
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
    let arrays = {
        array1: array1,
        array2: array2,
    };
    $.post('../script/writeJSON.php', arrays);
}

function getPagesCount(limit = 8) {
    $.post('../script/getData.php').done(json => { console.log(JSON.parse(json).total);
        return limit ? Math.ceil(JSON.parse(json).total / limit) : Math.ceil(JSON.parse(json).total / 8);
    });
}

function renderData(limit = 8, currentPage = 1) {
    let json;
    $.post('../script/getData.php', {
        limit: limit, offset: (currentPage - 1) * limit
    }).done(jsonString => {
        json = JSON.parse(jsonString);
        $.each(json.rows, index => {
            $('#tasks').append('<tr></tr>');
            $.each(json.rows[index], key =>
                $('#tasks > tr').eq(index).append('<td>' + json.rows[index][key] + '</td>')
            );
        })
    })
}

function updateData(currentPage = 3) {
    let json;
    let limit = 8;
    !currentPage || currentPage <= 0 ? currentPage = 1 : null;
    $.post('../script/getData.php', {
        limit: limit, offset: (currentPage - 1) * limit
    }).done(jsonString => {
            json = JSON.parse(jsonString);
            $.each(json.rows, (row, item) =>
                $.each(Object.keys(item), (index, col) =>
                    $('#tasks > tr').eq(row).children('td:eq(' + index + ')').text(json.rows[row][col])
                )
            )
        }
    )
}

$(document).ready(() => {
    renderData();
    $('#insertData').click(() => insertData());
    $('#writeJSON').click(() => writeJSON());
    $('#updateData').click(() => updateData())
});
