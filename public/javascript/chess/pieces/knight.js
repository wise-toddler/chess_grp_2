var Knight = function(config){
    this.type = 'knight';
    this.constructor(config);
};



Knight.prototype = new Piece({});
Knight.prototype.isValidMove = function(targetPosition)
{
    var currentRow = parseInt(this.position[1], 10);
    var targetRow = parseInt(targetPosition.row, 10);
    var currentCol = this.position[0].toUpperCase();
    var targetCol = targetPosition.col.toUpperCase();

    var rowDiff = Math.abs(currentRow - targetRow);
    var colDiff = Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0));
    
    if (rowDiff === 2 && colDiff === 1) {
        return true;
    }
    if (rowDiff === 1 && colDiff === 2) {
        return true;
    }
    return false;
}