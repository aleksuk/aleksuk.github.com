"use strict";

var next = (function () {
	var TEXT_NODE_TYPE = 3;
	var COMMENT_NODE_TYPE = 8;
 
	return function (node) {
		var nextSiblingNode = node;
 
		while (nextSiblingNode.nextSibling && (nextSiblingNode.nextSibling.nodeType === TEXT_NODE_TYPE || nextSiblingNode.nextSibling.nodeType === COMMENT_NODE_TYPE) ) {
			nextSiblingNode = nextSiblingNode.nextSibling;
		}
		return nextSiblingNode.nextSibling;
	}
}());

var prev = (function () {
	var TEXT_NODE_TYPE = 3;
	var COMMENT_NODE_TYPE = 8;
 
	return function (node) {
		var previousSiblingNode = node;
 
		while (previousSiblingNode.previousSibling && (previousSiblingNode.previousSibling.nodeType === TEXT_NODE_TYPE || previousSiblingNode.previousSibling.nodeType === COMMENT_NODE_TYPE) ) {
			previousSiblingNode = previousSiblingNode.previousSibling;
		}
		return previousSiblingNode.previousSibling;
	}
}());