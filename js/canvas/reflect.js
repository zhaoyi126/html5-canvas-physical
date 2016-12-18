
var canvas = document.getElementById('canvas');
var	context = canvas.getContext('2d');
var shapes = [];
var GRAVITY_FORCE = 98.1;
var startTime = undefined;

var velocity = new Vector(new Point(0, 0));
var lastTime = 0;
var c1 = new Circle(100,100,20);

var yFlag = false;
var startFlag = false;
var Vyflect = 0;
var collisionTime = 0;
var collisionStoreTime = 0;
shapes.push(c1);
var shapeMoving = c1;
var seconds = 1;
var html = '';

var times = 0;//times which the ball do the animate 
var velocitydirection = true;//down
var toppositiony = new Array();//the array indicate that the peak of once leap
var toppositionx = new Array();//the array indicate the position x.
var ATTENUATION = 1;


function init()
{
	velocity.x = 20;
	
	if($("#Attenuation").val() != null && $('#Attenuation').val() != '')
		ATTENUATION = $("#Attenuation").val();
	
	if($('#velocityX').val() != null && $('#velocityX').val() != '')
		velocity.x = $('#velocityX').val();
	
}

function drawCircle(x,y,r)
{
	context.save();
	context.beginPath();
	context.arc(x,y,r,0,Math.PI*2,false);
	context.stroke();
	context.restore();
}


function drawKeyPoint()
{
	//console.log("keypoint");
	for(var i=0;i<toppositionx.length;i++)
	{
		drawCircle(toppositionx[i],toppositiony[i],2);
	}
}

function animate(time)
{
	if(!startFlag)
	{
		if((time - 1000 * seconds) > 0)
		{
			seconds++;
		}
		if(times < 1)
		{
			drawGrid();
			drawShapes();
			window.requestNextAnimationFrame(animate);
			//console.log("stop");
		}
		if(times > 0)
		{
			drawKeyPoint();
		}
		return;
	}
	
	if(startTime == undefined) startTime = time;
	
	var elapsedTime = (time-lastTime)/1000;
	var flightTime = (time-startTime)/1000;
	context.clearRect(0,0,canvas.width,canvas.height);
	collisionStoreTime = flightTime;//save the time temp
	if(yFlag)
	{
		velocity.y = Vyflect + GRAVITY_FORCE * (flightTime - collisionTime);
		if(velocity.y > 0)
		{
			if(!velocitydirection) {
				toppositiony.push(c1.y);
				toppositionx.push(c1.x);
			}
			velocitydirection = true;//down
			//console.log(topposition);
		}
	}
	else {
		velocity.y = GRAVITY_FORCE * flightTime;
	}
	
	if((time - 1000 * seconds) > 0) {
		seconds++;
		html = '';
		html +="<tr><td>" + Math.round(flightTime*100)/100 + "</td><td>" + velocity.x + "</td><td>" + Math.round(velocity.y*100)/100 + "</td></tr>";
		$(".table").append(html);
	}
	times++;
	//if delete this, there will be a leap.
	if(times ==  1) {
		c1.move(0,0); 
	}
	else {
		c1.move(velocity.x * elapsedTime ,velocity.y * elapsedTime);
	}
	//c1.move(0 ,velocity.y * elapsedTime);
	
	handleEdgeCollisions();
	drawGrid();
	drawShapes();
	
	window.requestNextAnimationFrame(animate);
	lastTime = time;
}

//draw with a ball
function drawGrid()
{
   context.save();
	
   context.shadowColor = undefined;
   context.shadowBlur = 0;
   context.shadowOffsetX = 0;
   context.shadowOffsetY = 0;
   
   context.strokeStyle = 'green';
   context.fillStyle = '#ffffff';
   context.lineWidth = 0.5;
   context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	
	for(var i=0;i<context.canvas.width;i+=10)
	{
		context.beginPath();
		context.moveTo(i,0);
		context.lineTo(i,context.canvas.height);
		context.stroke();
	}
	
	for(var i=0;i<context.canvas.height;i+=10)
	{
		context.beginPath();
		context.moveTo(0,i);
		context.lineTo(context.canvas.width,i);
		context.stroke();
	}
	context.restore();
}

function handleEdgeCollisions() {
	   var bbox = shapeMoving.boundingBox(),
	       right = bbox.left + bbox.width,
	       bottom = bbox.top + bbox.height;
	      
	   if (right > canvas.width || bbox.left < 0) {
	      velocity.x = -velocity.x;
	      velocity.y = velocity.y;
	      if (right > canvas.width)
	         shapeMoving.move(0-(right-canvas.width), 0);

	      if (bbox.left < 0)
	         shapeMoving.move(-bbox.left, 0);
	   }
	   if (bottom > canvas.height || bbox.top < 0) {
		  collisionTime = collisionStoreTime;//update the collision time
	      velocity.y = -velocity.y;
	      //you can use a num to make the power run off
	      Vyflect = velocity.y * ATTENUATION;//collision velocity
	      if(Math.abs(Vyflect) <= 0.9)//it seems that it does not move.
    	  {
	    	  startFlag = false;
	    	  //drawKeyPoint();//this does not function
    	  }
	    	  
	      yFlag = true;
	      velocitydirection = false;//up
	      velocity.x = velocity.x;
	      if (bottom > canvas.height)
	         shapeMoving.move(0, 0-(bottom-canvas.height));
	      if (bbox.top < 0)
	         shapeMoving.move(0, -bbox.top);
	   }
	};

function drawShapes() {
	   shapes.forEach( function (shape) {
	      shape.stroke(context);
	      shape.fill(context);
	   });
	}

function stopFun()
{
	//startFlag = false;
	window.location.href = window.location.href;
}

function startFun()
{
	init();
	startFlag = true;
}

function toFix(data){
	var temp_data = data;
	return Math.round(temp_data*100)/100;
}

function writeWord(txt,x,y)
{
	context.font="20px Georgia";
	context.fillText(txt,x,y);
}

function windowToCanvas(e) {
	   var x = e.x || e.clientX,
	       y = e.y || e.clientY,
	       bbox = canvas.getBoundingClientRect();
			//console.log("x:" + x + ",y:" + y);
	   return { x: x - bbox.left * (canvas.width  / bbox.width),
	            y: y - bbox.top  * (canvas.height / bbox.height)
	          };
	};

canvas.onmousemove = function (e) {
	   var location;
	   location = windowToCanvas(e);
		var str = "x:" + toFix(location.x);// -collisionX);
		var str2 = "y:" + toFix(canvas.height - location.y);
		context.clearRect(canvas.width-100,canvas.height-110,100,60);
		writeWord(str,canvas.width-100,canvas.height-90);
		writeWord(str2,canvas.width-100,canvas.height-60);
}
window.requestNextAnimationFrame(animate);