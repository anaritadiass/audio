let data = [5,4,3,0,0,0,0,0,0,641,556,699,871,693,531,640,727,1120,1023,582,609,597,624,711,973,510,523,731,869,1394,1826,1069,44,64,64,65,67,77,80,90,82,87,81,79,64,55,47,64,47,67,89,93,9,187,192,125,];

let index = 0;
let sound;

function preload() {
  // Load the sound
  sound = loadSound('https://raw.githubusercontent.com/anaritadiass/audio/main/Plant%202%20(Joined%20by%20Happy%20Scribe).mp3');
}

function setup() {
  createCanvas(600, 400);  // Create the canvas to draw
  noFill();  // Don't fill the shape with color
  stroke(255, 150);  // Set stroke color to white with slight transparency
  sound.loop();  // Loop the sound to play continuously
}

function draw() {
  background(0, 30);  // Black background with some transparency to create a fading effect

  // Create a flowing effect by shifting the data every frame
  let dataLength = data.length;

  // Draw the wave using the data points
  beginShape();
  for (let i = 0; i < dataLength; i++) {
    let x = map(i, 0, dataLength, 0, width);  // Map data index to screen width
    let y = map(data[(i + index) % dataLength], 0, 2000, height, 0);  // Map data value to screen height
    let nextX = map(i + 1, 0, dataLength, 0, width);  // Next x value for smoothness
    let nextY = map(data[(i + index + 1) % dataLength], 0, 2000, height, 0);  // Next y value
    
    // Draw a line between each point
    line(x, y, nextX, nextY);
  }
  endShape();

  // Slow down the movement of the wave by changing the index more slowly
  index = (index + 0.2) % dataLength;  // Increment the index by a smaller value to slow the movement

  // Add some more complexity to the wave's appearance
  // Use sin() and cos() to create subtle undulations
  for (let i = 0; i < dataLength; i++) {
    let x = map(i, 0, dataLength, 0, width);
    let y = map(data[(i + index) % dataLength], 0, 2000, height / 2, height / 2);  // Create undulating effect

    // Create additional organic lines flowing across the screen
    let offsetX = sin(i * 0.1 + frameCount * 0.01) * 15; // Slower undulation
    let offsetY = cos(i * 0.05 + frameCount * 0.01) * 10; // Slower sine wave offset

    // Create a wavy and organic motion
    line(x + offsetX, y + offsetY, x + offsetX + 5, y + offsetY + 5); 
  }

  // Add connections between points to represent the web-like structure
  for (let i = 0; i < data.length - 1; i++) {
    let x1 = map(i, 0, data.length, 0, width);
    let y1 = map(data[(i + index) % data.length], 0, 200, height, 0);
    let x2 = map(i + 1, 0, data.length, 0, width);
    let y2 = map(data[(i + 1 + index) % data.length], 0, 4000, height, 0);
    
    // Draw semi-transparent lines between points to create connections
    stroke(255, 100); 
    line(x1, y1, x2, y2); 
  }
}
