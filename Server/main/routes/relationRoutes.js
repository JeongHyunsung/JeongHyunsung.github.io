require('dotenv').config();
const express = require('express')
const router = express.Router()
const pool = require("../db")
const checkAuthority = require('./utils/checkAuthority')


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

router.delete('/delete/resettagsinpost/:pid', checkAuthority(2), async (req, res, next)=>{
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