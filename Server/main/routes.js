var express = require('express')
var router = express.Router()
var pool = require("./db")


router.get('/get/post', (req, res, next) => {
    const post_id = req.query.post_id
    console.log(post_id)
    if(post_id >= 1){
      pool.query(`SELECT * FROM "posts"
        WHERE pid=$1`, [ post_id ],
        (q_err, q_res) => {
          console.log(q_err, q_res);
          res.json(q_res);
        }
      )
    }
    else{
      pool.query(`SELECT * FROM posts`,
        (q_err, q_res) => {
          console.log(q_err, q_res);
          res.json(q_res);
        }
      )
    }
})



module.exports = router