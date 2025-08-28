# caLib
Cellular automata simulation library in JavaScript

---

## Usage
- `caLib.newGrid(dimension)` outputs a new grid array with specified dimension

- `caLib.rulestring(rule)` converts B/S or Hensel notation rulestring to function usable by caLib

- `caLib.step(rule,grid)` outputs the next generation of the specified grid, with specified rule applied to each cell
