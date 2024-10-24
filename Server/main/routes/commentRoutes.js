require('dotenv').config();
const express = require('express')
const router = express.Router()
const pool = require("../db")
const checkAuthority = require('./utils/checkAuthority');
const { Pool } = require('pg');

router.get('/get/commentsinpost', async (req, res, next)=>{
  const pid = req.query.pid 
  try{
    const {rows} = await pool.query(`SELECT c.cid, c.content, c.created_at, c.parent_cid, u.name, u.pic, u.uid FROM comments AS c JOIN users AS u ON c.uid = u.uid WHERE c.pid = $1 ORDER BY c.created_at ASC`, [pid])
    return res.json(rows)
  }
  catch(error){
    console.log(error)
    return res.status(500).json({error: 'server error when get comment in post from DB'})
  }
})

router.get('/get/commentsuser', checkAuthority(1), async (req, res, next)=>{
  const uid = req.session.userId
  try{
    const {rows} = await pool.query(`SELECT c.cid, c.content, c.created_at, c.parent_cid, p.pid, p.title FROM comments AS c JOIN posts AS p ON c.pid = p.pid WHERE c.uid = $1 ORDER BY c.created_at ASC`, [uid])
    return res.json(rows)
  }
  catch(error){
    console.log(error)
    return res.status(500).json({error: 'server error when get comment of user from DB'})
  }
})

router.get('/get/usernamefromcid', checkAuthority(1), async (req, res, next)=>{
  const cid = req.query.cid
  try{
    const {rows} = await pool.query(`SELECT u.name FROM comments AS c JOIN users AS u ON c.uid = u.uid WHERE c.cid = $1`, [cid])
    return res.json(rows)
  }
  catch(error){
    console.log(error)
    return res.status(500).json({error: 'server error when get username from cid'})
  }
})

router.post('/post/comment', checkAuthority(1), async (req, res, next)=>{
  const {content, pid, parentcid} = req.body
  if(!req.session.userId){
    return res.status(403).json({message: 'Unauthorized'})
  }
  try{
    const result = await pool.query(`INSERT INTO comments(uid, pid, parent_cid, content, created_at) VALUES($1, $2, $3, $4, now()::timestamp) RETURNING cid`, [req.session.userId, pid, parentcid, content])
    const cid = result.rows[0].cid
    return res.status(201).json({message: 'Success add comment', cid})
  }
  catch(error){
    return res.status(500).json({error: 'Server error when add comment'})
  }
})

router.delete('/delete/comment/:cid', checkAuthority(1), async(req, res, next)=>{
  const cid = req.params.cid
  const userId = req.session.userId
  try{
    const result = await pool.query(`SELECT uid FROM comments WHERE cid = $1`, [cid])
    if(userId !== result.rows[0].uid){
      return res.status(403).json({message: "Unauthorized"})
    }
    await pool.query(`DELETE FROM comments WHERE cid = $1 AND uid = $2`, [cid, userId])
    return res.status(204).send()
  }
  catch(error){
    console.log(error)
    return res.status(500).json({error: "Server Error when delete comment in post"})
  }
})

module.exports = router
