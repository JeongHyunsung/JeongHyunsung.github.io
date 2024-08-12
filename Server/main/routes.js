var express = require('express')
var router = express.Router()
var pool = require("./db")

var multer = require('multer');
var path = require('path');

const bcrypt = require('bcrypt');
const { Pool } = require('pg');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/images/')); 
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
    return res.json(q_res);
  }
  catch(error){
    return res.status(500).json({error: 'Server error when get tag from db', error})
  }
})

router.get('/get/tagsinpost', async (req, res, next)=>{
  const post_id = req.query.post_id
  try{
    const {rows} = await pool.query(`SELECT DISTINCT tg.tid, tg.tag_name FROM post_tag pt JOIN tags tg ON pt.tid = tg.tid WHERE pt.pid = $1 ORDER BY tg.tag_name`, [post_id])
    return res.json(rows)
  }
  catch(error){
    return res.status(500).json({error: 'Server error when get tags in post from db', error})
  }
})

router.get('/get/pidstotids', async (req, res, next)=>{
  const pids = req.query.pids
  try{
    const {rows} = await pool.query(`SELECT tg.tid, tg.tag_name, COUNT(*) AS tag_count FROM post_tag pt JOIN tags tg ON pt.tid = tg.tid WHERE pid = ANY($1) GROUP BY tg.tid ORDER BY tag_count DESC, tg.tag_name ASC`, [pids])
    console.log(rows)
    return res.json(rows)
  }
  catch(error){
    return res.status(500).json({error: 'Server error when get tids from db', error})
  }
})

router.get('/get/tidstopids', async (req, res, next)=>{
  const tids = req.query.tids
  try{
    const {rows} = await pool.query(`SELECT DISTINCT pid FROM post_tag WHERE tid = ANY($1)`, [tids])
    return res.json(rows)
  }
  catch(error){
    return res.status(500).json({error: 'Server error when get pids from db', error})
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

router.get('/get/commentsinpost', async (req, res, next)=>{
  const pid = req.query.pid
  try{
    const {rows} = await pool.query(`SELECT cm.cid, cm.nickname, cm.content, cm.created_at FROM comments AS cm JOIN post_comment AS pc ON cm.cid = pc.cid WHERE pc.pid = $1 AND cm.is_approved = TRUE`, [pid])
    console.log(pid)
    return res.json(rows)
  }
  catch(error){
    return res.status(500).json({error: 'server error when get comment in post from DB'})
  }
})

router.post('/post/addpost', async (req, res, next)=>{
  const {title, content, imgurl} = req.body
  try{
    const {rows} = await pool.query('INSERT INTO "posts"("title", "content", "upload_date", "image_location", "is_blog") VALUES($1, $2, now()::timestamp, $3, \'\\000\') RETURNING pid;', [ title, content, imgurl ])
    const pid = rows[0].pid;
    return res.status(201).json({message: 'Success add post', pid})}
  catch(error){
    return res.status(500).json({error: 'Server error when add post to db', error})
  }
})

router.post('/post/editpost', async (req, res, next)=>{
  const {title, content, imgurl, pid} = req.body
  try{
    await pool.query('UPDATE "posts" SET "title" = $1, "content" = $2, "image_location" = $3 WHERE pid = $4;',[ title, content, imgurl, pid ])
    return res.status(200).json({message: 'Success edit post'})
  }
  catch(error){
    return res.status(500).json({error: 'Server error when edit post to db', error})
  }
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
      return res.status(201).json({message: 'Success add tag', tid})
    }
    else{
      const tid = rows[0].tid;
      return res.status(200).json({message: 'Success : tag aleady exists', tid});
    }
  }
  catch(error){
    return res.status(500).json({error: 'Server error when add tag to db', error});
  }
})

router.post('/post/posttagrel', async (req, res, next)=>{
  const {pid, tid} = req.body;
  try{
    await pool.query(`INSERT INTO post_tag(pid, tid) VALUES($1, $2)`, [pid, tid])
    return res.status(201).json({message: 'Success add post-tag relation'})
  }
  catch(error){
    return res.status(500).json({error: 'Server error when add post-tag relation to db'})
  }
})

router.post('/post/comment', async (req, res, next)=>{
  const {nickname, password, content} = req.body
  console.log(nickname, password, content)
  
  try{
    const hashed_pw = await bcrypt.hash(password, 10) 
    const result = await pool.query(`INSERT INTO comments(nickname, content, hashed_password, created_at, is_approved) VALUES($1, $2, $3, now()::timestamp, TRUE) RETURNING cid`, [nickname, content, hashed_pw])
    const cid = result.rows[0].cid
    return res.status(201).json({message: 'Success add comment', cid})
  }
  catch(error){
    return res.status(500).json({error: 'Server error when add comment'})
  }
})

router.post('/post/postcommentrel', async(req, res, next)=>{
  const {pid, cid} = req.body;
  try{
    await pool.query(`INSERT INTO post_comment(pid, cid) VALUES($1, $2)`, [pid, cid])
    return res.status(201).json({message: "Success add post-comment relation"})
  }
  catch(error){
    return res.status(500).json({error: 'Server error when add post-comment relation to db'})
  }
})

router.delete('/delete/post/:pid', async (req, res, next)=>{
  const pid = req.params.pid;
  try{
    await pool.query('DELETE FROM "posts" WHERE pid = $1', [pid])
    return res.status(200).json({message: 'Success delete post'})
  }
  catch(error){
    return res.status(500).json({error: 'Server error when delete post from db', error})
  }
})

router.delete('/delete/resettagsinpost/:pid', async (req, res, next)=>{
  const pid = req.params.pid;
  try{
    await pool.query('DELETE FROM "post_tag" WHERE pid = $1', [pid])
    return res.status(200).json({message: 'Success delete tags in post'});
  }
  catch(error){
    return res.status(500).json({error: "Server Error when delete tags in post"})
  }
})
module.exports = router