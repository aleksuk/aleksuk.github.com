// Кроссбраузерная функция для отмены действия по умолчанию
function preventDef(event) {
	if (event.preventDefault) {
		event.preventDefault();
	} else {
		event.returnValue = false;
	}
}