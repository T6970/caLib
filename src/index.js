// Note to self: comments should explain the purpose of code, not what it do.

// Cellular Automata LIBrary
const caLib = {
  
  // new grid
  // TODO: implement chunks
  newGrid(length,dimension,default) {
    
    // edge case: terminate and return default value because the recursion would eventually decrement the dimension to 0
    if (dimension === 0) return default;
    
    // recursion by calling newGrid with one less dimension
    return Array.from({ length }, () => this.newGrid(length, dimension-1))
    
    // therefore this would create a square grid of a certain dimension
    
  },
  
  
  // set the cell of a grid
  // TODO: support chunks
  setCell(grid,index,value) {

    // edge case: if grid is 0D directly return the value
    if (index.length === 0) return [value];

    // 
    const [head, ...rest] = index;
    
    // 
    return [
      ...grid.slice(0, head),
      this.setCell(grid[head], rest, value),
      ...grid.slice(head + 1)
    ];
    
  },

  // TODO: support B/S and Hensel notation
  toRule(rulestring) {},

  // TODO: implement step algoritm with O(1) complexity
  step(grid,rule) {},
};


export default caLib;
