var Queen = function(config){
    this.type = 'queen';
    this.constructor(config);
};

Queen.prototype = new Piece({});

// Modified moveTo function
Queen.prototype.moveTo = function(targetPosition){
    var possibleMoves = this.getAllPossibleMoves();
    var isValidMove = possibleMoves.some(function(move) {
        return move.col === targetPosition.col && move.row === targetPosition.row;
    });

    if (!isValidMove) {
        console.log("Invalid move for queen");
        return;
    }

    console.log("Move function starts here");
    var newPos = targetPosition.col + targetPosition.row;
    this.position = newPos;
    this.render();
    console.log("Move function successfully ends here");
};

// New getAllPossibleMoves function
Queen.prototype.getAllPossibleMoves = function() {
    var possibleMoves = [];
    
    var currentRow = parseInt(this.position[1], 10);
    var currentCol = this.position[0].toUpperCase();
    
    // Get all diagonal moves (Bishop-like moves)
    this.addDiagonalMoves(possibleMoves, currentRow, currentCol);
    
    // Get all straight moves (Rook-like moves)
    this.addStraightMoves(possibleMoves, currentRow, currentCol);
    
    return possibleMoves;
};

// Helper function for diagonal moves
Queen.prototype.addDiagonalMoves = function(possibleMoves, currentRow, currentCol) {
    var directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    directions.forEach(function(direction) {
        var rowStep = direction[0];
        var colStep = direction[1];
        var currentCheckRow = currentRow + rowStep;
        var currentCheckCol = currentCol.charCodeAt(0) + colStep;

        while (currentCheckRow >= 1 && currentCheckRow <= 8 && currentCheckCol >= 'A'.charCodeAt(0) && currentCheckCol <= 'H'.charCodeAt(0)) {
            possibleMoves.push({
                row: currentCheckRow.toString(),
                col: String.fromCharCode(currentCheckCol)
            });
            currentCheckRow += rowStep;
            currentCheckCol += colStep;
        }
    });
};

// Helper function for straight moves
Queen.prototype.addStraightMoves = function(possibleMoves, currentRow, currentCol) {
    // Add vertical moves (up and down)
    for (var row = 1; row <= 8; row++) {
        if (row !== currentRow) {
            possibleMoves.push({ row: row.toString(), col: currentCol });
        }
    }
    
    // Add horizontal moves (left and right)
    for (var colCode = 'A'.charCodeAt(0); colCode <= 'H'.charCodeAt(0); colCode++) {
        var col = String.fromCharCode(colCode);
        if (col !== currentCol) {
            possibleMoves.push({ row: currentRow.toString(), col: col });
        }
    }
};
