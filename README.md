# TetrisAPI
This is the thing that runs Tetris5, which doesn't exist yet.

## Tetris(w, h)

## PieceNotation
### PieceNotation.move(pos, checkValid, customCollider)
*Adds* to the piece
pos: How much to add to the x and y
checkValid: Whether or not to check if chosen position is valid
customCollider: Add a custom condition to be met in order to move (recommended to be the cellCollision method)
#### PieceNotation.setPos(pos)
*Sets* the position of the piece
pos: What to set to the x and y
checkValid: Whether or not to check if chosen position is valid
customCollider: Add a custom condition to be met in order to move (recommended to be the cellCollision method)
#### PieceNotation.rotate(i)
*Adds* to the rotation of the piece

### Pos
Constructor of x & y;

## Tetris Renderer
