var express = require('express');
var server = express();
var fs = require('fs');

// 
server.use(express.bodyParser());

// При заросе корня сайта отдаем содержимое файла index.html
server.use('/', express.static(__dirname));


// При запросе /form-action отдаем параметры внутри pre,
// с которыми был сделан запрос
server.all('/form-action', function (req, res) {
	var response = '<a href="/">Home</a>';

	response += '<pre>';
	response += 'POST parameters: \n';
	response += JSON.stringify(req.body);
	response += '\n\nGET parameters\n';
	response += JSON.stringify(req.query);
	response += '</pre>';

	res.set('Content-type', 'text/html');
	res.send(response);
})


// Сервер слушает запросы, приходящие на 8899 порт
server.listen();
