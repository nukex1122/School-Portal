const express=require('express');
const router=express.Router();
var User=require('../models/user');

const passport=require('passport')

router.get('/',function (req,res) {
    res.render('index')
})