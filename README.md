
# Tic Tac Toe Game - With ECLAT  Algorithm
## Jogo da velha com algoritmo ECLAT

![alt text](https://upload.wikimedia.org/wikipedia/commons/3/32/Tic_tac_toe.svg "TicTacToe Game")

This project has been made with the purpose to use the ECLAT Algorithm to recommend the moves of the machin in a Tic Tac Toe Game.

## Contextualizing
The project was created with 2 parts: 
* Generate all possible Paths to win using python.
* Build the game and the algorithm (without any library) with ES6 (Java Script).

## Python Code

The only not built-in module used was just [Pandas](https://pandas.pydata.org/) DataFrame.
The code are all commented to give a better idea of what has been made. 

First step was generate all possible paths with permutation in python. Each element of a list
was a move. The ordering represented the time play, for exemple, the first move is represented
by the first element on the list, the second too and so on. 
Using this method I was able to reduce the infromation of a TicTacToe Game to a single dataset.

After some processing describing the winner, and removing the clutter, the dataset was ready to be used on JS.

## Java Script Code 

After import the dataset from python code (manually), the funny starts. All the code is simple,
some variables take care of the environment of the game and some functions are used to choose the machine moves.
For decide the next move, the machine creates a dataset of all possible paths to win and to tie the game, then using this lists
all possibles game array is used to teste the ECLAT algorithm to get the result of some coeficients to compare which is the best path.

Other strategy used was to calculate the LIFT of all possible next machine moves and all possible next player moves to compare who has the highest LIFT score. If it's the player, the machine tries to block the player else, the machine choose the best path to win.
Another info it's that the LIFT score it's using a extra weight, the size of the path. Short path helps the LIFT score to increase.

## Built With
* [Python](https://www.python.org/)
* [JavaScript](https://www.javascript.com/)

## Versioning
Verions **1.0.0** - [TicTacToeECLAT Repository](httpshttps://github.com/0lilauro/TicTacToeECLAT). 

## Author
* **Lauro Oliveira** - [LinkedIn](https://www.linkedin.com/in/laurocoliveira/)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details