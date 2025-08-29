const caLib = {
  newGrid(length,dimension) { // new grid
    if (dimension === 0) return 0; // 0D array is basically element
    return Array.from({ length }, () => this.newGrid(length, dimension-1)); // recursion
  };
  setCell(grid,index,value) { // set cell
    const temp0 = JSON.parse(JSON.stringify(grid)); // immutable quirk 
    let temp1 = temp0
    for (let i = 0; i < index.length - 1; i++) {
      temp1 = temp1[index[i]]
    };
    temp1 = temp1[index[i]]
    return temp0
  }
};
export default caLib;
module.exports = caLib
