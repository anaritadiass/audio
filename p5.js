let data = [
  5, 4, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
  641, 556, 699, 871, 693, 531, 640, 727, 1120, 1023, 582, 609, 597, 624, 711, 973, 510, 523, 
  731, 869, 1394, 1826, 1266, 1069, 44, 64, 64, 65, 67, 77, 80, 90, 82, 87, 81, 79, 64, 55, 
  47, 64, 47, 67, 89, 93, 96, 187, 192, 125
];

let index = 0;
let sound;
let waveShift = 0;
let particles = [];
let hoverNodeIndex = -1;
let networkNodes = [];
let nodeCount = 10;
let growthStartTime = 4;
let growthEndTime = 16;

function preload() {
  // Load the sound
  sound = loadSound('https://raw.githubusercontent.com/anaritadiass/audio/main/Plants%20Mixed.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Make the canvas size match the window size
  sound.loop();  // Loop the sound for continuous play
  noFill();
  frameRate(30);

  // Create nodes for the network
  for (let i = 0; i < nodeCount; i++) {
    let x = random(width);
    let y = random(height);
    let radius = map(data[i], 0, 2000, 5, 50); // Size of node based on data value
    networkNodes.push(new NetworkNode(x, y, radius));
  }
}

function draw() {
  background(0);

  let elapsedTime = millis() / 1000;
  let growthProgress = map(elapsedTime, growthStartTime, growthEndTime, 0, 1);
  growthProgress = constrain(growthProgress, 0, 1);

  waveShift += 0.02;
  let dataLength = data.length;
  let waveOffset = sin(frameCount * 0.003) * 20;

  stroke(255, 255, 255, 150);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < dataLength; i++) {
    let x = map(i, 0, dataLength, 0, width);
    let y = map(data[(i + index) % dataLength] + noise(waveShift + i * 0.1) * 200, 0, 2000, height / 2 - 100, height / 2 + 100);
    let nextX = map(i + 1, 0, dataLength, 0, width);
    let nextY = map(data[(i + index + 1) % dataLength] + noise(waveShift + (i + 1) * 0.1) * 200, 0, 2000, height / 2 - 100, height / 2 + 100);

    line(x, y + waveOffset, nextX, nextY + waveOffset);
  }
  endShape();

  index = (index + 0.05) % dataLength;

  drawMycorrhizalNetwork();
  addGlowingNodes();
  moveParticles();

  for (let node of networkNodes) {
    node.update(growthProgress);
    node.show();
  }
}

function drawMycorrhizalNetwork() {
  stroke(255, 255, 255, 50);
  strokeWeight(1);

  for (let i = 0; i < 3; i++) {
    let startX = random(width);
    let startY = height / 2 + random(-100, 100);
    let rootLength = random(150, 300);
    let rootAngle = random(TWO_PI);
    for (let j = 0; j < rootLength; j++) {
      let x = startX + cos(rootAngle + j * 0.02) * j;
      let y = startY + sin(rootAngle + j * 0.02) * j;
      point(x, y);
    }
  }

  for (let i = 0; i < 5; i++) {
    let centerX = random(width);
    let centerY = random(height / 3, height / 2);
    let radius = random(20, 60);
    stroke(200, 255, 200, 80);
    noFill();
    ellipse(centerX, centerY, radius * 2, radius * 2);
  }
}

function addGlowingNodes() {
  hoverNodeIndex = -1;
  for (let i = 0; i < data.length; i++) {
    let x = map(i, 0, data.length, 0, width);
    let y = map(data[(i + index) % data.length] + noise(waveShift + i * 0.2) * 100, 0, 2000, height / 4, height / 4);

    let distanceToMouse = dist(mouseX, mouseY, x, y);
    let isHovered = distanceToMouse < 10;

    if (isHovered) {
      hoverNodeIndex = i;
    }

    if (hoverNodeIndex === i) {
      fill(0, 255, 255, 255);
      noStroke();
      ellipse(x, y, 10, 10);
    } else {
      fill(0, 255, 0, 80);
      noStroke();
      ellipse(x, y, 6, 6);
    }
  }
}

function moveParticles() {
  if (particles.length < 100) {
    particles.push(createParticle());
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();

    if (p.isOffScreen()) {
      particles.splice(i, 1);
    }
  }
}

function createParticle() {
  let p = new Particle(random(width), random(height));
  return p;
}

class NetworkNode {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.initialRadius = radius;
    this.radius = radius;
    this.hovered = false;
  }

  update(growthProgress) {
    this.radius = this.initialRadius + (this.initialRadius * growthProgress);

    let distanceToMouse = dist(mouseX, mouseY, this.x, this.y);
    this.hovered = distanceToMouse < this.radius;
  }

  show() {
    if (this.hovered) {
      fill(255, 0, 0, 200);
      noStroke();
      ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    } else {
      fill(0, 255, 0, 80);
      noStroke();
      ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 5;
    this.speed = createVector(random(-1, 1), random(-1, 1));
  }

  update() {
    this.x += this.speed.x;
    this.y += this.speed.y;
  }

  show() {
    fill(0, 255, 255, 200);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  isOffScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize canvas dynamically
}

