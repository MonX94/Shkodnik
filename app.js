var express = require('express')
var app = express();

app.use('/', express.static(__dirname));

app.get('/', function(req, res, next) {
	res.sendFile('./index.html')
})

app.get('/boys', function(req, res, next) {
	res.sendFile(__dirname + '/boys_goods.html')
})

app.get('/girls', function(req, res, next) {
	res.sendFile(__dirname + '/girls_goods.html')
})
app.get('/easteregggg', function(req, res, next) {
	res.sendFile(__dirname + '/easter.html')
})
app.get('/cart', function(req, res, next) {
	res.sendFile(__dirname + '/cart.html')
})
app.get('*', function(req, res, next) {
	res.sendFile(__dirname + '/404.html')
})
app.listen(80, function() {
	console.log('http://localhost')
})