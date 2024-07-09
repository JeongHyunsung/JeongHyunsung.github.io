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

router.post('/post/posttodb', (req, res, next)=>{
  const post_title = req.query.title;
  const post_content = req.query.content;
  pool.query('INSERT INTO "posts"("title", "content", "upload_date", "image_location", "is_blog") VALUES($1, $2, now()::timestamp, \'/images/sample_image.jpg\', \'\\000\');',
    [ post_title, post_content ], 
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(q_res.rows);
    }
  )
})


module.exports = router