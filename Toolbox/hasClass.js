function hasClass(elem, className) {
	var classList = elem.className.split(' ');
	for (var i = classList.length - 1; i >= 0; i -= 1) {
		if (classList[i] === className) return true;
	}
	return false;
}