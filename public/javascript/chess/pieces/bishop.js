var Bishop = function(config){
    this.type = 'bishop';
    this.constructor(config);
};



Bishop.prototype = new Piece({});
Bishop.prototype.moveTo = function(targetPosition){
    var isValidMove = this.isValidMove(targetPosition);
    if (!isValidMove) {
        console.log("Invalid move for bishop");
        return;
    }
    console.log("move function starts here");
    var newPos = targetPosition.col + targetPosition.row;
    this.position = newPos;
    this.render();
    console.log("move function successfully ends here");
}

Bishop.prototype.isValidMove = function(targetPosition) {

    var currentRow = parseInt(this.position[1], 10);
    var targetRow = parseInt(targetPosition.row, 10);
    var currentCol = this.position[0].toUpperCase();
    var targetCol = targetPosition.col.toUpperCase();

    console.log("currentRow: ", currentRow + " " + typeof currentRow);
    console.log("targetRow: ", targetRow + " " + typeof targetRow);
    console.log("currentCol: ", currentCol + " " + typeof currentCol);
    console.log("targetCol: ", targetCol + " " + typeof targetCol);

    if (Math.abs(currentRow - targetRow) !== Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0))) {
        console.log("Invalid move: Bishop must move diagonally");
        return false;
    }
    var rowStep = targetRow > currentRow ? 1 : -1;
    var colStep = targetCol.charCodeAt(0) > currentCol.charCodeAt(0) ? 1 : -1;
    
    var currentCheckRow = currentRow + rowStep;
    var currentCheckCol = currentCol.charCodeAt(0) + colStep;

    while (currentCheckRow !== targetRow && currentCheckCol !== targetCol.charCodeAt(0)) {
        var intermediatePosition = {
            row: currentCheckRow.toString(),
            col: String.fromCharCode(currentCheckCol)
        };

        if (this.Board.getPieceAt(intermediatePosition)) {
            console.log("Invalid move: Path is blocked by another piece");
            return false;
        }

        currentCheckRow += rowStep;
        currentCheckCol += colStep;
    }
    
    return true;
};