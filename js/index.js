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
let shortestPathSteps;
let shortestPathArray;
let shortestAltPath;
let movesForCalculateSteps;
let movesForCalculateAltSteps;
let startDirection = 0; // 0 = North, assuming you're starting facing North
let drawingStarted = false;

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

  ctx.strokeStyle = 'red'; // Set the color of the initial path
  ctx.stroke();
};

// Draw the shortest path in blue
const drawShortestPath = () => {
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY); // Start from the center of the canvas
  let posX = 0;
  let posY = 0;

  // Draw the shortest path based on the shortestPathArray
  for (const move of movesForCalculateSteps) {
    const directionIndex = move.direction;
    const steps = move.steps;

    // Update position based on direction
    posX += directions[directionIndex].dx * steps;
    posY += directions[directionIndex].dy * steps;

    // Draw the line to the new position
    ctx.lineTo(offsetX + posX * cellSize, offsetY + posY * cellSize);
  }

  ctx.strokeStyle = 'blue'; // Set the color for the shortest path
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

  console.log('moves provided: ', moves);
  console.log('Total steps: ', totalSteps);
  return totalSteps;
};

/**
 * Based on the start coordinates and destination coordinates calculate the shortest path
 * @param startX
 * @param startY
 * @param destination
 * @returns {*[]}
 */
const setShortestPath = (startX, startY, destination) => {
  let x = startX;
  let y = startY;
  let direction = "North"; // Start facing North
  let path = [];

  // With given direction, turn right to face East
  const turnRight = () => {
    if (direction === "North") direction = "East";
    else if (direction === "East") direction = "South";
    else if (direction === "South") direction = "West";
    else if (direction === "West") direction = "North";
  };

  // With given direction, turn left
  const turnLeft = () => {
    if (direction === "North") direction = "West";
    else if (direction === "West") direction = "South";
    else if (direction === "South") direction = "East";
    else if (direction === "East") direction = "North";
  };

  // Move along the X-axis first
  if (destination.x > x) {
    // Turn to face East if not already facing East
    while (direction !== "East") {
      turnRight();
    }

    // Move East
    let steps = destination.x - x;
    path.push(`R${steps}`);
    x = destination.x; // Update the x coordinate
  } else if (destination.x < x) {
    // Turn to face West if not already facing West
    while (direction !== "West") {
      turnLeft();
    }

    // Move West
    let steps = x - destination.x;
    path.push(`L${steps}`);
    x = destination.x; // Update the x coordinate
  }

  // Move along the Y-axis
  if (destination.y > y) {
    // Turn to face South if not already facing South
    while (direction !== "South") {
      turnRight();
    }

    // Move South
    let steps = destination.y - y;
    path.push(`R${steps}`);
    y = destination.y; // Update the y coordinate
  } else if (destination.y < y) {
    // Turn to face North if not already facing North
    while (direction !== "North") {
      turnLeft();
    }

    // Move North
    let steps = y - destination.y;
    path.push(`L${steps}`);
    y = destination.y; // Update the y coordinate
  }

  console.log('Shortest path: ', path);

  return path;
};

const calculateAlternativeShortestPath = (startX, startY, finalX, finalY, startDirection, shortestPath) => {
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

  ctx.strokeStyle = 'green'; // Set the color for the alternative path
  ctx.stroke();
};





// Helper function to convert the path to the expected format for calculateSteps
const convertPathToMoves = (path, moves) => {
  let initialDirection = moves[0].direction; // Extract the initial direction from the first object in "moves"
  let currentDirection = initialDirection; // Start with the initial direction

  const directions = ["North", "East", "South", "West"]; // Directions in clockwise order

  // Function to turn right
  const turnRight = () => {
    currentDirection = (currentDirection + 1) % 4; // Turn right (clockwise)
  };

  // Function to turn left
  const turnLeft = () => {
    currentDirection = (currentDirection + 3) % 4; // Turn left (counterclockwise)
  };

  // Convert path array into moves format
  return path.map(move => {
    const directionChar = move[0]; // 'R' or 'L'
    const steps = parseInt(move.slice(1)); // Extract the number of steps

    if (directionChar === 'R') {
      turnRight(); // Turn right modifies the current direction
    } else if (directionChar === 'L') {
      turnLeft(); // Turn left modifies the current direction
    }

    return {
      direction: currentDirection, // Use the updated current direction
      steps: steps
    };
  });
};



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
    // Only make the move if it's within the canvas bounds
    x = nextX;
    y = nextY;

    if (move) {
      moves.push(move); // Add the move to the moves array
      drawPathOnCanvas(); // Redraw the path with the new move
      finalCoordinates = calculateFinalCoordinates(moves, startDirection); // Assign the final coordinates here
      initialPathSteps = calculateSteps(moves);
      shortestPathArray = setShortestPath(0, 0, finalCoordinates);
      // shortestAltPath = calculateAlternativeShortestPath(0, 0, finalCoordinates.x, finalCoordinates.y, startDirection, shortestPathArray);
      movesForCalculateSteps = convertPathToMoves(shortestPathArray, moves);

      console.log('SHORTEST PATH: ', shortestPathArray);
      console.log('SHORTEST PATH ALT: ', shortestPathArray);

      console.log('movesForCalculateSteps: ', movesForCalculateSteps);
    }
  }
});

// Add an event listener for the "Draw Shortest Path" button
document.getElementById('drawShortestPathBtn').addEventListener('click', () => {
  drawShortestPath();
  // drawAlternativePath(shortestAltPath);
});

document.getElementById('resetPathsBtn').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

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

// On page load, draw the center dot
window.onload = () => {
  drawCenterDot();
};
