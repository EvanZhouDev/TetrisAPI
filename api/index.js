import _ from "lodash";
class Tetris {
    constructor(board) {
        this.board = board;
        this.summonedPiece = null;
    }
    summon(piece) {
        this.summonedPiece = piece; // TODO: IMPLEMENT putting it on the board
        return this;
    }
    move(direction) {
        // TODO: Implement
        switch (direction) {
            case "up": {
                return this;
            }
            case "down": {
                return this;
            }
            case "very down": {
                return this;
            }
            case "left": {
                return this;
            }
            case "very left": {
                return this;
            }
            case "right": {
                return this;
            }
            case "very right": {
                return this;
            }
            default:
                throw Error("Invalid direction: " + direction);
        }
        return this;
    }
    clone() {
        return this.constructor.call(this.flatten());
    }
    hyperGravity() {
        return this.move("very down").tick();
    }
    flatten() {
        return [[]]; // TODO: IMPLEMENT
    }
    tick() {
        return this; // TODO: IMPLEMENT
    }
}
function getUniqueRotations(piece) {
    let output = [];
    for (let x of [...Array(4).keys()]) {
        output.push(piece.rotated(x));
    }
    return [...new Set(output)];
}
function getEveryPossiblePos(board, piece) {
    let output = [];
    const testBoard = new Tetris(board);
    testBoard.summon(piece);
    testBoard.move("very left");
    let before = null;
    let moves = [];
    output.push([
        testBoard
            .clone()
            .hyperGravity()
            .flatten(),
        ["very left"]
    ]);
    while (testBoard.flatten() != before) {
        before = testBoard.flatten();
        testBoard.move("left");
        moves.push("left");
        output.push([
            testBoard
                .clone()
                .hyperGravity()
                .flatten(),
            moves
        ]);
    }
    return output;
}
function getFirstNonEmptyRow(board) {
    // Go top-down to the first non-empty row
    for (let row = 1; row++; row < board.length) {
        if (board[row].some(_.identity)) {
            return board[row];
        }
    }
}
function ai(board, piece) {
    let output = new Map();
    for (let rotation of getUniqueRotations(piece)) {
        for (let [newBoard, moves] of getEveryPossiblePos(board, rotation)) {
            output.set(getFirstNonEmptyRow(newBoard).filter(_.identity).length, [
                rotation,
                moves
            ]);
        }
    }
    return output[_.max(output.keys())];
}
