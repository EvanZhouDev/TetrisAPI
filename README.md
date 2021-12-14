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
    "left": "ArrowLeft", // or whatever key you want
    "hard": " ", // make sure to use a literal space character for space!
    // etc, etc...
}
```
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