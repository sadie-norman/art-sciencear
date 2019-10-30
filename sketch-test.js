// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Real time Object Detection using YOLO and p5.js
=== */

let images = [];
let imageNo = 20;

let video;
let poseNet;
let poses = [];

let objects = [];
let i = 0;
let scale = 0;
let angle = 0;
let skew = 0;
let length = 0;

let face = {
  eye1: {
    name: "leftEye",
    id: null,
    pos: null,
    img: null
  },
  eye2: {
    name: "rightEye",
    id: null,
    pos: null
  },
  nose: {
    name: "nose",
    id: null,
    pos: null
  }
}

function preload() {
  for(let i=0; i<imageNo; i++) {
    let image = loadImage(`images/img${i+1}.png`);
    images.push(image);
  }
}
function setup() {
  var can = createCanvas(windowWidth,windowWidth*0.75);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowWidth*0.75);
  let vidHeight = select('video').height;
  let mirror;
  if(windowWidth < 600) {
    mirror = false;
  } else {
    mirror = false;
  }
  //class prop threshold : number of boxes
  let options = {
    imageScaleFactor: 0.9,
    flipHorizontal: mirror,
    minConfidence: 10,
    maxPoseDetections: 3,
    scoreThreshold: 0.9,
    nmsRadius: 10,
    detectionType: 'single',
    multiplier: 0.75,
  }
  // Create a YOLO method
  poseNet = ml5.poseNet(video, options, modelReady);
  poseNet.on('pose',function(results) {
    poses = results;
  })
}

function draw() {
  clear();
  if(i < 100) {
    windowResized();
    i++;
  }

  image(video, 0, 0, width, height);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();

  //draw box
  if(face.eye1.id !== null && face.eye2.id !== null && face.nose.id !== null) {
    if(face.eye1.pos) {
      length = face.eye2.pos.x - face.eye1.pos.x;
      let x = face.eye1.pos.x + length/2;
      let y = face.eye1.pos.y;
      translate(x,y);
      rotate(-(noise(0.1)*angle));
      // let height = face.nose.pos.y - face.eye1.pos.y;
      let v1 = createVector(face.eye1.pos.x, face.eye1.pos.y);
      let v2 = createVector(face.eye2.pos.x, face.eye2.pos.y);
      skew = v1.angleBetween(v2);

      if(face.eye1.img && scale > 0) {
        let width = length+scale;
        image(images[face.eye1.img],-width/2,-width/2,width,width);
        // let top = (windowHeight - (windowWidth*0.75))/2;
        // let dna = select('.dna');
        // dna.position(x-(width/2),top+y-(width/2));
        // dna.size(width,width);
        // dna.attribute('src',`images/img${face.eye1.img}.png`);
        text(`${ceil(x)},${ceil(y)}`,x,y);
        ellipse(x,y,10,10)
      }
    }
  }
  // console.log(length);
  let eyeGap = map(length,30,110,-1,1);
  if(scale < windowWidth) {
    scale+=(ceil(random(-0.05,0.1)));
  }
  let skewAngle = map(skew,0.3,0,0.1,-0.1)
  if(angle <360) {
    angle+=(0.032+skewAngle);
  } else {
    angle = 0;
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();

        //set initial ids of eye + nose
        for(let feature in face) {
          let value = face[feature];
          if(keypoint.part === value.name && !value.id) {
            value.id = j;
            value.pos = keypoint.position;
            if(value.name === "leftEye") {
              value.img = floor(random(0,images.length));
            }
          } else if(value.id === j && value.id !== null) {
            value.pos = keypoint.position;
          }
        }
        //refresh positions if ids match those in face object
        if(face.eye1.id === j || face.eye2.id === j || face.nose.id === j) {
          if(keypoint.part === "leftEye") {
            face.eye1.pos = keypoint.position;
          }
          if(keypoint.part === "rightEye") {
            face.eye2.pos = keypoint.position;
          }
          fill(0,255,255);
        }

        ellipse(keypoint.position.x, keypoint.position.y, 5, 5);
        text(keypoint.part, keypoint.position.x, keypoint.position.y)
      }
    }
  }
}

function modelReady() {
  // select('#status').html('Model Loaded');
}

function windowResized() {
  // let vidHeight = select('video').height;
  // console.log(vidHeight)
  // resizeCanvas(windowWidth,vidHeight);
}
