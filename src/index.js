const caLib = {
  newGrid(length,dimension) { // new grid
    if (dimension === 0) return 0; // 0D array is basically element
    return Array.from({ length }, () => this.newGrid(length, dimension-1)); // recursion
  },
  setCell(grid,index,value) { // set cell
    if (index.length === 0) return value;
    const [head, ...rest] = index;
    return [
      ...grid.slice(0, head),
      this.setCell(grid[head], rest, value),
      ...grid.slice(head + 1)
    ];
  }
};
export default caLib;
