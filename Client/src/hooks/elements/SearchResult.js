import '../../styles/App.css';
import '../../styles/card.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import Card from "./Card"
import Masonry from 'react-masonry-css';


function SearchResult({condition}){
    const [pids, setPids] = useState([])
    const [visualPids, setVisualPids] = useState([])
    const [tags, setTags] = useState([])
    const [tagNames, setTagNames] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };
    /* 검색 결과에 해당하는 post 들의 pid 리스트를 내부에 가지고 있으며, pid 리스트를 post cards 로 렌더링함 */
    /* db 전체 가져올 필요 없고, 특정 조건에 해당하는 포스트의 pid 만 http request 로 가져오면 됨 */
    /* condition 은 {search: {startdate: enddate: title: tag:[]}, sort{field: order: }} 형태임 */
    useEffect(()=>{
        /* pids, tags update */
        const getSearchResultPids = async ()=>{
            try{
                const res = await axios.get('/api/get/searchresult', { params: condition });
                setPids(res.data.map(value=>{return value.pid}))
                
                const res_tags = await axios.get('/api/get/pidstotids', { params: {pids: res.data.map(value=>{return value.pid})}})
                setTags(res_tags.data.map(value=>{return value.tid}))
            }
            catch(error){console.log(error)}
        }
        getSearchResultPids()
    }, [condition])

    useEffect(()=>{
        /* visualPid update */
        const getVisualPids = async ()=>{
            try{
                if(selectedTags.length){
                    const res = await axios.get('/api/get/tidstopids', { params: {tids: tags}})

                    교집합 구하는거 여기서부터 하면댐 
                    setVisualPids(res.data.map(value=>{return value.pid}))
                }
                else{
                    setVisualPids(pids)
                }
            }
            catch(error){console.log(error)}
        }
        getVisualPids()
    }, [tags, selectedTags, pids])

    useEffect(()=>{
        const fetchTagNames = async()=>{
            try{
                const res = await Promise.all(tags.map(value=>{
                    return axios.get(`/api/get/tag`, {params: {tid: value}})
                }))
                const names = res.map(r=>[r.data.rows[0].tid, r.data.rows[0].tag_name])
                setTagNames(names);
            }
            catch(error){console.error("Failed to fetch tag names")}}
        if(tags.length > 0){
            fetchTagNames()
        }
        else{
            setTagNames([])
        }
    }, [tags])


    return(
        <React.Fragment>
            <div className="searchresult-tags-container w-100 d-asfs d-flex-r d-flex-wrap g-05r">
                {tagNames.map(([_, tagname], index)=>{
                return(
                    <div className="tag c-bdb d-flex-r d-ac t-s t-reg" key={index.toString()}>
                        <p className="tagname c-wh t-s t-spacing-small">{tagname}</p>
                    </div>
                    )
                })}
            </div>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid_column"
            >
                {visualPids.map((value)=>{
                    return(<Card key = {value} pid = {value}/>)
                })}
            </Masonry>
        </React.Fragment> 
    )
}

export default SearchResult