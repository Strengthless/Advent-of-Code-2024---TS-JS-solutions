import { readFileSync } from 'node:fs'

const input = readFileSync('inputs/d7.txt', 'utf-8').trim()

const equations = input.split('\n').map(line => {
    const [lhs, rhs] = line.split(': ')
    const result = parseInt(lhs)
    const nums = rhs.split(' ').map(num => parseInt(num))
    return { result, nums }
})

// Part 1 - Brute force
const validEquations = equations.filter(({ result, nums }) => {
    for (let i = 0; i < 2 ** nums.length; i++) {
        let sum = nums[0]
        for (let j = 1; j < nums.length; j++) {
            if (i & (1 << j)) sum += nums[j]
            else sum *= nums[j]
        }
        if (sum === result) return true
    }
    return false
})

console.log(
    validEquations.map(({ result }) => result).reduce((a, b) => a + b, 0),
)

// Part 2 - Brute force again :(
const validEquations2 = equations.filter(({ result, nums }) => {
    for (let i = 0; i < 3 ** nums.length; i++) {
        let sum = nums[0]
        let temp = i
        for (let j = 1; j < nums.length; j++) {
            const operation = temp % 3
            temp = Math.floor(temp / 3)
            if (operation === 0) sum += nums[j]
            else if (operation === 1) sum *= nums[j]
            else sum = parseInt(sum.toString() + nums[j].toString())
        }
        if (sum === result) return true
    }
    return false
})

console.log(
    validEquations2.map(({ result }) => result).reduce((a, b) => a + b, 0),
)
