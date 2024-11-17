import React, { useContext } from 'react'
import { BrowserRouter , Route, Routes, Redirect } from 'react-router-dom'


import Header from './hooks/Header'
import Footer from './hooks/Footer'
import Home from './hooks/Home'
import Post from './hooks/Post'
import Blog from './hooks/Blog'
import AddPost from './hooks/AddPost'
import EditPost from './hooks/EditPost'
import Policy from './hooks/Policy'
import Profile from './hooks/Profile'
import Contact from './hooks/Contact'
import ContactAdmin from './hooks/ContactAdmin'

import ProtectedRoute from './utils/ProtectedRoute'

import BlockNavigation from './hooks/elements/BlockNavigation'


import history from './utils/history'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles/toast.css'
import './styles/webkit.css'
import './styles/globalnavigation.css'

import { useSelector } from 'react-redux';

function RoutePage(){
    const userInfo = useSelector((state)=>state.auth.userInfo)


    return(
        <>
            <BrowserRouter history = {history}>
                <div className="App w-100 c-bddb d-flex-c d-ac">
                    <Header/>
                    <div className="global-body w-80">
                        <BlockNavigation />
                        <Routes>
                            <Route exact path="/" element={<Home/>}/>
                            <Route path="/post/:pid" element={<Post/>}/>
                            <Route path="/blog" element={<Blog/>}/>
                            <Route path="/privacy-policy" element={<Policy/>}/>
                            <Route path="/profile" element={<ProtectedRoute level={1} element={<Profile/>}/>}/>
                            <Route path="/addpost" element={<ProtectedRoute level={0} element={<AddPost/>}/>}/>
                            <Route path="/editpost/:pid" element={<ProtectedRoute level={0} element={<EditPost/>}/>}/>
                            <Route path="/contact" element={<ProtectedRoute level={1} element={<Contact/>}/>}/>
                            <Route path="/contactadmin" element={<ProtectedRoute level={0} element={<ContactAdmin/>}/>}/>
                        </Routes>
                        
                    </div>
                    <Footer/>
                </div>
                <ToastContainer 
                    position="top-right" 
                    autoClose={4000} 
                    hideProgressBar={false} 
                    closeOnClick={true} 
                    pauseOnHover={false}
                    draggable={false}
                    theme="colored" 
                />
            </BrowserRouter>
        </>
    )
}

export default RoutePage