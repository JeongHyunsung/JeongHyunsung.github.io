require('dotenv').config();
const express = require('express')
const router = express.Router()
const pool = require("../db")
const checkAuthority = require('./utils/checkAuthority')

const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../public/images/')); 
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // 파일명에 타임스탬프 추가
  }
});
var upload = multer({ storage: storage });


router.get('/get/post', async (req, res, next) => {
  const post_id = req.query.post_id
  try{
    let q_res;
    if(post_id >= 1){
      const result = await pool.query(`SELECT * FROM "posts" WHERE pid=$1`, [ post_id ])
      q_res = result
    }
    else{
      const result = await pool.query(`SELECT * FROM posts`)
      q_res = result
    }
    return res.json(q_res)
  }
  catch(error){
    return res.status(500).json({error: 'Server error when get post from db', error})
  }
})

router.get('/get/briefpost', async (req, res, next) => {
  const post_id = req.query.post_id
  try{
    let q_res;
    if(post_id >= 1){
      const result = await pool.query(`SELECT title, image_location FROM "posts" WHERE pid=$1`, [ post_id ])
      q_res = result
    }
    else{
      const result = await pool.query(`SELECT title, image_location FROM posts`)
      q_res = result
    }
    return res.json(q_res)
  }
  catch(error){
    return res.status(500).json({error: 'Server error when get post(brief) from db', error})
  }
})

router.get('/get/searchresult', async (req, res, next)=>{
  const search = req.query.search;
  const sort = req.query.sort;
  const queryParams = [];
  let query = 'SELECT pid FROM posts' 
  if(search){
    const conditions = [];
    if(search.startdate && search.enddate){
      conditions.push(`upload_date >= TO_TIMESTAMP($${queryParams.length + 1}, 'YYYY-MM-DD') AND upload_date <= TO_TIMESTAMP($${queryParams.length + 2}, 'YYYY-MM-DD HH:MI:SS PM')`);
      queryParams.push(search.startdate, search.enddate + ' 11:59:59 PM')
    }
    if(search.title){
      conditions.push(`title ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${search.title}%`);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
  }
  if(sort && sort.field && sort.order){
    query += ` ORDER BY ${sort.field} ${sort.order.toUpperCase()}`
  }
  else{
    query += ' ORDER BY pid'
  }
  try{
    console.log(query, queryParams)
    const {rows} = await pool.query(query, queryParams)
    return res.json(rows)
  }
  catch(error){
    return res.status(500).json({error: 'Server error when get post search result from db', error})
  }
})

router.post('/post/addpost', checkAuthority(2), async (req, res, next)=>{
  const {title, content, imgurl} = req.body
  try{
    const {rows} = await pool.query(`INSERT INTO "posts"("title", "content", "upload_date", "image_location", "is_blog") VALUES($1, $2, now()::timestamp, $3, \'\\000\') RETURNING pid;`, [ title, content, imgurl ])
    const pid = rows[0].pid;
    return res.status(201).json({message: 'Success add post', pid})}
  catch(error){
    return res.status(500).json({error: 'Server error when add post to db', error})
  }
})

router.post('/post/editpost', checkAuthority(2), async (req, res, next)=>{
  const {title, content, imgurl, pid} = req.body
  try{
    await pool.query(`UPDATE "posts" SET "title" = $1, "content" = $2, "image_location" = $3 WHERE pid = $4;`,[ title, content, imgurl, pid ])
    return res.status(200).json({message: 'Success edit post'})
  }
  catch(error){
    return res.status(500).json({error: 'Server error when edit post to db', error})
  }
})

router.post('/post/image', checkAuthority(2), upload.single('file'), (req, res, next)=>{
  const fileUrl = `../images/${req.file.filename}`;
  res.json({url: fileUrl})
})

router.delete('/delete/post/:pid', checkAuthority(2), async (req, res, next)=>{
  const pid = req.params.pid;
  try{
    await pool.query('DELETE FROM posts WHERE pid = $1', [pid])
    return res.status(200).json({message: 'Success delete post'})
  }
  catch(error){
    return res.status(500).json({error: 'Server error when delete post from db', error})
  }
})

module.exports = router
