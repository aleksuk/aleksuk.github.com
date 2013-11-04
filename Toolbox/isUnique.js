//Проверка массива на уникальность элементов
function isUnique(arr) {
    return arr.filter(function(elem, index) {
        return arr.indexOf(elem) === index;
    }).length === arr.length;
}