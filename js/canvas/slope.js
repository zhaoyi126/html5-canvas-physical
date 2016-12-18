
var canvas = document.getElementById('canvas');
var	context = canvas.getContext('2d');
	
var ballPainter ={
	paint: function(sprite, context) {
		
		var x = sprite.left + sprite.width/2;
		var y = sprite.top + sprite.width/2;
		var radius = sprite.width/2;
		
		context.save();
		context.beginPath();
		context.arc(x,y,radius,0,Math.PI*2,false);
		context.stroke();
		context.clip();
		
		context.shsdowColor = 'rgb(0,0,0)';
		context.shadowOffsetX = -4;
		context.shadowOffsetY = -4;
		context.shadowBlur = 8;
		
		context.lineWidth = 2;
		context.strokeStyle= 'rgb(100,100,100)';
		context.fillStyle = 'rgba(30,144,255,01.5)';
		context.fill();
		context.stroke();
		context.restore();
	}
};

function toFix(data){
	var temp_data = data;
	return Math.round(temp_data*100)/100;
}

function writeWord(txt,x,y)
{
	context.save();
	context.font="20px Georgia";
	context.fillText(txt,x,y);
	context.restore();
}

function windowToCanvas(e) {
	   var x = e.x || e.clientX,
	       y = e.y || e.clientY,
	       bbox = canvas.getBoundingClientRect();
	   return { x: x - bbox.left * (canvas.width  / bbox.width),
	            y: y - bbox.top  * (canvas.height / bbox.height)
	          };
	}

canvas.onmousemove = function (e) {
   var location;
   location = windowToCanvas(e);
	var str = "x:" + toFix(location.x);// -collisionX);
	var str2 = "y:" + toFix(location.y);
	context.clearRect(canvas.width-100,canvas.height-150,100,100);
	writeWord(str,canvas.width-100,canvas.height-120);
	writeWord(str2,canvas.width-100,canvas.height-90);
}

//draw the path of the ball
function drawAPath()
{
	context.beginPath();
	context.moveTo(ballLeft,0);
	for(var i =0;i<context.canvas.height;i+=lineStepX)
	{
		context.lineTo(ballLeft+BallAvelocityX*i,0.5*GRAVITY*i*i);
	}
	context.stroke();
}

function drawBPath()
{
	context.beginPath();
	context.moveTo(ballLeft,0);
	for(var i =0;i<context.canvas.height;i+=lineStepX)
	{
		context.lineTo(ballLeft+BallBvelocityX*i,0.5*GRAVITY*i*i);
	}
	context.stroke();
}

function drawSlope()
{
	context.save();
	context.beginPath();
	//draw triangle
	context.moveTo(0,50);
	context.lineTo((canvas.height/2 - 50)*Math.sqrt(3),canvas.height/2);
	context.lineTo(0,canvas.height/2);
	context.lineTo(0,50);
	//draw horizontal line
	context.moveTo((canvas.height/2 - 50)*Math.sqrt(3),canvas.height/2);
	context.lineTo(canvas.width,canvas.height/2);
	context.moveTo((canvas.height/2 - 50)*Math.sqrt(3),canvas.height/2+2);
	context.lineTo(canvas.width,canvas.height/2+2);
	writeWord('frication',(canvas.height/2)*Math.sqrt(3),canvas.height/2+22);
	context.closePath();
	context.stroke();
	context.restore();
}

function drawKeyAPoint()
{
	context.save();
	for(var i=0;i<arrayAX.length;i++)
	{
		ball.left = arrayAX[i]-3;
		ball.top = arrayAY[i]-3;
		ball.width=6;
		ball.paint(context);
	}
}

var ballTopA = 32;
var ballLeft = 0;
var GRAVITY = 9.81;

var ball = new Sprite('ball',ballPainter);
var lauchedTime = undefined;
var flightTime = 0;
var frameTime = 0;
ball.left = ballLeft;
ball.top = ballTopA;
var RADIUS = 10;
ball.width = RADIUS * 2,
ball.paint(context);
writeWord('A',ball.left+RADIUS*0.5,ball.top+RADIUS*1.5);

var lastAdvance = 0;
var second = 1;
var angle = Math.atan(1/Math.sqrt(3));
var start = false;
var tempVx = 0;
var tempTime = 0;
var horizontalFlag = false;

function animate(time)
{
	if(!start)
	{
		drawSlope();
		if((time - 1000 * second) > 0)
		{
			second++;
		}
		window.requestNextAnimationFrame(animate);
		return;
	}
		
	context.clearRect(0,0,canvas.width,canvas.height);
	drawSlope();
	if(lauchedTime == undefined) lauchedTime = time;
	flightTime = (time - lauchedTime)/1000;
	frameTime = (time - lastAdvance)/1;
	
	if((ball.top + RADIUS * 2 < canvas.height/2) && (!horizontalFlag))
	{
		ball.left = ballLeft + GRAVITY * flightTime * Math.sin(angle) * Math.cos(angle) * frameTime;
		ball.top = ballTopA + GRAVITY * flightTime * Math.sin(angle) * Math.sin(angle) * frameTime;
		tempVx = GRAVITY * flightTime;
		tempTime = flightTime;
		
		var html = '';
		if((time - 1000 * second) > 0)
		{
			second++;
			html = '';
			html +="<tr><td>" + Math.round(flightTime*100)/100 + "</td><td>" + Math.round(tempVx*Math.sin(angle)*Math.cos(angle)*100)/100 + "</td><td>" + Math.round(GRAVITY * flightTime * Math.sin(angle) * Math.sin(angle)*100)/100
			 + "</td><td>" + Math.round(ball.left * 100)/100+ "</td><td>" + Math.round(ball.top*100)/100 
			 +"</td></tr>";
			$(".tableA").append(html);
		}
	} else {
		//return;
		horizontalFlag = true;
		ball.top = canvas.height/2 - RADIUS * 2;//to assume there is a round angle
		var friction_force_ratio = GRAVITY/2;
		var horizontalTime = flightTime - tempTime;

		ball.left = (canvas.height/2 - 50)*Math.sqrt(3) + tempVx * horizontalTime - GRAVITY*Math.pow(horizontalTime,2)/2/2 ;
		var html = '';
		if((time - 1000 * second) > 0)
		{
			second++;
			html = '';
			html +="<tr><td>" + Math.round(flightTime*100)/100 + "</td><td>" + Math.round(tempVx * Math.sin(angle) *100)/100 + "</td><td>" + 0
			 + "</td><td>" + Math.round(ball.left * 100)/100+ "</td><td>" + Math.round(ball.top*100)/100 
			 +"</td></tr>";
			$(".tableA").append(html);
		}
	}
	
	ball.paint(context);
	context.font="15px Verdana";
	context.fillText('A',ball.left+RADIUS*0.5,ball.top+RADIUS*1.5);
	
	if(Math.abs(tempVx - friction_force_ratio * horizontalTime) <= 0.001) {
		writeWord('stop',canvas.width-100,50,100,100)
		return;
	}
		
	//console.log("time:" + frameTime + ",球A的x坐标：" +　ball.left + ",球A的y坐标" + ball.top);
	lastAdvance = time;
	window.requestNextAnimationFrame(animate);
}

function startFun()
{
	start = true;
}

function stopFun()
{
	window.location.href = window.location.href;
}

function writeWord(txt,x,y)
{
	context.font="20px Georgia";
	context.fillText(txt,x,y);
}

window.requestNextAnimationFrame(animate);