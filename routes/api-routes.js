const db = require('../models');
module.exports = function (app) {

    // READ all Projects
    app.get('/api/project', function (req, res) {
        db.Project.find({})
            .then(function (dbProject) {
                res.json(dbProject);
            })
            .catch(function (err) {
                res.json(err);
            });
    });


     // Get Selected Project
     app.get('/api/project/:Id', function (req, res) {
        console.log(req.body);
        db.Project.findOne({_id: req.params.Id})
            .then(function (dbProject) {
                res.json(dbProject);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // CREATE Project
    app.post('/api/project', function (req, res) {
        console.log(req.body);
        db.Project.create(req.body)
            .then(function (dbProject) {
                res.json(dbProject);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // UPDATE Project
    app.put('/api/project/:name', function (req, res) {
        db.Project.findOneAndUpdate({name: req.body.name})
            .then(function (dbProject) {
                res.json(dbProject);
            })
            .catch(function(err) {
                res.json(err);
            });
    });

       // DELETE Project
       app.delete('/api/project/:name', function (req, res) {
        db.Project.findOneAndRemove({name: req.body.name})
            .then(function (dbProject) {
                res.json(dbProject);
            })
            .catch(function(err) {
                res.json(err);
            });
    });


    // User Routes //

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