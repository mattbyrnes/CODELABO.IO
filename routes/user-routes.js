const db = require('../models');
module.exports = function (app) {

	app.get('/api/users', function (req, res) {
		db.User.findAll({}).then(function (dbUsers) {
			res.json(dbUsers);
		});
	});

	app.post('/api/register', function (req, res) {
		console.log(req.body);

		const userData = {
			username: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf,
		}

		//using schema.create to insert data into the db
		db.User.create(userData, function (err, user) {
			if (err) {
				return res.json(err)
			} else {
				console.log(user)
				//return res.redirect('/profile');
			}
		});
	});

	app.post('/api/login', function (req, res) {

		const User = {
			username: req.body.username,
			password: req.body.password
		}

		db.User.findOne({ username: User.username, password: User.password }).then(function (user) {
			if (!user) {
				res.send({ success: false });
			} else {
				res.send({ success: true });
			}

		})
	})
};