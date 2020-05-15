

// ===== Variable Declaring =====

var player = {"machine": 0, "user": 1} // code for each player
var starter = player.machine  // who will start the match
var currentPlayer = starter // who will play now
var symbols = ['X', 'O']; // symbols for each player, according his code
var usedPositions = []; // positions used along the match
var state = [[null, null, null],[null, null, null],[null, null, null]] // state = [ ["X", "O", "X"],["O", "O", "X"],["", "", "X"] ];
var totalMoves = 0; // qtd of moves used during the match
var match = 0; // the current number of the match
var score = [0, 0]; // the score for each player
var greenColor = '#39b4ff'; // green color hex
var grayColor = '#275673'; // gray color hex
var hasSummed = false; // if the winner point has already been summed.
var winPath = [
	[[0,0], [0,1], [0,2]],
	[[1,0], [1,1], [1,2]],
	[[2,0], [2,1], [2,2]],
	[[0,0], [1,0], [2,0]],
	[[0,1], [1,1], [2,1]],
	[[0,2], [1,2], [2,2]],
	[[0,0], [1,1], [2,2]],
	[[2,0], [1,1], [0,2]],
]; // All possibles path to win the match
var winPathB = [
	["B00", "B01", "B02"],
	["B10", "B11", "B12"],
	["B20", "B21", "B22"],
	["B00", "B10", "B20"],
	["B01", "B11", "B21"],
	["B02", "B12", "B22"],
	["B00", "B11", "B22"],
	["B20", "B11", "B02"],
]

// ===== windows loading settings ===== 
window.onload = () => {
	var ScoreBoard = document.querySelector("#score"); // paragraph where the score are being printed
	initialize();
}

// Function that turn the state variable to a visual points in the HTML
showState = (state) => {
	for (var i=0; i<3; i++) {
		for (var j=0; j<3; j++) {
			elemento = document.querySelector("#B"+ i.toString() + j.toString());
			if (state[i][j] == undefined || state[i][j] == null) {
				elemento.innerHTML = "&nbsp;";
			}
			else {
				elemento.innerHTML = state[i][j];
			}
		}
	}
}

// Function that initialize the Game
initialize = () => {
	runGame();
}

// Function to print the current score
printScore = () => {
	ScoreBoard = document.querySelector("#score");
	ScoreBoard.innerText = `(Máquina) ${score[player.machine]} X ${score[player.user]} (Humano)`;
}

// Function  to restart the variables to a new match
restartVariables = () => {
	colorPath(all_moves, 'none');
	hasSummed = false;
	starter = changePlayerTime(starter, false);
	currentPlayer = starter;
	usedPositions = [];
	state = [[null, null, null],[null, null, null],[null, null, null]];
	totalMoves = 0;
}

// Run Game Function to start the game
runGame = () => {
	// verify if it isn't the first match
	if (match > 0) {
		restartVariables();
		console.log("reseted");
	}
	match++;
	// verify if the start player is the machine
	if(starter == player.machine) {
		// choose a random position with high probability of win to start.
		position = chooseMachineStart(player.machine);
		usedPositions.push(position);
		markBPosition(position, player.machine);
		console.log(state);
		showState(state);
	}
	// render the game 
	showState(state);
	// change the time to play to other user if the machine start
	if (starter == player.machine) {
		totalMoves++;
		changePlayerTime();
	}
}

// Function to change the game player
changePlayerTime = (lastMoviment, define=true) =>{ 
	if(define) {
		// if define is true, change the current player time
		currentPlayer = (currentPlayer == player.machine ? player.user : player.machine);
		return null;
	} else {
		// if define is false  return the oposit playr of the passed on the parameter 
		return (lastMoviment == player.machine ? player.user : player.machine);
	}
}

// Generator of random integer between the interval passed
randomInteger = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// use a Bcode (#B10) to change the variable state and add a new game move for a player.
markBPosition = (positition, player) => {
	i = positition.substr(1,1);
	j = positition.substr(2,1);
	value = symbols[player];
	state[i][j] = symbols[player];
}

// Choose a random starts to the machine with the high possibilities
chooseMachineStart = (startTime) => {
	let startPossibilities = (startTime == 0 ? first_start : second_start);
	return startPossibilities[randomInteger(0, startPossibilities.length - 1)];
}

// Verify if the passed move is available
availableMove = (position) => {  
	return (usedPositions.indexOf(position) < 0);
}

// Funcion if an win has ocurred and who wins;
findVictory = () => {
	// Separating the moves of each player
	let firstMoves = [];
	let secondMoves = [];
	for (let index = 0; index < usedPositions.length; index+=1) {
		if(index%2==1) {
			secondMoves.push(usedPositions[index]);
		} else {
			firstMoves.push(usedPositions[index]);
		}
	}
	movesOccurred = [firstMoves, secondMoves];
	winPlayer = -1;
	winPathIdxUsed = -1;
	// verifing if an victory ocurred
	for (let index = 0; index < movesOccurred.length; index++) {
		const playersMoves = movesOccurred[index];
		for (let pathIdx = 0; pathIdx < winPathB.length; pathIdx++) {
			let path = winPathB[pathIdx];
			let count = 0;
			// testing each path with the players moves
			playersMoves.forEach(singleMove => {
				count += (path.indexOf(singleMove) != -1 ? 1 : 0); 
			});
			// testing if the path used is an winpath
			if(count == 3) {
				winPlayer = (index == 0 ? starter : (player.machine == starter ? player.user : player.machine));
				winPathIdxUsed = pathIdx;
				break;
			}
		}
		if (winPlayer != -1) {
			break;
		}
	}
	// returns a object with the winner and the path used to win (to highlight)
	return {"userWinner": winPlayer, "winnerPathIdx": winPathIdxUsed};
}

// Function to costumize the colors of game the board
colorPath = (listIds, color) => {
	listIds.forEach((element) => {
		divSelected = document.querySelector(`#${element.replace('B', 'C')}`);
		divSelected.style.background = color;
	})
}

// Verify if the game ends and add score to the winner
gameIsEnd = () => {
	response = false;
	// if exits enough moves to someone wins
	if(totalMoves>=5) {
		// if a winner exists
		result = findVictory();
		if(result.userWinner != -1) {
			colorPath(winPathB[result.winnerPathIdx], greenColor);
			winner = (result.userWinner == player.machine ? "MACHINE" : "PLAYER")
			// sum points if somone wins
			if(!hasSummed) {
				score[result.userWinner]++;
				hasSummed = true
			}
			// print the scores
			printScore();
			response = true;
		} else if (totalMoves == 9) {
			// if all movas had been done and no one wins
			colorPath(all_moves, grayColor);
			// color all the cells 
			response = true;
			console.log("endGmase");
		} else {
			response = false;
		}
	}
	return response;
}

// Execute the move of the fisical player and change the player time
playerClick = (id, i, j) => {
	// verify if the move is available
    available = availableMove(id);
	// teste the current player
	if(currentPlayer != player.user) {
		return null;
	} else if (!available) {
		return null;
	}
	// test if the game ends
	if (gameIsEnd()) {
		console.log("FIM");
		setTimeout(runGame, 1000);
		return null;
	}
	// add the move of the player to the move useds
	usedPositions.push(id);
	state[i][j] = symbols[player.user];
	totalMoves++;
	showState(state);
	// change the game time;
	changePlayerTime();
	// calculate the Machine moves to do the next move
	calculateMachineMove();
	// test if the game ends
	if (gameIsEnd()) {
		console.log("FIM");
		setTimeout(runGame, 1000);
		return null;
	}
} 

// function to test if the array starts with the other array elements
arrayStartsWith = (arrayStart, arrayTest, min_diff_size = 0) => {
	// its possible to fit the same size or a minimal dif size needed to compare
	response =  false;
	if (arrayTest.length >= arrayStart.length + min_diff_size) {
		response = true;
		arrayStart.forEach((element, idx) => {
			if(element != arrayTest[idx]) {
				response = false;
			}
		});
	}
	return response;
}

// return all possibles moves available
unchosen = (allPossible, selected) => {
	return allPossible.filter((eachPossible) => {
		return selected.indexOf(eachPossible)==-1;
	});
}

// create a list of all availables next moves
// Add the a item at the before the list starts 
createPossibleMovesSufix = (usedMoves, nextMoves) => {
	newMoves = []
	nextMoves.forEach((eachMove) => {
		newMoves.push(usedMoves.concat([eachMove]))
	});
	return newMoves;
}

// create a list of all availables next moves
// Add the a item at the after the list ends 
createPossibleMovesPrefix = (usedMoves, previousMoves) => {
	newMoves = []
	previousMoves.forEach((eachMove, idx) => {
		newMoves.push([]);
		usedMoves.forEach((eachUsed) => {
			newMoves[idx].push([eachMove].concat(eachUsed))
		})
	});
	return newMoves;
}

// get the sample moves and generate the pre metrics of ECLAT
getDatasetMoves = (samples) => {
	let sampleSize = samples[0].length;
	// create a base object to store some metrics
	let baseObj = {
		presupport: 0, 
		confidenceDenominator: 0,
		liftDenominator: 0,
		minLength: 100,
		minPath: null
	};
	let metrics = {
		"moves": [],
		"datasetMovesLen": 0,
		"measure": {},
	}
	// running through all samples generated by the user
	samples.forEach((sample, idx) => {
		// initialize the metrics
		metrics.measure[idx] = Object.assign({}, baseObj);
		let firstEl = sample[0];
		let testeElement = sample.slice(0, sampleSize - 1);
		let valueTeste = sample[sampleSize - 1];
		// iterate all game possibilities of path 
		possibilities.forEach((element) => {
			// test if it's the same objective of path (first wins, second wins or no one wins)
			if(element[0] == firstEl) {
				// start to counting;
				metrics['datasetMovesLen']++;
				// condition to count the support numerator of ECLAT algorithm
				if(arrayStartsWith(sample, element, 0)) {
					metrics.measure[idx].presupport++;
					// finding the minimal path
					if(element.length < metrics.measure[idx].minLength) {
						metrics.measure[idx].minLength = element.length;
						metrics.measure[idx].minPath = element;
					}
				}
				// counting the ocurrencies of the start of list given the last element
				if(arrayStartsWith(element.slice(0, sampleSize-1), testeElement, 0)) {
					metrics.moves.push(element);
					// counting the confidence denominator parameter 
					metrics.measure[idx].confidenceDenominator++;
				}
				// counting the lift denominator parameter
				if(element[sampleSize - 1] == valueTeste) {
					metrics.measure[idx].liftDenominator++;
				}
			}
		});	
	});
	// return the object of metrics
	return metrics;
}

// get the calculated matrics and find the better moves paths
processMetrics = (objectValues) => {
	const arr = Object.values(objectValues);
	let listMaxIdx = [arr[0].id];
	let idxMax = arr[0].id;
	let valueMax = arr[0].lift;
	let idxMin = arr[0].id;
	let listMinIdx = [arr[0].id]
	let valueMin = arr[0].minPathSize;
	// test if each element are the best
	for (let idx = 1; idx < arr.length; idx++) {
		// find the highest lift
		if(arr[idx].lift >= valueMax) {
			if(arr[idx].lift == valueMax) {
				listMaxIdx.push(arr[idx].id);
			} else {
				listMaxIdx = [arr[idx].id];
			}
			idxMax = arr[idx].id;
			valueMax = arr[idx].lift;
		}
		// fint the minimal path
		if(arr[idx].minPathSize >= valueMin) {
			if(arr[idx].minPathSize == valueMin) {
				listMinIdx.push(arr[idx].id);
			} else {
				listMinIdx = [arr[idx].id];
			}
			idxMin = arr[idx].id;
			valueMin = arr[idx].minPathSize;
		}	
	}
	// return the set of metrics calculated;
	return {
		maxLift: valueMax,
		maxLiftIds: listMaxIdx,
		minPathSize: valueMin,
		minPathSizeIds: listMinIdx,
	}
}

// create a list changing the order of moves of the first and second player
reverseUsedPositions = () =>  {
	let reverseUsedPositionsArray = [];
	for (let index = 1; index < usedPositions.length; index+=2) {
		// change the order of the player moves
		reverseUsedPositionsArray.push(usedPositions[index]);
		reverseUsedPositionsArray.push(usedPositions[index - 1]);
	}
	return reverseUsedPositionsArray;
}

// function to return the possibles next moves (the best | high possibilities)
chooseNextMove = (who, reverse=false) =>  {
	let options = {"win": 0, "old": 1};
	// create a list for win or tie the game
	let positionsToUse = (reverse ? reverseUsedPositions() : usedPositions);
	let unchosenPositions = unchosen(all_moves, positionsToUse);
	let possibleMoves = createPossibleMovesPrefix(
		createPossibleMovesSufix(positionsToUse, unchosenPositions),
		[who, 'N']
	);
	// create the list of possibles next moves
	console.log(possibleMoves)
	winMoves = possibleMoves[options.win];
	datasetMovesMetrics = getDatasetMoves(winMoves);
	// if the machine doesnt have chance to win, use the paths to tie the game;
	if(datasetMovesMetrics.datasetMovesLen == 0) {
		datasetMovesMetrics = getDatasetMoves(possibleMoves[options.old]);
	}
	let metrics = {};
	// calculate the parameters for ECLAT ALGORITHM in a object 
	unchosenPositions.forEach((element, idx) => {
		metrics[element] = {};
		confidence = (datasetMovesMetrics.measure[idx].presupport / datasetMovesMetrics.measure[idx].confidenceDenominator);
		metrics[element].id = element;
		// Gets the SUPPORT value
		metrics[element].support = (datasetMovesMetrics.measure[idx].presupport / datasetMovesMetrics.datasetMovesLen);
		// Gets the CONFIDENCE value
		metrics[element].confidence = confidence;
		// Gets the min size of path to win
		metrics[element].minPathSize = datasetMovesMetrics.measure[idx].minLength;
		metrics[element].minPath =  datasetMovesMetrics.measure[idx].minPath;
		// Calculates the LIFT and use the value of min size to give weight to the lift value. ( if the path is short, turn up the value of lift, else down)
		metrics[element].lift = (10-datasetMovesMetrics.measure[idx].minLength) - (confidence / datasetMovesMetrics.measure[idx].liftDenominator);
	});
	// process and return the metrics
	maxLiftID = processMetrics(metrics);
	return [maxLiftID, datasetMovesMetrics.measure, metrics];
}

// Calculate the next machine moves
calculateMachineMove = () => {
	console.log("Used Position:"+ usedPositions);
	// tests if the game ends;
	if (gameIsEnd()) {
		console.log("FIM");
		return null;
	}
	console.clear();
	// getts the unchosen positions
	let unchosenPositions = unchosen(all_moves, usedPositions);
	let id = unchosenPositions[0];
	if(unchosenPositions.length != 1) {
		// find if the machine is the start player or not
		let chosePlayerToStart = (starter == player.machine) ? 'F' : 'S';
		// calculate the possibilites of the machine
		let machineMetrics = chooseNextMove(chosePlayerToStart);
		// calculate the possibilites of the player (if he could play the next move)
		let playerMetrics = chooseNextMove(chosePlayerToStart, true);
		console.log(machineMetrics);
		console.log("Next Player:");
		console.log(playerMetrics);
		machineMetrics = machineMetrics[0]
		playerMetrics = playerMetrics[0]

		// get the list of possibles next moves, of the player who have the minimal path to win. IF equals, the machine
		let listPossibles = (machineMetrics.maxLiftIds.length <= machineMetrics.minPathSizeIds.length) ?
			machineMetrics.maxLiftIds : machineMetrics.minPathSizeIds
		// if the next move will make the enemy wins or his lift its higher choose his paths, else the machine paths.
		if ((playerMetrics.minPathSize == usedPositions.length+2 || playerMetrics.maxLift > machineMetrics.maxLift) 
			&& machineMetrics.minPathSize != usedPositions.length+2) {
				listPossibles = (playerMetrics.maxLiftIds.length <= playerMetrics.minPathSizeIds.length) ?
					playerMetrics.maxLiftIds : playerMetrics.minPathSizeIds
		}
		// get the possibilities random between the paths with highests lifts
		id = listPossibles[randomInteger(0, listPossibles.length - 1)];
	}
	console.log(id);
	// mark the positions
	markBPosition(id, player.machine);
	usedPositions.push(id);
	// render the game 
	showState(state);
	totalMoves++;
	// gets if the game ends
	if (gameIsEnd()) {
		console.log("FIM");
		setTimeout(runGame, 1000);
		return null;
	}
	// change the player time
	changePlayerTime();
}

