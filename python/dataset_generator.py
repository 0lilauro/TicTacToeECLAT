# -*- coding: utf-8 -*-
"""
Created on Fri Apr 24 22:37:02 2020

@author: lauro.teixeira
"""
from functools import reduce
from itertools import product
from itertools import groupby
from itertools import permutations
import pandas as pd

# each possible possition numered
positions = list(product(range(0,3,1),range(0,3,1)))
# each possible possition where the first number is the line and the second the column
positionsB = ["B00", "B01", "B02", "B10", "B11", "B12", "B20", "B21", "B22"]
# all possible path to play the game
all_paths = [list(i) for i in permutations(range(9), 9)]
# size of all possible paths
lenth = 362880

# paths needed to win the game.
victory = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], 
           [1,4,7], [2,5,8], [0,4,8],[2,4,6]]

base_dataset = []
size =  len(all_paths[0])
for i in range(0, len(all_paths)):  
    # Here we will discover if the player who starts the game won the match and which path was used
    path_win = -1
    who_win = "N"
    starter = [all_paths[i][0], all_paths[i][2], all_paths[i][4],
               all_paths[i][6], all_paths[i][8]] 
    for idx, win_path in enumerate(victory):
        if all(block in starter for block in win_path): 
            who_win = "F"
            path_win = idx
            break

    # Here we will discover if the player 2 won the match and which path was used
    if who_win != "N": 
        second = [all_paths[i][1],all_paths[i][3],
                  all_paths[i][5],all_paths[i][7]]
        for idx, win_path in enumerate(victory):
            if all(block in second for block in win_path): 
                who_win = "S"
                path_win = idx
                break
    
    # Here we will remove all the moves done after somone wins the match
    subset = all_paths[i].copy()
    if who_win != "N": 
        for m in range(5, size):
            logical = 1 if who_win == 'S' else 0
            if all(block in subset[logical:m:2] for block in victory[path_win]): 
                delets = (size-m)
                if delets > 0: 
                    for _ in range(0, delets):
                        subset.pop(-1)
                    break
    subset = subset + [who_win]                        
    base_dataset.append(subset)
    
print(len(base_dataset))
base_dataset[0:10]

# Analyse with pandas to see some probability statistics
base = pd.DataFrame(base_dataset)
base.drop_duplicates(inplace=True)
base.shape[0]
print(len(base_dataset))

# replacing the number position by the labeled positions (#B00, #B01, #B12, ...)
final_data = []
for e in base_dataset:
    test = [e[-1]]
    for i in e[0:-1]:     
        test.append(positionsB[i])    
    final_data.append(test)
final_data[28]

# Getting the uniques
final_data.sort()
final_data_un = list(final_data for final_data,_ in groupby(final_data))
dataset_final = final_data_un