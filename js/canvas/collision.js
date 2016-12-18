
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    shapes = [],
    
    lastdrag = { x: 0, y: 0 },
    shapeBeingDragged = undefined,
	RADIUS = 20,
	startX = 150,
	c1 = new Circle(50, startX, RADIUS),
    c2 = new Circle(200, startX, RADIUS);

function windowToCanvas(e) {
   var x = e.x || e.clientX,
       y = e.y || e.clientY,
       bbox = canvas.getBoundingClientRect();
   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
};

function drawShapes() {
   shapes.forEach( function (shape) {
      shape.stroke(context);
      shape.fill(context);
   });
}

function drawLine(startx,starty,endx,endy)
{
	context.save();
	context.beginPath();
	context.moveTo(startx,starty);
	context.lineTo(endx,endy);
	context.stroke();
	context.restore();
}

function detectCollisions() {
   var textY = 30;
   
   if (shapeBeingDragged) {
      shapes.forEach( function (shape) {
         if (shape !== shapeBeingDragged) {
            if (shapeBeingDragged.collidesWith(shape)) {
               //context.fillStyle = shape.fillStyle;
               context.fillText('collision', 20, textY);
               textY += 40;
			   collision = true;
			   return;
            }
			else {
			   collision = false;
			}
         }
      });
   }
};

function toFix(data){
	var temp_data = data;
	return Math.round(temp_data*100)/100;
}

canvas.onmousemove = function (e) {
   var location;
   location = windowToCanvas(e);
	var str = "x:" + toFix(location.x -collisionX);
	var str2 = "y:" + toFix(location.y);
	context.clearRect(canvas.width-100,canvas.height-150,100,100);
	writeWord(str,canvas.width-100,canvas.height-120);
	writeWord(str2,canvas.width-100,canvas.height-90);
}

shapes.push(c1);
shapes.push(c2);
drawShapes();

var v_x_c1 = 60;
var v_x_c2 = 0;
var startTime = undefined;
var lastTime = 0;
var GRAVITY_FORCE = 9.81;
var elapsedTime = 0;
var flightTime = 0;
shapeBeingDragged = c1;
var collision = false;
var hasCrashed = false;
var collisionX = 0;//the position x where the collision happens
var start = false;

function writeWord(txt,x,y)
{
	context.font="20px Georgia";
	context.fillText(txt,x,y);
}

function startFun() {
	start = true;
}

function animation(time)
{
	if(!start)
	{
		lastTime = time;
		writeWord('A',c1.x - RADIUS/2,c1.y + RADIUS/2);
		writeWord('B',c2.x - RADIUS/2,c2.y + RADIUS/2);
		window.requestNextAnimationFrame(animation);
		return;
	}
	
	if(startTime == undefined) startTime = time;
	elapsedTime = (time - lastTime)/1000;
	flightTime = (time - startTime)/1000;
	
	if(!collision && !hasCrashed)
	{
		c1.move(v_x_c1 * elapsedTime,GRAVITY_FORCE * flightTime * elapsedTime);
		c2.move(0,GRAVITY_FORCE * flightTime * elapsedTime);
	} else {
		if(!hasCrashed)
		{
			hasCrashed = true;
			//mtv
			c1.move((c2.x - c1.x - 2 * RADIUS),GRAVITY_FORCE * flightTime * elapsedTime);
			collisionX = c1.x + RADIUS;
		}
		c1.move(0-v_x_c1 * elapsedTime/2,GRAVITY_FORCE * flightTime * elapsedTime);
		c2.move(v_x_c1 * elapsedTime * 3/2,GRAVITY_FORCE * flightTime * elapsedTime);
		$("#velocityafter").val(-v_x_c1/2);
		$("#velocityBafter").val(v_x_c1 * 3/2);
	}
	
	//stop
	if(c1.y + RADIUS >= canvas.height) {
		drawLine(collisionX,0,collisionX,canvas.height);
		//console.log(collisionX);
		return;
	}
	lastTime = time;
	context.clearRect(0,0,canvas.width,canvas.height);
    drawShapes();
    detectCollisions();
    //drawLine(collisionX,0,collisionX,canvas.height);
	writeWord('A',c1.x - RADIUS/2,c1.y + RADIUS/2);
	writeWord('B',c2.x - RADIUS/2,c2.y + RADIUS/2);

	window.requestNextAnimationFrame(animation);
}

function resetFun()
{
	window.location.href = window.location.href;
}

window.requestNextAnimationFrame(animation);