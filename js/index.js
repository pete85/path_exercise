const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d'); // 2D context
const cellSize = 10;
let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;
const directions = [
  { dx: 0, dy: -1 }, // North (Up)
  { dx: 1, dy: 0 },  // East (Right)
  { dx: 0, dy: 1 },  // South (Down)
  { dx: -1, dy: 0 }  // West (Left)
];

let x = 0;
let y = 0;
let moves = [];
let finalCoordinates;
let initialPathSteps;
let shortestPath;
let shortestPathSteps;
let startDirection = 0;
let drawingStarted = false;
let mainPathStepsText = document.getElementById("given-path");
let shortestPathStepsText = document.getElementById("shortest-path");
let stepsText;
let shortestStepsText;
ctx.beginPath();
ctx.moveTo(offsetX, offsetY);

const resizeCanvas = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Set the canvas size dynamically based on a percentage of screen size
  canvas.width = Math.min(screenWidth * 0.8, 400); // 80% of the screen width or max 400px
  canvas.height = Math.min(screenHeight * 0.8, 400); // 80% of the screen height or max 400px

  // Update the offset to reflect the new canvas size
  offsetX = canvas.width / 2;
  offsetY = canvas.height / 2;

  // Clear the canvas and redraw the center dot
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw the center dot after resizing
  drawCenterDot();
};

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

  ctx.strokeStyle = 'red'; // Set the color of the initial path
  ctx.stroke();
};

const calculateFinalCoordinates = (moves, startDirection) => {
  let xCoord = 0, yCoord = 0;
  let directionIndex = startDirection; // Initial direction. Directions set clockwise: 0 = North, 1 = East, 2 = South, 3 = West

  for (let move of moves) {
    const {direction, steps} = move; // Extract direction and steps directly

    xCoord += directions[direction].dx * steps;
    yCoord += directions[direction].dy * steps;
  }

  console.log(`Final X: ${xCoord}, Final Y: ${yCoord}`);
  return {x: xCoord, y: yCoord};  // Return the final coordinates correctly
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
  return totalSteps;
};

const setShortestPath = (startX, startY, finalX, finalY, startDirection) => {
  let x = startX;
  let y = startY;
  let direction = startDirection; // Starting direction (0 = North, 1 = East, 2 = South, 3 = West)
  let alternativePath = [];

  // With given direction, turn right to face East
  const turnRight = () => {
    direction = (direction + 1) % 4; // Turn right (clockwise)
  };

  // With given direction, turn left to face West
  const turnLeft = () => {
    direction = (direction + 3) % 4; // Turn left (counterclockwise)
  };

  // Move along the X-axis first for the alternative route
  if (finalX > x) {
    // Turn left instead of right to face East if not already facing East
    while (direction !== 1) {
      turnLeft();
      alternativePath.push({ direction, steps: 0 });
    }

    // Move East
    let steps = finalX - x;
    alternativePath.push({ direction: 1, steps: steps });
    x = finalX; // Update x coordinate
  } else if (finalX < x) {
    // Turn right instead of left to face West if not already facing West
    while (direction !== 3) {
      turnRight();
      alternativePath.push({ direction, steps: 0 });
    }

    // Move West
    let steps = x - finalX;
    alternativePath.push({ direction: 3, steps: steps });
    x = finalX; // Update x coordinate
  }

  // Move along the Y-axis for the alternative route
  if (finalY > y) {
    // Turn right instead of left to face South if not already facing South
    while (direction !== 2) {
      turnRight();
      alternativePath.push({ direction, steps: 0 });
    }

    // Move South
    let steps = finalY - y;
    alternativePath.push({ direction: 2, steps: steps });
    y = finalY; // Update y coordinate
  } else if (finalY < y) {
    // Turn left instead of right to face North if not already facing North
    while (direction !== 0) {
      turnLeft();
      alternativePath.push({ direction, steps: 0 });
    }

    // Move North
    let steps = y - finalY;
    alternativePath.push({ direction: 0, steps: steps });
    y = finalY; // Update y coordinate
  }

  alternativePath = alternativePath.filter(move => move.steps > 0);
  shortestPathSteps = calculateSteps(alternativePath);
  if (shortestPathSteps === 1) {
    shortestStepsText = 'step';
  } else {
    shortestStepsText = 'steps';
  }
  shortestPathStepsText.innerText = `${shortestPathSteps} ${shortestStepsText}`

  return alternativePath;
};

// Function to draw the alternative shortest path in green
const drawAlternativePath = (alternativePath) => {
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY); // Start from the center of the canvas
  let posX = 0;
  let posY = 0;

  // Draw the alternative path based on the calculated path array
  for (const move of alternativePath) {
    const directionIndex = move.direction;
    const steps = move.steps;

    // Update position based on direction
    posX += directions[directionIndex].dx * steps;
    posY += directions[directionIndex].dy * steps;

    // Draw the line to the new position
    ctx.lineTo(offsetX + posX * cellSize, offsetY + posY * cellSize);
  }

  ctx.strokeStyle = 'blue'; // Set the color for the alternative path
  ctx.stroke();
};

const updateDrawButtonState = () => {
  const drawButton = document.getElementById('drawShortestPathBtn');
  drawButton.disabled = initialPathSteps.length === 0;
};

// Function to draw the center dot
const drawCenterDot = () => {
  const radius = 5; // Radius of the red dot
  ctx.beginPath();
  ctx.arc(offsetX, offsetY, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();

  // Apply CSS animation by temporarily creating an overlay canvas for the dot
  canvas.classList.add('centerDot');
};

// Clear the dot once the user starts drawing
const clearCenterDot = () => {
  ctx.clearRect(offsetX - 10, offsetY - 10, 20, 20); // Clear the dot
  canvas.classList.remove('centerDot'); // Stop the animation
};

const resetPath = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moves = []; // Clear all moves
  initialPathSteps = []; // Clear the initial path steps
  shortestPathArray = []; // Clear the shortest path
  shortestPath = [];
  updateDrawButtonState();
  mainPathStepsText.innerText = '';
  shortestPathStepsText.innerText = '';
  drawCenterDot();
}

// Handle arrow key presses to draw path
document.addEventListener('keydown', (event) => {
  let move = null;
  let nextX = x;
  let nextY = y;

  if (!drawingStarted) {
    clearCenterDot();
    drawingStarted = true; // Mark that drawing has started
  }

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
    x = nextX;
    y = nextY;

    if (move) {
      moves.push(move);
      drawPathOnCanvas();
      finalCoordinates = calculateFinalCoordinates(moves, startDirection); // Assign the final coordinates here
      initialPathSteps = calculateSteps(moves);
      updateDrawButtonState();
      drawingStarted = false;
      shortestPath = setShortestPath(0, 0, finalCoordinates.x, finalCoordinates.y, startDirection);

      if (initialPathSteps === 1) {
        stepsText = 'step';
      } else {
        stepsText = 'steps';
      }

      mainPathStepsText.innerText = `${initialPathSteps} ${stepsText}`
    }
  }
});

document.getElementById('drawShortestPathBtn').addEventListener('click', () => {
  drawAlternativePath(shortestPath);
});

document.getElementById('resetPathsBtn').addEventListener('click', () => {
  resetPath();
});

// On page load, draw the center dot
window.onload = () => {
  drawCenterDot();
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
