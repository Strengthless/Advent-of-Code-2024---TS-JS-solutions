import { readFileSync } from 'node:fs'

const input = readFileSync('inputs/d11.txt', 'utf-8').trim()
const originalStones = input.split(' ').map(Number)

// Part 1
const blinks = 35

// Initialize an array for full simulation, this is O(n^2) or even O(2^n).
let stones = originalStones

for (let b = 0; b < blinks; b++) {
    const newStones = []
    for (let i = 0; i < stones.length; i++) {
        if (stones[i] === 0) {
            newStones.push(1)
            continue
        }
        if (stones[i].toString().length % 2 == 0) {
            const stoneString = stones[i].toString()
            const firstHalf = stoneString.slice(0, stoneString.length / 2)
            const secondHalf = stoneString.slice(stoneString.length / 2)
            newStones.push(parseInt(firstHalf))
            newStones.push(parseInt(secondHalf))
            continue
        }
        newStones.push(stones[i] * 2024)
    }
    stones = newStones
}

console.log(stones.length)

// Part 2
const newBlinks = 75

// Initialize a map for simulation, this is close to O(n log n) or even O(n).
// For the 35th blink, we only need to iterate 1118 times.
// Compare this to the 35th blink in part 1, which needs to iterate 8065657 times.
let simulationMap = new Map<number, number>()
originalStones.forEach(stone => {
    const prevCount = simulationMap.get(stone) ?? 0
    simulationMap.set(stone, prevCount + 1)
})

for (let b = 0; b < newBlinks; b++) {
    const prevSimulationMap = new Map(simulationMap)
    const newSimulationMap = new Map<number, number>()
    prevSimulationMap.forEach((count, stone) => {
        if (stone === 0) {
            newSimulationMap.set(1, (newSimulationMap.get(1) ?? 0) + count)
            return
        }
        if (stone.toString().length % 2 == 0) {
            const stoneString = stone.toString()
            const firstHalf = parseInt(
                stoneString.slice(0, stoneString.length / 2),
            )
            const secondHalf = parseInt(
                stoneString.slice(stoneString.length / 2),
            )
            newSimulationMap.set(
                firstHalf,
                (newSimulationMap.get(firstHalf) ?? 0) + count,
            )
            newSimulationMap.set(
                secondHalf,
                (newSimulationMap.get(secondHalf) ?? 0) + count,
            )
            return
        }
        newSimulationMap.set(
            stone * 2024,
            (newSimulationMap.get(stone * 2024) ?? 0) + count,
        )
    })
    simulationMap = newSimulationMap
}

console.log(simulationMap.values().reduce((a, b) => a + b, 0))
