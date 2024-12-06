const input = document.querySelector('body').innerText
// const input = `<REDACTED>`

const numArrays = parseInput(input)
const indexedNumArrays = numArrays.map(indexArray)

// Part 1
for (const arr of indexedNumArrays) {
    arr.sort((a, b) => a[0] - b[0])
}

const distances = indexedNumArrays[0].map((_, index) =>
    getDistance(indexedNumArrays, index),
)

const totalDistance = distances.reduce((a, b) => a + b, 0)

console.log(totalDistance)

// Part 2
const appearanceMap = new Map()

for (const num of numArrays[1]) {
    const prevCount = appearanceMap.get(num) ?? 0
    appearanceMap.set(num, prevCount + 1)
}

const similarities = numArrays[0].map((_, index) =>
    getSimilarity(numArrays[0], index, appearanceMap),
)

const totalSimilarity = similarities.reduce((a, b) => a + b, 0)

console.log(totalSimilarity)

// Helper functions
function getSimilarity(array, index, appearanceMap) {
    const appearances = appearanceMap.get(array[index]) ?? 0
    return array[index] * appearances
}

function getDistance(arrays, index) {
    return Math.abs(arrays[0][index][0] - arrays[1][index][0])
}

function indexArray(arr) {
    return arr.map((num, index) => [num, index])
}

function parseInput(input) {
    const numbers = input.split('\n').map(row => row.split('   '))

    const firstArray = numbers.map(row => parseInt(row[0])).filter(num => num)
    const secondArray = numbers.map(row => parseInt(row[1])).filter(num => num)

    return [firstArray, secondArray]
}
