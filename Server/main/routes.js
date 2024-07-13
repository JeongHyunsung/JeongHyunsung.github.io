var express = require('express')
var router = express.Router()
var pool = require("./db")

var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/images/')); 
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // 파일명에 타임스탬프 추가
  }
});
var upload = multer({ storage: storage });


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
  const {title, content} = req.body
  pool.query('INSERT INTO "posts"("title", "content", "upload_date", "image_location", "is_blog") VALUES($1, $2, now()::timestamp, \'/images/sample_image.jpg\', \'\\000\');',
    [ title, content ], 
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(req.rows);
    }
  )
})

router.post('/post/editpost', (req, res, next)=>{
  const {title, content, pid} = req.body
  pool.query('UPDATE "posts" SET "title" = $1, "content" = $2, "upload_date" = now()::timestamp WHERE pid = $3;',
    [ title, content, pid ], 
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json(req.rows);
    }
  )
})

router.post('/post/image', upload.single('file'), (req, res, next)=>{
  const fileUrl = `/images/${req.file.filename}`;
  res.json({url: fileUrl})
})

router.delete('/delete/post/:pid', (req, res, next)=>{
  const pid = req.params.pid;
  pool.query('DELETE FROM "posts" WHERE pid = $1', 
    [pid],
    (q_err, q_res) => {
      if (q_err) return next(q_err);
      res.json({message: "Post deleted successfully"});
    }
  )
})
module.exports = router