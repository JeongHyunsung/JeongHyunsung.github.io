import '../../styles/App.css';

import { useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect, useRef } from 'react';
import Matter, {Engine, Render, World, Bodies, Body, Mouse, MouseConstraint} from 'matter-js';

function BlockNavigation({visibility}){

    /* visibility 0: unvisible, 1: visible(small size), 2: visible(big size)
    small : small picture of blocks + current menu ex) BLOG, CONTACT etc...
    big : User interface enables user to modify blocks and navigate pages */
    const canvasRef = useRef(null)

    useEffect(()=>{
        const rootStyles = getComputedStyle(document.documentElement);
        const colorWhite = rootStyles.getPropertyValue('--col-wh').trim(); 
        const colorDdblue = rootStyles.getPropertyValue('--col-ddb').trim(); 

        const engine = Engine.create({
            gravity: {
                x: 0,
                y: 1,
                scale: 0.002,
            }
        })
        const world = engine.world

        const render = Render.create({
            element : canvasRef.current,
            engine: engine,
            options:{
                width: 2000,
                height: 500,
                wireframes: false,
                background: colorDdblue,
            },
        })
        const ground = Bodies.rectangle(1000, 510, 2000, 10, { 
            isStatic: true,
            render:{
                fillStyle: colorDdblue,
            }
        });
        World.add(world, ground)
        const block = Bodies.rectangle(1000, 0, 100, 100, {
            isStatic: false,
            restitution: 0.8,
            render: {
                fillStyle: colorWhite,
            }
        })
        World.add(world, block)

        const mouse = Mouse.create(render.canvas)
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.1,
                render:{
                    visible: false,
                },
            },
        })
        World.add(world, mouseConstraint)
    
        const renderLoop = () => {
            Engine.update(engine, 1000 / 60); // 60FPS로 엔진 업데이트
            Render.world(render);
            requestAnimationFrame(renderLoop); // 재귀적으로 호출
        };
        requestAnimationFrame(renderLoop);
        Render.run(render)

        return ()=>{
            Render.stop(render)
            Engine.clear(engine)
        }
    }, [])

    
    

    return(
        <div className="block-navigation d-flex-c d-ac">
             <div ref={canvasRef} className="canvas-container" style={{ width: '2000px', height: '500px' }} />
        </div>
    )
}

export default BlockNavigation