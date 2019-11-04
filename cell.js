var zoom;
var spread;

class Cell {
  constructor(type,image,i) {
    this.type = type;
    if(this.type === "bot") {
      this.image = image;
    } else {
      this.image = null;
    }
    this.imageNo = i;
    // rotation
    this.speed = random(1,4);
    if(this.type === "bot") {
      this.rotationDirection = random(-1,1);
    } else {
      this.rotationDirection = 0;
    }
    // size
    if(this.type === "bot") {
      this.maxSize = random(windowWidth/2,windowWidth);
    } else {
      this.maxSize = windowWidth*0.75;
    }
    // position
    if(this.type === "bot") {
      this.x = 0;
      this.y = 0;
      this.posx = random(windowWidth*0.3, windowWidth*0.7);
      this.posy = random(windowHeight*0.3, windowHeight*0.7);
      this.posAngle = 0;
      this.posRadius = 0;
      this.pullDist = random(windowWidth*0.1, windowWidth*0.7);
    } else {
      this.x = windowWidth/2;
      this.y = windowWidth/2;
    }
    //size
    if(this.type === "bot") {
      this.size = 0;
      this.scale = 0;
    } else {
      this.size = 110;
      this.scale = 100;
    }
    this.scaleFactor = random(1,1.7);
    console.log(this.scaleFactor);
    //styles
    if(this.type === "bot") {
      this.hue = random(-70,70);
    } else {
      this.hue = 0;
    }
    if(this.type === "bot") {
      this.opacity = random(0.1,0.9);
    } else {
      this.opacity = random(0.8,1);
    }
    this.brightness = random(80,120);
    if(this.type === "bot") {
      this.blur = random(0,1);
    } else {
      this.blur = 0;
    }
    this.dropShadow = floor(random(0,20));

    this.angle = 0;

    this.top = (windowHeight - (windowWidth*0.75))/2;
    // this.pulse = eyeGap; // scale + eyeGap/random
  }

  display() {
    //set image url
    let image;
    if(this.type === "bot") {
      image = select(`.dna${this.imageNo}`);
    } else {
      image = select('.dna');
    }
    image.removeClass('hide');
    //set hue | brightness | blur | drop shadow
    image.style('filter', `hue-rotate(${this.hue}deg) brightness(${this.brightness}%) blur(${this.blur}px)`);
    //set opacity
    image.style('opacity', this.opacity);

    //set initial scale + position
    image.position(this.x,this.y);
    image.size(this.size,this.size);
  }

  update(data) {
    let image;
    if(this.type === "bot") {
      image = select(`.dna${this.imageNo}`);
    } else {
      image = select('.dna');
    }
    this.top = (windowHeight - (windowWidth*0.75))/2;
    // update size
    if(this.scale < this.maxSize) {
      // this.scale+=(noise(0.1)*ceil(random(-0.3,0.7)));
      // this.scale+=ceil(random(-0.3,0.7));
      this.scale+=this.scaleFactor;
    }
    this.size = this.scale;
    // update cell variables
    if(this.type === "bot") { //bot cell
      // angle
      if(this.angle <360) {
        this.angle += this.speed*this.rotationDirection;
      } else {
        this.angle = 0;
      }
      // stays in same position
      // this.x = this.posx - this.size/2;
      // this.y = this.posy - this.size/2;
      // automomous movement (remains within boundary of circle)
      this.posAngle += 0.01;
      this.x = this.posx - this.size/2 + cos(this.posAngle*(this.posRadius));
      this.y = this.posy - this.size/2 + sin(this.posAngle*(this.posRadius));
      // autonomous movement affected by movement of tracked cell (calculated from distance between dna and this?)
      // let control = select('.dna');
      // let controlx = control.style('left');
      // let controly = control.style('right');
      // let xdist = this.x - Number(split(controlx,'px')[0]);
      // let ydist = this.y - Number(split(controly,'px')[0]);
      // if(abs(xdist) > this.pullDist) {
      //   if(xdist > 0) {
      //     console.log(true);
      //     this.x = this.x - 1;
      //   } else {
      //     this.x ++;
      //   }
      // } else {
      //   if(xdist > 0) {
      //     this.x ++;
      //   } else {
      //     this.x --;
      //   }
      // }

    } else { // face cell
      // image
      this.image = data.image;
      // size
      let length = data.x2 - data.x1;
      // position
      let x = data.x1 + length/2;
      let y = data.y1;
      this.x = noise(0.2)+(x-(this.size/2));
      this.y = noise(0.2)+(this.top+y-(this.size/2));
      // angle
      let v1 = createVector(data.x1, data.y1);
      let v2 = createVector(data.x2, data.y2);
      let skew = v1.angleBetween(v2);
      this.rotationDirection = map(skew,0.3,0,-1.5,1.5); //not bot
      if(this.angle <360) {
        this.angle += this.speed*this.rotationDirection;
      } else {
        this.angle = 0;
      }
      // hue
      this.hue = map(length,0,200,-70,70);
      if(length <0 || length > 200) {
        this.hue = 0;
      }
    }
    //set image src
    if(!image.attribute('src')) {
      image.attribute('src',`images/img${this.image}.png`);
    }
    //update size
    image.size(this.size,this.size);
    //update position
    image.position(this.x,this.y);
    //update hue
    image.style('filter', `hue-rotate(${this.hue}deg) brightness(${this.brightness}%) blur(${this.blur}px) drop-shadow(${this.dropShadow}px ${this.dropShadow}px ${this.dropShadow}px blue)`);
    //update rotation
    image.style('transform', `rotate(${this.angle}deg)`);
    //update opacity
    image.style('opacity', this.opacity);
  }
}
