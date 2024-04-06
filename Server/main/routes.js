var express = require('express')
var router = express.Router()
var pool = require("./db")


router.get('/api/1', (req, res, next) =>{
    console.log()
    pool.query(`SELECT * FROM users`, 
            (q_err, q_res) => {
                console.log(q_res)
                console.log(q_err)
                res.json(q_res.rows)
    })
})

router.get('/api/2', (req, res, next) =>{
    res.json("hello")
})

module.exports = router