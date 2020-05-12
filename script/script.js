

// Variable Declaring 
var player = {"machine": 0, "user": 1} // code for each player
var starter = player.machine  // who will start the match
var current_player = starter // who will play now
var symbols = ['X', 'O']; // symbols for each player, according his code
var used_positions = []
var state = [[null, null, null],[null, null, null],[null, null, null]] // state = [ ["X", "O", "X"],["O", "O", "X"],["", "", "X"] ];
var ConsoleBoard = null;
var totalMoves = 0;
var match = 0;
var score = [0, 0];
var green_color = '#275673';
var gray_color = '#275673';

winPath = [
	[[0,0], [0,1], [0,2]],
	[[1,0], [1,1], [1,2]],
	[[2,0], [2,1], [2,2]],
	[[0,0], [1,0], [2,0]],
	[[0,1], [1,1], [2,1]],
	[[0,2], [1,2], [2,2]],
	[[0,0], [1,1], [2,2]],
	[[2,0], [1,1], [0,2]],
]

winPathB = [
	["B00", "B01", "B02"],
	["B10", "B11", "B12"],
	["B20", "B21", "B22"],
	["B00", "B10", "B20"],
	["B01", "B11", "B21"],
	["B02", "B12", "B22"],
	["B00", "B11", "B22"],
	["B20", "B11", "B02"],
]


window.onload = () => {
	ConsoleBoard = document.querySelector("#coding");
	ButtonGame = document.querySelector(".cell");
	initialize();

}

showState = (state) => {
	for (var i=0; i<3; i++)
		for (var j=0; j<3; j++) {
			elemento = document.querySelector("#B"+ i.toString() + j.toString());
			if (state[i][j] == undefined || state[i][j] == null)
				elemento.innerHTML = "&nbsp;";
			else
				elemento.innerHTML = state[i][j];
		}
}

initialize = () => {
	runGame()
}


restartVariables = () => {
	ConsoleBoard.innerText = '';
	colorPath(all_moves, '#ffffff');
	starter = changePlayerTime(starter, false)  
	current_player = starter;
	used_positions = []
	state = [[null, null, null],[null, null, null],[null, null, null]]
	totalMoves = 0;

}


runGame = () => {
	if (match > 0) {
		restartVariables();
		console.log("reseted");
	}
	match++;
	if(starter == player.machine) {
		position = chooseMachineStart(player.machine);
		used_positions.push(position);
		markBPosition(position, player.machine);
		console.log(state)
		showState(state);
	}
	showState(state);
	if (starter == player.machine) {
		totalMoves++;
		changePlayerTime();
	}
}

changePlayerTime = (last_moviment, define=true) =>{ 
	if(define) {
		current_player = (current_player == player.machine ? player.user : player.machine);
		return null;
	} else {
		return (last_moviment == player.machine ? player.user : player.machine);
	}
}

randomInteger = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

markBPosition = (positition, player) => {
	i = positition.substr(1,1);
	j = positition.substr(2,1);
	value = symbols[player];
	state[i][j] = symbols[player];
}

chooseMachineStart = (start_time) => {
	let start_possibilities = (start_time==0 ? first_start : second_start);
	size = start_possibilities.length 
	return start_possibilities[randomInteger(0, size - 1)];
}

availableMove = (position) => {  
	return !(used_positions.indexOf(position) >= 0)
}

findVictory = () => {
	firstMoves = []
	secondMoves = []
	for (let index = 0; index < used_positions.length; index+=1) {
		if(index%2==1) {
			secondMoves.push(used_positions[index]);
		} else {
			firstMoves.push(used_positions[index]);
		}
	}
	movesOccurred = [firstMoves, secondMoves];
	winPlayer = -1;
	winPathIdxUsed = -1;
	for (let index = 0; index < movesOccurred.length; index++) {
		const playersMoves = movesOccurred[index];
		for (let pathIdx = 0; pathIdx < winPathB.length; pathIdx++) {
			let path = winPathB[pathIdx];
			let count = 0;
			playersMoves.forEach(singleMove => {
				count += (path.indexOf(singleMove) != -1 ? 1 : 0); 
			});
			if(count == 3) {
				winPlayer = (index == 0 ? starter : (player.machine == starter ? player.user : player.machine))
				winPathIdxUsed = pathIdx;
				break;
			}
		}
		if (winPlayer != -1) {
			break;
		}
	}
	return {"userWinner": winPlayer, "winnerPathIdx": winPathIdxUsed}
}

colorPath = (listIds, color) => {
	listIds.forEach((element) => {
		divSelected = document.querySelector(`#${element.replace('B', 'C')}`);
		divSelected.style.background = color;
	})
}

gameIsEnd = () => {
	response = false;
	if(totalMoves>=5) {
		result = findVictory();
		if(result.userWinner != -1) {
			colorPath(winPathB[result.winnerPathIdx], green_color);
			winner = (result.userWinner == player.machine ? "MACHINE" : "PLAYER")
			score[winner]++;
			response = true;
		} else if (totalMoves == 9) {
			colorPath(all_moves, gray_color);
			response = true;
			console.log("endGmase")
		} else {
			response = false
		}
	}
	return response
}

playerClick = (id, i, j) => {
    available = availableMove(id);
	if(current_player != player.user) {
		return null;
	} else if (!available) {
		return null;
	}
	if (gameIsEnd()) {
		console.log("FIM");
		setTimeout(runGame, 1000)
		return null;
	}
	used_positions.push(id);
	state[i][j] = symbols[player.user];
	totalMoves++;
	showState(state);
	changePlayerTime();
	calculateMachineMove();
	if (gameIsEnd()) {
		console.log("FIM");
		setTimeout(runGame, 1000)
		return null;
	}

} 

arrayStartsWith = (arrayStart, arrayTest, min_diff_size = 0) => {
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

unchosen = (allPossible, selected) => {
	return allPossible.filter((eachPossible) => {
		return selected.indexOf(eachPossible)==-1;
	});
}

createPossibleMovesSufix = (usedMoves, nextMoves) => {
	newMoves = []
	nextMoves.forEach((eachMove) => {
		newMoves.push(usedMoves.concat([eachMove]))
	});
	return newMoves;
}

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


typing = (text, element, speed=5) => {
	var i = 0;
	typeWriter = () => {
		if (i < text.length) {
			element.innerText += text.charAt(i);
		  	i++;
		  	setTimeout(typeWriter, speed);
		}
	}
	typeWriter();
	element.scrollTop = element.scrollHeight - element.clientHeight;
}


getDatasetMoves = (samples) => {
	sampleSize = samples[0].length;
	baseObj = {
		presupport: 0, 
		confidenceDenominator: 0,
		liftDenominator: 0,
		minLength: 100,
		minPath: null
	};
	metrics = {
		"moves": [],
		"datasetMovesLen": 0,
		"measure": {},
	}
	samples.forEach((sample, idx) => {
		metrics.measure[idx] = Object.assign({}, baseObj);
		firstEl = sample[0];
		testeElement = sample.slice(0, sampleSize - 1);
		valueTeste = sample[sampleSize - 1];
		possibilities.forEach((element) => {
			if(element[0] == firstEl) {
				metrics['datasetMovesLen']++;
				if(arrayStartsWith(sample, element, 0)) {
					metrics.measure[idx].presupport++;
					if(element.length < metrics.measure[idx].minLength) {
						metrics.measure[idx].minLength = element.length
						metrics.measure[idx].minPath = element
					}
				}
				if(arrayStartsWith(element.slice(0, sampleSize-1), testeElement, 0)) {
					metrics.moves.push(element)
					metrics.measure[idx].confidenceDenominator++;
				}
				if(element[sampleSize - 1] == valueTeste) {
					metrics.measure[idx].liftDenominator++;
				}
			}
		});	
	});
	return metrics;
}

processMetrics = (objectValues) => {
	const arr = Object.values(metrics);
	// console.log(arr);
	listMaxIdx = [arr[0].id]
	idxMax = arr[0].id;
	valueMax = arr[0].lift;
	
	idxMin = arr[0].id;
	listMinIdx = [arr[0].id]
	valueMin = arr[0].minPathSize;
	for (let idx = 1; idx < arr.length; idx++) {
		if(arr[idx].lift >= valueMax) {
			if(arr[idx].lift == valueMax) {
				listMaxIdx.push(arr[idx].id);
			} else {
				listMaxIdx = [arr[idx].id]
			}
			idxMax = arr[idx].id;
			valueMax = arr[idx].lift;
		}
		if(arr[idx].minPathSize >= valueMin) {
			if(arr[idx].minPathSize == valueMin) {
				listMinIdx.push(arr[idx].id)
			} else {
				listMinIdx = [arr[idx].id]
			}
			idxMin = arr[idx].id;
			valueMin = arr[idx].minPathSize;
		}	
	}
	return {
		maxLift: valueMax,
		maxLiftIds: listMaxIdx,
		minPathSize: valueMin,
		minPathSizeIds: listMinIdx,
	}
}

reverseUsedPositions = () =>  {
	let reverseUsedPositionsArray = [];
	for (let index = 1; index < used_positions.length; index+=2) {
		reverseUsedPositionsArray.push(used_positions[index]);
		reverseUsedPositionsArray.push(used_positions[index - 1]);
	}
	return reverseUsedPositionsArray;
}

chooseNextMove = (who, reverse=false) =>  {
	options = {"win": 0, "old": 1}
	positionsToUse = (reverse ? reverseUsedPositions() : used_positions);
	unchosen_positions = unchosen(all_moves, positionsToUse);
	possibleMoves = createPossibleMovesPrefix(
		createPossibleMovesSufix(positionsToUse, unchosen_positions),
		[who, 'N']
	);
	console.log(possibleMoves)
	winMoves = possibleMoves[options.win];
	datasetMovesMetrics = getDatasetMoves(winMoves);
	if(datasetMovesMetrics.datasetMovesLen == 0) {
		datasetMovesMetrics = getDatasetMoves(possibleMoves[options.old]);
	}
	metrics = {}
	datasetMovesMetrics.datasetMovesLen;
	unchosen_positions.forEach((element, idx) => {
		metrics[element] = {};
		confidence = (datasetMovesMetrics.measure[idx].presupport / datasetMovesMetrics.measure[idx].confidenceDenominator);
		metrics[element].id = element;
		metrics[element].support = (datasetMovesMetrics.measure[idx].presupport / datasetMovesMetrics.datasetMovesLen);
		metrics[element].confidence = confidence
		metrics[element].minPathSize = datasetMovesMetrics.measure[idx].minLength;
		metrics[element].minPath =  datasetMovesMetrics.measure[idx].minPath;
		metrics[element].lift = (10-datasetMovesMetrics.measure[idx].minLength) - (confidence / datasetMovesMetrics.measure[idx].liftDenominator);
	});

	maxLiftID = processMetrics(metrics);
	return [maxLiftID, datasetMovesMetrics.measure, metrics]
}

calculateMachineMove = () => {
	console.log("Used Position:"+ used_positions)
	if (gameIsEnd()) {
		console.log("FIM");
		return null;
	}
	console.clear();
	unchosen_positions = unchosen(all_moves, used_positions);
	id = unchosen_positions[0];
	if(unchosen_positions.length != 1) {
		chosePlayerToStart = (starter == player.machine) ? 'F' : 'S';
		machineMetrics = chooseNextMove(chosePlayerToStart);
		playerMetrics = chooseNextMove(chosePlayerToStart, true);
		console.log(machineMetrics)
		console.log("Next Player:")
		console.log(playerMetrics)
		machineMetrics = machineMetrics[0]
		playerMetrics = playerMetrics[0]

		listPossibles = (machineMetrics.maxLiftIds.length <= machineMetrics.minPathSizeIds.length) ?
			machineMetrics.maxLiftIds : machineMetrics.minPathSizeIds
		if ((playerMetrics.minPathSize == used_positions.length+2 || playerMetrics.maxLift > machineMetrics.maxLift) 
			&& machineMetrics.minPathSize != used_positions.length+2) {
				listPossibles = (playerMetrics.maxLiftIds.length <= playerMetrics.minPathSizeIds.length) ?
					playerMetrics.maxLiftIds : playerMetrics.minPathSizeIds
		}
		id = listPossibles[randomInteger(0, listPossibles.length - 1)]
	}
	
	console.log(id)
	markBPosition(id, player.machine);
	used_positions.push(id);
	showState(state);
	totalMoves++;
	if (gameIsEnd()) {
		console.log("FIM");
		setTimeout(runGame, 1000)
		return null;
	}
	changePlayerTime();
}

