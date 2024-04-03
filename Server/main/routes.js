var express = require('express')
var router = express.Router()
var pool = require("./db")

router.get('/api/hello', (req, res, next) =>{
    res.json("HELLO")
})

module.exports = router