var King = function (config) {
    this.type = 'king';
    this.constructor(config);
};

King.prototype = new Piece({});

King.prototype.moveTo = function (targetPosition, isValidMove) {
    if (isValidMove === "o-o" || isValidMove === "o-o-o") {
        let rook = this.Board.getPieceAt({ col: isValidMove === "o-o" ? 'H' : 'A', row: parseInt(this.position[1]) });
        let rookTargetPosition = isValidMove === "o-o" ? { col: 'F', row: parseInt(this.position[1]) } : { col: 'D', row: parseInt(this.position[1]) };
        rook.moveTo(rookTargetPosition);
    }
    Piece.prototype.moveTo.call(this, targetPosition);
}

King.prototype.isSafe = function (piece, targetPosition) {
    let ans = true;
    let oldPosition = piece.position;
    piece.position = targetPosition.col + targetPosition.row;
    let otherPieces = piece.color === 'white' ? this.Board.blackPieces : this.Board.whitePieces;
    let kingPosition = this.position;
    kingPosition = { row: kingPosition[1], col: kingPosition[0] };
    for (let pieceType in otherPieces) {
        if (pieceType !== 'king') {
            for (let otherPiece of otherPieces[pieceType]) {
                if (otherPiece.position !== piece.position && otherPiece.isValidMove(kingPosition)) {
                    ans = false;
                    break;
                }
            }
        }
        else {
            let otherPiece = otherPieces[pieceType];
            if (otherPiece.position !== piece.position && otherPiece.isValidMove(kingPosition)) {
                ans = false;
                break;
            }
        }
    }
    piece.position = oldPosition;
    return ans;
}

King.prototype.isValidMove = function (targetPosition) {
    var currentCol = this.position.charAt(0);
    var currentRow = parseInt(this.position.charAt(1));

    var newCol = targetPosition.col;
    var newRow = parseInt(targetPosition.row);

    var rowDiff = Math.abs(currentRow - newRow);
    var colDiff = Math.abs(currentCol.charCodeAt(0) - newCol.charCodeAt(0));

    let targetPiece = this.Board.getPieceAt(targetPosition);

    if (rowDiff <= 1 && colDiff <= 1) {
        return targetPiece.color !== this.color;
    }
    // check for castling
    if (!this.hasMoved && !this.Board.isSquareUnderAttack({ col: currentCol, row: currentRow }, this.color)) {
        let othercolor = this.color === 'white' ? 'black' : 'white';
        // let see rook is present or not
        if (newCol === 'G') {
            var rook = this.Board.getPieceAt({ col: 'H', row: currentRow });
            if (rook && !rook.hasMoved) {
                // the intermediate squares are empty and not under attack
                if (!this.Board.getPieceAt({ col: 'F', row: currentRow }) && !this.Board.getPieceAt({ col: 'G', row: currentRow })) {
                    if (!this.Board.isSquareUnderAttack({ col: 'F', row: currentRow }, othercolor) && !this.Board.isSquareUnderAttack({ col: 'G', row: currentRow }, othercolor)) {
                        return "o-o";
                    }
                }
            }
        }
        else if (newCol === 'C') {
            var rook = this.Board.getPieceAt({ col: 'A', row: currentRow });
            if (rook && !rook.hasMoved) {
                // the intermediate squares are empty and not under attack
                if (!this.Board.getPieceAt({ col: 'C', row: currentRow }) && !this.Board.getPieceAt({ col: 'D', row: currentRow })) {
                    if (!this.Board.isSquareUnderAttack({ col: 'C', row: currentRow }, othercolor) && !this.Board.isSquareUnderAttack({ col: 'D', row: currentRow }, othercolor)) {
                        return "o-o-o";
                    }
                }
            }
        }
    }
    return false;
}