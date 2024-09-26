var Piece = function (config) {
    this.position = config.position;
    this.color = config.color;
    this.Board = config.Board;
    this.hasMoved = false;
    if (this.position) {
        this.render();
    }
}
Piece.prototype.moveTo = function (targetPosition) {
    let targetPiece = this.Board.getPieceAt(targetPosition);
    if (targetPiece) {
        targetPiece.kill();
    }
    this.Board.moves.push({
        piece: this,
        from: {
            row: this.position[1],
            col: this.position[0]
        },
        to: targetPosition
    });
    this.position = targetPosition.col + targetPosition.row;
    this.render();
    this.hasMoved = true;
}


Piece.prototype.attachListeners = function () {
    //To be implemented
}

Piece.prototype.render = function () {
    var col = this.position[0];
    var row = this.position[1];
    // Find the li element with matching data-col and data-row attributes
    var element = document.querySelector(`[data-col="${col}"] [data-row="${row}"]`);
    if (element) {
        // Remove the existing piece element from the DOM if it exists
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
        }
        // Create a new div element to represent the piece
        var pieceElement = document.createElement('div');

        // Add classes to the new element for styling
        pieceElement.classList.add('piece', this.color, this.type);

        // Clear any existing content in the cell
        element.innerHTML = '';

        // Append the new piece element to the cell
        element.appendChild(pieceElement);
        this.$el = pieceElement;
        this.attachListeners();
    } else {
        console.warn(`Element not found for position: ${this.position}`);
    }
}

Piece.prototype.kill = function () {
    console.log('removing piece', this);

    const removePiece = (pieces, type, piece) => {
        if (type === 'queen') delete pieces.queen;
        else pieces[type + 's'] = pieces[type + 's'].filter(p => p !== piece);
    };

    const pieces = this.color === 'white' ? this.Board.whitePieces : this.Board.blackPieces;
    removePiece(pieces, this.type, this);

    this.$el.parentNode.removeChild(this.$el);
    this.position = null;
};
Piece.prototype.isKingSafe = function (targetPosition) {
    let king = this.color === 'white' ? this.Board.whitePieces.king : this.Board.blackPieces.king;
    return king.isSafe(this, targetPosition);
}

Piece.prototype.isValidMove = function () {
    console.log("Method not implemeted by: " + this.type);
}

Piece.prototype.pathIsClear = function (targetPosition) {
    var str = parseInt(this.position[1], 10);
    var stc = this.position[0].toUpperCase();
    var endr = parseInt(targetPosition.row, 10);
    var endc = targetPosition.col.toUpperCase();

    let hdist = Math.abs(str - endr);
    let vdist = Math.abs(stc.charCodeAt(0) - endc.charCodeAt(0));

    if (hdist !== 0 && vdist !== 0 && Math.abs(hdist) !== Math.abs(vdist)) {
        // invalid move
        return false;
    }

    let rowStep = hdist === 0 ? 0 : (endr - str) / hdist;
    let colStep = vdist === 0 ? 0 : (endc.charCodeAt(0) - stc.charCodeAt(0)) / vdist;

    var currentCheckRow = str + rowStep;
    var currentCheckCol = stc.charCodeAt(0) + colStep;

    while (currentCheckRow !== endr || currentCheckCol !== endc.charCodeAt(0)) {
        var intermediatePosition = {
            row: currentCheckRow.toString(),
            col: String.fromCharCode(currentCheckCol)
        };

        if (this.Board.getPieceAt(intermediatePosition)) {
            // console.log("Invalid move: Path is blocked by another piece");
            return false;
        }

        currentCheckRow += rowStep;
        currentCheckCol += colStep;
    }
    return true;
}