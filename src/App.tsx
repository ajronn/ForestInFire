import React from "react"
import { probability, randTree, randFire, randBurnedTree, addLake, copy } from "./utils"
import Board from './components/board/Borad';
import style from './App.module.css';

//forest size
const NX = 150
const NY = 300

interface State {
    forest: number[][],
    forestOnFire: NodeJS.Timeout | null,
    probability: number,
    moore: boolean,
    iterations: number,
    wind: string,
    windProbability: number,
    lake: boolean,
    isMenuOpen: boolean,
}

class AppClass extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            forest: [],
            forestOnFire: null,
            probability: 0.2,
            moore: false,
            iterations: -1,
            wind: '',
            windProbability: 0,
            lake: false,
            isMenuOpen: true,
        }
        this.burn = this.burn.bind(this)
    }

    componentDidMount() {
        //init forest when view is loaded
        this.setState({ ...this.state, forest: this.createForest() })
    }

    createForest() {
        //init forest
        let newForest = new Array(NX)
        for (let i = 0; i < newForest.length; i++) {
            newForest[i] = new Array(NY)
        }

        //fill forest
        for (let i = 0; i < newForest.length; i++) {
            for (let j = 0; j < newForest[i].length; j++) {
                newForest[i][j] = randTree()
            }
        }

        if (this.state.lake) {
            newForest = addLake(newForest)
        }

        return this.fireRandomTree(newForest);
    }

    fireRandomTree(arr: number[][]): number[][] {
        //fire random tree
        let x = Math.floor(Math.random() * (NX - 1))
        let y = Math.floor(Math.random() * (NY - 1))
        while (arr[x][y] > 16) {
            x = Math.floor(Math.random() * (NX - 1))
            y = Math.floor(Math.random() * (NY - 1))
        }

        arr[x][y] = randFire()
        return arr
    }

    burn() {
        //decrementation iterations
        if (this.state.iterations > 0) {
            this.setState({ ...this.state, iterations: this.state.iterations - 1 })
        }

        //end of iterations
        if (this.state.iterations === 0) {
            this.stoptSimulation()
            return
        }

        const copyOfForest = copy(this.state.forest) //copy forest array without binding
        const burningTrees = [] //current trees on fire
        for (let i = 0; i < copyOfForest.length; i++) {
            for (let j = 0; j < copyOfForest[i].length; j++) {
                if (copyOfForest[i][j] >= 11 && copyOfForest[i][j] <= 13) {
                    burningTrees.push([i, j])
                }
            }
        }

        //when no trees on fire
        if (burningTrees.length === 0) {
            this.stoptSimulation()
            alert('The fire was extinguished')
            return
        }

        burningTrees.forEach((coords) => {
            let x = coords[0]
            let y = coords[1]

            //can fire down
            if (x + 1 < NX && copyOfForest[x + 1][y] < 11 && probability(this.state.probability + (this.state.wind === 's' ? this.state.windProbability : 0))) {
                copyOfForest[x + 1][y] = randFire()
            }
            //can fire up
            if (x - 1 >= 0 && copyOfForest[x - 1][y] < 11 && probability(this.state.probability + (this.state.wind === 'n' ? this.state.windProbability : 0))) {
                copyOfForest[x - 1][y] = randFire()
            }
            //can fire right
            if (y + 1 < NY && copyOfForest[x][y + 1] < 11 && probability(this.state.probability + (this.state.wind === 'e' ? this.state.windProbability : 0))) {
                copyOfForest[x][y + 1] = randFire()
            }
            //can fire left
            if (y - 1 >= 0 && copyOfForest[x][y - 1] < 11 && probability(this.state.probability + (this.state.wind === 'w' ? this.state.windProbability : 0))) {
                copyOfForest[x][y - 1] = randFire()
            }

            //can fire down and right
            if (this.state.moore && x + 1 < NX && y + 1 < NY && copyOfForest[x + 1][y + 1] < 11 && probability(this.state.probability)) {
                copyOfForest[x + 1][y + 1] = randFire()
            }
            //can fire up and left
            if (this.state.moore && x - 1 >= 0 && y - 1 >= 0 && copyOfForest[x - 1][y - 1] < 11 && probability(this.state.probability)) {
                copyOfForest[x - 1][y - 1] = randFire()
            }
            //can fire down and left
            if (this.state.moore && x + 1 < NX && y - 1 >= 0 && copyOfForest[x + 1][y - 1] < 11 && probability(this.state.probability)) {
                copyOfForest[x + 1][y - 1] = randFire()
            }
            //can fire up and right
            if (this.state.moore && y + 1 < NY && x - 1 >= 0 && copyOfForest[x - 1][y + 1] < 11 && probability(this.state.probability)) {
                copyOfForest[x - 1][y + 1] = randFire()
            }
        })

        //turn burning trees into burned trees
        burningTrees.forEach((coords) => {
            let x = coords[0]
            let y = coords[1]
            copyOfForest[x][y] = probability(this.state.probability) ? randBurnedTree() : copyOfForest[x][y];
        })

        //swap the forest
        this.setState({ ...this.state, forest: copyOfForest })
    }

    startSimulation() {
        this.setState({ ...this.state, forestOnFire: setInterval(this.burn, 50) })
    }

    stoptSimulation() {
        if (this.state.forestOnFire) {
            clearInterval(this.state.forestOnFire)
            this.setState({ ...this.state, forestOnFire: null })
        }
    }

    newSimulation() {
        this.stoptSimulation()
        this.setState({ ...this.state, forest: this.createForest(), iterations: -1 })
    }

    addFire() {
        this.setState({ ...this.state, forest: this.fireRandomTree(this.state.forest) })
    }

    onFireProbabilityChange(value: number) {
        this.setState({ ...this.state, probability: value })
    }

    onWindProbabilityChange(value: number) {
        this.setState({ ...this.state, windProbability: value })
    }

    onIterationsChange(v: string) {
        const num = Number(v)
        this.setState({ ...this.state, iterations: isNaN(num) ? -1 : num })
    }

    onWindChange(v: string) {
        this.setState({ ...this.state, wind: v })
    }

    onNeighborhoodChange() {
        this.setState({ ...this.state, moore: !this.state.moore })
    }

    onLakeChange() {
        this.setState({ ...this.state, lake: !this.state.lake })
    }

    onMenuStateChange() {
        this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen })
    }

    render() {
        return (
            <div className="App">
                <div className={style.menu}>
                    {this.state.isMenuOpen ?
                        <div className={style.menucontainer}>
                            <div onClick={this.onMenuStateChange.bind(this)} className={style.icon}>x</div>
                            <label>
                                Iterations
                                <input type="text" value={this.state.iterations} onChange={(event) => this.onIterationsChange(event.target.value)} />
                            </label>
                            <label>
                                With lake
                                <button onClick={() => this.onLakeChange()} >{this.state.lake ? "Yes" : "No"}</button>
                            </label>
                            <label>
                                Fire probability
                                <input type="range" min={0.1} max={1} step={0.1} value={this.state.probability} onChange={(event) => this.onFireProbabilityChange(Number(event.target.value))} />
                                {this.state.probability}
                            </label>
                            <label>
                                Current neighborhood
                                <button onClick={() => this.onNeighborhoodChange()} >{this.state.moore ? "Moore" : "Von Neumann"}</button>
                            </label>
                            <label>
                                Wind
                                <button className={`${this.state.wind === 'n' && style.active}`} onClick={() => this.onWindChange('n')} >^</button>
                                <button className={`${this.state.wind === 's' && style.active}`} onClick={() => this.onWindChange('s')} >v</button>
                                <button className={`${this.state.wind === 'w' && style.active}`} onClick={() => this.onWindChange('w')} >{'<'}</button>
                                <button className={`${this.state.wind === 'e' && style.active}`} onClick={() => this.onWindChange('e')} >{'>'}</button>
                                <button className={`${this.state.wind === '' && style.active}`} onClick={() => this.onWindChange('')} >None</button>
                            </label>
                            <label>
                                Wind force
                                <input type="range" min={0} max={1} step={0.1} value={this.state.windProbability} onChange={(event) => this.onWindProbabilityChange(Number(event.target.value))} />
                                {this.state.windProbability}
                            </label>
                            <label>
                                <button onClick={this.startSimulation.bind(this)}>START</button>
                                <button onClick={this.stoptSimulation.bind(this)}>PAUSE</button>
                                <button onClick={this.newSimulation.bind(this)}>NEW</button>
                                <button onClick={this.addFire.bind(this)}>ADD FIRE</button>
                            </label>
                        </div>
                        :
                        <div className={style.menucontainer}>
                            MENU<div onClick={this.onMenuStateChange.bind(this)} className={style.icon}>^</div>
                        </div>}
                </div>
                <Board board={this.state.forest} cellSide={5} />
            </div>
        )
    }
}

export default AppClass