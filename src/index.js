// CA LIBrary (or rather a library for any general purpose grid handling)

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
    if (!Number.isInteger(chunkLength) || chunkLength < 1) throw new RangeError("Chunk length must be a positive integer!");
    if (!Number.isInteger(dimension) || dimension < 0)     throw new RangeError("Dimension must be a non-negative integer!");

    // Edge case: 0D grid is just the quiescent state
    if (dimension === 0) return quiescent;

    return Object.freeze({
      chunkLength,
      dimension,
      quiescent,
      chunks: new Map(), // used Map to boost lookup
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
    const oldChunk = grid.chunks.get(key) ?? this._hypercube(grid.chunkLength, grid.dimension, grid.quiescent);

    // Apply immutable set
    const newChunk = this._immutableSet(oldChunk, localIndex, value);

    // Replace chunk in a new Map
    const newChunks = new Map(grid.chunks);
    newChunks.set(key, newChunk);

    return Object.freeze({ ...grid, chunks: newChunks });
  },
  
  
  // placeholder
  toRule(rulestring) {
    // TODO: Implement rulestring parser
    return () => {}; // Return a no-op rule for now
  },
  
  
  /**
   * Advances the grid by one step using the provided rule.
   * @param {object} grid - The current grid object.
   * @param {function} rule - A function called for each cell:
   *   (cellValue, coordinates, getCell) => newValue
   *   - `cellValue`: current state of the cell
   *   - `coordinates`: global coordinates of the cell
   *   - `getCell(coords)`: helper to get the state of any neighbor (or quiescent if not present)
   * @returns {object} - A new immutable grid.
   */
  step(grid, rule) {
    if (grid.dimension === 0) {
      return rule(grid, [], () => grid); // 0D case
    }
  
    const { chunkLength, dimension, chunks, quiescent } = grid;
  
    // Helper: Get cell value at global coordinates
    const getCell = (coords) => {
      const chunkIndex = coords.map(i => Math.floor(i / chunkLength));
      const localIndex = coords.map(i => ((i % chunkLength) + chunkLength) % chunkLength);
      const key = JSON.stringify(chunkIndex);
      const chunk = chunks.get(key);
      if (!chunk) return quiescent;
  
      // Traverse chunk array
      return localIndex.reduce((acc, idx) => acc[idx], chunk);
    };

    // Collect all chunks to process (including neighbors)
    const chunkCoordsSet = new Set();
    for (const key of chunks.keys()) {
      const baseCoords = JSON.parse(key);
      // Include the chunk itself + all neighbors in n dimensions
      const offsets = this._neighborOffsets(dimension);
      for (const offset of offsets) {
        const neighborCoords = baseCoords.map((c, i) => c + offset[i]);
        chunkCoordsSet.add(JSON.stringify(neighborCoords));
      }
    }

    const newChunks = new Map();

    // Process each chunk
    for (const key of chunkCoordsSet) {
      const chunkCoords = JSON.parse(key);
      const newChunk = this._mapHypercube(
        chunkLength,
        dimension,
        (localCoords) => {
          const globalCoords = localCoords.map((c, i) => chunkCoords[i] * chunkLength + c);
          const oldValue = getCell(globalCoords);
          return rule(oldValue, globalCoords, getCell);
        }
      );

      // Only store if it contains any non-quiescent cells
      if (!this._isHypercubeUniform(newChunk, quiescent)) {
        newChunks.set(key, newChunk);
      }
    }

    return Object.freeze({ ...grid, chunks: newChunks });
    },

  /*
  
  ===========================================
    INTERNAL FUNCTIONS - DO NOT USE OUTSIDE
  ===========================================
  
  */
  
  // Create a filled hypercube
  _hypercube(sideLength, dimension, fill) {
    if (dimension === 0) return fill;
    return Array.from({ length: sideLength }, () =>
      this._hypercube(sideLength, dimension - 1, fill)
    );
  },

  // Immutable setter for n-dimensional arrays
  _immutableSet(array, index, value) {
    if (index.length === 0) return value;

    const [head, ...tail] = index;
    if (!Array.isArray(array))
      throw new RangeError("Index exceeds array depth!");

    return array.map((el, i) =>
      i === head ? this._immutableSet(el, tail, value) : el
    );
  },

  // Normal equality checks reference, so this exists
  _equalArray(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  },

  // Generate all neighbour offsets (including the cell itself) for a given dimension
  _neighborOffsets(dimension) {
    if (dimension === 0) return [[]];
    const smaller = this._neighborOffsets(dimension - 1);
    const offsets = [-1, 0, 1];
    return smaller.flatMap(prefix => offsets.map(o => [...prefix, o]));
  },

  // Creates a hypercube and fills it with a function based on local coordinates
  _mapHypercube(sideLength, dimension, fn, prefix = []) {
    if (dimension === 0) return fn(prefix);
    return Array.from({ length: sideLength }, (_, i) =>
      this._mapHypercube(sideLength, dimension - 1, fn, [...prefix, i])
    );
  },

  // Checks if an nD hypercube contains only a single uniform value.
  _isHypercubeUniform(array, value) {
    if (!Array.isArray(array)) return array === value;
    return array.every(el => this._isHypercubeUniform(el, value));
  },
  
};

export default caLib;
