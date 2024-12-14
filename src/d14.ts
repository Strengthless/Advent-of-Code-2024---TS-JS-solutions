import { readFileSync } from 'node:fs'

// Type definitions
type Robot = {
    position: number[]
    velocity: number[]
}

type Grid = string[][]

// Main body
const input = readFileSync('inputs/d14.txt', 'utf-8').trim()

const robots: Robot[] = input.split('\n').map(line => {
    const [position, velocity] = line
        .split(' ')
        .map(e => e.slice(2).split(',').map(Number))
    return { position, velocity }
})

const mapWidth = 101
const mapHeight = 103

// Part 1
const finalPositions = new Map<string, number>()

robots.forEach(robot => {
    const [finalX, finalY] = getFinalPosition(robot, 100)
    const prevCount = finalPositions.get(`${finalX},${finalY}`) || 0
    finalPositions.set(`${finalX},${finalY}`, prevCount + 1)
})

const middleX = Math.floor(mapWidth / 2)
const middleY = Math.floor(mapHeight / 2)

const quadrants = [0, 0, 0, 0]

finalPositions.forEach((count, position) => {
    if (position.startsWith(`${middleX},`) || position.endsWith(`,${middleY}`))
        return
    const [x, y] = position.split(',').map(Number)
    const quadIndex = x < middleX ? (y < middleY ? 0 : 1) : y < middleY ? 2 : 3
    quadrants[quadIndex] += count
})

console.log(quadrants.reduce((a, b) => a * b, 1))

// Part 2
let seconds = 0
let maxAdjacency = 1
const secondsLimit = 100000

while (seconds < secondsLimit) {
    const currentGrid = initGrid(mapWidth, mapHeight)

    let robotsCollided = false

    for (const robot of robots) {
        const [finalX, finalY] = getFinalPosition(robot, seconds)
        const isLocationOccupied = currentGrid[finalY][finalX] === '#'
        if (isLocationOccupied) {
            robotsCollided = true
            break
        }
        currentGrid[finalY][finalX] = '#'
    }

    if (!robotsCollided) {
        const adjacency = getAdjacency(currentGrid, mapWidth, mapHeight)
        if (adjacency > maxAdjacency) {
            maxAdjacency = adjacency
            printGrid(currentGrid)
            console.log(`Seconds:`, seconds)
            console.log(`Adjacency:`, adjacency)
        }
    }

    seconds++
}

console.log(`Computed up to ${secondsLimit} seconds. Do you see a tree yet?`)

// Helper functions
function initGrid(mapWidth: number, mapHeight: number) {
    const grid = new Array(mapHeight)
        .fill(null)
        .map(() => new Array(mapWidth).fill('.'))
    return grid
}

function getFinalPosition(robot: Robot, seconds: number) {
    const [x, y] = robot.position
    const [dx, dy] = robot.velocity
    const finalX = (((x + seconds * dx) % mapWidth) + mapWidth) % mapWidth
    const finalY = (((y + seconds * dy) % mapHeight) + mapHeight) % mapHeight
    return [finalX, finalY]
}

function getAdjacency(grid: Grid, mapWidth: number, mapHeight: number) {
    const gridClone = structuredClone(grid)
    let maxAdjacency = 0
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (gridClone[y][x] !== '#') continue
            const adjacency = floodFill(gridClone, x, y)
            maxAdjacency = Math.max(maxAdjacency, adjacency)
        }
    }
    return maxAdjacency
}

function floodFill(grid: Grid, x: number, y: number): number {
    if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) return 0
    if (grid[y][x] !== '#') return 0

    grid[y][x] = '.'

    return (
        1 +
        floodFill(grid, x + 1, y) +
        floodFill(grid, x - 1, y) +
        floodFill(grid, x, y + 1) +
        floodFill(grid, x, y - 1)
    )
}

function printGrid(grid: Grid) {
    const gridString = grid.map(row => row.join('')).join('\n')
    console.log(gridString)
}
