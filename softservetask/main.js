(function () {
	"use strict";

	function wishesBoardManagement () {
		var errorMail = document.querySelector('.errorMail'),
			errorName = document.querySelector('.errorName'),
			errorWish = document.querySelector('.errorWish'),
			boardWishes = document.querySelector('.boardWishes'),
			button = document.querySelector('#add'),
			email = document.querySelector('#mail'),
			name = document.querySelector('#name'),
			wish = document.querySelector('#addWish'),
			entryFields = document.querySelector('.addData'),
			validationResult = {
				'name': false,
				'mail': false,
				'addWish': false
			},
			validation;

		validation = {
			'mail': function (value) { 
				var chekMailExpression = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;

				if (value.trim().length) {
					if ( chekMailExpression.test(value.trim()) ) {
						errorMail.innerHTML = '';
						errorMail.classList.add('notError');
						return true;
					} else {
						errorMail.innerHTML = 'Введенный e-mail не корректен!';
					}
				} else {
					errorMail.innerHTML = 'E-mail не может быть пустым!';
				}

				errorMail.classList.remove('notError');
				return false;
			},

			'name': function (value) {
				var chekNameExpression = /^[а-яА-ЯёЁa-zA-Z\s]+$/,
					value = value.trim(),
					MIN_NAME_LENGTH = 3;

				if (value.length >= MIN_NAME_LENGTH && chekNameExpression.test(value)) {
					errorName.innerHTML = '';
					errorName.classList.add('notError');
					return true;
				} else if (!value.length) {
					errorName.innerHTML = 'Введите ваше имя!';
				} else if (value.length < MIN_NAME_LENGTH) {
					errorName.innerHTML = 'Имя слишком короткое!';
				} else {
					errorName.innerHTML = 'Введенное имя некорректно!';
				}

				errorName.classList.remove('notError');
				return false;
			},

			'addWish': function (value) {
				if (value.trim().length) {
					errorWish.innerHTML = '';
					errorWish.classList.add('notError');
					return true;
				}
				errorWish.innerHTML = 'Введите пожелание!';
				errorWish.classList.remove('notError');
				return false;
			}
		};

		function closest (nodeName, func) {
			var parent = nodeName;

			while ( parent && !func(parent) ) {
				parent = parent.parentNode;
			}
			return parent;
		}

		function returnDefaultState () {
			mail.value = '';
			wish.value = '';
			name.value = '';

			for (var key in validationResult) {
				validationResult[key] = false;
			}
		}

		// в задании не указывалось где хранить введенные имя и пароль, решил засунуть их в атрибуты
		function addNewWish (name, mail, wish) {
			var wishNode = document.createElement('div');

			wishNode.className = 'wish';
			wishNode.innerHTML = '<div class = "remove">x</div> ' + wish.trim() + '</div>';
			
			//Отказался от dataset, так как не отрабатывали в ie10
			wishNode.setAttribute('data-mail', mail.trim());
			wishNode.setAttribute('data-name', name.trim());

			if (boardWishes.children.length) {
				boardWishes.insertBefore(wishNode, boardWishes.children[0]);
			} else {
				boardWishes.appendChild(wishNode);
			}
		}

		function lastChek () {
			var key;

			for (key in validationResult) {
				if (validationResult[key] !== true) {
					validation[key](document.querySelector('#' + key).value);
					return;
				}
			}

			addNewWish(name.value, mail.value, wish.value);
			returnDefaultState();
		}

		function validationEntryFields (event) {
			var target = event.target;
			validationResult[target.id] = validation[target.id](target.value);
		}

		function removeWish (event) {
			var target = event.target,
				removeElement;

			if (target.classList.contains('remove')) {
				removeElement = target.parentNode;
				removeElement.innerHTML = '';
				removeElement.parentNode.removeChild(removeElement);
			}
		}

		mail.addEventListener('change', validationEntryFields, false);
		name.addEventListener('change', validationEntryFields, false);
		wish.addEventListener('change', validationEntryFields, false);
		button.addEventListener('click', lastChek, false);
		boardWishes.addEventListener('click', removeWish, false);
	}

	window.addEventListener('load', wishesBoardManagement, false);
})();