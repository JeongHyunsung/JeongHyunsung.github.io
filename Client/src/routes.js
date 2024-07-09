import React, { useContext } from 'react'
import { BrowserRouter , Route, Routes, Redirect } from 'react-router-dom'
import history from './utils/history'

import Context from './utils/context'

import Header from './hooks/Header'
import Footer from './hooks/Footer'
import Home from './hooks/Home'
import Post from './hooks/Post'
import Blog from './hooks/Blog'
import AddPost from './hooks/AddPost'


function RoutePage(){
    const context = useContext(Context)
    return(
        <div>
            <BrowserRouter history = {history}>
                <div className="App w-100 c-bddb d-flex-c d-ac">
                    <Header/>
                    <div className="w-80">
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route path="/post/:pid" element={<Post/>}/>
                        <Route path="/blog" element={<Blog/>}/>
                        <Route path="/addpost" element={<AddPost/>}/>
                    </Routes>
                    </div>
                    <Footer/>
                </div>
                
            </BrowserRouter>
        </div>
    )
}

export default RoutePage