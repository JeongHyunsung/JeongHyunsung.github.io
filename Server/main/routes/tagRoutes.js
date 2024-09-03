require('dotenv').config();
const express = require('express')
const router = express.Router()
const pool = require("../db")
const checkAuthority = require('./utils/checkAuthority')


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

router.post('/post/tag', checkAuthority(2), async (req, res, next)=>{
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

module.exports = router