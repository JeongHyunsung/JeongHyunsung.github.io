require('dotenv').config();
const express = require('express')
const router = express.Router()
const pool = require("../db")
const checkAuthority = require('./utils/checkAuthority')

router.get('/get/messagesfromuid', checkAuthority(1), async(req, res, next)=>{
    const userId = req.session.userId
    let userIdfromClient = req.query.userId
    let otherId = req.query.otherId
    
    if(otherId === "0"){
        otherId = parseInt(process.env.ADMIN_UID, 10);
    }
    if(userIdfromClient === "0"){
        userIdfromClient = parseInt(process.env.ADMIN_UID, 10);
    }

    if(userId != userIdfromClient){
        return res.status(403).json({error: unauthorized})
    }
    
    
    console.log(userId, otherId)
    try{
        const {rows} = await pool.query(`SELECT mid, uid_sender, uid_recipient, content, created_at FROM messages WHERE (uid_sender = $1 AND uid_recipient = $2) OR (uid_recipient = $1 AND uid_sender = $2)`, [userId, otherId])
        res.json(rows)
    }catch(error){
        return res.status(500).json({error: 'server error when get message from DB'})
    }
})

router.get('/get/contactusers', checkAuthority(1), async (req, res, next)=>{
    try{
        const adminId = parseInt(process.env.ADMIN_UID, 10);
        const {rows} = await pool.query(`SELECT DISTINCT uid_sender AS uid FROM messages WHERE uid_recipient = $1 UNION SELECT DISTINCT uid_recipient AS uid FROM messages WHERE uid_sender = $1`, [adminId])
        res.json(rows)
    }catch(error){
        return res.status(500).json({error: 'server error when get contact users'})
    }
})
 


module.exports = router
