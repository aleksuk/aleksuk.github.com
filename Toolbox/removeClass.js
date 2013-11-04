function removeClass(elem, className) {
	var classList = elem.className.split(' ');
	for (var i = 0; i < classList.length; i += 1) {
		if (classList[i] === className) {
			classList.splice(i, 1);
			i -= 1;
		}
	}
	elem.className = classList.join(' ');
}