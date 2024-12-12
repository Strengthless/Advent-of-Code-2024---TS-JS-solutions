import { readFileSync } from 'node:fs'

// Type definitions
type Region = {
    plant: string
    area: number
    perimeter: number
    sides: number
    edges: Location[]
}

type Location = {
    x: number
    y: number
    direction: Direction
}

type Direction = 'N' | 'E' | 'S' | 'W'

// Main body
const input = readFileSync('inputs/d12.txt', 'utf-8').trim()

const farm = input.split('\n').map(line => line.split(''))
const [farmWidth, farmHeight] = getMapSize(farm)

// Part 1
const regions: Region[] = []

for (let y = 0; y < farmHeight; y++) {
    for (let x = 0; x < farmWidth; x++) {
        const plant = farm[y][x]
        if (plant === plant.toLowerCase()) continue
        const region = { plant, area: 0, perimeter: 0, sides: 0, edges: [] }
        dfs(farm, x, y, region)
        regions.push(region)
    }
}

console.log(
    regions
        .map(region => region.area * region.perimeter)
        .reduce((a, b) => a + b, 0),
)

// Part 2
regions.forEach(region => {
    const northEdges = getDirectionalEdgeSet(region.edges, 'N')
    const southEdges = getDirectionalEdgeSet(region.edges, 'S')
    const eastEdges = getDirectionalEdgeSet(region.edges, 'E')
    const westEdges = getDirectionalEdgeSet(region.edges, 'W')

    // Merge edges into sides
    mergeHorizontalEdges(northEdges)
    mergeHorizontalEdges(southEdges)
    mergeVerticalEdges(eastEdges)
    mergeVerticalEdges(westEdges)

    region.sides =
        northEdges.size + southEdges.size + eastEdges.size + westEdges.size
})

console.log(
    regions
        .map(region => region.area * region.sides)
        .reduce((a, b) => a + b, 0),
)

// Helper functions
function getMapSize(map: string[][]) {
    return [map[0].length, map.length]
}

function dfs(map: string[][], x: number, y: number, region: Region) {
    const [mapWidth, mapHeight] = getMapSize(map)
    if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return
    if (map[y][x] !== region.plant) return

    // For part 1
    const visitedSymbol = region.plant.toLowerCase()
    map[y][x] = visitedSymbol
    region.area++

    const visitedNeighbors = countVisitedNeighbors(map, x, y, region.plant)
    if (visitedNeighbors === 0) region.perimeter += 4
    if (visitedNeighbors === 1) region.perimeter += 2
    if (visitedNeighbors === 3) region.perimeter -= 2
    if (visitedNeighbors === 4) region.perimeter -= 4

    // Added in part 2
    const edges = getEdges(map, x, y, region.plant)
    region.edges.push(...edges)

    dfs(map, x + 1, y, region)
    dfs(map, x - 1, y, region)
    dfs(map, x, y + 1, region)
    dfs(map, x, y - 1, region)
}

function countVisitedNeighbors(
    map: string[][],
    x: number,
    y: number,
    plant: string,
) {
    const [mapWidth, mapHeight] = getMapSize(map)
    const visitedSymbol = plant.toLowerCase()
    let count = 0
    if (x > 0 && map[y][x - 1] === visitedSymbol) count++
    if (x < mapWidth - 1 && map[y][x + 1] === visitedSymbol) count++
    if (y > 0 && map[y - 1][x] === visitedSymbol) count++
    if (y < mapHeight - 1 && map[y + 1][x] === visitedSymbol) count++
    return count
}

function getEdges(map: string[][], x: number, y: number, plant: string) {
    const [mapWidth, mapHeight] = getMapSize(map)
    const edges: Location[] = []

    // We basically check the four directions from current cell.
    // If the next cell is not the same plant (or does not have plant), we add an edge.
    if (x === 0 || (x > 0 && !caseInsensitiveEqual(map[y][x - 1], plant)))
        edges.push({ x, y, direction: 'W' })

    if (
        x === mapWidth - 1 ||
        (x < mapWidth - 1 && !caseInsensitiveEqual(map[y][x + 1], plant))
    )
        edges.push({ x, y, direction: 'E' })

    if (y === 0 || (y > 0 && !caseInsensitiveEqual(map[y - 1][x], plant)))
        edges.push({ x, y, direction: 'N' })

    if (
        y === mapHeight - 1 ||
        (y < mapHeight - 1 && !caseInsensitiveEqual(map[y + 1][x], plant))
    )
        edges.push({ x, y, direction: 'S' })

    return edges
}

function caseInsensitiveEqual(a: string, b: string) {
    return a.toLowerCase() === b.toLowerCase()
}

function mergeVerticalEdges(edges: Set<string>) {
    edges.forEach(edge => {
        const [x, y] = edge.split(',').map(Number)
        let searchPtr = y
        // Search up
        while (edges.has(`${x},${searchPtr - 1}`)) {
            edges.delete(`${x},${searchPtr - 1}`)
            searchPtr--
        }
        // Search down
        searchPtr = y
        while (edges.has(`${x},${searchPtr + 1}`)) {
            edges.delete(`${x},${searchPtr + 1}`)
            searchPtr++
        }
    })
}

function mergeHorizontalEdges(edges: Set<string>) {
    edges.forEach(edge => {
        const [x, y] = edge.split(',').map(Number)
        let searchPtr = x
        // Search left
        while (edges.has(`${searchPtr - 1},${y}`)) {
            edges.delete(`${searchPtr - 1},${y}`)
            searchPtr--
        }
        // Search right
        searchPtr = x
        while (edges.has(`${searchPtr + 1},${y}`)) {
            edges.delete(`${searchPtr + 1},${y}`)
            searchPtr++
        }
    })
}

function getDirectionalEdgeSet(edges: Location[], direction: Direction) {
    return new Set(
        edges.filter(e => e.direction === direction).map(e => `${e.x},${e.y}`),
    )
}
