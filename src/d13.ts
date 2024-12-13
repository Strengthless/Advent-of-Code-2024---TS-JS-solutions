import { readFileSync } from 'node:fs'

// Type definitions
type Button = {
    dx: number
    dy: number
}

type Prize = {
    x: number
    y: number
}

type ClawMachine = {
    buttonA: Button
    buttonB: Button
    prize: Prize
    minCost: number
}

// Main body
const input = readFileSync('inputs/d13.txt', 'utf-8').trim()

const clawMachines: ClawMachine[] = input.split('\n\n').map(sec => {
    const buttonRegex = new RegExp(/X\+([0-9]+), Y\+([0-9]+)/gm)
    const prizeRegex = new RegExp(/X=([0-9]+), Y=([0-9]+)/gm)
    const buttons = [...sec.matchAll(buttonRegex)]
    const prize = prizeRegex.exec(sec)
    if (buttons.length !== 2 || !prize) throw new Error('Invalid input')
    return {
        buttonA: { dx: parseInt(buttons[0][1]), dy: parseInt(buttons[0][2]) },
        buttonB: { dx: parseInt(buttons[1][1]), dy: parseInt(buttons[1][2]) },
        prize: { x: parseInt(prize[1]), y: parseInt(prize[2]) },
        minCost: Infinity,
    }
})

const buttonACost = 3
const buttonBCost = 1

// Part 1
clawMachines.forEach(machine => {
    let minCost = Infinity
    for (let a = 0; a < 100; a++) {
        for (let b = 0; b < 100; b++) {
            const x = a * machine.buttonA.dx + b * machine.buttonB.dx
            const y = a * machine.buttonA.dy + b * machine.buttonB.dy
            if (x !== machine.prize.x || y !== machine.prize.y) continue
            const cost = a * buttonACost + b * buttonBCost
            if (cost < minCost) {
                minCost = cost
            }
        }
    }
    machine.minCost = minCost
})

console.log(
    clawMachines
        .map(machine => machine.minCost)
        .filter(c => c !== Infinity)
        .reduce((a, b) => a + b, 0),
)

// Part 2
const newClawMachines = clawMachines.map(machine => {
    const newMachine = { ...machine }
    newMachine.prize.x += 10000000000000
    newMachine.prize.y += 10000000000000
    newMachine.minCost = Infinity
    return newMachine
})

newClawMachines.forEach(machine => {
    const { buttonA, buttonB, prize } = machine
    const solution = solve_simult_linear_equations(
        buttonA.dx,
        buttonB.dx,
        prize.x,
        buttonA.dy,
        buttonB.dy,
        prize.y,
    )

    if (!solution) return
    if (solution.x < 0 || solution.y < 0) return
    if (!Number.isInteger(solution.x) || !Number.isInteger(solution.y)) return

    machine.minCost = solution.x * buttonACost + solution.y * buttonBCost
})

console.log(
    newClawMachines
        .map(machine => machine.minCost)
        .filter(c => c !== Infinity)
        .reduce((a, b) => a + b, 0),
)

// Helper functions
function solve_simult_linear_equations(
    a1: number,
    b1: number,
    c1: number,
    a2: number,
    b2: number,
    c2: number,
) {
    const det = a1 * b2 - a2 * b1
    if (det === 0) return null
    const x = (c1 * b2 - c2 * b1) / det
    const y = (a1 * c2 - a2 * c1) / det
    return { x, y }
}
