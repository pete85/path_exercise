const grid = document.getElementById("grid");
const gridSize = 400;

// Create grid items in HTML template
for (let i = 0; i < gridSize * gridSize; i++) {
  const div = document.createElement("div");
  div.classList.add("grid-item");
  grid.appendChild(div);
}

const start = { x: 0, y: 0 };
const startDirection = 0; // Initial direction. Directions set clockwise: 0 = North, 1 = East, 2 = South, 3 = West

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

// Directions reflecting cardinal directions
const directions = [
  { dx: 0, dy: 1 }, // North
  { dx: 1, dy: 0 }, // East
  { dx: 0, dy: -1 }, // South
  { dx: -1, dy: 0 } // West
];

/**
 * Based on moves provided in givenMoves array, loop through all items in the array to produce the destination coordinates.
 * These coordinates will, then, be used to calculate the shortest path.
 * @param moves
 * @param startDirection
 * @returns {{x: number, y: number}}
 */
const calculateFinalCoordinates = (moves, startDirection) => {
  let x = 0, y = 0;
  let directionIndex = startDirection; // Initial direction. Directions set clockwise: 0 = North, 1 = East, 2 = South, 3 = West

  for (let move of moves) {
    let turn = move[0]; // Take the first substring R or L
    let steps = parseInt(move.slice(1)); // Number of steps

    // Update the direction based on the turn
    if (turn === "R") {
      directionIndex = (directionIndex + 1) % 4; // Turn right (modulo operator in place to ensure we stay within the 0 - 3 range)
    } else if (turn === "L") {
      directionIndex = (directionIndex + 3) % 4; // Turn left (+3 used to avoid negative values)
    }

    x += directions[directionIndex].dx * steps;
    y += directions[directionIndex].dy * steps;
  }

  return { x, y };
};

/**
 * Based on the start coordinates and destination coordinates calculate the shortest path
 * @param start
 * @param destination
 * @returns {*[]}
 */
const shortestPath = (start, destination) => {
  let x = start.x;
  let y = start.y;
  let direction = "North";
  let path = [];

  // With given direction, turn right in the direction set
  const turnRight = () => {
    if (direction === "North") direction = "East";
    else if (direction === "East") direction = "South";
    else if (direction === "South") direction = "West";
    else if (direction === "West") direction = "North";
    path.push("R");
  };

  // With given direction, turn left in the direction set
  const turnLeft = () => {
    if (direction === "North") direction = "West";
    else if (direction === "West") direction = "South";
    else if (direction === "South") direction = "East";
    else if (direction === "East") direction = "North";
    path.push("L"); // Add 'L' for a left turn
  };

  // Move along the X-axis first
  if (destination.x > x) {
    // Turn right to face East if we're not already facing East
    if (direction === "North") turnRight();
    else if (direction === "South") turnLeft();

    // Move East
    let steps = destination.x - x;
    path[path.length - 1] += `${steps}`; // Concatenate steps with last turn
  } else if (destination.x < x) {
    // Turn left to face West if we're not already facing West
    if (direction === "North") turnLeft();
    else if (direction === "South") turnRight();

    // Move West
    let steps = x - destination.x;
    path[path.length - 1] += `${steps}`; // Concatenate steps with last turn
  }

  // Now move along the Y-axis
  if (destination.y > y) {
    // If facing East/West, turn back North
    if (direction === "East") turnLeft();
    else if (direction === "West") turnRight();

    // Move North
    let steps = destination.y - y;
    path[path.length - 1] += `${steps}`; // Concatenate steps with last turn
  } else if (destination.y < y) {
    // If facing East/West, turn to face South
    if (direction === "East") turnRight();
    else if (direction === "West") turnLeft();

    // Move South
    let steps = y - destination.y;
    path[path.length - 1] += `${steps}`; // Concatenate steps with last turn
  }

  // Return the path (turns and steps)
  return path;
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
    // Extract the numeric part (steps) from the string
    let steps = parseInt(move.slice(1));

    // Add the steps to the total
    totalSteps += steps;
  }

  return totalSteps;
};

/**
 * Draw path in HTML grid
 * @param startPosition
 * @param path
 * @param color
 */
const drawPath = (startPosition, path, color) => {

  let x = 0;
  let y = 0;
  let directionIndex = startPosition;

  let startIndex = x + (gridSize / 2) + (y + (gridSize / 2)) * gridSize; // Adjust grid size

  path.forEach((move) => {
    let turn = move[0];
    let steps = parseInt(move.slice(1));

    // Update directionIndex based on turn
    if (turn === "R") {
      directionIndex = (directionIndex + 1) % 4; // Turn right
    } else if (turn === "L") {
      directionIndex = (directionIndex + 3) % 4; // Turn left
    } else if (turn === "S") {
      directionIndex = startPosition;
    }

    // Move according to the updated directionIndex
    for (let step = 0; step < steps; step++) {

      x += directions[directionIndex].dx;
      y += directions[directionIndex].dy;

      let index = (x + gridSize - 330) + ((gridSize / 2) - y) * (gridSize + 1); // Adjust grid size
      if (grid.children[index]) {

        grid.children[index].classList.add(color);
      }
    }
  });

  if (grid.children[startIndex]) {
    grid.children[startIndex].style.backgroundColor = "black";
    grid.children[startIndex].classList.add("start-point");
  }
};

/**
 * Calculate alternative shortest path by setting a new start direction, based on the first move in the shortest path,
 * and adjusting moves accordingly.
 * @param startPosition
 * @param shortestPath
 * @returns {{startDirection: number, altPath: *[]}}
 */
const calculateAlternativeRoute = (startPosition, shortestPath) => {

  let directionIndex;
  let alternativePath = [];

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

  return {
    startDirection: directionIndex,
    altPath: alternativePath
  };
};

let finalCoordinates = calculateFinalCoordinates(givenMoves, startDirection);
let shortestPathArray = shortestPath(start, finalCoordinates);
let alternativePathConfig = calculateAlternativeRoute(startDirection, shortestPathArray);
let initialPathSteps = calculateSteps(givenMoves);
let totalSteps = calculateSteps(shortestPathArray);
let totalAltSteps = calculateSteps(alternativePathConfig.altPath);

console.log('Final coordinates: ', finalCoordinates);
console.log("Shortest path: ", shortestPathArray);
console.log("Number of steps: ", totalSteps);
console.log("Number of steps init: ", initialPathSteps);

let first_paragraph = document.getElementById("given-path");
let second_paragraph = document.getElementById("shortest-path");
let third_paragraph = document.getElementById("alternative-shortest-path");
first_paragraph.innerText = `${initialPathSteps} steps`;
second_paragraph.innerText = `${totalSteps} steps`;
third_paragraph.innerText = `${totalAltSteps} steps`;

drawPath(startDirection, givenMoves, "path-a");
drawPath(startDirection, shortestPathArray, "path-b");
drawPath(alternativePathConfig.startDirection, alternativePathConfig.altPath, "path-c");
