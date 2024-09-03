require('dotenv').config();
const express = require('express')
const router = express.Router()
const pool = require("../db")
const checkAuthority = require('./utils/checkAuthority')


const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client(process.env.CLIENT_ID)

router.get('/post/checklogin', async(req, res, next)=>{
  if(req.session.userId){
    const userId = req.session.userId
    const userEmail = req.session.userEmail
    const userName = req.session.userName
    const userPic = req.session.userPic
    const userIsAdmin = req.session.userIsAdmin
    res.json({isLoggedIn: true, userInfo: {userId, userEmail, userName, userPic, userIsAdmin}})
  }
  else{
    res.json({isLoggedIn: false})
  }
})

router.post('/post/googlelogin', async(req, res, next)=>{
  const {credential, redirect_url} = req.body
  try{
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.CLIENT_ID
    })
    const payload = ticket.getPayload();
    const userSub = payload['sub'];
    const userEmail = payload['email']
    const userName = payload['name']
    const userPic = payload['picture']
    let result

    const { rows } = await pool.query(`SELECT uid FROM users WHERE sub = $1;`, [userSub]);
    if(rows.length === 0){
      result = await pool.query(`INSERT INTO users (sub, name, email, pic) VALUES($1, $2, $3, $4) RETURNING uid, is_admin`, [userSub, userName, userEmail, userPic])
    }
    else{result = await pool.query(`UPDATE users SET name = $1, email = $2, pic = $4 WHERE sub = $3 RETURNING uid, is_admin`, [userName, userEmail, userSub, userPic])}
    const userId = result.rows[0].uid
    const userIsAdmin = result.rows[0].is_admin
    req.session.userSub = userSub
    req.session.userEmail = userEmail
    req.session.userName = userName
    req.session.userPic = userPic
    req.session.userId = userId
    req.session.userIsAdmin = userIsAdmin
    res.json({userInfo: {userId, userEmail, userName, userPic, userIsAdmin}});
  }
  catch(error){
    console.log(error)
    res.status(401).json({error: 'Invalid ID token'})
  }
})

router.post('/post/googlelogout', checkAuthority(1), async(req, res, next)=>{
  req.session.destroy(err=>{
    if(err){return res.status(500).json({error: 'Failed to logout'})}
    res.clearCookie('connect.sid')
    res.json({message: 'Logged out'})
  })
})

router.post('/post/googlelogoutwithdeletion', checkAuthority(1), async(req, res, next)=>{
  try{
    const result = await pool.query('DELETE FROM users WHERE uid = $1', [req.session.userId])
    console.log(result)
    req.session.destroy(err=>{
      if(err){return res.status(500).json({error: 'Failed to account deletion'})}
      res.clearCookie('connect.sid')
      res.json({message: 'Account deleted successfully'})
    })
  }
  catch(error){
    console.log(error)
    res.status(500).json({error: 'Failed to account deletion'})
  }
})

module.exports = router
