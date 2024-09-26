var King = function(config){
    this.type = 'king';
    this.constructor(config);
};



King.prototype = new Piece({});
King.prototype.isValidMove = function(newPosition)
{
    var currentCol = this.position.charAt(0);
    var currentRow = parseInt(this.position.charAt(1));
    
    var newCol = newPosition.col;
    var newRow = parseInt(newPosition.row);

    var rowDiff = Math.abs(currentRow - newRow);
    var colDiff = Math.abs(currentCol.charCodeAt(0) - newCol.charCodeAt(0));

    if (rowDiff <= 1 && colDiff <= 1) {
        return true;
    }
    // check for castling
    if(!this.hasMoved)
    {
        // let see rook is present or not
    }
    return false;
}