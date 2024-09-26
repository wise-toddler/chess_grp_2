var Queen = function(config){
    this.type = 'queen';
    this.constructor(config);
};

Queen.prototype = new Piece({});

Queen.prototype.isValidMove = function(targetPosition) {
    var currentRow = parseInt(this.position[1], 10);
    var targetRow = parseInt(targetPosition.row, 10);
    var currentCol = this.position[0].toUpperCase();
    var targetCol = targetPosition.col.toUpperCase();

    var rowDiff = Math.abs(currentRow - targetRow);
    var colDiff = Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0));

    if (rowDiff === colDiff) {
        return this.pathIsClear(targetPosition);
    }

    if (currentRow === targetRow && currentCol !== targetCol) {
        return this.pathIsClear(targetPosition);
    }

    if (currentCol === targetCol && currentRow !== targetRow) {
        return this.pathIsClear(targetPosition);
    }

    // console.log("Invalid move: Queen must move diagonally or horizontally or vertically");
    return false;
};