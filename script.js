//tools
function probability(n) {
    return Math.random() <= n;
}

function randTree() {
    return Math.floor(Math.random() * (10 - 1)) + 1;
}

function randFire() {
    return Math.floor(Math.random() * (11 - 14)) + 14;
}

function randBurnedTree() {
    return Math.floor(Math.random() * (14 - 17)) + 17;
}

function randWater() {
    return Math.floor(Math.random() * (17 - 21)) + 21;
}

function copyOfForest() {
    const copy = new Array(nx)
    for (let i = 0; i < copy.length; i++) {
        copy[i] = new Array(ny)
    }

    for (let i = 0; i < forest.length; i++) {
        for (let j = 0; j < forest[i].length; j++) {
            copy[i][j] = forest[i][j]
        }
    }

    return copy
}
//tools

//forest size
const nx = 150
const ny = 300

//moore's neighborhood
let moore = false
//probability of a fire
let PROBABILITY = 0.2

//init forest
const forest = new Array(nx)
for (let i = 0; i < forest.length; i++) {
    forest[i] = new Array(ny)
}

//fill forest
for (let i = 0; i < forest.length; i++) {
    for (let j = 0; j < forest[i].length; j++) {
        forest[i][j] = this.randTree()
    }
}

//generate lake
let water_x = Math.floor(Math.random() * (nx - 1))
let water_y = Math.floor(Math.random() * (ny - 1))
forest[water_x][water_y] = this.randWater()

for (let u = 0; u < 100; u++) {
    const water = []
    for (let i = 0; i < forest.length; i++) {
        for (let j = 0; j < forest[i].length; j++) {
            if (forest[i][j] > 16) {
                water.push([i, j])
            }
        }
    }

    water.forEach((coords) => {
        let x = coords[0]
        let y = coords[1]
        if (x + 1 < nx && probability(PROBABILITY)) {
            forest[x + 1][y] = this.randWater()
        }
        if (x - 1 >= 0 && probability(PROBABILITY)) {
            forest[x - 1][y] = this.randWater()
        }
        if (y + 1 < ny && probability(PROBABILITY)) {
            forest[x][y + 1] = this.randWater()
        }
        // if (y - 1 >= 0 && probability(PROBABILITY)) {
        //     forest[x][y - 1] = this.randWater()
        // }
    })

}

//for draw
const cellSide = 5;
const canvas = document.getElementById('canvas');
canvas.width = ny * cellSide;
canvas.height = nx * cellSide;
const ctx = canvas.getContext("2d")
const colorMap = [
    '#80ff80',
    '#4dff4d',
    '#1aff1a',
    '#00e600',
    '#00e600',
    '#00cc00',
    '#00b300',
    '#009900',
    '#009900',
    '#008000',
    '#006600',
    '#ff0000',
    '#e60000',
    '#990000',
    '#666666',
    '#404040',
    '#000000',
    '#0040ff',
    '#0039e6',
    '#0033cc',
    '#002db3']

//for draw
function draw(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let x = j * cellSide;
            let y = i * cellSide;
            ctx.beginPath();
            ctx.fillStyle = colorMap[board[i][j]];
            ctx.fillRect(x, y, cellSide, cellSide);
        }
    }
}

//core
function burn() {
    const burningTrees = []
    for (let i = 0; i < forest.length; i++) {
        for (let j = 0; j < forest[i].length; j++) {
            if (forest[i][j] >= 11 && forest[i][j] <= 13) {
                burningTrees.push([i, j])
            }
        }
    }

    burningTrees.forEach((coords) => {
        let x = coords[0]
        let y = coords[1]

        if (x + 1 < nx && forest[x + 1][y] < 11 && probability(PROBABILITY)) {
            forest[x + 1][y] = this.randFire()
        }
        if (x - 1 >= 0 && forest[x - 1][y] < 11 && probability(PROBABILITY)) {
            forest[x - 1][y] = this.randFire()
        }
        if (y + 1 < ny && forest[x][y + 1] < 11 && probability(PROBABILITY)) {
            forest[x][y + 1] = this.randFire()
        }
        if (y - 1 >= 0 && forest[x][y - 1] < 11 && probability(PROBABILITY)) {
            forest[x][y - 1] = this.randFire()
        }

        if (moore && x + 1 < nx && y + 1 < ny && forest[x + 1][y + 1] < 11 && probability(PROBABILITY)) {
            forest[x + 1][y + 1] = this.randFire()
        }
        if (moore && x - 1 >= 0 && y - 1 >= 0 && forest[x - 1][y - 1] < 11 && probability(PROBABILITY)) {
            forest[x - 1][y - 1] = this.randFire()
        }
        if (moore && x + 1 < nx && y - 1 >= 0 && forest[x + 1][y - 1] < 11 && probability(PROBABILITY)) {
            forest[x + 1][y - 1] = this.randFire()
        }
        if (moore && y + 1 < ny && x - 1 >= 0 && forest[x - 1][y + 1] < 11 && probability(PROBABILITY)) {
            forest[x - 1][y + 1] = this.randFire()
        }
    })

    burningTrees.forEach((coords) => {
        let x = coords[0]
        let y = coords[1]
        forest[x][y] = this.probability(PROBABILITY) ? this.randBurnedTree() : forest[x][y];
    })

    this.draw(copyOfForest())

}
let myInterval;
function startSimulation() {
    forest[x][y] = this.randFire()
    myInterval = setInterval(burn, 50);
    document.getElementById("stopBtn").disabled = false;
    document.getElementById("startBtn").disabled = true;
}

function stopSimulation() {
    clearInterval(myInterval);
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
}

//start fire
let x = Math.floor(Math.random() * (nx - 1))
let y = Math.floor(Math.random() * (ny - 1))
while (forest[x][y] > 16) {
    x = Math.floor(Math.random() * (nx - 1))
    y = Math.floor(Math.random() * (ny - 1))
}


//view
function onChange() {
    const v = document.getElementById('fireProbability').value;
    document.getElementById('fireProbabilityText').value = v;
    PROBABILITY = v
}
function onNeighborhoodChange() {
    const v = document.getElementById('neighborhood').value;
    moore = v
}
this.onChange()
document.getElementById("startBtn").disabled = false;
document.getElementById("stopBtn").disabled = true;

