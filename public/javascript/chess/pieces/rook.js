var Rook = function(config){
    this.type = 'rook';
    this.constructor(config);
};



Rook.prototype = new Piece({});

Rook.prototype.isValidMove = function(newPosition){
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));
    let newCol = newPosition.col;
    let newRow = parseInt(newPosition.row);

    const isHorizontalMove = (currentRow === newRow && currentCol !== newCol);
    const isVerticalMove = (currentCol === newCol && currentRow !== newRow);    

    if (isHorizontalMove || isVerticalMove) return this.pathIsClear(newPosition);
    return false;
}
