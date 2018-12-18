const path = require('path');
////////
var express = require('express');
var passport = require('passport');
var User = require('../models/user.js');

module.exports = function(app){

    app.get('/', (req, res)=>{
        res.sendFile(__dirname + '/../public/index.html');
    })

    app.get('/register', (req,res)=> {
        res.sendFile(path.join(__dirname + '/../public/register.html'));
    })

    app.get('/login', (req,res)=> {
        res.sendFile(path.join(__dirname + '/../public/login.html'));
    })

    app.get('/edit', (req,res)=> {
        res.sendFile(path.join(__dirname + '/../public/edit.html'));
    })

    app.get('/edit/:id', function (req, res) {
        res.sendFile(path.join(__dirname, '/../public/edit.html'));
    })

}