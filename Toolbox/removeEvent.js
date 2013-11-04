// Кроссбраузерная функция для удаления обработчиков
function removeEvent (node, eventName, handler) {
	if (node.removeEventListener) {
		node.removeEventListener(eventName, handler, false);
	} else if (node.detachEvent) {
		node.detachEvent('on' + eventName, handler);
	}
}