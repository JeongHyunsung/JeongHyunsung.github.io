require('dotenv').config();
const express = require('express')
const router = express.Router()
const pool = require("../db")

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

router.post('/post/comment', async (req, res, next)=>{
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

router.delete('/delete/comment/:cid/:uid', async(req, res, next)=>{
  const {cid, uid} = req.params
  const userId = req.session.userId
  if(!userId){
    return res.status(401).json({message: "Login required"})
  }
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
