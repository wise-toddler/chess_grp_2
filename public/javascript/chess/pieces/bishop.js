var Bishop = function(config){
    this.type = 'bishop';
    this.constructor(config);
};

Bishop.prototype = new Piece({});
Bishop.prototype.moveTo = function(targetPosition){
    var newPos = targetPosition.col + targetPosition.row;
    this.position = newPos;
    this.render();
}

Bishop.prototype.isValidMove = function(targetPosition) {
    var currentRow = parseInt(this.position[1], 10);
    var targetRow = parseInt(targetPosition.row, 10);
    var currentCol = this.position[0].toUpperCase();
    var targetCol = targetPosition.col.toUpperCase();

    if (Math.abs(currentRow - targetRow) !== Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0))) {
        console.log("Invalid move: Bishop must move diagonally");
        return false;
    }
    return this.pathIsClear(targetPosition);
};