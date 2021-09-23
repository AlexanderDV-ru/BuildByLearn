// ==UserScript==
// @name         BuildByLearn
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  you can build your palace for your points from duolingo and other sites for learning languages
// @author       https://github.com/AlexanderDV-ru
// @match        https://www.duolingo.com/profile/*
// @icon         https://www.google.com/s2/favicons?domain=duolingo.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{
        let pane=document.createElement("div")
        if(0)
        {
            pane.style.position = 'absolute';
            pane.style.x = 10;
            pane.style.y = 10;
            pane.style.width = 300;
            pane.style.height = 300;
            pane.style["z-index"]=1000000
            document.getElementsByClassName("_1kJpR _3g2C1")[0].appendChild(pane)
        }
        else document.body.appendChild(pane)

        let allPoints,rects=[]

        let upd=document.createElement("button")
        upd.innerHTML="Update"
        pane.appendChild(upd)

        let color=document.createElement("input")
        color.placeholder="color"
        pane.appendChild(color)

        let brushSizeInput=document.createElement("input")
        brushSizeInput.placeholder="Brush size"
        pane.appendChild(brushSizeInput)

        let clearButton=document.createElement("button")
        clearButton.innerHTML="Clear"
        pane.appendChild(clearButton)
        clearButton.onclick=()=>upd.onclick(localStorage.studyWorld_rects=JSON.stringify(rects=[]))

        let allPointsSpan=document.createElement("span")
        pane.appendChild(allPointsSpan)
        allPointsSpan.onclick=()=>allPointsSpan.innerHTML=Math.floor(allPoints)

        pane.appendChild(document.createElement("br"))

        let canv=document.createElement("canvas"),ctx=canv.getContext("2d")
        pane.appendChild(canv)

        let info=document.createElement("div")
        pane.appendChild(info)

        upd.onclick=()=>{
            let hasPerm=document.getElementsByClassName("_3oNvD")[0].innerText.split(/[’ ]/g).length<3,isAdmin=false
            if(!hasPerm&&!isAdmin)
                return alert("No permissions! It is not you")
            let langs=document.getElementsByClassName("BMuTY")[0].innerText.split("\n")
            let table=[]
            for(let l of langs)
                if(table[table.length-1]&&(table[table.length-1][2]+"").split(/[0-9]/).length==1)
                    table[table.length-1][2]=l.replace(/[^0-9]/g,"")
                else table.push(l.replace(/[0-9) ]/g,"").split("("))

            ctx.clearRect(0,0,500,500)
            allPoints=0
            rects=JSON.parse(localStorage.studyWorld_rects)

            let points={}
            for(let t of table)
            {
                points[t[0]]=Number(points[t[0]]||0)+Number(t[2])
                allPoints+=Number(t[2])
            }
            console.log(langs, table, points,rects)
            let text="INFO"

            for(let p in points)
                text+="<br><span>"+p+": "+points[p]+"</span>"
            info.innerHTML=text

            let defaultBrushSize=Math.cbrt(allPoints)
            function fillRect(rect,no){
                if(allPoints-rect.size*rect.size<0)
                    return
                ctx.fillStyle=rect.color
                ctx.fillRect(rect.x,rect.y,rect.size,rect.size)
                allPoints-=rect.size*rect.size
                allPointsSpan.onclick()
                if(!no)
                    rects.push(rect)
                localStorage.studyWorld_rects=JSON.stringify(rects)
            }
            for(let rect of rects)
                fillRect(rect,1)
            allPointsSpan.onclick()
            canv.onmousedown=(e)=>(allPoints>0?fillRect({x:e.offsetX,y:e.offsetY,size:brushSizeInput.value||defaultBrushSize,color:color.value||"black"}):0)
        }
    },1000)
})();
