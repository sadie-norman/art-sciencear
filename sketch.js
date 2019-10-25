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
let yolo;
let status;
let objects = [];
let i = 0;

function preload() {
  for(let i=0; i<imageNo; i++) {
    let image = loadImage(`images/img${i+1}.png`);
    images.push(image);
  }
}

function setup() {
  var can = createCanvas(windowWidth,windowHeight);
  video = createCapture(VIDEO);
  let vidHeight = select('video').height;
  console.log(select('video').height);
  let options = {
    filterBoxesThreshold: 0.01,
    IOUThreshold: 0.1,
    classProbThreshold: 0.4
  }

  console.log(images);
  //class prop threshold : number of boxes

  // Create a YOLO method
  yolo = ml5.YOLO(video, options, startDetecting);

  // Hide the original video
  status = select('#status');
}

function draw() {
  clear();
  if(i < 100) {
    // let vidHeight = select('video').height;
    // console.log(vidHeight);
    // resizeCanvas(windowWidth,vidHeight*2);
    windowResized();
    i++;
  }
  console.log(objects)
  // image(video, 0, 0, width, height);
  for (let i = 0; i < objects.length; i++) {
    let x = objects[i].x * width;
    let y = objects[i].y * height;
    let w = objects[i].w * width;
    let h = objects[i].h * height;
    // let rand = floor(random(0,imageNo));
    image(images[i],x,y,w,h);
    noStroke();
    fill(0, 255, 0);
    text(objects[i].label, x, y - 5);
    noFill();
    strokeWeight(4);
    stroke(0, 255, 0);
    rect(x,y,w,h);
  }
}

function startDetecting() {
  status.html('Model loaded!');
  detect();
}

function detect() {
  yolo.detect(function(err, results) {
    objects = results;
    detect();
  });
}

function windowResized() {
  let vidHeight = select('video').height;
  resizeCanvas(windowWidth,vidHeight*2);
}
