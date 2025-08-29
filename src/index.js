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
