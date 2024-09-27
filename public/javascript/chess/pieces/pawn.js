var Pawn = function (config) {
    this.type = 'pawn';
    this.constructor(config);
};

Pawn.prototype = new Piece({});
Pawn.prototype.handlePromotion = function () {
    const promotionContainer = document.getElementById('promotion-container');
    promotionContainer.style.display = 'block';
    function handlePromotionClick(e) {
        const promotionPiece = e.target.getAttribute('data-piece');
        let position = this.position;
        let pieces = this.color !== 'white' ? this.Board.blackPieces : this.Board.whitePieces;
        let newpiece = null;
        this.kill();
        switch (promotionPiece) {
            case 'queen':
                newpiece = new Queen({ color: this.color, position: position, Board: this.Board });
                pieces['queens'].push(newpiece);
                break;
            case 'rook':
                newpiece = new Rook({ color: this.color, position: position, Board: this.Board });
                pieces['rooks'].push(newpiece);
                break;
            case 'bishop':
                newpiece = new Bishop({ color: this.color, position: position, Board: this.Board });
                pieces['bishops'].push(newpiece);
                break;
            case 'knight':
                newpiece = new Knight({ color: this.color, position: position, Board: this.Board });
                pieces['knights'].push(newpiece);
                break;
        }
        newpiece.render();
        promotionContainer.style.display = 'none';
        promotionContainer.removeEventListener('click', handlePromotionClick);
    }
    promotionContainer.addEventListener('click', handlePromotionClick.bind(this));

}
Pawn.prototype.moveTo = function (targetPosition, isValidMove, choice) {
    Piece.prototype.moveTo.call(this, targetPosition);
    if (isValidMove === 'empasent') {
        let lastMove = this.Board.moves[this.Board.moves.length - 1];
        let cappawn = this.Board.getPieceAt({ col: targetPosition.col, row: lastMove.from.row });
        cappawn.kill();
    }
    if (isValidMove === 'Promotion') {
        this.handlePromotion();
    }

}

Pawn.prototype.isValidMove = function (targetPosition) {
    var currentRow = parseInt(this.position[1], 10);
    var targetRow = parseInt(targetPosition.row, 10);
    var currentCol = this.position[0].toUpperCase();
    var targetCol = targetPosition.col.toUpperCase();

    if (this.color === 'white') {
        if (currentCol === targetCol && targetRow === currentRow + 1) {
            let targetPiece = this.Board.getPieceAt(targetPosition);
            if (!targetPiece && targetRow === 8) return 'Promotion';
            return !targetPiece;
        }
        if (currentCol === targetCol && currentRow === 2 && targetRow === currentRow + 2) {
            return !this.Board.getPieceAt({ col: currentCol, row: currentRow + 1 }) &&
                !this.Board.getPieceAt({ col: currentCol, row: currentRow + 2 });
        }
        if (Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0)) === 1 && targetRow === currentRow + 1) {
            var targetPiece = this.Board.getPieceAt(targetPosition);
            if (targetPiece && targetPiece.color !== this.color) {
                if (targetRow === 8) return 'Promotion';
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
            let targetPiece = this.Board.getPieceAt(targetPosition);
            if (!targetPiece && targetRow === 1) return 'Promotion';
            return !targetPiece;
        }
        if (currentCol === targetCol && currentRow === 7 && targetRow === currentRow - 2) {
            return !this.Board.getPieceAt({ col: currentCol, row: currentRow - 1 }) &&
                !this.Board.getPieceAt({ col: currentCol, row: currentRow - 2 });
        }
        if (Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0)) === 1 && targetRow === currentRow - 1) {
            var targetPiece = this.Board.getPieceAt(targetPosition);
            if (targetPiece && targetPiece.color !== this.color) {
                if (targetRow === 1) return 'Promotion';
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