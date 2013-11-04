// Кроссбраузерная функция для отмены всплытия события
function stopProp(event) {
	if (event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.cancelBubble = true;
	}
}