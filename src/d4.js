const input = document.querySelector('body').innerText
// const input = `<REDACTED>`

const horizontals = input
const { diagonalStrings, diagonalMaps } = getDiagonals(input)
const verticals = getVerticals(input)

const directionalVariants = [horizontals, ...diagonalStrings, verticals]

// Part 1
let matches1 = 0

for (const direction of directionalVariants) {
    for (const line of getLines(direction)) {
        for (let i = 0; i < line.length; i++) {
            if (line[i] !== 'X') continue
            if (checkForwardMatchPart1(line, i)) matches1++
            if (checkBackwardMatchPart1(line, i)) matches1++
        }
    }
}

console.log(matches1)

// Part 2
let matches2 = 0

const { matrix, columns, rows } = getMatrix(horizontals)

for (let h = 0; h < rows; h++) {
    for (let w = 0; w < columns; w++) {
        const currentChar = matrix[h][w]
        if (currentChar !== 'A') continue
        if (checkMatchPart2(w, h, diagonalMaps, columns)) matches2++
    }
}

console.log(matches2)

// Helper functions
function checkForwardMatchPart1(line, i) {
    if (i + 3 >= line.length) return false
    if (line[i + 1] === 'M' && line[i + 2] === 'A' && line[i + 3] === 'S')
        return true
}

function checkBackwardMatchPart1(line, i) {
    if (i - 3 < 0) return false
    if (line[i - 1] === 'M' && line[i - 2] === 'A' && line[i - 3] === 'S')
        return true
}

function checkMatchPart2(w, h, diagonalMaps, columns) {
    const [mapIndex1, mapIndex2] = getDiagonalMapIndices(w, h)
    const [negDiagonalMap, posDiagonalMap] = diagonalMaps
    const negLine = negDiagonalMap[mapIndex1]
    const posLine = posDiagonalMap[mapIndex2]
    const selectedPosition1 = Math.min(w, h)
    const selectedPosition2 = Math.min(columns - w - 1, h)
    return (
        checkDiagonalMatchPart2(negLine, selectedPosition1) &&
        checkDiagonalMatchPart2(posLine, selectedPosition2)
    )
}

function checkDiagonalMatchPart2(line, position) {
    return (
        checkForwardMatchPart2(line, position) ||
        checkBackwardMatchPart2(line, position)
    )
}

function checkForwardMatchPart2(line, i) {
    if (i - 1 < 0 || i + 1 >= line.length) return false
    if (line[i - 1] === 'M' && line[i + 1] === 'S') return true
    return false
}

function checkBackwardMatchPart2(line, i) {
    if (i - 1 < 0 || i + 1 >= line.length) return false
    if (line[i - 1] === 'S' && line[i + 1] === 'M') return true
    return false
}

function getDiagonals(string) {
    const { matrix, columns, rows } = getMatrix(string)

    const diagonalMap1 = {}
    const diagonalMap2 = {}

    for (let h = 0; h < rows; h++) {
        for (let w = 0; w < columns; w++) {
            const [mapIndex1, mapIndex2] = getDiagonalMapIndices(w, h)
            const currentChar = matrix[h][w]
            safelyPushToMap(diagonalMap1, mapIndex1, currentChar)
            safelyPushToMap(diagonalMap2, mapIndex2, currentChar)
        }
    }

    const diagonalMaps = [diagonalMap1, diagonalMap2]
    const diagonalStrings = getStringsFromDiagonalMaps(diagonalMaps)
    return { diagonalStrings, diagonalMaps }
}

function getStringsFromDiagonalMaps(maps) {
    return maps.map(map => Object.values(map)).map(matrix => getString(matrix))
}

function getDiagonalMapIndices(i, j) {
    return [i - j, i + j]
}

function safelyPushToMap(map, index, value) {
    if (!map[index]) {
        map[index] = []
    }
    map[index].push(value)
}

function getVerticals(string) {
    const { matrix, columns, rows } = getMatrix(string)

    const newMatrix = []

    for (let i = 0; i < columns; i++) {
        const newRow = []
        for (let j = 0; j < rows; j++) {
            newRow.push(matrix[j][i])
        }
        newMatrix.push(newRow)
    }

    return getString(newMatrix)
}

function getMatrixSize(matrix) {
    const columns = matrix[0].length
    const rows = matrix.length

    return { columns, rows }
}

function getMatrix(string) {
    const matrix = string.split('\n').map(row => row.split(''))
    const size = getMatrixSize(matrix)
    return { matrix, ...size }
}

function getString(matrix) {
    const string = matrix.map(row => row.join('')).join('\n')
    return string
}

function getLines(string) {
    const lines = string.split('\n')
    return lines
}
