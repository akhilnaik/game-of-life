import * as React from "react"
import {createRef, useEffect} from "react";
import styled from 'styled-components'

const CanvasElem = styled.canvas`
  width:50vh;
  height:50vh;
  border: 1px solid black;
`

const IndexPage = () => {

  useEffect(()=>{
    drawImage();
  }, []);

  const canvasRef = createRef();

  const mGridSize = 100;
  const CELLWIDTH = 1000/mGridSize;


  let isMouseDown = false;


  let mGrid = Array();
  let mTempGrid = Array();
  for (let i=0; i<mGridSize; i++)
  {
    let row = Array();
    for (let j=0; j<mGridSize; j++)
    {
      row.push(Math.random() < 0.5);
    }
    mGrid.push(row);
    mTempGrid.push(Array(row));
  }

  const getNeighbors = (i, j) =>
  {
      let count = 0;
      let im1 = (i-1+mGridSize)%mGridSize;
      let jm1 = (j-1+mGridSize)%mGridSize;
      let ip1 = (i+1)%mGridSize;
      let jp1 = (j+1)%mGridSize;
      count =  count + mGrid[im1][jm1] + mGrid[im1][j] + mGrid[im1][jp1] + mGrid[i][jm1]
                  + mGrid[i][jp1] + mGrid[ip1][jm1] + mGrid[ip1][j] + mGrid[ip1][jp1];
      return count;
  }

  const checkRules = (i,j)=>
  {
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

  const drawImage=()=>{
    if (canvasRef.current === null) requestAnimationFrame(drawImage);
    let ctx = canvasRef.current.getContext('2d');
    ctx.imageSmoothingEnabled = false

    for (let i=0;i<mGridSize;i++) {
      for (let j=0;j<mGridSize;j++)
      {
        if (mGrid[i][j] === false) { ctx.fillRect(j*CELLWIDTH, i*CELLWIDTH, CELLWIDTH, CELLWIDTH); }
        else { ctx.clearRect(j*CELLWIDTH, i*CELLWIDTH, CELLWIDTH, CELLWIDTH); }
        mTempGrid[i][j] = checkRules(i,j);
      }
    }

    for (let i=0;i<mGridSize;i++)
      for (let j=0;j<mGridSize;j++)
        mGrid[i][j] = mTempGrid[i][j];

    setTimeout(()=>{
      requestAnimationFrame(drawImage);
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

  return(
    <div>
      <CanvasElem ref={canvasRef} width='1000' height='1000' onMouseDown={mouseDownEvent} onMouseUp={mouseUpEvent} onMouseMove={mouseMoveEvent}/>
    </div>
  );
}

export default IndexPage
