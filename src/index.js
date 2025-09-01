// Note to self: comments should explain why, not what.
// Aim for immutability and statelessness, both to prevent side effects)

// Cellular Automata LIBrary
const caLib = {
  
  // returns a new grid
  // TODO: implement chunks (objects with position and array)
  // Rules are stored separately
  
  newGrid(chunkLength,dimension,quiescent) {

    // edge case: arrays can only have numeric length
    if (typeof(dimension) !== "number")   throw new TypeError(`Number expected, got a ${typeof dimension  }!`);
    if (typeof(chunkLength) !== "number") throw new TypeError(`Number expected, got a ${typeof chunkLength}!`);

    // edge case: negative dimension, may cause infinite recursion
    if (dimension < 0) throw new RangeError("Dimension can't be negative!");

    // edge case: chunk length isn't positive, is meaningless
    if (chunkLength < 1) throw new RangeError("Chunk length must be positive!");

    // edge case: arrays can't have floating point lengths
    if (!Number.isInteger(chunkLength)) throw new RangeError("Integer expected, got a floating point");
    if (!Number.isInteger(dimension)) throw new RangeError("Integer expected, got a floating point");
    
    // base case: leaf nodes return quiescent value no matter the side length
    if (dimension === 0) return quiescent;

    // make grid with no chunks
    return({dimension: dimension, quiescent: quiescent, chunkLength: chunkLength, chunks: []})
    
  },
  
  
  // return a grid but with the cell at index set to value
  // TODO: support chunks
  updateCell(grid,index,value) {

    // value can be anything, since caLib expects the cells to be anything

    // edge case: grid or index isn't array
    if (!Array.isArray(grid))  throw new TypeError(`Array expected, got a ${typeof grid}!`);
    if (!Array.isArray(index)) throw new TypeError(`Array expected, got a ${typeof index}!`);
    
    // edge case: if grid is 0D directly return the value
    if (index.length === 0) return value;
    
    // Destructure the indices for recursive updates
    const [head, ...rest] = index;

    // edge case: head out of bounds
    if (head >= grid.length || head < 0) throw new RangeError("Head out of range!");

    // for last recurstion layer, return a new array where only the target index is replaced with value
    return [
      ...grid.slice(0, head),
      this.updateCell(grid[head], rest, value),
      ...grid.slice(head + 1)
    ];
    
  },

  // Internal function
  // uses sequential method to find and return chunks
  findChunk(grid,index) {
    
    // uses sequential method to find chunk
    for (let i = 0; i < grid.chunks.length; i++) {
      if (grid.chunks[i].position = index) return grid.chunks[i]
    };
    // edge case: return new chunk if no existing one found
    const content = hypercube(grid.chunkLength,grid.dimension,grid.quiescent);
    return {position: index, content: content};
    
  },

  // Internal function
  // makes hypercube array
  hypercube(sideLength,dimension,fill) {

    const grid = [];
    
    // base case: leaf nodes
    if (dimension === 0) return fill;
    
    for (let i = 0; i < sideLength; i++) {
      grid[i] = this.hypercube(sideLength,dimension-1,fill)
    };

    return grid
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
      if (NEIGHBORS >=2 && NEIGHBORS <= 3 && CELL === 1) return 1;
    }
    */
  },

  // TODO: implement step algoritm with O(n) complexity
  step(grid,rule) {},
   // TODO: return the grid with each cell applied with rule function
   // rule is a function that parses a variable called 'cell' 
};


export default caLib;
