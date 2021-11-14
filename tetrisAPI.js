const Array2D = require('array2D');

class Tetris {
    
}

class PieceNotation {
    // A array of rotations
    #rotations = [];

    // Creates rotations. Private function, called once on init
    #createRotations() {
        let rotatedShape = JSON.parse(JSON.stringify(this.shape));
        this.#rotations.push(this.shape);
        for (let i = 0; i < 3; i++) {
            rotatedShape = Array2D.rrotate(rotatedShape);
           this.#rotations.push(rotatedShape);
        }
    }

    constructor (shape, position) {
        this.shape = shape;
        this.position = position;
        this.rotation = 0;
        this.#createRotations();
        console.log(this.#rotations);
    }

    // Sets the rotation to 0-3.
    setRotation(i) {
        let rotationIndex = i;

        // If number is less than 0, assumes it turns the other way
        if (rotationIndex < 0) {
            rotationIndex = 4-(Math.abs(i)%4);
        }

        // If number is more than 3, then finds i % 4
        if (rotationIndex >= 4) {
            rotationIndex = rotationIndex % 4;
        }

        // Sets shape to the rotation
        this.shape = this.#rotations[rotationIndex];
    }

    // Moves the piece FROM its original position
    move(pos) {
        this.pos.x += pos.x;
        this.pos.y += pos.y;
    }

    // Moves the piece TO pos
    setPos(pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
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

class TetrisRenderer {

}

module.exports = PieceNotation;