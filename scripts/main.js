function shape(x, y, w, h, fill) {
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 0;
  this.h = h || 0;
  this.fill = fill || '#AAAAAA';
}

shape.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}

//mouse in shape
shape.prototype.contains = function(mx, my) {
  return (this.x <= mx) && (this.x + this.w >= mx) &&
         (this.y <= my) && (this.y + this.h >= my);
}



function canvasState() {
  this.canvas = canvas;
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.ctx = canvas.getContext('2d');
  this.valid = false;
  this.shapes = [];
  this.dragging = false;
  this.selection = null;
  this.dragoffx = 0;
  this.dragoffy = 0;
  var myState = this;

  canvas.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
  }, false);

  canvas.addEventListener('mousedown', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var shapes = myState.shapes;
    var l = shapes.length;
    for (var i = l-1; i >= 0; i--) {
      if (shapes[i].contains(mx, my)) {
        var mySel = shapes[i];
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
    }

    if (myState.selection) {
      myState.selection = null;
      myState.valid = false;
    }
  }, true);

  canvas.addEventListener('mousemove', function(e) {
    if (myState.dragging){
      var mouse = myState.getMouse(e);
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;
      myState.valid = false;
    }
  }, true);

  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
  }, true);

  canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
    myState.addShape(new shape(mouse.x - 10, mouse.y - 10, 50, 50,
        'rgb(255, 255, 255)'));
  }, true);

  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);

  window.addEventListener('keypress', function(e) {
    var colors = ['rgb(0, 0, 255)', 'rgb(169,169,169)', 'rgb(255, 255, 0)', 'rgb(255, 0, 0)'];
    canvas.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  }, true);

}

canvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}

canvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

canvasState.prototype.draw = function() {
  if(!this.valid) {
    var ctx = this.ctx;
    var shapes = this.shapes;
    this.clear();
  //enter more shapes if needed here
  var l = shapes.length;
  for (var i = 0; i < l; i++) {
    var shape = shapes[i];
    if (shape.x > this.width || shape.y > this.height ||
    shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
    shapes[i].draw(ctx);
  }

  if (this.selection != null) {
    ctx.strokeStyle = this.selectionColor;
    ctx.lineWidth = this.selectionWidth;
    var mySelection = this.selection;
    ctx.strokeRect(mySelection.x, mySelection.y, mySelection.w, mySelection.h);
  }

  this.valid = true;
  }
}

canvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }
  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  return {x: mx, y: my};
}

function init() {
  var s = new canvasState(document.getElementById('canvas'));
  s.addShape(new shape(20, 20, 400, 400, 'rgb(255, 0, 0)'));
  s.addShape(new shape(125, 80, 30, 200, 'rgb(255, 255, 0)'));
  s.addShape( new shape(60, 140, 300, 60, 'rgb(0, 0, 0)'));
  s.addShape(new shape(40, 40, 50,  50, 'rgb(255, 255, 0)'));
  s.addShape(new shape(80, 150, 60, 30, 'rgb(255, 255, 255)'));
}

init();
