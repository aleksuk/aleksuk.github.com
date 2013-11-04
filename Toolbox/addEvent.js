// Кроссбраузерная функция для навешивания обработчиков
function addEvent (node, eventName, handler) {
	if (node.addEventListener) {
		node.addEventListener(eventName, handler, false);
	} else if (node.attachEvent) {
		node.attachEvent('on' + eventName, handler);
	}
}