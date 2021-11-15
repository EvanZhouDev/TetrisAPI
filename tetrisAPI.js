const _ = require("lodash");
const Array2D = require("array2d");

class Tetris {
    constructor(width, height) {
        this.piece = null;
        this.stationary = Array2D.build(width, height, null);
    }

    clone() {
        return _.cloneDeep(this);
    }

    summonPiece(piece) {
        if (Array2D.check(piece.shape)) {
            this.piece = piece;
        } else {
            console.error("Make sure that 'piece.shape' has 2D array!");
        }
        return this;
    }

    destroyPiece() {
        this.piece = null;
    }

    flatten() {
        if (this.piece !== null) {
            let returnBoard = Array2D.clone(this.stationary); // Creates a new array to work with
            // Renames some variables
            let shape = this.piece.shape;
            let pos = this.piece.pos;

            // For each cell of array
            shape.forEach((v1, i1) => {
                v1.forEach((_v2, i2) => {
                    if (
                        pos.y + i1 < returnBoard.length &&
                        pos.y + i1 >= 0 && // If valid y location
                        pos.x + i2 < returnBoard[0].length && // If valid x location
                        shape[i1][i2] !== 0 // If the current space of the board is able to be replaced
                    ) {
                        returnBoard[pos.y + i1][pos.x + i2] = shape[i1][i2]; // Append a shape onto the board
                    }
                });
            });
            // Return the new appened board
            return returnBoard;
        } else {
            return this.stationary;
        }
    }
}

class PieceNotation {
    // A array of rotations
    
    // Creates rotations. Private function, called once on init
    
    constructor(shape, position) {
        this.shape = shape;
        this.pos = position;
        this.rotation = 0;
        this.ROTATIONS = [];
        this.createRotations();
    }

    createRotations() {
        let rotatedShape = Array2D.clone(this.shape);
        this.ROTATIONS.push(this.shape);
        for (let i = 0; i < 3; i++) {
            rotatedShape = Array2D.rrotate(rotatedShape);
            this.ROTATIONS.push(rotatedShape);
        }
    }

    // Sets the rotation to 0-3.
    setRotation(i) {
        let rotationIndex = i;

        // If number is less than 0, assumes it turns the other way
        if (rotationIndex < 0) {
            rotationIndex = 4 - (Math.abs(i) % 4);
        }

        // If number is more than 3, then finds i % 4
        if (rotationIndex >= 4) {
            rotationIndex = rotationIndex % 4;
        }

        // Sets shape to the rotation
        this.shape = this.ROTATIONS[rotationIndex];
    }

    // Moves the piece FROM its original position
    move(pos) {
        this.pos.x += pos.x;
        this.pos.y += pos.y;
        return this;
    }

    // Moves the piece TO pos
    setPos(pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
        return this;
    }

    // Rotates the piece
    rotate(i) {
        // Adds to current rotation index
        let rotationIndex = this.rotation;
        rotationIndex += i;

        // Rotates using setRotation()
        this.setRotation(rotationIndex);
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class TetrisRenderer {}

let tetris = new Tetris(10, 40);
tetris.summonPiece(
    new PieceNotation(
        [
            [1, 1],
            [1, 1]
        ],
        new Position(0, 0)
    )
);
console.log(tetris.flatten());

tetris.destroyPiece();
console.log(tetris.flatten());

tetris.summonPiece(new PieceNotation([[2], [2]], new Position(1, 0)));
console.log(tetris.flatten());

tetris.piece.move(new Position(0, 1));
console.log(tetris.flatten());

module.exports = PieceNotation;
