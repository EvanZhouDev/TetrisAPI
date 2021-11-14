const Array2D = require('./libs/array2D');

class Tetris {

}

class PieceNotation {
    // A array of rotations
    #rotations = [];

    // Creates rotations. Private function, called once on init
    #createRotations() {
        for (let i = 0; i < 4; i++) {
           this.#rotations.push(Array2D.rrotate(this.shape));
        }
    }

    constructor (shape, position) {
        this.shape = shape;
        this.position = position;
        this.rotation = 0;
        this.#createRotations();
    }

    // Sets the rotation to 0-3.
    setRotation(i) {
        let rotationIndex = i;

        // If number is less than 0, takes the absolute value.
        if (rotationIndex < 0) {
            rotationIndex = Math.abs(i);
        }

        // If number is more than 3, then finds i % 4
        if (rotationIndex >= 4) {
            rotationIndex = rotationIndex % 4;
        }

        // Sets shape to the rotation
        this.shape = this.#rotations[rotationIndex];
    }

    // Moves the pieces
    move(pos) {
        this.pos.x += pos.x;
        this.pos.y += pos.y;
    }

    setPos(pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
    }

    rotate(i) {
        let rotationIndex = this.rotation;
        rotationIndex += i;
        this.setRotation(rotationIndex);
    }
}

class TetrisRenderer {

}

module.exports = PieceNotation;