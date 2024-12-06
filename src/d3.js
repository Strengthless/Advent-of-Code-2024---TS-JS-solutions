const input = document.querySelector('body').innerText
// const input = `<REDACTED>`

const mulRe = new RegExp(/mul\(([0-9]*),([0-9]*)\)/gm)
const doRe = new RegExp(/do\(\)/gm)
const dontRe = new RegExp(/don't\(\)/gm)

// Part 1
const matches = [...input.matchAll(mulRe)]
const products = matches.map(match => match[1] * match[2])
const sum = products.reduce((a, b) => a + b, 0)
console.log(sum)

// Part 2
const instructions = [mulRe, doRe, dontRe]
    .map(re => [...input.matchAll(re)])
    .flat()
    .toSorted((a, b) => a.index - b.index)

const parsedInstructions = instructions.map(instruction => {
    if (instruction[0].startsWith('mul')) {
        return instruction[1] * instruction[2]
    } else if (instruction[0].startsWith('don')) {
        return 'dont'
    } else {
        return 'do'
    }
})

let shouldSum = true
let improvedSum = 0

parsedInstructions.forEach(instruction => {
    switch (instruction) {
        case 'dont':
            shouldSum = false
            break
        case 'do':
            shouldSum = true
            break
        default:
            if (shouldSum) improvedSum += instruction
    }
})

console.log(improvedSum)
