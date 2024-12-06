import { readFileSync } from 'node:fs'

// Type definitions
type Guard = {
    x: number
    y: number
    direction: Direction
    steps: number
}

enum Direction {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3,
}

type Map = string[][]
type Input = string

const GuardSymbol = '^'
const ObstacleSymbol = '#'
const PathSymbol = 'X'

// Main body
const input = readFileSync('inputs/d6.txt', 'utf-8').trim()

// Part 1
const map = initializeMap(input)
const guard = initializeGuard(input)

while (hasNextMove(guard, map)) {
    if (needsToTurn(guard, map)) {
        turnDirection(guard)
        continue
    }
    updateGuardAndMap(guard, map)
}

console.log(getPathLength(map))

// Part 2 - Brute force
const mutatedMaps = getMapMutations(input, map)
const [mapWidth, mapHeight] = getMapSize(mutatedMaps[0])
const maxPathLength = mapWidth * mapHeight
let goodMaps = 0

for (const mutatedMap of mutatedMaps) {
    const guard = initializeGuard(input)

    while (hasNextMove(guard, mutatedMap)) {
        if (loopDetected(guard, maxPathLength)) break
        if (needsToTurn(guard, mutatedMap)) {
            turnDirection(guard)
            continue
        }
        updateGuardAndMap(guard, mutatedMap)
    }

    if (loopDetected(guard, maxPathLength)) goodMaps++
}

console.log(goodMaps)

// Helper functions
function initializeGuard(input: Input) {
    const [guardX, guardY] = getStartingPoint(input)
    const guard = {
        x: guardX,
        y: guardY,
        direction: Direction.UP,
        steps: 0,
    }
    return guard
}

function initializeMap(input: Input) {
    const map = input.split('\n').map(row => row.split(''))
    return map
}

function getStartingPoint(input: Input) {
    const startingIndex = input.indexOf(GuardSymbol)
    const inputWidth = input.indexOf('\n') + 1
    const targetWidth = startingIndex % inputWidth
    const targetHeight = Math.floor(startingIndex / inputWidth)
    return [targetWidth, targetHeight]
}

function hasNextMove(guard: Guard, map: Map) {
    const [nextX, nextY] = getNextMoveIgnoringObstacles(guard)
    if (isOutOfBounds(nextX, nextY, map)) return false
    return true
}

function turnDirection(guard: Guard) {
    guard.direction = (guard.direction + 1) % 4
}

function updateGuardAndMap(guard: Guard, map: Map) {
    const { x, y } = guard
    map[y][x] = PathSymbol

    const [nextX, nextY] = getNextMoveIgnoringObstacles(guard)
    guard.x = nextX
    guard.y = nextY
    map[nextY][nextX] = GuardSymbol

    guard.steps++
}

function getNextMoveIgnoringObstacles(guard: Guard) {
    const { x, y, direction } = guard
    switch (direction) {
        case Direction.UP:
            return [x, y - 1]
        case Direction.RIGHT:
            return [x + 1, y]
        case Direction.DOWN:
            return [x, y + 1]
        case Direction.LEFT:
            return [x - 1, y]
    }
}

function needsToTurn(guard: Guard, map: Map) {
    const [nextX, nextY] = getNextMoveIgnoringObstacles(guard)
    return map[nextY][nextX] === ObstacleSymbol
}

function isOutOfBounds(x: number, y: number, map: Map) {
    const [mapWidth, mapHeight] = getMapSize(map)
    return x < 0 || y < 0 || x >= mapWidth || y >= mapHeight
}

function getMapSize(map: Map) {
    const mapWidth = map[0].length
    const mapHeight = map.length
    return [mapWidth, mapHeight]
}

function _printMap(map: Map) {
    const mapString = stringifyMap(map)
    console.log(mapString)
}

function stringifyMap(map: Map) {
    return map.map(row => row.join('')).join('\n')
}

function getPathLength(map: Map) {
    const pathLength = map.flat().filter(isGuardOrPathSymbol).length
    return pathLength
}

function getMapMutations(input: Input, finishedMap: Map) {
    const initialMap = initializeMap(input)
    const [mapWidth, mapHeight] = getMapSize(initialMap)

    const mutatedMaps = []
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            // The new obstacle should only be placed on the path traversed in Part 1.
            // Anywhere else would not alter the guard's new path.
            if (!isGuardOrPathSymbol(finishedMap[y][x])) continue
            const mutatedMap = getMutatedMap(initialMap, x, y)
            mutatedMaps.push(mutatedMap)
        }
    }
    return mutatedMaps
}

function getMutatedMap(map: Map, x: number, y: number) {
    const mutatedMap = structuredClone(map)
    mutatedMap[y][x] = ObstacleSymbol
    return mutatedMap
}

function loopDetected(guard: Guard, maxPathLength: number) {
    return guard.steps > maxPathLength
}

function isGuardOrPathSymbol(cell: string) {
    return cell === GuardSymbol || cell === PathSymbol
}
