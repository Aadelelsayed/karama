const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const db = require('./helpers/db.js');

var Cryptr = require('cryptr');
var cryptr = new Cryptr('secretKey');
var luhn = require("luhn");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/form.html');
});

app.post('/storeCreditCard', function(req, res){
	var error = {
		messages: []
	};
	var data = req.body;

	if(data.cardNo == null) {
		error.messages.push("Credit card can't be empty")
	} else if(!luhn.validate(data.cardNo)){
		error.messages.push("Please use a valid card");
	}

	if(data.cardNo.length != 16){
		error.messages.push("Enter a valid credit card number");
	}


	if(data.cvv == null){
		error.messages.push("CVV can't be empty");
	}

	if(data.cvv.length != 3){
		error.messages.push("Enter a valid cvv");
	}

	if(data.holderName == null){
		error.messages.push("Holder name can't be empty");
	}

	if(error.messages.length > 0){
		res.status(400).json(JSON.stringify(error));
	}

	db.insert([cryptr.encrypt(data.cardNo), cryptr.encrypt(data.cvv), data.holderName], function(isSuccess){
		if(!isSuccess){
			error.messages.push("Something went wrong, please try again");
			res.status(500).json(JSON.stringify(error));
		}

		res.status(200).json({});
	});

});

app.listen(3000, function () {

});