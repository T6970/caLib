// Note to self: comments should explain the purpose of code, not what it do.
// Aim for immutability (to prevent side effects) and stateless (to prevent side effects)

// Cellular Automata LIBrary
const caLib = {
  
  // returns a new grid
  // TODO: implement chunks (objects with position and array)
  // A grid with chunks look like this:
  /*
    {
      dimension: 2,
      chunks: [
        {
          position: [3,2],
          grid: [
            [0,0,0,0]
            [2,2,2,0]
            [0,0,2,0]
            [0,2,0,0]
          ]
        },
        {
          position: [3,3],
          grid: [
            [0,0,1,0]
            [0,0,0,1]
            [0,1,1,1]
            [0,0,0,0]
          ]
        }
      ]
    }
  */
  // Rules are stored separately
  
  newGrid(sideLength,dimension,quiescent) {

    // edge case: side length and dimension must be a number
    if (typeof(dimension) !== "number")  throw new TypeError(`Number expected, got a ${typeof dimension}!`);
    if (typeof(sideLength) !== "number") throw new TypeError(`Number expected, got a ${typeof sideLength}!`);

    // edge case: negative side length and dimension
    if (sideLength < 0) throw new RangeError("Side length can't be negative!")
    if (dimension < 0)  throw new RangeError("Dimension can't be negative!!!")

    // edge case: side length is 0, return empty array no matter the dimension
    if (sideLength === 0) return [];
    
    // base case: leaf nodes return quiescent value
    if (dimension === 0) return quiescent;
    
    // recursion by calling newGrid with one less dimension
    return Array.from({ length: sideLength }, () => this.newGrid(sideLength, dimension-1, quiescent))
    
    // therefore this would create a hypercube grid of a certain dimension
    // one dimension because implementation of chunks would render that useless
    
  },
  
  
  // return a grid but with the cell at index set to value
  // TODO: support chunks
  updateCell(grid,index,value) {
    
    // edge case: if grid is 0D directly return the value
    if (index.length === 0) return value;
    
    // Destructure the indices for recursive updates
    const [head, ...rest] = index;

    // edge case: head out of bounds
    if (head >= grid.length || head < 0) throw new RangeError("Head out of range!")
    
    // return a new array where only the target index is replace with value
    return [
      ...grid.slice(0, head),
      this.updateCell(grid[head], rest, value),
      ...grid.slice(head + 1)
    ];
    
  },

  // TODO: support B/S and Hensel notation
  // B/S notation between B/S and B01234678/S012345678
  // Hensel notation between B/S and B01ce2aceikn3aceijknqr4aceijknqrtwyz5aceijknqr6aceikn7ce8/S01ce2aceikn3aceijknqr4aceijknqrtwyz5aceijknqr6aceikn7ce8
  toRule(rulestring) {
    // TODO: return a function
    /*
    Conway's Life:
    rule(chunk,indexX,indexY) {
      // neighbor count
      const NEIGHBORS = chunk[indexX+1][indexY] + chunk[indexX+1][indexY+1] + chunk[indexX][indexY+1] + chunk[indexX-1][indexY+1] + chunk[indexX-1][indexY] + chunk[indexX-1][indexY-1] + chunk[indexX][indexY-1] + chunk[indexX+1][indexY-1];
      const CELL = chunk[indexX][indexY];
      // B3
      if (NEIGHBORS === 3 && CELL === 0) return 1;
      // S23
      if (NEIGHBORS === 2 && CELL >= 2 && CELL <= 3) return 1;
    }
    */
  },

  // TODO: implement step algoritm with O(n) complexity
  step(grid,rule) {},
   // TODO: return the grid with each cell applied with rule function
   // rule is a function that parses a variable called 'cell' 
};


export default caLib;
