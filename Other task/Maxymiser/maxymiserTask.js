/*	Надо привести страницу вида
	http://www.paddypower.it/scommesse-calcio

	К виду, как на картинке https://github.com/aleksuk/aleksuk.github.com/blob/master/Other%20task/Maxymiser/sample/pp.png

	Пока делаем только для открытой вкладки (содержимое вкладок подгружается динамически)

	Математика создания надписи:
	gioca €20 vinci €x
	где x - 20 * значение ставки

	Примеры:
	2.10 €20 vinci €42
	5.90 €20 vinci €118

	Запускать на странице http://www.paddypower.it/scommesse-calcio
*/

// Разметка меняется на всех прогруженых вкладках.
// Нажатие на кнопку "AGGIORNA QUOTE" ломает новую разметку на открытой вкладке:
// слетает размер столбиков таблиц на первоначальный, и добавленные классы
(function ($) {
	var tables = $('table.footballcard tbody'),
		colgroup = $('table.footballcard').find('colgroup'),
		header = $('table.footballcard thead').find('tr');

	// Удаление в заголовках таблиц "1", "x", "2"
	header.each(function () {
		trNodes = $(this).children();

		trNodes.eq(3).children().hide();
		trNodes.eq(4).children().hide();
		trNodes.eq(5).children().hide();
	})

	// Изменение ширины столбцов таблиц
	colgroup.each(function () {
		var colNodes = $(this).children();

		colNodes.eq(2).css('width', '30px');
		colNodes.eq(3).css('width', '10px');
		colNodes.eq(5).css('width', '100px');
	})

	tables.each(function () {

		$(this).children()
			.each(function () {
				var $this = $(this),
					node = $this.find('.fbhlt'),
					topButton = node.eq(0).find('div').eq(0),
					centerButton = node.eq(1).find('div').eq(0),
					bottomButton = node.eq(2).find('div').eq(0),
					valueTopButton = parseFloat(node.eq(0).find('.prc').get(0).innerHTML, 10),
					valueCenterButton = parseFloat(node.eq(1).find('.prc').get(0).innerHTML, 10),
					valueBottomButton = parseFloat(node.eq(2).find('.prc').get(0).innerHTML, 10);

				topButton.insertBefore(centerButton);
				bottomButton.insertAfter(centerButton);

				$('<div> 1 </div></br><div> X </div></br><div> 2 </div>').appendTo( node.eq(0) );
				node.eq(0).children()
					.css({
						'color' : 'rgb(25, 124, 175)',
						'font-size' : '9px',
						'text-align' : 'right'
					});

				$('<div>gioca €20 vinci ' + Math.floor(valueTopButton * 20)
					+ '</div></br><div>gioca €20 vinci ' + Math.floor(valueCenterButton * 20)
					+ '</div></br><div>gioca €20 vinci ' + Math.floor(valueBottomButton * 20)
					+ '</div>')
					.appendTo( node.eq(2) )
					.css({
						'color' : 'rgb(25, 124, 175)',
						'text-align' : 'left',
					});

				node.eq(2).addClass('time');
			})
	})
})(jQuery);