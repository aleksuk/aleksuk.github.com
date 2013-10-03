"use strict";
// Удаление банера 
$('.banner_300x500').remove();

// Удаление второго блока рекламы
$('#htmlblock_placeholder').remove();

// Удаление блока навигации
$('.block.fast_navigator').remove();

// Разделение "прямого эфира" на 2 блока
var posts = $('.block.live_broadcast'),
	qa = posts.clone().insertAfter('.block.live_broadcast');

posts.find('span.dotted')
	.eq(0)
	.removeClass('tab')
	.next()
	.remove();

posts.find('.qa_activity')
	.remove();

qa.find('span.dotted')
	.eq(1)
	.removeClass('tab')
	.prev()
	.remove();

qa.find('.qa_activity')
	.removeClass('hidden')
	.prev()
	.remove();

// Все блоки сделать collapsible

// Все блоки становятся изначально свернутыми 
$('.block').each(function () {
	$(this).children()
		.addClass('hidden')
		.css('display', 'none');
	$(this).children('.title')
		.css('display', 'block');
});

$('.block').each(function () {
	$(this).on('click', function () {
		var $this = $(this);

		if ($this.children().hasClass('hidden') ) {
			$this.children()
				.removeClass('hidden')
				.css('display', 'block');
		} else {
			$this.children()
				.addClass('hidden')
				.css('display', 'none');
			$this.children('.title')
				.css('display', 'block');
		}
	})
});

//Удаление рейтинга, описания, флагов.
function removeInfoAllInfopanel() {
	var $this = $(this);

	$this.find('.published').remove();
	$this.find('.content').remove();
	$this.find('.infopanel ').remove();
}

function addNumberOfComments() {
	var $this = $(this),
		title = $this.find('h1.title'),
		numberOfComments = parseInt($this.find('span.all').get(0).innerHTML, 10) || 0;

	title.text(title.text() + ' (' + numberOfComments + ' comments)');
}

function addPosts(data) {
	var receivedContent = ( $(data).find('.post') );

	receivedContent.each(getNumberOfComments);
	receivedContent.each(removeInfoAllInfopanel);
	$('.posts.shortcuts_items').append(receivedContent);
}

function sendRequest(requestedUrl, processingOfTheRequest) {
	var	request = {
			url: requestedUrl,
			dataType: 'text',
			success: processingOfTheRequest
		}

	$.ajax(request);
}

function getNumberOfPages() {
	var pagesHref = document.querySelectorAll('#nav-pages li a');
	return parseInt(pagesHref[pagesHref.length - 1].innerHTML, 10);
}

function getAllPages(numberOfPages) {
	var url;

	for (var i = 2; i <= numberOfPages; i += 1) {
		url = '/page' + i + '/';
		sendRequest(url, addPosts);
	}
}

$('.post').each(getNumberOfComments);
$('.post').each(removeInfoAllInfopanel);
getAllPages( getNumberOfPages() );