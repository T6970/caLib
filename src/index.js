const caLib = {
  newGrid(length,dimension) {
    if (dimension === 0) return 0;
    const grid = new Array(length);
    for (let i = 0; i < length; i++) {
      grid.i = this.newGrid(length,dimension-1)
    }
    return grid
  };
  setCell(grid,index,value) {
    let temp = grid;
    for (let i = 0; i < index.length - 1; i++) {
      temp = temp[index[i]]
    };
    
  }
};
export default caLib;
module.exports = caLib
