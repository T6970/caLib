// Cellular Automata Library
// Emphasizes immutability and statelessness to avoid side effects.

const caLib = {

  /**
   * Creates a new grid.
   * @param {number} chunkLength - Length of each chunk side.
   * @param {number} dimension - Number of dimensions (0D..nD).
   * @param {*} quiescent - Default state of cells.
   * @returns {object} - An immutable grid object.
   */
  newGrid(chunkLength, dimension, quiescent) {
    // Validate inputs
    if (!Number.isInteger(chunkLength) || chunkLength < 1)
      throw new RangeError("Chunk length must be a positive integer!");
    if (!Number.isInteger(dimension) || dimension < 0)
      throw new RangeError("Dimension must be a non-negative integer!");

    // Edge case: 0D grid is just the quiescent state
    if (dimension === 0) return quiescent;

    return Object.freeze({
      chunkLength,
      dimension,
      quiescent,
      chunks: new Map(), // Map<JSON-stringified chunk index, chunk content>
    });
  },

  /**
   * Returns a new grid with one cell updated.
   * @param {object} grid - The grid object.
   * @param {number[]} index - Coordinates of the cell.
   * @param {*} value - New cell value.
   */
  updateCell(grid, index, value) {
    if (!Array.isArray(index))
      throw new TypeError(`Index must be an array, got ${typeof index}`);

    // Edge case: 0D grid → just return the value directly
    if (grid.dimension === 0) return value;

    // Calculate chunk and local coordinates
    const chunkIndex = index.map(i => Math.floor(i / grid.chunkLength));
    const localIndex = index.map(i => ((i % grid.chunkLength) + grid.chunkLength) % grid.chunkLength);

    const key = JSON.stringify(chunkIndex);
    const oldChunk = grid.chunks.get(key) ?? this._makeHypercube(grid.chunkLength, grid.dimension, grid.quiescent);

    // Apply immutable set
    const newChunk = this._immutableSet(oldChunk, localIndex, value);

    // Replace chunk in a new Map
    const newChunks = new Map(grid.chunks);
    newChunks.set(key, newChunk);

    return Object.freeze({ ...grid, chunks: newChunks });
  },

  /**
   * Creates an n-dimensional hypercube array filled with `fill`.
   * @param {number} sideLength
   * @param {number} dimension
   * @param {*} fill
   * @returns {Array|*}
   */
  _makeHypercube(sideLength, dimension, fill) {
    if (dimension === 0) return fill;
    return Array.from({ length: sideLength }, () =>
      this._makeHypercube(sideLength, dimension - 1, fill)
    );
  },

  /**
   * Immutable setter for n-dimensional arrays.
   * @param {Array|*} array
   * @param {number[]} index
   * @param {*} value
   * @returns {Array|*}
   */
  _immutableSet(array, index, value) {
    if (index.length === 0) return value;

    const [head, ...tail] = index;
    if (!Array.isArray(array))
      throw new RangeError("Index exceeds array depth!");

    return array.map((el, i) =>
      i === head ? this._immutableSet(el, tail, value) : el
    );
  },

  /**
   * Checks deep equality of two arrays.
   */
  _equalArray(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  },

  /**
   * Placeholder for rule parsing (B/S, Hensel).
   */
  toRule(rulestring) {
    // TODO: Implement rulestring parser
    return () => {}; // Return a no-op rule for now
  },

  /**
   * Advances the grid by one step using the given rule.
   * (Future: O(n) implementation focusing only on active cells)
   */
  step(grid, rule) {
    // TODO: Implement efficient step algorithm
    return grid;
  }
};

export default caLib;
