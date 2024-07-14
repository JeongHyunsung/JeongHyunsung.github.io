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

router.get('/get/tag', async (req, res, next) => {
  const tag_id = req.query.tid

  try{
    let q_res;
    if(tag_id >= 1){
      const result = await pool.query('SELECT * FROM tags WHERE tid = $1', [tag_id]);
      q_res = result;
    }
    else{
      const result = await pool.query('SELECT * FROM tags');
      q_res = result
    }
    res.json(q_res);
  }
  catch(error){
    res.status(500).json({error: 'Server error'})
  }

})

router.get('/get/tagsinpost', async (req, res, next)=>{
  const post_id = req.query.post_id
  try{
    const {rows} = await pool.query('SELECT tid FROM post_tag WHERE pid = $1', [post_id])
    res.json(rows)
  }
  catch(error){
    console.log(error)
  }
})

router.post('/post/addpost', async (req, res, next)=>{
  const {title, content, imgurl} = req.body
  try{
    const {rows} = await pool.query('INSERT INTO "posts"("title", "content", "upload_date", "image_location", "is_blog") VALUES($1, $2, now()::timestamp, $3, \'\\000\') RETURNING pid;', [ title, content, imgurl ])
    const pid = rows[0].pid;
    res.status(201).json({message: "Successfully added", pid})}
  catch(error){
    res.status(500).json({error: error})
  }
})

router.post('/post/editpost', (req, res, next)=>{
  const {title, content, imgurl, pid} = req.body
  pool.query('UPDATE "posts" SET "title" = $1, "content" = $2, "image_location" = $3 WHERE pid = $4;',
    [ title, content, imgurl, pid ], 
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

router.post('/post/tag', async (req, res, next)=>{
  const tagname = req.body.tagname;
  try{
    const { rows } = await pool.query('SELECT * FROM tags WHERE tag_name = $1;', [tagname]);
    if(rows.length === 0){
      result = await pool.query('INSERT INTO tags(tag_name) VALUES($1) RETURNING tid;', [tagname]);
      const tid = result.rows[0].tid;
      return res.status(201).json({message: 'Successfully Added', tid})
    }
    else{
      const tid = rows[0].tid;
      return res.status(200).json({message: 'Aleady Exists', tid});
    }
    
  }
  catch(error){
    return res.status(500).json({error: "Error"});
  }
})

router.post('/post/posttagrel', async (req, res, next)=>{
  const {pid, tid} = req.body;
  try{
    await pool.query('INSERT INTO post_tag(pid, tid) VALUES($1, $2)', [pid, tid])
    return res.status(200).json({nessage: "Success"})
  }
  catch(error){
    return res.status(500).json({error: error})
  }
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

router.delete('/delete/resettagsinpost/:pid', async (req, res, next)=>{
  const pid = req.params.pid;
  try{
    await pool.query('DELETE FROM "post_tag" WHERE pid = $1', [pid])
    res.status(200).json({ message: `Deleted tags for post with pid ${pid}`});
  }
  catch(error){
    res.status(500).json({error: "Server Error"})
  }
})
module.exports = router