const input = document.querySelector('body').innerText
// const input = `<REDACTED>`

const [section1, section2] = input.split('\n\n')

// Populate ordering rules
const orderingRules = new Map()

section1
    .split('\n')
    .filter(row => row)
    .forEach(row => {
        const [key, value] = row.split('|').map(num => parseInt(num))
        if (!orderingRules.get(key)) {
            orderingRules.set(key, new Set())
        }
        orderingRules.get(key).add(value)
    })

// Populate updates
const updates = section2
    .split('\n')
    .filter(row => row)
    .map(row => row.split(',').map(num => parseInt(num)))

// Part 1
// O(kn^2) calculations, where k is the number of updates, n is the average length
const correctUpdates = updates.filter(update => {
    for (let i = 0; i < update.length; i++) {
        const expectedSuccessors = orderingRules.get(update[i])
        for (let j = i + 1; j < update.length; j++) {
            if (!expectedSuccessors.has(update[j])) {
                return false
            }
        }
    }
    return true
})

console.log(correctUpdates.map(getMid).reduce((a, b) => a + b, 0))

// Part 2
// O(knlogn) calculations, yay!
const incorrectUpdates = updates.filter(
    update => !correctUpdates.includes(update),
)

const correctedUpdates = incorrectUpdates.map(update => {
    const pageNums = new Set(update)
    const numsWithSuccessors = update.map(num => {
        const allSuccessors = orderingRules.get(num)
        const nextSuccessors = allSuccessors.intersection(pageNums)
        return [num, nextSuccessors]
    })
    const correctedNums = numsWithSuccessors
        .toSorted((a, b) => b[1].size - a[1].size)
        .map(nws => nws[0])

    return correctedNums
})

console.log(correctedUpdates.map(getMid).reduce((a, b) => a + b, 0))

// Helper functions
function getMid(arr) {
    return arr[(arr.length / 2) | 0]
}
