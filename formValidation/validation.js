"use strict";

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

function preventDef(event) {
	if (event.preventDefault) {
		event.preventDefault();
	} else {
		event.returnValue = false;
	}
}

function contains(original, toMatch) {
	for (var i = 0; i < toMatch.length; i += 1) {
		if (original.indexOf(toMatch[i]) === -1) {
			return false;
		}
	}
	return true;
}

function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

function hasClass(node, className) {
	var elemClass = node.className.split(' ');

	if (isArray(className)) {
		return contains(elemClass, className);
	} else {
		for (var i = 0; i < elemClass.length; i += 1) {
			if (elemClass[i] === className) {
				return true;
			}
		}
	}
	return false;
}

function addClass(node, className) {

	if (!hasClass(node, className)) {
		(node.className) ? (node.className += ' ' + className) : (node.className = className);
	}
}

function removeClass(node, className) {
	var elemClass = node.className.split(' '),
		newClass;

	if (isArray(className)) {
		newClass = elemClass.filter(function (value) {
			return className.indexOf(value) === -1;
		});
	} else {
		newClass = elemClass.filter(function (value) {
			return value !== className;
		});
	}
	node.className = newClass.join(' ');
}

function addEvent(node, eventName, handler) {
	if (node.addEventListener) {
		node.addEventListener(eventName, handler, false);
	} else if (node.attachEvent) {
		node.attachEvent('on' + eventName, handler);
	}
}

function removeEvent(node, eventName, handler) {
	if (node.removeEventListener) {
		node.removeEventListener(eventName, handler, false);
	} else if (node.detachEvent) {
		node.detachEvent('on' + eventName, handler);
	}
}

function documentLoad() {

	var mailBase = ['first@mail.ru', 'second@yahoo.com', 'third@ukr.net', 'fourth@gmail.com', 'fifth@gmail.com'];

	var form = document.querySelector('form'),
		mail = form.querySelector('input[name="mail"]'),
		password = form.querySelectorAll('input[type="password"]'),
		error = form.querySelectorAll('span.error'),
		passwordStrength = form.querySelector('div.passwordStrength'),
		formElements = [mail, password[0], password[1]];

	function chekPassword() {
		//Полагаю, будь это где-то на работе, мне бы уже оторвали руки...
		if (this.value.length < 4) {
			error[1].innerHTML = 'Пароль должен быть не менее 4 символов!';
			addClass(error[1], 'has-error');
		} else {
			removeClass(error[1], 'has-error');
		}

		if (password[1].value.length !== 0 && password[1].value !== this.value) {
			error[2].innerHTML = 'Пароли не совпадают!';
			addClass(error[2], 'has-error');
		} else if (password[1].value.length !== 0 && password[1].value === this.value) {
			removeTheError(password[1]);
			removeClass(error[2], 'has-error');
		}
		if (!this.value.length) {
			removeTheError(this);
		}

		if (this.value.length === 0) {
			passwordStrength.style.background = '';
			passwordStrength.style.width = '';
		} else if (this.value.length <= 4) {
			passwordStrength.style.background = 'red';
			passwordStrength.style.width = '40px';
		} else if (this.value.length > 4 && this.value.length <= 7) {
			passwordStrength.style.background = 'orange';
			passwordStrength.style.width = '80px';
		} else if (this.value.length > 7 && this.value.length <= 10) {
			passwordStrength.style.background = 'yellow';
			passwordStrength.style.width = '120px';
		} else if (this.value.length > 10 && this.value.length <= 13) {
			passwordStrength.style.background = '#98FB98';
			passwordStrength.style.width = '160px';
		} else {
			passwordStrength.style.background = 'green';
			passwordStrength.style.width = '200px';
		}
	}

	function chekThePasswordCheck() {
		if (this.value !== password[0].value) {
			error[2].innerHTML = 'Пароли не совпадают!'
			addClass(error[2], 'has-error');
		} else {
			removeClass(error[2], 'has-error');
		}

		if (!this.value.length) {
			removeTheError(this);
		}
	}

	function chekMail() {
		var input = this.value.trim(),
			mailServerName = input.slice(input.indexOf('@') + 1),
			errorStr,
			errorList = ['/', '\\', ',', ';', ':', '*', '!', '^', '%', '?', '#', '$', '=', ')', '(', '!', '+', '~', '\'', '\"', ' ', '}', '{', '[', ']'];

		if (input.indexOf('@') !== -1 && mailServerName.indexOf('@') === -1 && input.length !== mailServerName.length && (input.indexOf('@') + 1) !== input.length) {
			for (var i = 0; i < errorList.length; i += 1) {
				if (input.indexOf(errorList[i]) !== -1) {
					errorStr = 'Введенный e-mail некорректен! Символ \" ' + errorList[i] + ' \" нельзя использовать!';
					error[0].innerHTML = errorStr;
					addClass(error[0], 'has-error');
					return;
				}
			}
		} else {
			error[0].innerHTML = 'Введенный e-mail некорректен!';
			addClass(error[0], 'has-error');
		}

		if (!input.length) {
			removeTheError(this);
		}

		for (var i = 0; i < mailBase.length; i += 1) {
			if (input === mailBase[i]) {
				error[0].innerHTML = 'Введенный вами e-mail уже занят!';
				addClass(error[0], 'has-error');
				return;
			}
		}
		removeClass(error[0], 'has-error');
	}

	function validation() {
		switch (this) {
		case mail:
			chekMail.call(this);
			break;
		case password[0]:
			chekPassword.call(this);
			break;
		case password[1]:
			chekThePasswordCheck.call(this);
		}
	}

	function removeTheError(elem) {
		for (var i = 0; i < formElements.length; i += 1) {
			if (formElements[i] === elem) {
				error[i].innerHTML = '';
			}
		}
	}

	function chekForm() {
		var timer;

		function startValidation(event) {
			var self = this,
				validationTimeout;

			removeTheError(this);

			if (hasClass(this, 'pass')) {
				validationTimeout = 0;
			} else {
				validationTimeout = 800;
			}

			timer = setTimeout(function () {
				validation.call(self);
			}, validationTimeout);
		}

		addEvent(this, 'keyup', startValidation);
		addEvent(this, 'blur', function () {
			removeEvent(this, 'keyup', startValidation);
		});
	}

	function submitForm(event) {
		event = event || window.event;

		for (var i = 0; i < error.length; i += 1) {
			if (hasClass(error[i], 'has-error')) {
				preventDef(event);
				break;
			}
		}
	}

	addEvent(mail, 'focus', chekForm);
	addEvent(form, 'submit', submitForm);
	addEvent(password[0], 'focus', chekForm);
	addEvent(password[1], 'focus', chekForm);
}

addEvent(window, 'load', documentLoad);