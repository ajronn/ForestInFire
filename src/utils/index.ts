//calculate the probability
export const probability = (n: number) => Math.random() <= n;
//select a tree style
export const randTree = () => Math.floor(Math.random() * (10 - 1)) + 1;
//select a fire style
export const randFire = () => Math.floor(Math.random() * (11 - 14)) + 14;
//select a burned tree style
export const randBurnedTree = () => Math.floor(Math.random() * (14 - 17)) + 17;
//select a water style
export const randWater = () => Math.floor(Math.random() * (17 - 21)) + 21;

//copy array without binding
export const copy = (arr: number[][]) => {
    const copy = new Array(arr.length)
    for (let i = 0; i < copy.length; i++) {
        copy[i] = new Array(arr[0].length)
    }

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            copy[i][j] = arr[i][j]
        }
    }

    return copy
}

//generate lake
export const addLake = (arr: number[][]): number[][] => {
    const WATER_PROBABILITY = 0.01;
    const DIR_PROBABILITY = 0.01;
    const NX = arr.length
    const NY = arr[0].length
    let x = Math.floor(Math.random() * (NX - 1))
    let y = Math.floor(Math.random() * (NY - 1))

    arr[x][y] = randWater()

    const direction = Math.floor(Math.random() * (4)) + 1;
    const iters = Math.floor(Math.random() * (500)) + 50;
    for (let u = 0; u < iters; u++) {
        const water = [] //current trees on fire
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (arr[i][j] > 16) {
                    water.push([i, j])
                }
            }
        }

        water.forEach((coords) => {
            let x = coords[0]
            let y = coords[1]

            //can water down
            if (x + 1 < NX && arr[x + 1][y] < 11 && probability(WATER_PROBABILITY + (direction === 1 ? DIR_PROBABILITY : 0))) {
                arr[x + 1][y] = randWater()
            }
            //can water up
            if (x - 1 >= 0 && arr[x - 1][y] < 11 && probability(WATER_PROBABILITY + (direction === 2 ? DIR_PROBABILITY : 0))) {
                arr[x - 1][y] = randWater()
            }
            //can water right
            if (y + 1 < NY && arr[x][y + 1] < 11 && probability(WATER_PROBABILITY + (direction === 3 ? DIR_PROBABILITY : 0))) {
                arr[x][y + 1] = randWater()
            }
            //can water left
            if (y - 1 >= 0 && arr[x][y - 1] < 11 && probability(WATER_PROBABILITY + (direction === 4 ? DIR_PROBABILITY : 0))) {
                arr[x][y - 1] = randWater()
            }

            //can fire down and right
            if (x + 1 < NX && y + 1 < NY && arr[x + 1][y + 1] < 11 && probability(WATER_PROBABILITY + ([1, 3].includes(direction) ? DIR_PROBABILITY : 0))) {
                arr[x + 1][y + 1] = randWater()
            }
            //can fire up and left
            if (x - 1 >= 0 && y - 1 >= 0 && arr[x - 1][y - 1] < 11 && probability(WATER_PROBABILITY + ([2, 4].includes(direction) ? DIR_PROBABILITY : 0))) {
                arr[x - 1][y - 1] = randWater()
            }
            //can fire down and left
            if (x + 1 < NX && y - 1 >= 0 && arr[x + 1][y - 1] < 11 && probability(WATER_PROBABILITY + ([4, 1].includes(direction) ? DIR_PROBABILITY : 0))) {
                arr[x + 1][y - 1] = randWater()
            }
            //can fire up and right
            if (y + 1 < NY && x - 1 >= 0 && arr[x - 1][y + 1] < 11 && probability(WATER_PROBABILITY + ([3, 2].includes(direction) ? DIR_PROBABILITY : 0))) {
                arr[x - 1][y + 1] = randWater()
            }
        })
    }

    return arr;
}