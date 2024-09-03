function checkAuthority(requiredRole){
    return (req, res, next)=>{
        const userRole = (!!req.session.userId)? ((req.session.userIsAdmin)?2:1):0
        if (userRole == 0){
            return res.status(401).send("Unauthorized")
        }
        else if(userRole < requiredRole){
            return res.status(403).send("Forbidden")
        }
        else{
            return next()
        }
    }
}

module.exports = checkAuthority