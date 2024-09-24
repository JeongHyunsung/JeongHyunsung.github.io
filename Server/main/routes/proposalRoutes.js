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

module.exports = router