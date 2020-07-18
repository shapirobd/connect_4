/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

let p1Score = 0;
let p2Score = 0;
let hasListener;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard () {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	for (let i = 0; i < HEIGHT; i++) {
		board.push([]);
		for (let j = 0; j < WIDTH; j++) {
			board[i].push('null');
		}
	}
	return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function updateScore (player, score) {
	localStorage.setItem(`p${player}CurrScore`, `${score}`);
	document.querySelector(`#p${player}-curr-score`).textContent = score;
}

function loadHighScores () {
	if (localStorage.getItem('p1HighScore') === null || localStorage.getItem('p2HighScore') === null) {
		localStorage.setItem('p1HighScore', '0');
		localStorage.setItem('p2HighScore', '0');
	}
	if (localStorage.getItem('p1HighScore') !== '0') {
		document.querySelector('#p1-high-score').textContent = localStorage.getItem('p1HighScore');
	}
	if (localStorage.getItem('p2HighScore') !== '0') {
		document.querySelector('#p2-high-score').textContent = localStorage.getItem('p2HighScore');
	}
}

function makeHtmlBoard () {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoardWrapper = document.createElement('div');
	htmlBoardWrapper.setAttribute('id', 'board-wrapper');
	document.querySelector('#game').append(htmlBoardWrapper);

	const htmlBoardBack = document.createElement('table');
	htmlBoardBack.setAttribute('id', 'board-back');
	htmlBoardWrapper.append(htmlBoardBack);

	const htmlBoard = document.createElement('table');
	htmlBoard.setAttribute('id', 'board');
	htmlBoardWrapper.append(htmlBoard);
	// TODO: add comment for this code
	//Create a row, assign it to variable 'top', and then give it an ID of 'column-top'. We then add an eventListener to execute the 'handleClick' function when 'top' is clicked.
	//Next, create WIDTH ammount of 'td' cells, give each an ID of 0 thru WIDTH - 1 in order of creation, and then append each one in order before the next is created - then we append the entire 'column-top' row to 'htmlBoard'.
	const topBack = document.createElement('tr');
	topBack.setAttribute('id', 'column-top-back');
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		topBack.append(headCell);
	}
	htmlBoardBack.append(topBack);

	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);
	hasListener = true;
	let topCircle;
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		topCircle = document.createElement('div');
		topCircle.setAttribute('id', x + 7);
		topCircle.className = 'hover-piece-p1';
		headCell.append(topCircle);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// TODO: add comment for this code
	//Create HEIGHT amount of 'tr' rows (each one declared with the varaible name 'row') by using a for loop with 'y' being the incrementing variable.  For each row, create WIDTH amount of 'td' cells (each one declared with the variable name 'cell') by using a nested for loop with 'x' being the incrememnting variable. Give each cell the unique ID of 'y-x' and append each cell to the corresponding row. Append each 'row' to 'htmlBoard' at the end of each iteration of the parent for loop.
	for (let y = HEIGHT - 1; y >= 0; y--) {
		const rowBack = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cellBack = document.createElement('td');
			rowBack.append(cellBack);
		}
		htmlBoardBack.append(rowBack);
	}

	for (let y = HEIGHT - 1; y >= 0; y--) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			const cellWrap = document.createElement('div');
			cellWrap.classList.add('cell-wrapper');
			cell.append(cellWrap);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
	// const backLayer = document.createElement('div');
	// htmlBoard.append(backLayer);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol (x) {
	// TODO: write the real version of this, rather than always returning 0
	let y = board.findIndex((row) => {
		return row[x] === 'null';
	});
	if (y === -1) {
		return null;
	}
	return y;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable (y, x) {
	// TODO: make a div and insert into correct table cell
	let className = 'p1';
	if (currPlayer === 2) {
		className = 'p2';
	}
	const piece = document.createElement('div');
	piece.classList.add('piece', className, `fall-r${y}`);

	const topX = document.getElementById(`${x + 7}`);
	topX.append(piece);

	const pieceCell = document.getElementById(`${y}-${x}`);
	pieceCell.querySelector('.cell-wrapper').append(piece);
}

/** endGame: announce game end */

function endGame (msg) {
	// TODO: pop up alert message
	if (currPlayer === 1) {
		document.querySelector('#p1-curr-score').style.color = 'limegreen';
		if (localStorage.getItem('p1HighScore') > p1Score || localStorage.getItem('p1HighScore') === '0') {
			localStorage.setItem('p1HighScore', p1Score);
			document.querySelector('#p1-high-score').textContent = p1Score;
			document.querySelector('#p1-high-score').style.color = 'limegreen';
		}
	} else if (currPlayer === 2) {
		document.querySelector('#p2-curr-score').style.color = 'limegreen';
		if (localStorage.getItem('p2HighScore') > p2Score || localStorage.getItem('p2HighScore') === '0') {
			localStorage.setItem('p2HighScore', p2Score);
			document.querySelector('#p2-high-score').textContent = p2Score;
			document.querySelector('#p2-high-score').style.color = 'limegreen';
		}
	}
	setTimeout(() => {
		alert(msg);
	}, 300);
}

/** handleClick: handle click of column top to play piece */

function handleClick (evt) {
	// get x from ID of clicked cell
	let x;
	if (evt.target.tagName === 'DIV') {
		x = +evt.target.id - 7;
	} else {
		x = +evt.target.id;
	}
	console.log(evt.target.tagName + ' : ' + x);
	// get next spot in column (if none, ignore click)
	var y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	if (currPlayer === 1) {
		p1Score++;
		updateScore(currPlayer, p1Score);
		console.log(p1Score);
	} else {
		p2Score++;
		updateScore(currPlayer, p2Score);
		console.log(p2Score);
	}

	// check for win
	if (checkForWin()) {
		const topRow = document.getElementById('column-top');
		topRow.removeEventListener('click', handleClick);
		const topRowArr = Array.from(topRow.querySelectorAll('td div'));
		topRowArr.map((div) => {
			return div.removeEventListener('click', handleClick);
		});
		hasListener = false;
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	let checkForTie = board.every((row) => {
		return row.every((slot) => {
			return slot !== null;
		});
	});
	if (!checkForTie) {
		endGame();
	}
	// switch players
	// TODO: switch currPlayer 1 <-> 2
	currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);

	const topRow = document.getElementById('column-top');
	const topRowArr = Array.from(topRow.querySelectorAll('td div'));
	topRowArr.map((div) => {
		div.className = `hover-piece-p${currPlayer}`;
	});
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin () {
	function _win (cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.
	//Create a for loop that uses the variable 'y' to iterate through the board row by row. Then, create a nested for loop that uses the variable 'x' to iterate thorugh each row cell by cell (or column by column) within the current row in the loop. For each iteration thorugh the nested loop, create 4 variables: horiz, vert, diagDR, diagDL (each being an array consisting of four sub-arrays, each subarray consisting of a potentially modified 'x,y coordinate')
	//
	//horiz: each subarray has the same 'y' value, but the 'x' value starts at 'x' in the first subarray and increments by 1 for each subsequent subarray. This means that 'horiz' represents a horizontal row pieces within row 'y'
	//vert: each subarray has the same 'x' value, but the 'y' value starts at 'y' in the first subarray and increments by 1 for each subsequent subarray. This means that 'vert' represents a vertical column of pieces within column 'x'
	//diagDR: the 'x' value starts at 'x' in the first subarray and increments by 1 for each subsequent subarray, and the 'y' value starts at 'y' in the first subarray and increments by 1 for each subsequent subarray. This means that 'diagDR' represents a diagonal series of 4 pieces that go down-right (I edited my code however to where row 0 is on the bottom instead of the top like it was originally written, so diagDR should be called diagDL and vise versa)
	//diagDL: the 'x' value starts at 'x' in the first subarray and decrements by 1 for each subsequent subarray, and the 'y' value starts at 'y' in the first subarray and increments by 1 for each subsequent subarray. This means that 'diagDL' represents a diagonal series of 4 pieces that go down-left (I edited my code however to where row 0 is on the bottom instead of the top like it was originally written, so diagDR should be called diagDL and vise versa)
	//
	//at the end of each iteration through the nested loop, there is an if statement to check if the _win function returns true when either 'horiz', 'vert', 'diagDR' or 'diagDL' is used as a parameter.
	for (var y = 0; y < HEIGHT; y++) {
		for (var x = 0; x < WIDTH; x++) {
			var horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			var vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			var diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			var diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

let resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.setItem('p1CurrScore', '0');
	localStorage.setItem('p2CurrScore', '0');
	p1Score = 0;
	p2Score = 0;
	let allPieces = Array.from(document.querySelectorAll('.piece'));
	for (let piece of allPieces) {
		piece.remove();
	}
	document.querySelector('#p1-curr-score').innerText = '';
	document.querySelector('#p2-curr-score').innerText = '';
	for (i = 0; i < board.length; i++) {
		for (j = 0; j < board[i].length; j++) {
			board[i][j] = 'null';
		}
	}
	loadHighScores();
	if (hasListener === false) {
		const topRow = document.getElementById('column-top');
		topRow.addEventListener('click', handleClick);
		const topRowArr = Array.from(topRow.querySelectorAll('td div'));
	}
	hasListener = true;
	currPlayer = 1;
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.getElementById(`${x}`);
		const topCircle = headCell.querySelector('div');
		topCircle.className = 'hover-piece-p1';
	}
	document.querySelector('#p1-curr-score').style.color = 'white';
	document.querySelector('#p2-curr-score').style.color = 'white';
	document.querySelector('#p1-high-score').style.color = 'rgb(255, 49, 49)';
	document.querySelector('#p2-high-score').style.color = 'rgb(38, 38, 255)';
});

makeBoard();
makeHtmlBoard();
loadHighScores();
