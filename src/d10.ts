import { readFileSync } from 'node:fs'

const input = readFileSync('inputs/d10.txt', 'utf-8').trim()
const map = input.split('\n').map(line => line.split('').map(Number))
const [mapWidth, mapHeight] = getMapSize(map)

// Part 1
let totalScore = 0
for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
        const point = map[y][x]
        if (point !== 0) continue
        const mapCopy = structuredClone(map)
        const score = dfs_unique_dest(mapCopy, x, y, 0)
        totalScore += score
    }
}

console.log(totalScore)

// Part 2
let totalRating = 0
for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
        const point = map[y][x]
        if (point !== 0) continue
        const mapCopy = structuredClone(map)
        const score = dfs_unique_path(mapCopy, x, y, 0)
        totalRating += score
    }
}

console.log(totalRating)

// Helper functions
function getMapSize(map: number[][]) {
    return [map[0].length, map.length]
}

function dfs_unique_dest(map: number[][], x: number, y: number, num: number) {
    const [mapWidth, mapHeight] = getMapSize(map)
    if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return 0
    if (map[y][x] !== num) return 0
    if (num === 9) {
        map[y][x] = -1
        return 1
    }
    let score = 0
    score += dfs_unique_dest(map, x + 1, y, num + 1)
    score += dfs_unique_dest(map, x - 1, y, num + 1)
    score += dfs_unique_dest(map, x, y + 1, num + 1)
    score += dfs_unique_dest(map, x, y - 1, num + 1)
    return score
}

function dfs_unique_path(map: number[][], x: number, y: number, num: number) {
    const [mapWidth, mapHeight] = getMapSize(map)
    if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) return 0
    if (map[y][x] !== num) return 0
    if (num === 9) return 1
    let score = 0
    score += dfs_unique_path(map, x + 1, y, num + 1)
    score += dfs_unique_path(map, x - 1, y, num + 1)
    score += dfs_unique_path(map, x, y + 1, num + 1)
    score += dfs_unique_path(map, x, y - 1, num + 1)
    return score
}
