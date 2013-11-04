//Проверка, является ли массив подмножеством другого массива
function contains (original, toMatch) {
    for (var i = 0; i < toMatch.length; i += 1) {
        if (original.indexOf(toMatch[i]) === -1) {
            return false;
        }
    }
    return true;
}