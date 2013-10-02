"use strict";
// Удаление банера 
$('.banner_300x500').remove();

// Удаление второго блока рекламы, в задании этого небыло, но та как он имеет другую структуру,
// код, который делает все блоки collapsible, срабатывает и на нем, но не корректно.
// P.S. если в браузере стоит AdBlock, он убирается как и банер
$('#htmlblock_placeholder').remove();

// Удаление блока навигации
$('.block').each(function () {
	if ( $(this).hasClass('fast_navigator') ) {
		$(this).remove();
	}
});

// Разделение "прямого эфира" на 2 блока
var posts = $('.block.live_broadcast'),
	qa = posts.clone().insertAfter('.block.live_broadcast');

posts.children('.title')
	.get(0).innerHTML += ' - '
	+ posts.children('.title')
	.children('sup')
	.children('span')
	.get(0).innerHTML;

qa.children('.title')
	.get(0).innerHTML += ' - '
	+ posts.children('.title')
	.children('sup')
	.children('span')
	.get(1).innerHTML;

posts.children('.title')
	.children('sup')
	.children('span')
	.remove();

qa.children('.title')
	.children('sup')
	.children('span')
	.remove();

posts.children('div')
	.get(2)
	.remove();

qa.children('div')
	.eq(2)
	.removeClass('hidden');

qa.children('div')
	.get(1)
	.remove();

// Все блоки сделать collapsible

// Все блоки становятся изначально свернутыми 
$('.block').each(function () {
	$(this).children().each(function (index) {
		if ( !$(this).hasClass('title') ) {
			this.style.display = 'none';
		}
	})
});

$('.block').each(function () {
	$(this).on('click', function () {
		$(this).children()
		.each(function (index) {
			if ( (! $(this).hasClass('title') ) && this.style.display !== 'block'  ) {
				this.style.display = 'block';
			} else if ( (!($(this).hasClass('title') ) ) && this.style.display === 'block' ) {
				this.style.display = 'none';
			}
		})
	})
});