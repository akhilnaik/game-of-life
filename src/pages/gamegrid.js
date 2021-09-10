import * as React from "react"
import {useEffect} from "react";
import styled from 'styled-components'

const CanvasElem = styled.canvas`
  border: 0;
  outline: 0;
`

const GameGrid = ({mWidth, mHeight, gridSize, controllerId}) => {

  useEffect(()=>{
    console.log("created grid")
    clearImage();
    drawImage();
    document.getElementById(controllerId).addEventListener('click', handlePlayToggle)
    document.getElementById(controllerId).textContent = "Pause";
    return () => {
      document.getElementById(controllerId).removeEventListener('click', handlePlayToggle);
      clearImage();
    };
  }, []);

  const mGridSize = gridSize || 100;
  const CELLWIDTH = 1000/mGridSize;
  
  let isMouseDown = false;

  let mStopNextFrame = false;
  let mAnimationFrame = null;

  console.log("created mGrid again")
  let mGrid = Array();
  let mTempGrid = Array();
  for (let i=0; i<mGridSize; i++)
  {
    let row = Array();
    for (let j=0; j<mGridSize; j++)
    {
      //row.push(Math.random() < 0.5);
      if(i>mGridSize*0.3 && i<mGridSize*0.7 && j>mGridSize*0.3 && j<mGridSize*0.7) row.push(Math.random() < 0.5)
      else row.push(false)
    }
    mGrid.push(row);
    mTempGrid.push(Array(row));
  }

  const getNeighbors = (i, j) => {
      let count = 0;
      let im1 = (i-1+mGridSize)%mGridSize;
      let jm1 = (j-1+mGridSize)%mGridSize;
      let ip1 = (i+1)%mGridSize;
      let jp1 = (j+1)%mGridSize;
      count =  count + mGrid[im1][jm1] + mGrid[im1][j] + mGrid[im1][jp1] + mGrid[i][jm1]
                  + mGrid[i][jp1] + mGrid[ip1][jm1] + mGrid[ip1][j] + mGrid[ip1][jp1];
      return count;
  }

  const checkRules = (i, j) => {
      let result = false;
      let count = getNeighbors(i, j);
      if(mGrid[i][j])// if live cell
      {
          if(count == 2 || count == 3) result = true;
      }
      else
      {
          if(count == 3) result = true;
      }
      return result;
  }

  const clearImage = () => {
    let canvasElem = document.getElementById('game-canvas')
    if (canvasElem === null) return;
    canvasElem.getContext('2d').clearRect(0, 0, 1000, 1000);
    clearTimeout(mAnimationFrame);
  }

  const drawImage = () => {
    console.log('draw called')
    if (mStopNextFrame) 
    {
      mStopNextFrame = false
      clearTimeout(mAnimationFrame)
      return;
    }

    let canvasElem = document.getElementById('game-canvas')
    if (canvasElem === null) return;
    let ctx = canvasElem.getContext('2d');
    ctx.imageSmoothingEnabled = false

    ctx.fillStyle = "#ffffff";
    ctx.clearRect(0, 0, 1000, 1000);
    for (let i=0;i<mGridSize;i++) {
      for (let j=0;j<mGridSize;j++)
      {
        if (mGrid[i][j] === true) { ctx.fillRect(j*CELLWIDTH, i*CELLWIDTH, CELLWIDTH, CELLWIDTH); }
        mTempGrid[i][j] = checkRules(i,j);
      }
    }

    for (let i=0;i<mGridSize;i++)
      for (let j=0;j<mGridSize;j++)
        mGrid[i][j] = mTempGrid[i][j];

      mAnimationFrame = setTimeout(()=>{
        drawImage();
      }, 100)
    ;
  }

  const mouseDownEvent = (event) =>
  {
    isMouseDown = true;
  }

  const mouseUpEvent = (event) =>
  {
    isMouseDown = false;
  }

  const mouseMoveEvent = (event) =>
  {
    if (isMouseDown) 
    {
      let elem = event.target;
      let geom = elem.getBoundingClientRect();
      let y = event.clientY - geom.top;
      let x = event.clientX - geom.left;
      x = Math.floor(mGridSize*(x/geom.width));
      y = Math.floor(mGridSize*(y/geom.height));
      mGrid[y][x] = true;
    }
  }


  const handlePlayToggle = () => {
    console.log('click', mAnimationFrame, mStopNextFrame)
    mStopNextFrame = !mStopNextFrame
    clearTimeout(mAnimationFrame)
    if(!mStopNextFrame) {
      drawImage();
      document.getElementById(controllerId).textContent = "Pause";
    }
    else
    {
      document.getElementById(controllerId).textContent = "Play";
    }
  }

  return(
    <div style={{
      width: mWidth,
      }}>
      <CanvasElem id='game-canvas' width='1000' height='1000' onMouseDown={mouseDownEvent} onMouseUp={mouseUpEvent} onMouseMove={mouseMoveEvent}
        style={{
          width: mWidth,
          height: mHeight
        }}
      />
    </div>
  );
}

export default GameGrid
