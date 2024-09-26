var Board = function (config) {
    this.root_id = config.root_id;
    this.$el = document.getElementById(this.root_id);
    this.currentPlayer = 'white';
    this.moves = [];
    this.generateBoardDom();
    this.addListeners();
}

Board.prototype.addListeners = function () {
    this.$el.addEventListener('click', this.boardClicked.bind(this));
}
Board.prototype.generateBoardDom = function (config) {
    let boardHTML = '<ul id="game-ct">';
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    for (let col of columns) {
        boardHTML += `<li data-col="${col}"><ul>`;
        for (let row = 8; row >= 1; row--) {
            boardHTML += `<li data-row="${row}"></li>`;
        }
        boardHTML += '</ul></li>';
    }

    boardHTML += '</ul>';

    this.$el.innerHTML = boardHTML;
};

Board.prototype.getClickedBlock = function (clickEvent) {
    // Get the clicked block
    const clickedCell = clickEvent.target.closest('li');

    if (clickedCell) {
        // Extract row and column from data attributes
        const row = clickedCell.getAttribute('data-row');
        const parentLi = clickedCell.closest('li[data-col]');
        const col = parentLi ? parentLi.getAttribute('data-col') : null;

        if (row !== null && col !== null) {
            return {
                row: row,
                col: col
            };
        } else {
            console.warn('Unable to determine block coordinates');
        }
    } else {
        console.warn('Clicked element is not within a board square');
    }
}

Board.prototype.clearSelection = function () {
    // Remove 'selected' class from all pieces
    const allPieces = document.querySelectorAll('.piece');
    allPieces.forEach(piece => {
        piece.classList.remove('selected');
    });
    this.selectedPiece = null;
};

Board.prototype.kingSafe = function (piece, targetPosition) {
    let king = null;
    let kingPosition = null;
    let kingSafe = true;
    let oldPosition = piece.position;
    piece.position = targetPosition.col + targetPosition.row;
    if (piece.color === 'white') {
        king = this.whitePieces.king;
        kingPosition = king.position;
        kingPosition = { row: kingPosition[1], col: kingPosition[0] };

        for (let pieceType in this.blackPieces) {
            if (pieceType !== 'queen' && pieceType !== 'king'){
                for (let piece of this.blackPieces[pieceType]) {
                    if (piece.isValidMove(kingPosition)) {
                        kingSafe = false;
                        break;
                    }
                }
            } else {
                if (this.blackPieces[pieceType].isValidMove(kingPosition)) {
                    kingSafe = false;
                    break;
                }
            }
        }


    } else {
        king = this.blackPieces.king;
        kingPosition = king.position;
        kingPosition = { row: kingPosition[1], col: kingPosition[0] };
        for (let pieceType in this.whitePieces) {
            if (pieceType !== 'queen' && pieceType !== 'king'){
                for (let piece of this.whitePieces[pieceType]) {
                    if (piece.isValidMove(kingPosition)) {
                        kingSafe = false;
                        break;
                    }
                }
            } else {
                if (this.whitePieces[pieceType].isValidMove(kingPosition)) {
                    kingSafe = false;
                    break;
                }
            }
        }
    }
    piece.position = oldPosition;
    return kingSafe;
}
Board.prototype.boardClicked = function (event) {
    // this.clearSelection();
    const clickedCell = this.getClickedBlock(event);
    const selectedPiece = this.getPieceAt(clickedCell)
    if (this.selectedPiece) {
        if (selectedPiece && selectedPiece.color === this.currentPlayer) {
            this.clearSelection();
            this.selectPiece(event.target, selectedPiece);
        }
        else {
            let isValidMove = this.selectedPiece.isValidMove(clickedCell);
            if (isValidMove) {
                if (!this.kingSafe(this.selectedPiece, clickedCell)) {
                    console.log("Invalid move: King is in check");
                    this.clearSelection();
                    return;
                }
                if (selectedPiece) {
                    selectedPiece.kill(selectedPiece);
                }
                this.moves.push({
                    piece: this.selectedPiece,
                    from: { row: this.selectedPiece.position[1], col: this.selectedPiece.position[0] },
                    to: clickedCell
                });
                this.selectedPiece.moveTo(clickedCell);
                // Special cases 
                // Empasent
                if (isValidMove === "empasent") {
                    let lastMove = this.moves[this.moves.length - 1];
                    let pawnposition = null;
                    if (this.currentPlayer === 'white') {
                        pawnposition = { row: parseInt(lastMove.to.row) - 1, col: lastMove.to.col };
                    } else {
                        pawnposition = { row: parseInt(lastMove.to.row) + 1, col: lastMove.to.col };
                    }
                    let pawn = this.getPieceAt(pawnposition);
                    pawn.kill(pawn);
                }
                // Promotion : To be implemented
                // Castling : To be implemented
                this.clearSelection();
                this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
            }
            else {
                console.log("Invalid move for " + this.selectedPiece.type);
                this.clearSelection();
            }
        }
    }
    else {
        if (selectedPiece && selectedPiece.color === this.currentPlayer) {
            this.selectPiece(event.target, selectedPiece);
        }
    }

}

Board.prototype.getPieceAt = function (cell) {
    if (!cell || !cell.row || !cell.col) {
        return false;
    }

    const position = cell.col + cell.row;

    // Check white pieces
    for (let pieceType in this.whitePieces) {
        if (Array.isArray(this.whitePieces[pieceType])) {
            // For arrays (pawns, bishops, knights, rooks)
            for (let piece of this.whitePieces[pieceType]) {
                if (piece.position === position) {
                    return piece;
                }
            }
        } else {
            // For single pieces (king, queen)
            if (this.whitePieces[pieceType].position === position) {
                return this.whitePieces[pieceType];
            }
        }
    }

    // Check black pieces
    for (let pieceType in this.blackPieces) {
        if (Array.isArray(this.blackPieces[pieceType])) {
            // For arrays (pawns, bishops, knights, rooks)
            for (let piece of this.blackPieces[pieceType]) {
                if (piece.position === position) {
                    return piece;
                }
            }
        } else {
            // For single pieces (king, queen)
            if (this.blackPieces[pieceType].position === position) {
                return this.blackPieces[pieceType];
            }
        }
    }
    return false;
}

Board.prototype.selectPiece = function (clickedElement, selectedPiece) {
    if (clickedElement.classList.contains('piece')) {
        // If the clicked element is a piece, add the 'selected' class
        clickedElement.classList.add('selected');
    } else {
        // If the clicked element is not a piece, check its parent
        const parentElement = clickedElement.closest('.piece');
        if (parentElement) {
            parentElement.classList.add('selected');
        }
    }
    selectedPiece.selected = true;
    this.selectedPiece = selectedPiece;
}

Board.prototype.initiateGame = function () {
    // Create white pieces
    this.whitePieces = {
        king: new King({ color: 'white', position: 'E1', Board: this }),
        queen: new Queen({ color: 'white', position: 'D1', Board: this }),
        bishops: [
            new Bishop({ color: 'white', position: 'C1', Board: this }),
            new Bishop({ color: 'white', position: 'F1', Board: this })
        ],
        knights: [
            new Knight({ color: 'white', position: 'B1', Board: this }),
            new Knight({ color: 'white', position: 'G1', Board: this })
        ],
        rooks: [
            new Rook({ color: 'white', position: 'A1', Board: this }),
            new Rook({ color: 'white', position: 'H1', Board: this })
        ],
        pawns: []
    };

    // Create white pawns
    for (let i = 0; i < 8; i++) {
        this.whitePieces.pawns.push(new Pawn({ color: 'white', position: String.fromCharCode(65 + i) + '2', Board: this }));
    }

    // Create black pieces
    this.blackPieces = {
        king: new King({ color: 'black', position: 'E8', Board: this }),
        queen: new Queen({ color: 'black', position: 'D8', Board: this }),
        bishops: [
            new Bishop({ color: 'black', position: 'C8', Board: this }),
            new Bishop({ color: 'black', position: 'F8', Board: this })
        ],
        knights: [
            new Knight({ color: 'black', position: 'B8', Board: this }),
            new Knight({ color: 'black', position: 'G8', Board: this })
        ],
        rooks: [
            new Rook({ color: 'black', position: 'A8', Board: this }),
            new Rook({ color: 'black', position: 'H8', Board: this })
        ],
        pawns: []
    };

    // Create black pawns
    for (let i = 0; i < 8; i++) {
        this.blackPieces.pawns.push(new Pawn({ color: 'black', position: String.fromCharCode(65 + i) + '7', Board: this }));
    }
};

Board.prototype.renderAllPieces = function () {
    // Render white pieces
    Object.values(this.whitePieces).forEach(piece => {
        if (Array.isArray(piece)) {
            piece.forEach(p => p.render());
        } else {
            piece.render();
        }
    });

    // Render black pieces
    Object.values(this.blackPieces).forEach(piece => {
        if (Array.isArray(piece)) {
            piece.forEach(p => p.render());
        } else {
            piece.render();
        }
    });
};
