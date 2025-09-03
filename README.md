# caLib
Cellular automata simulation library in JavaScript

---

## About

caLib is a JavaScript library that provides an engine for cellular automata simulation. 
caLib supports grid of any dimension, and could handle any cellular automata by converting them to JavaScript functions.

## Usage
- `caLib.newGrid(length,dimension)` outputs a new grid array with specified dimension

-  `caLib. updateCell(grid,index,value)` outputs the grid but with the cell at index changed to value

- `caLib.toRule(rule)` converts B/S or Hensel notation rulestring to function usable by caLib

- `caLib.step(rule,grid)` outputs the next generation of the specified grid, with specified rule applied to each cell

