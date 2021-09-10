
import * as React from "react"
import {useState} from "react"

import GameGrid from "./gamegrid"

import '../styles/common.css'

const IndexPage = () => {

    const [mGridSize, setGridSize] = useState(100);

    const updateCells = (event) => 
    {
        let count = parseInt(event.target.value)
        console.log(count)
        setGridSize(count);
    }

    return (
        <>
        <div class="level" style={{
            height: '100vh'
            }}>
            <div class="level-item">
                <div class="container is-widescreen">
                    <div class="columns is-centered">
                        <div class="column is-narrow">
                            <h1 class="title" style={{color:'white'}}>Game of Life</h1>
                        </div>
                    </div>
                    <br></br>                
                    <div class="columns is-centered is-vcentered">
                        <div class="column is-narrow">
                            <GameGrid mWidth='70vh' mHeight='70vh' gridSize={mGridSize} controllerId='ppb' key={mGridSize}></GameGrid>
                        </div>
                    </div>
                    <div class="columns is-centered">
                        <div class="column is-narrow">
                            <input class="input numberInput" placeholder="Enter the grid size" type='number' onChange={updateCells}></input>
                        </div>
                        <div class="column is-narrow" >
                            <button class="button" id='ppb'> Click </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default IndexPage;