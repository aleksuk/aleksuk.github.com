/*	Надо привести страницу вида
	http://www.paddypower.it/scommesse-calcio

	К виду, как на картинке 

	Математика создания надписи:
	gioca €20 vinci €x
	где x - 20 * значение ставки

	Примеры:
	2.10 €20 vinci €42
	5.90 €20 vinci €118

	P.S. Предполагается что скрипт уже на странице.
	Данное поведение эмулировалось с помощью программы fiddler2, для проверки, нужно открыть 
	вкладку fidlerScript, и в ф-цию onBeforeResponse и добавить следующий код
	
	if (oSession.HostnameIs("www.paddypower.it") && oSession.oResponse.headers.ExistsAndContains("Content-Type", "text/html")) {
		oSession.utilDecodeResponse();
		oSession.utilReplaceInResponse('</head>','<script type="text/javascript" src="https://dl.dropboxusercontent.com/s/17oyxsjoucfr6iv/maxymiserTaskDekoration.js?token_hash=AAGkmFkcokVAUTma-3qx_GeyOpfc0Iw1-DO2rGX8zr51ZQ&dl=1"></script></head>');
	}
*/

(function ($) {
	"use strict";

	function decorate(original, before, after, context) {
		return function () {
			context = context || this;
			var res;
			if (typeof before === 'function') {
				before.apply(context, arguments);
			}
			res = original.apply(context, arguments);
			if (typeof after === 'function') {
				after.apply(context, arguments);
			}
			return res;
		};
	}

	function hideHeaderNumber() {
		var headerColumn = $(this).children();

		headerColumn.eq(3).children().hide();
		headerColumn.eq(4).children().hide();
		headerColumn.eq(5).children().hide();
	}

	function redesignTables() {
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

		$('<div> 1 </div></br><div> X </div></br><div> 2 </div>').appendTo(node.eq(0));
		node.eq(0).children()
			.css({
				'color': 'rgb(25, 124, 175)',
				'font-size': '9px',
				'text-align': 'right'
			});

		$('<div>gioca €20 vinci ' + Math.floor(valueTopButton * 20) + '</div></br><div>gioca €20 vinci ' + Math.floor(valueCenterButton * 20) + '</div></br><div>gioca €20 vinci ' + Math.floor(valueBottomButton * 20) + '</div>')
			.appendTo(node.eq(2))
			.css({
				'color': 'rgb(25, 124, 175)',
				'text-align': 'left',
			});

		node.eq(2).children()
			.addClass('time __updated')
			.css({
				'margin': '0px',
				'padding': '0px'
			});
	}

	function editColgroupWidth() {
		var columnNode = $(this).children();

		columnNode.eq(2).css('width', '30px');
		columnNode.eq(3).css('width', '10px');
		columnNode.eq(5).css('width', '100px');
	}

	function redesignPaddy(url, obj) {
		var contentColum = document.getElementById(obj.id),
			tableNodes = $(contentColum).find('table.footballcard tbody').children(),
			colgroupNodes = $(contentColum).find('table.footballcard colgroup'),
			tableHeaderNode = $(contentColum).find('table.footballcard thead tr');

		colgroupNodes.each(editColgroupWidth);
		tableNodes.each(redesignTables);
		tableHeaderNode.each(hideHeaderNumber);
	}

	function postAjaxRedesign() {
		var colgroupNodes = $('table.footballcard colgroup');
		var tableNodes = $('table.footballcard tbody');

		colgroupNodes.each(editColgroupWidth);
		tableNodes.each(function (index) {
			var $this = $(this);

			if ($this.find('tr td div.__updated').length === 0) {
				$this.children().each(redesignTables);
			}
		})
	};

	function ifNoAjaxRequest() {
		var contentNodes = $('.tabCnt'),
			tabsNodes = $('.tabs ul li');

		tabsNodes.each(function (index) {
			if ($(this).hasClass('active')) {
				contentNodes.eq(index).find('table.footballcard tbody').each(function () {
					$(this).children().each(redesignTables);
				})

				contentNodes.eq(index).find('table.footballcard colgroup').each(editColgroupWidth);
				contentNodes.eq(index).find('table.footballcard thead tr').each(hideHeaderNumber);
			}
		})

	}

	function contentReady() {
		if (typeof globalEval === 'undefined') {
			setTimeout(contentReady, 0);
		} else {
			_lb_fb_cpn_got_ajax_content = decorate(_lb_fb_cpn_got_ajax_content, false, postAjaxRedesign);
			globalEval = decorate(globalEval, false, ifNoAjaxRequest)
		}
	}
	contentReady();
})(jQuery);