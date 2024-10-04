const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d'); // 2D context
const cellSize = 10; // Size of each "grid cell"
canvas.width = 600;
canvas.height = 600;
const offsetX = canvas.width / 2; // Start from the middle of the canvas
const offsetY = canvas.height / 2;
const directions = [
  {dx: 0, dy: -1}, // North (Up)
  {dx: 1, dy: 0},  // East (Right)
  {dx: 0, dy: 1},  // South (Down)
  {dx: -1, dy: 0}  // West (Left)
];

let x = 0; // Logical coordinates start at the center
let y = 0;
let moves = []; // Store moves for drawing
let finalCoordinates;
let initialPathSteps;
let startDirection = 0; // 0 = North, assuming you're starting facing North

// Set initial path start position
ctx.beginPath();
ctx.moveTo(offsetX, offsetY);

// Draw the current path
const drawPathOnCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before each draw

  // Redraw the path starting from the fixed center
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY); // Always start from the center of the canvas

  let posX = 0;
  let posY = 0;

  for (const move of moves) {
    const directionIndex = move.direction;
    const steps = move.steps;

    // Update position based on direction
    posX += directions[directionIndex].dx * steps;
    posY += directions[directionIndex].dy * steps;

    // Draw the line to the new position
    ctx.lineTo(offsetX + posX * cellSize, offsetY + posY * cellSize);
  }

  ctx.strokeStyle = 'red'; // Set the color of the path
  ctx.stroke();
};

const calculateFinalCoordinates = (moves, startDirection) => {
  let x = 0, y = 0;
  let directionIndex = startDirection; // Initial direction. Directions set clockwise: 0 = North, 1 = East, 2 = South, 3 = West

  for (let move of moves) {
    const { direction, steps } = move; // Extract direction and steps directly

    // Since the moves array already stores directions, we don't need to handle "R" or "L" logic here.
    // We can just update x and y based on the current direction.
    x += directions[direction].dx * steps;
    y += directions[direction].dy * steps;
  }

  console.log(`Final X: ${x}, Final Y: ${y}`);
  return { x, y };
};

/**
 * Calculate total number of steps, based on the moves provided
 * @param moves
 * @returns {number}
 */
const calculateSteps = (moves) => {
  let totalSteps = 0;

  // Loop through each move in the array
  for (let move of moves) {
    // Access the 'steps' property directly from the move object
    let steps = move.steps;

    // Add the steps to the total
    totalSteps += steps;
  }

  console.log('Total steps: ', totalSteps);
  return totalSteps;
};



// Handle arrow key presses to draw path
document.addEventListener('keydown', (event) => {
  let move = null;
  let nextX = x;
  let nextY = y;

  if (event.key === 'ArrowUp') {
    nextY -= 1; // Check next position for North
    move = {direction: 0, steps: 1}; // Move north
  } else if (event.key === 'ArrowRight') {
    nextX += 1; // Check next position for East
    move = {direction: 1, steps: 1}; // Move east
  } else if (event.key === 'ArrowDown') {
    nextY += 1; // Check next position for South
    move = {direction: 2, steps: 1}; // Move south
  } else if (event.key === 'ArrowLeft') {
    nextX -= 1; // Check next position for West
    move = {direction: 3, steps: 1}; // Move west
  }

  // Check if the next move would go beyond the canvas borders
  if (
    offsetX + nextX * cellSize >= 0 && offsetX + nextX * cellSize <= canvas.width &&
    offsetY + nextY * cellSize >= 0 && offsetY + nextY * cellSize <= canvas.height
  ) {
    // Only make the move if it's within the canvas bounds
    x = nextX;
    y = nextY;

    if (move) {
      moves.push(move); // Add the move to the moves array
      drawPathOnCanvas(); // Redraw the path with the new move
      finalCoordinates = calculateFinalCoordinates(moves, startDirection); // Pass the startDirection into calculateFinalCoordinates
      initialPathSteps = calculateSteps(moves);
    }
  }
});
