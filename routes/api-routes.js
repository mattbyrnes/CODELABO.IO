// Require all models
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
};