let images = [];
let imageNo = 40;
let mirror;
let cellsNo = 0;
let cells = [];
let currentCell = 0;

let video;
let poseNet;
let poses = [];

let objects = [];
let i = 0;
let scale = 10;
let angle = 0;
let skew = 0;
let length = 0;
let speed;

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
  for(let i=0; i<4; i++) {
    let randomImage = floor(random(0,imageNo));
    console.log(randomImage);
    let image = loadImage(`images/img${randomImage}.png`);
    images.push(image);
  }
  console.log(images)
//   for(let i=0; i<imageNo; i++) {
//     let image = loadImage(`images/img${i+1}.png`);
//     images.push(image);
//   }
}
function setup() {
  var can = createCanvas(windowWidth,windowWidth*0.75);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowWidth*0.75);
  let vidHeight = select('video').height;

  if(windowWidth < 600) {
    mirror = false;
  } else {
    mirror = true;
  }
  //class prop threshold : number of boxes
  let options = {
    imageScaleFactor: 0.9,
    flipHorizontal: true,
    minConfidence: 10,
    maxPoseDetections: 3,
    scoreThreshold: 0.9,
    nmsRadius: 10,
    detectionType: 'single',
    multiplier: 0.75,
  }
  speed = random(1,4);

  // Create a YOLO method
  poseNet = ml5.poseNet(video, options, modelReady);
  poseNet.on('pose',function(results) {
    poses = results;
  })
  if(windowWidth < 600) {
    select('.circle').attribute('src','circle2.png');
  }
  // create initial cell
  cells.push(new Cell('face'));
  // display cells
  for(let i=0; i<cells.length;i++) {
    cells[i].display();
  }
}

function draw() {
  clear();
  if(i < 100) {
    windowResized();
    i++;
  }

  // image(video, 0, 0, width, height);
  // We can call both functions to draw all keypoints and the skeletons
  if(camera) {
    drawKeypoints();
  }

  //draw box
  if(face.eye1.id !== null && face.eye2.id !== null && face.nose.id !== null) {
    if(face.eye1.pos) {
      if(face.eye1.img && scale > 0) {
        let data = {
          x1: face.eye1.pos.x,
          y1: face.eye1.pos.y,
          x2: face.eye2.pos.x,
          y2: face.eye2.pos.y,
          image: face.eye1.img
        }
        cells[0].update(data);
        if(cells.length > 1) {
          for(let i=1; i<cells.length;i++) {
            cells[i].update();
          }
        }
      }
    }
  }
  if(select('.dna').width > windowWidth/2 && cells.length === 1) {
    currentCell = 1;
    addNewCell(1);
  }
  if(select('.dna1').width > windowWidth/2.1 && cells.length === 2) {
    currentCell = 2;
    addNewCell(2);
  }
  if(select('.dna2').width > windowWidth/2.1 && cells.length === 3) {
    currentCell = 3;
    addNewCell(3);
  }
}
function addNewCell(index) {
  let imageI = images[currentCell];
  cells[index] = new Cell('bot',imageI,index);
  cells[index].display();
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
        }
      }
    }
  }
}

function modelReady() {
  // select('#status').html('Model Loaded');
  select('.cells').removeClass('hide');
}

function windowResized() {
  // let vidHeight = select('video').height;
  // console.log(vidHeight)
  // resizeCanvas(windowWidth,vidHeight);
}
