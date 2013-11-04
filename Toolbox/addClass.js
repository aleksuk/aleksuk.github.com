function addClass(elem, className) {
	var classList = elem.className ? elem.className.split(' ') : [];
	for (var i = 0; i < classList.length; i += 1) {
		if (classList[i] === className) return;
	}
	classList.push(className);
	elem.className = classList.join(' ');
}