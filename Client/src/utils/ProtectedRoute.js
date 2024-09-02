import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, level }) => {
    const userInfo = useSelector(state => state.auth.userInfo);
    
    let isAuthenticated = false

    if(level === 0){
        isAuthenticated = userInfo.userIsAdmin;
        console.log(userInfo.userIsAdmin)
    }
    else if(level === 1){
        isAuthenticated = !!userInfo.userId;
    }
    
    

    return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;