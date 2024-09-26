var Pawn = function(config){
    this.type = 'pawn';
    this.constructor(config);
};



Pawn.prototype = new Piece({});
Pawn.prototype.moveTo = function(targetPosition){

    var isValidMove = this.isValidMove(targetPosition);
    if (!isValidMove) {
        console.log("Invalid move for pawn");
        return;
    }
    console.log("move function starts here");
    var newPos = targetPosition.col + targetPosition.row;
    this.position = newPos;
    this.render();
    console.log("move function successfully ends here");
}
Pawn.prototype.isValidMove = function(targetPosition) {
    var currentRow = parseInt(this.position[1], 10);
    var targetRow = parseInt(targetPosition.row, 10);
    var currentCol = this.position[0].toUpperCase();
    var targetCol = targetPosition.col.toUpperCase();

    if (this.color === 'white') {
        if (currentCol === targetCol && targetRow === currentRow + 1) {
            return !this.Board.getPieceAt({ col: currentCol, row: currentRow + 1 });
        }
        if (currentCol === targetCol && currentRow === 2 && targetRow === currentRow + 2) {
            return !this.Board.getPieceAt({ col: currentCol, row: currentRow + 1 }) &&
                   !this.Board.getPieceAt({ col: currentCol, row: currentRow + 2 });
        }
    }
    else if (this.color === 'black') {
        if (currentCol === targetCol && targetRow === currentRow - 1) {
            return !this.Board.getPieceAt({ col: currentCol, row: currentRow - 1 });
        }
        if (currentCol === targetCol && currentRow === 7 && targetRow === currentRow - 2) {
            return !this.Board.getPieceAt({ col: currentCol, row: currentRow - 1 }) &&
                   !this.Board.getPieceAt({ col: currentCol, row: currentRow - 2 });
        }
    }
    return false;
};