import { readFileSync } from 'node:fs'

const input = readFileSync('inputs/d8.txt', 'utf-8').trim()
const inputWidth = input.indexOf('\n') + 1

// Populate the antenna map
const antennaMap = new Map<string, { x: number; y: number }[]>()
input.split('').forEach((char, index) => {
    if (char === '.' || char === '\n') return
    const x = index % inputWidth
    const y = Math.floor(index / inputWidth)
    if (!antennaMap.has(char)) antennaMap.set(char, [])
    antennaMap.get(char)!.push({ x, y })
})

// Part 1
const antiNodes = new Set()
const maxX = inputWidth - 2
const maxY = input.split('\n').length - 1

antennaMap.forEach(antennas => {
    for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
            const [a, b] = [antennas[i], antennas[j]]
            const dx = b.x - a.x
            const dy = b.y - a.y
            const [c, d] = [
                { x: b.x + dx, y: b.y + dy },
                { x: a.x - dx, y: a.y - dy },
            ]
            if (isWithinBounds(c)) antiNodes.add(`${c.x},${c.y}`)
            if (isWithinBounds(d)) antiNodes.add(`${d.x},${d.y}`)
        }
    }
})

console.log(antiNodes.size)

// Part 2
antennaMap.forEach(antennas => {
    for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
            const [a, b] = [antennas[i], antennas[j]]
            const dx = b.x - a.x
            const dy = b.y - a.y
            // Use one of the antennas as base, add it to the list
            // of antinodes, then travel in both directions
            antiNodes.add(`${b.x},${b.y}`)
            for (const sign of [-1, 1]) {
                let x = b.x + dx * sign
                let y = b.y + dy * sign
                while (isWithinBounds({ x, y })) {
                    antiNodes.add(`${x},${y}`)
                    x += dx * sign
                    y += dy * sign
                }
            }
        }
    }
})

console.log(antiNodes.size)

// Helper functions
function isWithinBounds({ x, y }: { x: number; y: number }) {
    return x >= 0 && x <= maxX && y >= 0 && y <= maxY
}
