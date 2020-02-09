let currentPage = 1;
let limit = 8;
let rowsCount;
let pagesCount;

function post(url, data, doneCallback) {
    $.post(url, data).done(doneCallback).then(
        null,
        err => alert(`Ошибка: ${url} ${err.statusText}`)
    )
}

function createTable() {
    post('../script/createTable.php');
}

function insertData() {
    let arrayURL = ['json/array-1.json', 'json/array-2.json'];
    $.getJSON(arrayURL[0], array1 => {
        $.getJSON(arrayURL[1], array2 => {
            let array = [];
            let balanceCond = parseInt(array2['4']);
            if (isNaN(balanceCond)) balanceCond = 0; //в массиве 2 может не оказаться элемента с ключом "4"
            $.each(array1, (key, value) => {
                let date = new Date();
                date.setFullYear(date.getFullYear() - 21);
                date.setDate(date.getDate() - key);
                array.push({
                    firstName: `Василий${key}`,
                    patronymic: `Александрович${value}`,
                    lastName: `Пупкин${(key + 6)}`,
                    birthday: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                    balance: parseInt(value) + balanceCond
                });
            });
            post(
                '../script/insertData.php',
                { tasks: array },
                json => {
                    rowsCount = JSON.parse(json).total
                    pagesCount = Math.ceil( rowsCount/ 8);

                    updateData(currentPage);
                }
            );
        }).then(
            null,
            err => alert(`Ошибка: ${arrayURL[1]} ${err.statusText}`)
        );
    }).then(
        null,
        err => alert(`Ошибка: ${arrayURL[0]} ${err.statusText}`)
    );
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
    post('../script/writeJSON.php', arrays);
}

function init() {
    let json;
    let postData = {limit: limit, offset: 0};
    post('../script/getData.php', postData,
        jsonString => {
            json = JSON.parse(jsonString);
            $.each(json.rows, index => {
                $('#tasks').append('<tr></tr>');
                $.each(json.rows[index], key =>
                    $('#tasks tr').eq(index)
                        .append(`<td>${json.rows[index][key]}</td>`)
                )
            });


            $('.pagination').append(
                '<li class="waves-effect disabled"><a onclick=""><ion-icon name="chevron-back-outline"></ion-icon></a></li>' +
                '<li class="waves-effect"><a onclick="updateData(1)"><ion-icon name="play-skip-back-outline"></ion-icon></a></li>' +
                `<li class='waves-effect'><a onclick='updateData(${pagesCount})'><ion-icon name='play-skip-forward-outline'></ion-icon></a></li>` +
                `<li class='waves-effect'><a onclick="updateData(${currentPage + 1})"><ion-icon name='chevron-forward-outline'></ion-icon></a></li>`
            )
    });
    updateData(1);
}

function updateData(page) {
    let json;
    let offset = (page - 1) * limit;
    let postData = { limit: limit, offset: offset };
    !page || page <= 0 ? page = 1 : null;
    post('../script/getData.php', postData,
        jsonString => {
        json = JSON.parse(jsonString);
        $.each(json.rows, (row, item) =>
            $.each(Object.keys(item),
                (index, col) =>
                    $('#tasks > tr').eq(row).children(`td:eq(${index})`).text(json.rows[row][col]))
        );

        rowsCount = json.total;
        pagesCount = Math.ceil(rowsCount / limit);

        pagesCount > 1 ? $('.bottom-panel').show() : $('.bottom-panel').hide();

            $('.pagination li:eq(2) a').attr('onclick', `updateData(${pagesCount})`);

        if (page === 1) {
            $('.pagination li:first-child').addClass('disabled');
            $('.pagination li:first-child a').attr('onclick', '');
        } else {
            $('.pagination li:first-child').removeClass('disabled');
            $('.pagination li:first-child a').attr('onclick', `updateData(${page - 1})`);
        }

        if (page === pagesCount) {
            let remain = rowsCount % limit;
            if (remain !== 0) {
                for (remain; remain <= limit; remain++) {
                    $('#tasks > tr').eq(remain).children('td').empty();
                }
            }
            $('.pagination li:last-child').addClass('disabled');
            $('.pagination li:last-child a').attr('onclick', '');
        } else {
            $('.pagination li:last-child').removeClass('disabled');
            $('.pagination li:last-child a').attr('onclick', `updateData(${page + 1})`);
        }

        currentPage = page;
        $('.rows').text(`Всего записей: ${rowsCount}`);
        $('.pages').text(`Страница ${currentPage} из ${pagesCount}`);
    });
}

$(() => {
    init();
});
