const path = require('path');
////////
var express = require('express');
var passport = require('passport');
var User = require('../models/user.js');

module.exports = function(app){

    app.get('/editor', (req,res)=> {
        res.sendFile(path.join(__dirname + '/../public/editor.html'));
    })

    app.get('/editor/:id', function (req, res) {
        res.sendFile(path.join(__dirname, '/../public/editor.html'));
    })

    app.get('/edit', (req,res)=> {
        res.sendFile(path.join(__dirname + '/../public/edit.html'));
    })

    app.get('/edit/:id', function (req, res) {
        res.sendFile(path.join(__dirname, '/../public/edit.html'));
    })

    app.get('/register', (req,res)=> {
        res.sendFile(path.join(__dirname + '/../public/register.html'));
    })

    app.get('/login', (req,res)=> {
        res.sendFile(path.join(__dirname + '/../public/login.html'));
    })

      //Default to index.html
      app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

}