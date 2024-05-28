// transform array length 5 into object
export function transformedData(data) {
  const transformedData = data.reduce((acc, curr, index, arr) => {
    let currentLevel = acc;
    for (let i = 0; i < index; i++) {
      currentLevel = currentLevel[arr[i]];
    }
    if (index < data.length - 2) {
      if (!currentLevel[curr]) {
        currentLevel[curr] = {};
      }
    } else if (index === data.length - 2) {
      currentLevel[curr] = data[index + 1];
    }
    return acc;
  }, {});

  return transformedData;
}

// Function to transform the array data into an object
export function transformedData1(data) {
  const transformedData = data.reduce((acc, curr) => {
    const [rack, side, level, row, column] = curr.pigeonhole_id.split("-");
    if (!acc[rack]) {
      acc[rack] = {};
    }
    if (!acc[rack][side]) {
      acc[rack][side] = {};
    }
    if (!acc[rack][side][level]) {
      acc[rack][side][level] = {};
    }
    acc[rack][side][level][row] = column;
    return acc;
  }, {});

  return transformedData;
}

// Function to transform the array data into an object
export function transformedData2(data) {
  data = transformedData1(data);
  const transformed = {
    rack: [],
    side: [],
    row: [],
    column: [],
  };

  for (let rack in data) {
    transformed.rack.push(rack);
    for (let side in data[rack]) {
      if (!transformed.side.includes(side)) {
        transformed.side.push(side);
      }
      for (let row in data[rack][side]) {
        if (!transformed.row.includes(row)) {
          transformed.row.push(row);
        }
        for (let column in data[rack][side][row]) {
          if (!transformed.column.includes(column)) {
            transformed.column.push(column);
          }
        }
      }
    }
  }
  return transformed;
}
