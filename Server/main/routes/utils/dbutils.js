const pool = require("../../db")

const postMessage = async(msg)=>{
    try{
        const {rows} = await pool.query(`INSERT INTO messages (uid_sender, uid_recipient, content, created_at) VALUES ($1, $2, $3, now()::timestamp) RETURNING mid, created_at`, [msg.uid_sender, msg.uid_recipient, msg.content])
        return rows[0]
    }catch(error){
        throw new Error("Post fail")
    }
}

module.exports = {
    postMessage
}