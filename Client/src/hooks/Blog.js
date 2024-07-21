import '../styles/App.css';
import '../styles/searchsortbox.css'

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import SearchResult from './elements/SearchResult'


function Blog(){
    const isMobile = useMediaQuery({
        query : "(max-width:767px)"
    })
    const [search, setSearch] = useState({startdate:'', enddate:'', tags:[], title:''})
    /* search 요소 date 2개 -> 날짜 선택, 제목 -> text, tags -> text list */
    const [sort, setSort] = useState({field:'title', order:'desc'})
    /* sort 요소 field -> 선택지 중 선택, order -> 2개 중 선택 */
    const [condition, setCondition] = useState({})
    const containerClassName= (isMobile)?"condition-selector w-100 d-flex-c d-jc g-1r r-smooth-05 c-bdb":"condition-selector w-100 d-flex-r d-jsa g-1r r-smooth-05 c-bdb"



    useEffect(()=>{
        const srch = {}
        const srt = {}
        search.startdate && search.enddate && (srch.startdate = search.startdate)
        search.startdate && search.enddate && (srch.enddate = search.enddate)
        search.tags.length && (srch.tags = search.tags)
        search.title && (srch.title = search.title)
        sort.field!='none' && (srt.field = sort.field)
        sort.field!='none' && (srt.order = sort.order)
        console.log(search, sort)
        setCondition({
            search: srch,
            sort: srt
        })
    }, [search, sort])
    const handleTitleChange = (e)=>{
        setSearch(prevsearch=>({...prevsearch, title: e.target.value}))
    }
    const handleStartdateChange = (e)=>{
        setSearch(prevsearch=>({...prevsearch, startdate: e.target.value}))
    }
    const handleEnddateChange = (e)=>{
        setSearch(prevsearch=>({...prevsearch, enddate: e.target.value}))
    }
    const handleFieldChange = (e)=>{
        setSort(prevsort=>({...prevsort, field: e.target.value}))
    }
    const setOrder = (text) =>{
        setSort(prevsort=>({...prevsort, order: text}))
    }

    return (
        <div className="d-flex-c">
            <h1 className="t-bbb t-reg">BLOG</h1>
            <Link to="/addpost" className="addpost-button c-bwh"></Link>
            <div className="recent-works d-flex-c">
                <div className={containerClassName}>
                    <div className="g-05r d-flex-c d-ac">
                        <h2>Search For</h2>
                        <input className = "search-title-input" type="text" placeholder='제목으로 검색' value={search.title} onChange={handleTitleChange}/>
                        <input className = "search-date-input" type="date" placeholder="YYYY-MM-DD" value={search.startdate} onChange={handleStartdateChange}/>
                        <input className = "search-date-input" type="date" value={search.enddate} onChange={handleEnddateChange}/>
                    </div>
                    {!(isMobile) && <div className = "search-box-rect d-asfs"></div>}
                    <div className="g-05r d-flex-c d-ac">
                        <h2>Sort By</h2>
                        <div className="sort-container d-flex-r d-jsb d-ac">
                            <select className = "sort-field-input" value={sort.field} onChange={handleFieldChange}>
                                <option value="none">None</option>
                                <option value="title">Title</option>
                                <option value="upload_date">Upload date</option>
                            </select>
                            {sort.order == "asc" && (<button className="c-bdb cur-pt" onClick={()=>{setOrder("desc")}}><img className="sort-icon" src="/triangle.svg" alt=""/></button>)}
                            {sort.order == "desc" && (<button className="c-bdb cur-pt" onClick={()=>{setOrder("asc")}}><img className="sort-icon" src="/reversetriangle.svg" alt=""/></button>)}
                        </div>
                    </div>
                </div>
                <SearchResult condition={condition}/>
            </div>
        </div>
    )
}

export default Blog