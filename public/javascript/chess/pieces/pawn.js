var Pawn = function(config){
    this.type = 'pawn';
    this.constructor(config);
};

Pawn.prototype = new Piece({});

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
        if (Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0)) === 1 && targetRow === currentRow + 1) {
            var targetPiece = this.Board.getPieceAt(targetPosition);
            if (targetPiece && targetPiece.color !== this.color) {
                return true;
            }
            // empasent
            var lastMove = this.Board.moves[this.Board.moves.length - 1];
            if (lastMove.piece.type === 'pawn' && Math.abs(lastMove.from.row - lastMove.to.row) === 2) {
                if ((lastMove.to.row) == currentRow && lastMove.to.col === targetCol) {
                    return "empasent";
                }
            }
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
        if (Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0)) === 1 && targetRow === currentRow - 1) {
            var targetPiece = this.Board.getPieceAt(targetPosition);
            if (targetPiece && targetPiece.color !== this.color) {
                return true;
            }
            // empasent
            var lastMove = this.Board.moves[this.Board.moves.length - 1];
            if (lastMove.piece.type === 'pawn' && Math.abs(lastMove.from.row - lastMove.to.row) === 2) {
                if (lastMove.to.row == currentRow && lastMove.to.col === targetCol) {
                    return "empasent";
                }
            }
        }
    }
    return false;
};