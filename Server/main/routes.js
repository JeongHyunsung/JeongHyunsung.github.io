var express = require('express')
var router = express.Router()

router.get('/api/hello', (req, res) =>{
    res.json('hello world')
    console.log(req.originalUrl)
    console.log(req.baseUrl)
    console.log(req.path)
})

module.exports = router