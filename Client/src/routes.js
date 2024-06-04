import React, { useContext } from 'react'
import { BrowserRouter , Route, Switch, Redirect } from 'react-router-dom'
import history from './utils/history'

import Context from './utils/context'

import Header from './hooks/Header'
import Home from './hooks/Home'


function Routes(){
    const context = useContext(Context)
    return(
        <div>
            <BrowserRouter history = {history}>
                <Header/>
                <div>
                    <switch>
                        <Route exact path='/' component={Home}/>

                    </switch>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default Routes