const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d'); // 2D context
const cellSize = 5; // Size of each "grid cell"
const start = { x: 0, y: 0 };
const startDirection = 0; // 0 = North, 1 = East, 2 = South, 3 = West

// Set canvas dimensions
canvas.width = 1500;
canvas.height = 1500;
const offsetX = canvas.width / 2; // Start from the middle of the canvas
const offsetY = canvas.height / 2;

// Directions reflecting cardinal directions
const directions = [
  { dx: 0, dy: 1 }, // North
  { dx: 1, dy: 0 }, // East
  { dx: 0, dy: -1 }, // South
  { dx: -1, dy: 0 } // West
];

const givenMoves = [
  "R1",
  "R1",
  "R3",
  "R1",
  "R1",
  "L2",
  "R5",
  "L2",
  "R5",
  "R1",
  "R4",
  "L2",
  "R3",
  "L3",
  "R4",
  "L5",
  "R4",
  "R4",
  "R1",
  "L5",
  "L4",
  "R5",
  "R3",
  "L1",
  "R4",
  "R3",
  "L2",
  "L1",
  "R3",
  "L4",
  "R3",
  "L2",
  "R5",
  "R190",
  "R3",
  "R5",
  "L5",
  "L1",
  "R54",
  "L3",
  "L4",
  "L1",
  "R4",
  "R1",
  "R3",
  "L1",
  "L1",
  "R2",
  "L2",
  "R2",
  "R5",
  "L3",
  "R4",
  "R76",
  "L3",
  "R4",
  "R191",
  "R5",
  "R5",
  "L5",
  "L40",
  "L5",
  "L3",
  "R1",
  "R3",
  "R2",
  "L2",
  "L2",
  "L4",
  "L5",
  "L4",
  "R5",
  "R4",
  "R4",
  "R2",
  "R3",
  "R4",
  "L3",
  "L2",
  "R5",
  "R3",
  "L2",
  "L1",
  "R2",
  "L3",
  "R2",
  "L1",
  "L1",
  "R1",
  "L3",
  "R5",
  "L5",
  "L1",
  "L2",
  "R5",
  "R3",
  "L3",
  "R3",
  "R5",
  "R2",
  "R5",
  "R5",
  "L5",
  "L5",
  "R25",
  "L3",
  "L5",
  "L2",
  "L1",
  "R2",
  "R2",
  "L2",
  "R2",
  "L3",
  "L2",
  "R3",
  "L5",
  "R4",
  "L4",
  "L5",
  "R3",
  "L4",
  "R1",
  "R3",
  "R2",
  "R4",
  "L2",
  "L3",
  "R2",
  "L5",
  "R5",
  "R4",
  "L2",
  "R4",
  "L1",
  "L3",
  "L1",
  "L3",
  "R1",
  "R2",
  "R1",
  "L5",
  "R5",
  "R3",
  "L3",
  "L3",
  "L2",
  "R4",
  "R2",
  "L5",
  "L1",
  "L1",
  "L5",
  "L4",
  "L1",
  "L1",
  "R1"
];

// Function to calculate final coordinates and track boundaries
const calculateFinalCoordinates = (moves, startDirection) => {
  let x = 0, y = 0;
  let directionIndex = startDirection;
  let minX = 0, maxX = 0, minY = 0, maxY = 0;

  for (let move of moves) {
    let turn = move[0];
    let steps = parseInt(move.slice(1));

    // Update the direction based on the turn
    if (turn === "R") {
      directionIndex = (directionIndex + 1) % 4; // Turn right
    } else if (turn === "L") {
      directionIndex = (directionIndex + 3) % 4; // Turn left
    }

    // Update the x and y coordinates based on the direction and steps
    x += directions[directionIndex].dx * steps;
    y += directions[directionIndex].dy * steps;

    // Track the min and max boundaries
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  // Return the final boundaries
  return { minX, maxX, minY, maxY };
};

/**
 * Based on the start coordinates and destination coordinates calculate the shortest path
 */
const shortestPath = (start, destination) => {
  let x = start.x;
  let y = start.y;
  let direction = "North";
  let path = [];

  // With given direction, turn right or left
  const turnRight = () => {
    if (direction === "North") direction = "East";
    else if (direction === "East") direction = "South";
    else if (direction === "South") direction = "West";
    else if (direction === "West") direction = "North";
    path.push("R");
  };

  const turnLeft = () => {
    if (direction === "North") direction = "West";
    else if (direction === "West") direction = "South";
    else if (direction === "South") direction = "East";
    else if (direction === "East") direction = "North";
    path.push("L");
  };

  // Move along the X-axis
  if (destination.x > x) {
    if (direction === "North") turnRight();
    else if (direction === "South") turnLeft();
    let steps = destination.x - x;
    path[path.length - 1] += `${steps}`;
  } else if (destination.x < x) {
    if (direction === "North") turnLeft();
    else if (direction === "South") turnRight();
    let steps = x - destination.x;
    path[path.length - 1] += `${steps}`;
  }

  // Move along the Y-axis
  if (destination.y > y) {
    if (direction === "East") turnLeft();
    else if (direction === "West") turnRight();
    let steps = destination.y - y;
    path[path.length - 1] += `${steps}`;
  } else if (destination.y < y) {
    if (direction === "East") turnRight();
    else if (direction === "West") turnLeft();
    let steps = y - destination.y;
    path[path.length - 1] += `${steps}`;
  }

  return path;
};

/**
 * Draw a path on the canvas with scaling to fit the canvas size
 */
const drawPathOnCanvas = (path, startX, startY, color, boundaries, startDirection) => {
  let x = startX;
  let y = startY;
  let directionIndex = startDirection;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const pathWidth = boundaries.maxX - boundaries.minX;
  const pathHeight = boundaries.maxY - boundaries.minY;

  // Calculate the scale factor to fit within the canvas
  const scaleX = canvasWidth / (pathWidth * cellSize + 20); // Add a little margin
  const scaleY = canvasHeight / (pathHeight * cellSize + 20);
  const scale = Math.min(scaleX, scaleY);

  // Move to starting position
  ctx.beginPath();
  ctx.moveTo(offsetX + (x - boundaries.minX) * cellSize * scale, offsetY - (y - boundaries.minY) * cellSize * scale);

  for (const move of path) {
    let turn = move[0];
    let steps = parseInt(move.slice(1));

    // Update direction based on turn
    if (turn === "R") {
      directionIndex = (directionIndex + 1) % 4;
    } else if (turn === "L") {
      directionIndex = (directionIndex + 3) % 4;
    }

    // Move according to the direction
    for (let step = 0; step < steps; step++) {
      x += directions[directionIndex].dx;
      y += directions[directionIndex].dy;

      // Draw the line for each step, adjusting for boundaries and scaling
      ctx.lineTo(offsetX + (x - boundaries.minX) * cellSize * scale, offsetY - (y - boundaries.minY) * cellSize * scale);
    }
  }

  ctx.strokeStyle = color; // Set the color of the path
  ctx.stroke();
};

/**
 * Calculate an alternative route based on the shortest path and new direction
 */
const calculateAlternativeRoute = (startPosition, shortestPath) => {
  let directionIndex;
  let alternativePath = [];

  if (shortestPath.length < 2) {
    console.error('Shortest path does not have enough elements:', shortestPath);
    return { startDirection: startPosition, altPath: [] };
  }

  if (shortestPath[0][0] === 'R' && shortestPath[1][0] === 'R') {
    directionIndex = (startPosition + 3) % 4;
    alternativePath.push(`L${shortestPath[1].slice(1)}`);
    alternativePath.push(`L${shortestPath[0].slice(1)}`);
  } else if (shortestPath[0][0] === 'R' && shortestPath[1][0] === 'L') {
    directionIndex = (startPosition + 3) % 4;
    alternativePath.push(`R${shortestPath[1].slice(1)}`);
    alternativePath.push(`R${shortestPath[0].slice(1)}`);
  } else if (shortestPath[0][0] === 'L' && shortestPath[1][0] === 'L') {
    directionIndex = (startPosition + 1) % 4;
    alternativePath.push(`R${shortestPath[1].slice(1)}`);
    alternativePath.push(`R${shortestPath[0].slice(1)}`);
  } else if (shortestPath[0][0] === 'L' && shortestPath[1][0] === 'R') {
    directionIndex = (startPosition + 1) % 4;
    alternativePath.push(`L${shortestPath[1].slice(1)}`);
    alternativePath.push(`L${shortestPath[0].slice(1)}`);
  }

  return { startDirection: directionIndex, altPath: alternativePath };
};

let finalCoordinates = calculateFinalCoordinates(givenMoves, startDirection);
let shortestPathArray = shortestPath(start, finalCoordinates);
let alternativePathConfig = calculateAlternativeRoute(startDirection, shortestPathArray);

// Draw paths on the canvas
drawPathOnCanvas(givenMoves, -150, 0, "red", finalCoordinates, startDirection);
drawPathOnCanvas(shortestPathArray, 0, 0, "blue", finalCoordinates, startDirection);
drawPathOnCanvas(alternativePathConfig.altPath, 0, 0, "green", finalCoordinates, alternativePathConfig.startDirection);
