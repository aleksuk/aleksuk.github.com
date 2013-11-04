"use strict";
//возвращает элемент, для которого func выдаcт true
function closest (nodeName, func) {
	var parent = nodeName;

	while ( parent && !func(parent) ) {
		parent = parent.parentNode;
	}
	return parent;
}
