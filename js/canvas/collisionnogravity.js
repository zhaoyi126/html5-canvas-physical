
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    shapes = [],

    mousedown = { x: 0, y: 0 },
    lastdrag = { x: 0, y: 0 },
    shapeSelected = undefined,
	RADIUS = 20,
    startY = 150,
    c1 = new Circle(150, startY, RADIUS),
    c2 = new Circle(350, startY, RADIUS);

function windowToCanvas(e) {
   var x = e.x || e.clientX,
       y = e.y || e.clientY,
       bbox = canvas.getBoundingClientRect();
		//console.log("x:" + x + ",y:" + y);
   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
};

function drawHorizontalLine()
{
	context.save();
	context.beginPath();
	context.moveTo(0,startY+RADIUS);
	context.lineTo(canvas.width,startY+RADIUS);
	context.stroke();
	context.restore();
}

function drawShapes() {
   shapes.forEach( function (shape) {
      shape.stroke(context);
      shape.fill(context);
   });
}

function detectCollisions() {
   var textY = 30;
   
   if (shapeSelected) {
      shapes.forEach( function (shape) {
         if (shape !== shapeSelected) {
            if (shapeSelected.collidesWith(shape)) {
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

shapes.push(c1);
shapes.push(c2);

context.shadowColor = 'rgba(100,140,255,0.5)';
context.shadowBlur = 4;
context.shadowOffsetX = 2;
context.shadowOffsetY = 2;
context.font = '38px Arial';


var v_x_c1 = 0;
var v_x_c2 = 0;
var startTime = undefined;
var lastTime = 0;
//var GRAVITY_FORCE = 9.81;
var GRAVITY_FORCE = 0;//no gravity
var elapsedTime = 0;
var flightTime = 0;
shapeSelected = c1;
var collision = false;
var hasCrashed = false;
var startFlag = false;


function writeWord(txt,x,y)
{
	context.font="20px Georgia";
	context.fillText(txt,x,y);
}


function init()
{
	if($("#velocity").val() == "" || $("#velocity").val() == null)
		return;
	drawShapes();
}
init();

function animation(time)
{
	if(!startFlag){
		context.clearRect(0,0,canvas.width,canvas.height);
	    drawShapes();
	    drawHorizontalLine();
		writeWord('A',c1.x - RADIUS/2,c1.y + RADIUS/2);
		writeWord('B',c2.x - RADIUS/2,c2.y + RADIUS/2);
		lastTime = time;
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
		}
		//Conservation of momentum
		c1.move(0-v_x_c1 * elapsedTime/2,GRAVITY_FORCE * flightTime * elapsedTime);
		c2.move(v_x_c1 * elapsedTime*3/2,GRAVITY_FORCE * flightTime * elapsedTime);
		$("#velocityafter").val(-v_x_c1/2);
		$("#velocityBafter").val(v_x_c1 * 3/2);
	}
	
	//stop
	if(c2.x + RADIUS >= canvas.width)
		return;
		
	lastTime = time;
	context.clearRect(0,0,canvas.width,canvas.height);
    drawShapes();
    detectCollisions();
    drawHorizontalLine();
	writeWord('A',c1.x - RADIUS/2,c1.y + RADIUS/2);
	writeWord('B',c2.x - RADIUS/2,c2.y + RADIUS/2);

	window.requestNextAnimationFrame(animation);
}

function start()
{
	v_x_c1 = $("#velocity").val();
	startFlag = true;
}

function toFix(data){
	var temp_data = data;
	return Math.round(temp_data*100)/100;
}

canvas.onmousemove = function (e) {
	   var location;
	   location = windowToCanvas(e);
		var str = "x:" + toFix(location.x);// -collisionX);
		var str2 = "y:" + toFix(location.y);
		context.clearRect(canvas.width-100,canvas.height-100,100,100);
		writeWord(str,canvas.width-100,canvas.height-80);
		writeWord(str2,canvas.width-100,canvas.height-50);
}

function reset()
{
	window.location.href = window.location.href;
}

window.requestNextAnimationFrame(animation);