# TetrisAPI
This is the thing that runs Tetris5, which doesn't exist yet.

## Tetris(w, h, standard, controls, hideTop)
### Parameters
W: Width of the board <br>
H: Height of the board <br>
Standard: Whether or not to start a "standard" Tetris game
Controls: What the controls are. They can be written like this:
```json
{
    "left": "ArrowLeft",
    "hard": " "
}
```
**IMPORTANT**
Make sure to use the actual space character when invoking the spacebar.

HideTop: Whether or not to hide the top of the Tetris board. See the first regulation in the 2009 (Tetris Guidelines)[https://tetris.fandom.com/wiki/Tetris_Guideline] for more information
### addEventListener(type, callback)
Adds an event listener for a certain event. When this event listener is triggered, the callback parameter will be called.

### clone()
Returns an copy of "this"

### summonPiece(summon)
Creates a new piece. If default in the constructor is checked, this will create a new piece conforming to the 7-Bag Random Generator (all built in).

### destroyPiece()
Removes the current piece in the this.piece

### flatten(type)
Flattens the piece onto the board and returns a flattened 2D Array
<br>
If type is "full", it will flatten the *entire board*, including the top even if hideTop in the inspector is disabled.
<br>
If type is "standard", it will return the sliced version.

### gravity(piece, check, useLockDelay)
In core just moves the piece downward. However, it also comes equipped with some more parameters.
<br>
Piece is what the piece will spawn if the piece hits the ground.
<br>
If check is enabled, it will not move the piece down, but cancel lock delay if it is activated, but not necessary anymore.
<br>
If useLockDelay is disabled, it will not use lock delay (used by hard drops).

### appendControls()
Adds event listeners for what is included in controls.

## Tick(tickUpdate, frameUpdate, tickSpeed)
FAQ:
Q: Why can I not just use request animation frame?
A: Umm... because... this is better? (But in all seriousness, Tick has built in Tetris speed curve)

### Parameters
tickUpdate: What to do every tick, according to the Tetris speed curve.
frameUpdate: Literally what to do every frame.
tickSpeed: Set up a custom tick speed for the Tetris speed curve

## PieceNotation(shape, position, id, tetris)
FAQ:
Q: Do I have to memorize al of these weird parameters?
A: No, you can simply set standard on the main Tetris class instance to true, and simply use summonPiece(**with no parameters**). But if you are a *true programmer* you should.

## Parameters
Shape: A 2D array filled with the shape of the piece.
Position: A {"x": xPos, "y": yPos} object that represents the position.
ID: What each non-zero cell in the shape will be replaced with. (the color of the piece will be identified in the config.color JSON)
Tetris: Which Tetris class instance this piece will be attached to. This has to be defined.

## maxY()
Finds the maximum y level that this piece can be in, without overlapping with the stationary array.

## createRotation()
A function that generates all of the rotations for the piece, stored in the PieceNotation.ROTATIONS "constant".

## rotate(right)
A way to rotate the piece. Set the parameter to true to rate