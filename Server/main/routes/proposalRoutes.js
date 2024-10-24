require('dotenv').config();
const express = require('express')
const router = express.Router()
const pool = require("../db")
const checkAuthority = require('./utils/checkAuthority')


router.post('/post/proposal', checkAuthority(1), async (req, res, next)=>{
  const {email, title, description} = req.body;
  try{
    await pool.query(`INSERT INTO proposals(uid, title, description, contact_email, created_at) VALUES($1, $2, $3, $4, now()::timestamp)`, [req.session.userId, title, description, email])
    return res.status(201).json({message: 'Success add proposal'})
  }
  catch(error){
    console.log(error)
    return res.status(500).json({error: 'Server error when add proposal to db'})
  }
})

router.get(`/get/proposal`, checkAuthority(2), async (req, res, next)=>{
  try{
    const {rows} = await pool.query(`SELECT * FROM proposals`)
    return res.json(rows)
  }catch(error){
    console.log(error)
    return res.status(500).json({error: 'Server error when get proposals'})
  }
})

router.get('/get/proposaluser', checkAuthority(1), async (req, res, next)=>{
  const userId = req.session.userId
  try{
    const {rows} = await pool.query(`SELECT ppid, title, description, created_at FROM proposals WHERE uid = $1`, [userId])
    return res.status(200).json(rows)
  }catch(error){
    console.log(error)
    return res.status(500).json({error: 'Server error'})
  }
})

router.delete('/delete/proposal/:ppid', checkAuthority(1), async(req, res, next)=>{
  const ppid = req.params.ppid
  const userId = req.session.userId
  try{
    const result = pool.query(`SELECT uid FROM proposals WHERE ppid = $1`, [ppid])
    if(userId != result.rows[0].uid){
      return res.status(403).json({message: "Unauthorized"})
    }
    await pool.query(`DELETE FROM proposals WHERE ppid = $1 AND uid = $2`, [ppid, userId])
    return res.status(204).send()
  }catch(error){
    console.log(error)
    return res.status(500).json({error: "Server error"})
  }
})

module.exports = router