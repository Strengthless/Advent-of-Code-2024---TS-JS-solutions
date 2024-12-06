const input = document.querySelector('body').innerText
// const input = `<REDACTED>`

const reports = parseInput(input)

// Part 1
let safeReports = 0

for (const report of reports) {
    let safety = true
    if (isIncremental(report)) {
        for (let i = 1; i < report.length; i++) {
            if (report[i] <= report[i - 1] || !isDifferValid(report, i, 1)) {
                safety = false
                break
            }
        }
    } else {
        for (let i = 1; i < report.length; i++) {
            if (report[i] >= report[i - 1] || !isDifferValid(report, i, 1)) {
                safety = false
                break
            }
        }
    }
    if (safety) safeReports++
}

console.log(safeReports)

// Part 2 - Brute force
const mutatedReports = []
for (const report of reports) {
    const mutations = []
    for (let i = 0; i < report.length; i++) {
        mutations.push(report.toSpliced(i, 1))
    }
    mutatedReports.push(mutations)
}

let actualSafeReports = 0

for (const mutations of mutatedReports) {
    for (const report of mutations) {
        let safety = true
        if (isIncremental(report)) {
            for (let i = 1; i < report.length; i++) {
                if (
                    report[i] <= report[i - 1] ||
                    !isDifferValid(report, i, 1)
                ) {
                    safety = false
                    break
                }
            }
        } else {
            for (let i = 1; i < report.length; i++) {
                if (
                    report[i] >= report[i - 1] ||
                    !isDifferValid(report, i, 1)
                ) {
                    safety = false
                    break
                }
            }
        }
        if (safety) {
            actualSafeReports++
            break
        }
    }
}

console.log(actualSafeReports)

// Helper functions
function isDifferValid(report, secondIndex, lookupOffset) {
    const difference = Math.abs(
        report[secondIndex] - report[secondIndex - lookupOffset],
    )
    return difference >= 1 && difference <= 3
}

function isIncremental(report) {
    return report[0] < report[1]
}

function parseInput(input) {
    return input
        .split('\n')
        .filter(row => row)
        .map(row => row.split(' ').map(num => parseInt(num)))
}
