import { readFileSync } from 'node:fs'

// Type definitions
type IndividualBlock = number | '.'

type ContiguousBlock = DataBlock | FreeBlock

type DataBlock = {
    type: 'data'
    id: number
    size: number
}

type FreeBlock = {
    type: 'free'
    size: number
}

// Main functions
const input = readFileSync('inputs/d9.txt', 'utf-8').trim()
const numbers = input.split('').map(num => parseInt(num))

// Part 1
const individualBlocks: IndividualBlock[] = []
numbers.forEach((num, index) => {
    if (index % 2 == 0) {
        const fileSize = num
        const id = index / 2
        for (let i = 0; i < fileSize; i++) {
            individualBlocks.push(id)
        }
        return
    }
    const freeSize = num
    for (let i = 0; i < freeSize; i++) {
        individualBlocks.push('.')
    }
})

let write = 0
let read = individualBlocks.length - 1
while (write < read) {
    while (individualBlocks[write] !== '.') write++
    while (individualBlocks[read] === '.') read--
    if (write >= read) break
    individualBlocks[write] = individualBlocks[read]
    individualBlocks[read] = '.'
    write++
    read--
}

const checksum1 = getChecksum(individualBlocks)

console.log(checksum1)

// Part 2
// Notes for future reference: We should've stuck to IndividualBlock[] instead of this...
// This is a mess, with pointers moving around after each swap. It was a nightmare to debug.
// See https://github.com/insin/adventofcode/blob/main/2024/09/index.js for a much cleaner solution.
const contiguousBlocks: ContiguousBlock[] = []
numbers.forEach((num, index) => {
    if (num === 0) return
    if (index % 2 == 0) {
        const id = index / 2
        contiguousBlocks.push({ type: 'data', id, size: num })
        return
    }
    contiguousBlocks.push({ type: 'free', size: num })
})

let lp = 0
let rp = contiguousBlocks.length - 1

while (rp > 0) {
    // Locate a data block on the right to swap
    while (isFreeBlock(contiguousBlocks[rp])) rp--
    // Find a sufficient-sized free block on the left to swap
    lp = 0
    while (
        lp < rp &&
        (isDataBlock(contiguousBlocks[lp]) ||
            !isValidForSwap(lp, rp, contiguousBlocks))
    )
        lp++
    // If we don't find any, we move to the next right block
    if (lp >= rp) {
        rp--
        continue
    }
    // Otherwise, we swap the blocks
    const [newLp, newRp] = swapBlocks(lp, rp, contiguousBlocks)
    lp = newLp
    rp = newRp
}

const serializedBlocks = serializeContiguousBlocks(contiguousBlocks)
const checksum2 = getChecksum(serializedBlocks)

console.log(checksum2)

// Helper functions
function serializeContiguousBlocks(
    blocks: ContiguousBlock[],
): IndividualBlock[] {
    const individualBlocks: IndividualBlock[] = []
    blocks.forEach(block => {
        if (block.type === 'data') {
            for (let i = 0; i < block.size; i++) {
                individualBlocks.push(block.id)
            }
            return
        }
        for (let i = 0; i < block.size; i++) {
            individualBlocks.push('.')
        }
    })
    return individualBlocks
}

function swapBlocks(
    lp: number,
    rp: number,
    blocks: ContiguousBlock[],
): [number, number] {
    if (isDataBlock(blocks[lp]) || isFreeBlock(blocks[rp])) {
        throw new Error('Invalid block types for swapping')
    }
    const remainingFreeSpace = blocks[lp].size - blocks[rp].size
    // Swap the blocks
    blocks[lp] = blocks[rp]
    blocks[rp] = { type: 'free', size: blocks[rp].size }
    // Merge the free blocks to prepare for the next iteration.
    while (blocks[rp + 1] && isFreeBlock(blocks[rp + 1])) {
        blocks[rp].size = blocks[rp].size + blocks[rp + 1].size
        blocks.splice(rp + 1, 1)
    }
    while (blocks[rp - 1] && isFreeBlock(blocks[rp - 1])) {
        blocks[rp - 1].size += blocks[rp].size
        blocks.splice(rp, 1)
        rp--
    }
    // Insert the remaining free space (after swap) to lp + 1
    if (remainingFreeSpace > 0) {
        blocks.splice(lp + 1, 0, { type: 'free', size: remainingFreeSpace })
        lp++
    }
    return [lp, rp]
}

function getChecksum(blocks: IndividualBlock[]): number {
    let checksum = 0
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i] === '.') continue
        checksum += i * (blocks[i] as number)
    }
    return checksum
}

function isValidForSwap(
    lp: number,
    rp: number,
    blocks: ContiguousBlock[],
): boolean {
    return blocks[lp].size >= blocks[rp].size
}

function isDataBlock(block: ContiguousBlock): block is DataBlock {
    return block.type === 'data'
}

function isFreeBlock(block: ContiguousBlock): block is FreeBlock {
    return block.type === 'free'
}
