import React from 'react';

import RoutePage from './routes'

import {GoogleOAuthProvider} from '@react-oauth/google'

function AuthState(){
    return(
        <GoogleOAuthProvider
            clientId="722561384306-jki305r2olugm2a2v0cq3prvs3eh7lc1.apps.googleusercontent.com"
        >
            <RoutePage/>
        </GoogleOAuthProvider>
    )
}

export default AuthState