// Проверка на массив
function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}
// Проверка на объект
function isObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
}