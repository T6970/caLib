// NOTE: comments should explain why, not what.
// Aim for immutability and statelessness, both to prevent side effects)

// TODO: make docstring

const caLib = {

  // External function
  // returns a new grid
  // rules are stored separately
  newGrid(chunkLength,dimension,quiescent) {

    // validity check
    if (typeof(dimension)   !== "number") throw new TypeError  ( `Number expected, got a ${typeof dimension  }!` );
    if (typeof(chunkLength) !== "number") throw new TypeError  ( `Number expected, got a ${typeof chunkLength}!` );
    if (dimension   < 0)                  throw new RangeError ( "Dimension can't be negative!"                  );
    if (chunkLength < 1)                  throw new RangeError ( "Chunk length must be positive!"                );
    if (!Number.isInteger(chunkLength)  ) throw new RangeError ( "Integer expected, got a floating point!"       );
    if (!Number.isInteger(dimension  )  ) throw new RangeError ( "Integer expected, got a floating point!"       );
    
    // base case: leaf nodes return quiescent value no matter the side length
    if (dimension === 0) return quiescent;

    // make grid with no chunks
    return(
      {
        dimension   : dimension   , 
        quiescent   : quiescent   , 
        chunkLength : chunkLength , 
        chunks      : [] // chunks are created lazily
      }
    )
    
  },
  
  // External function
  // return a grid but with the cell at index set to value
  updateCell(grid,index,value) {
    
    // edge case: the function can't process non-arrays
    if (!Array.isArray(grid.chunks)) throw new TypeError(`Array expected, got a ${typeof grid}!` );
    if (!Array.isArray(index      )) throw new TypeError(`Array expected, got a ${typeof index}!`);
    
    // edge case: if grid is 0D directly return the value
    if (index.length === 0) return value;

    const newChunk     = this._findChunk(grid,this._multiplyElements(index, grid.chunkLength));
    const newContent   = structuredClone(newChunk.content); // deep copy to avoid mutation
          newContent   = this._setElement(newContent,index,value);
    const updatedChunk = {...newChunk,content:newContent};
    
    const chunksWithoutOld = grid.chunks.filter(c => !this._equalArray(c.position, newChunk.position));
    return { ...grid, chunks: [...chunksWithoutOld, updatedChunk] };

    
  },

  
  // Internal function
  // uses sequential method to find and return chunks
  // TODO: use Map for fast lookup
  _findChunk(grid,index) {
    
    // find chunk
    const chunk = grid.chunks.find(c => this._equalArray(c.position, index));
    if (chunk) return chunk;
    
    // edge case: return new chunk if no existing one found
    const content = this._hypercube(grid.chunkLength,grid.dimension,grid.quiescent);
    return {position: index, content: content};
    
  },

  
  // Internal function
  // makes hypercube array
  _hypercube(sideLength,dimension,fill) {
    const grid = [];
    if (dimension === 0) return fill; // base case: leaf nodes
    for (let i = 0; i < sideLength; i++) {
      grid[i] = this._hypercube(sideLength,dimension-1,fill)
    };
    return grid
  },

  // Internal function
  _multiplyElements(array,multiplier=1) {return array.map(num => num * multiplier)},

  // Internal function
  _findElement(array,index) {
    // edge case: the function can't process non-arrays
    if (!Array.isArray(array)) throw new TypeError(`Array expected, got a ${typeof array}!`);
    if (!Array.isArray(index)) throw new TypeError(`Array expected, got a ${typeof index}!`);

    let element = array;
    for (const idx of index) {
      if (!Array.isArray(element)         ) throw new RangeError("Index exceeds array depth!");
      if (idx >= element.length || idx < 0) throw new RangeError("Index out of bounds!"      );
      element = element[idx]
    };
    return element
    
  },

  // Internal function
  // sets element of an array
  _setElement(array,index,value) {
    const result = array
    // edge case: the function can't process non-arrays
    if (!Array.isArray(array)) throw new TypeError(`Array expected, got a ${typeof array}!`);
    if (!Array.isArray(index)) throw new TypeError(`Array expected, got a ${typeof index}!`);
    
    let current = result;
    for (let i = 0; i < index.length - 1; i++) {
      current = current[index[i]]
    };
    current[index[index.length - 1]] = value;
    return result
  },


  // Internal function
  // normal equality don't compare array content
  _equalArray(a,b) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index])
  },

  // External function
  // TODO [priority: mid]: support B/S and Hensel notation
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

  // External function
  // TODO [priority: high]: implement step algoritm with O(n) complexity
  // only update non-quiescent cells and their neighbors
  step(grid,rule) {},
   // TODO: return the grid with each cell applied with rule function
   // rule is a function that parses a variable called 'cell' 
};


export default caLib;
