import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import Routes from './routes'

function AuthState(){
    return(
        <div>
            <Auth0Provider
                domain="dev-fe08mjqzeio0l00y.us.auth0.com"
                clientId="SnWTdCeqXyGxwbaW5WRzJHRPZVS8xF9X"
                authorizationParams={{
                    redirect_uri: "https://localhost:3000/"
                }}
            >
                <Routes/>
            </Auth0Provider>
        </div>
    )
}

export default AuthState