import '../../styles/App.css';
import '../../styles/card.css';
import '../../styles/editor.css';
import React, { useContext, useRef, useState, useEffect } from 'react';
import axios from 'axios'

import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import Card from "./Card"
import Masonry from 'react-masonry-css';


function SearchResult({condition}){
    const [pids, setPids] = useState([])
    const [visualPids, setVisualPids] = useState([])
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    
    const [containerHeight, setContainerHeight] = useState(0)
    const containerRef = useRef(null);
    
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };
    /* 검색 결과에 해당하는 post 들의 pid 리스트를 내부에 가지고 있으며, pid 리스트를 post cards 로 렌더링함 */
    /* db 전체 가져올 필요 없고, 특정 조건에 해당하는 포스트의 pid 만 http request 로 가져오면 됨 */
    /* condition 은 {search: {startdate: enddate: title: tag:[]}, sort{field: order: }} 형태임 */
    useEffect(()=>{
        /* pids, tags update selectedTags initialization*/
        setSelectedTags([])
        const getSearchResultPids = async ()=>{
            try{
                const res = await axios.get('/post/get/searchresult', { params: condition });
                setPids(res.data.map(value=>{return value.pid}))
                
                const res_tags = await axios.get('/rel/get/pidstotids', { params: {pids: res.data.map(value=>{return value.pid})}})
                setTags(res_tags.data.map(value=>{return [value.tid, value.tag_name, value.tag_count]}))
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
                    const res = await axios.get('/rel/get/tidstopids', { params: {tids: selectedTags}})
                    const pidsetfromtid = new Set(res.data.map(value=>{return value.pid}))
                    const result = []
                    for(let elem of pids){
                        if(pidsetfromtid.has(elem)){
                            result.push(elem)
                        }
                    }
                    setVisualPids(result)
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
        const updateContainerHeight = ()=>{
            if(containerRef.current){
                let totalHeight = 0;
                let currentLineHeight = 0;
                let currentLineTop = 0;

                containerRef.current.childNodes.forEach(node => {
                    const rect = node.getBoundingClientRect();
                    if (rect.top !== currentLineTop) { // element 의 top 속성을 비교하여 같은 줄인지 판별
                        totalHeight += currentLineHeight; 
                        currentLineHeight = 0; 
                        currentLineTop = rect.top; 
                    }
                    currentLineHeight = Math.max(currentLineHeight, rect.height); // 현재 줄 element 의 최대 height 저장
                });
                totalHeight += currentLineHeight;
                setContainerHeight(totalHeight)
            }
        }
        updateContainerHeight()
        window.addEventListener('resize', updateContainerHeight);
        return ()=>{
            window.removeEventListener('resize', updateContainerHeight)
        }
    }, [tags])

    const handleTagClicked = (tid)=>{
        if(selectedTags.includes(tid)){
            const updatedArray = selectedTags.filter(element => element !== tid);
            setSelectedTags(updatedArray);
        }
        else{
            setSelectedTags([...selectedTags, tid])
        }
    }

    

    return(
        <React.Fragment>
            <div className="searchresult-tags-container w-100 d-asfs d-flex-r d-flex-wrap g-05r" ref={containerRef} style={{height: containerHeight}}>
                {tags.map(([tid, tagname, tagcount], index)=>{
                return(
                    <div
                        className="tag cur-pt c-bdb d-flex-r d-ac t-s t-reg g-05r"
                        key={index.toString()}
                        style={{backgroundColor: (selectedTags.includes(tid))?"var(--col-mb)":"var(--col-db)"}}
                        onClick={()=>{handleTagClicked(tid)}}>
                        <p className="tagname c-wh t-s t-spacing-small">{tagname}</p>
                        <p className="tagname c-wh t-s">{"("+tagcount+")"}</p>
                    </div>
                    )
                })}
            </div>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid_column">
                {visualPids.map((value)=>{
                    return(<Card key = {value} pid = {value}/>)
                })}
            </Masonry>
        </React.Fragment> 
    )
}

export default SearchResult