'use strict';

const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'karma',
  password: 'foobar',
  port: 5432,
});

const command = "INSERT INTO creditCard (creditCardNumber, cvv, holderName) VALUES ($1, $2, $3)";

module.exports = {
	insert: function(info, cb){
		client.connect()
		client.query(command, info, (err, res) => {
			if(err) console.log(err);
			cb(err == null);
		});
	}
}