"use strict";
window.onerror = null;
(function (callback) {
	var result = [];

	function getInfo(node) {
		var linkNode = node.querySelector('.gtile-i-title a'),
			priceUAHString,
			priceUSDString,
			linkStr = linkNode.innerHTML.trim();
		if ( node.querySelector('.g-price-uah') && node.querySelector('.g-price-usd') ) {
			priceUAHString = node.querySelector('.g-price-uah').innerHTML;
			priceUSDString = node.querySelector('.g-price-usd').innerHTML;
		} else {
			priceUAHString = '';
			priceUSDString = '';
		}

		var reg = {
			findCapacity : /[\d]*(?=\s?GB)/i,
			findName : /\s?[\d]*(?=\s?GB)\s?GB/i,
			findCode : /\([\s\S]*\)/,
			findPriceUAH : /[\d]*/,
			findPriceUSD : /[\d]*$/
			},
			info = {};

		info.descriptionOfGoods = linkStr.replace(reg.findName, '').trim();
		info.url = linkNode.href;
		info.capacity = parseInt(linkStr.match(reg.findCapacity)[0], 10);
		info.priceUAH = parseInt(priceUAHString.match(reg.findPriceUAH)[0], 10);
		info.priceUSD = parseInt(priceUSDString.match(reg.findPriceUSD)[0], 10);

		return info;
	}

	function getMaxPage() {
		var pages = document.querySelectorAll('.goods-pages-list li');
		return parseInt(pages[pages.length - 1].id.match(/[\d]*$/)[0], 10);
	}

	function getArrLinks() {
		var link = document.querySelectorAll('.goods-pages-list li a'),
			href = link[link.length - 1].href.match(/[\s\S]*(?=page)/)[0],
			url = [],
			numbeOfPages = getMaxPage();

		for(var i = 1; i <= numbeOfPages; i += 1) {
			url.push(href + 'page=' + i + '/');
		}
		return url;
	}

	function addGoodsInfo(htmlText) {
		var reg = /<body>([\s\S]*)<\/body>/,
			tempDOM = document.createElement('html');		
		tempDOM.innerHTML = htmlText.match(reg)[0].trim();

		var products = tempDOM.querySelectorAll('div.gtile-i-wrap');

		for (var i = 0; i < products.length; i += 1) {
			result.push( getInfo(products[i]) );
		};
	}

	var pages = getArrLinks(),
		counter = 0;

	pages.forEach(function (page) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', page, true);

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					addGoodsInfo(xhr.responseText);
					counter += 1;

					if (counter === pages.length) {
						callback(result);
					}
				};
			};
		};
		xhr.send(null);
	});
})(getResult);

function getResult(res) {
	console.dir(res);
} 