require('dotenv').config();
const express = require('express')
const router = express.Router()
const pool = require("../db")
const checkAuthority = require('./utils/checkAuthority')

router.get('/get/messagewithuser', checkAuthority(1), async (req, res, next)=>{
  const uid = req.session.userId
  try{
    const {rows} = await pool.query(`SELECT mid, uid_sender, uid_recipient, content, created_at FROM messages WHERE uid_recipient = $1 OR uid_sender = $1 ORDER BY created_at ASC`, [uid])
    return res.json(rows)
  }
  catch(error){
    console.log(error)
    return res.status(500).json({error: 'server error when get message from DB'})
  }
})

router.post('/post/message', checkAuthority(1), async (req, res, next)=>{
  const {sender, recipient, content} = req.body;
  try{
    await pool.query(`INSERT INTO messages(uid_sender, uid_recipient, content, created_at) VALUES($1, $2, $3, now()::timestamp)`, [sender, recipient, content])
    return res.status(201).json({message: 'Success add message'})
  }
  catch(error){
    return res.status(500).json({error: 'Server error when add message to db'})
  }
})