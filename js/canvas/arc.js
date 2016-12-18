
var canvas = document.getElementById('canvas');
var	context = canvas.getContext('2d');

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

//parabola(bullet)
var lob = {
		lastTime:0,
		GRAVITY_FORCE: 9.81,
		applyGravity: function(elapsed) {
			bullet.velocityY = (this.GRAVITY_FORCE * elapsed);
		},
		
		updateBallPosition: function(updateDelta) {
			bullet.left += bullet.velocityX * (updateDelta);
			bullet.top += bullet.velocityY * (updateDelta);
		},
		
		execute: function(bullet, context, time) {
			var elapsedFlightTime;
			var elapsedFrameTime;
			
			if(launchTime == undefined) launchTime = time;
			elapsedFrameTime = (time - this.lastTime)/1000;
			elapsedFlightTime = (time - launchTime)/1000;
			globalFlightTime = elapsedFlightTime;
			
			this.applyGravity(elapsedFlightTime);
			this.updateBallPosition(elapsedFrameTime);
			this.lastTime = time;
		}
	};

//arc
var lob2 = {
		lastTime:0,
		angle:Math.PI/6,
		R:150,
			
		execute: function(ball, context, time) {
			var elapsedFlightTime;
			
			if(launchTime == undefined) launchTime = time;
			elapsedFlightTime = (time - launchTime)/1000;
			FlightTime = elapsedFlightTime;
			ball.left = this.R * Math.sin(this.angle*elapsedFlightTime) + circlePointX - ball.width/2;
			ball.top = circlePointY - this.R * Math.cos(this.angle*elapsedFlightTime) - ball.width/2;
		}
	};

var ball = new Sprite('ball',ballPainter, [lob2]);
var globalFlightTime = 0;
var circlePointX = 500;
var circlePointY = 200;

var start = false;
var launchTime = undefined;
var BIGBALL_WIDTH = 40;


var bullet = new Sprite('bullet',ballPainter, [lob]);
var bulletStartX = 60;
var bulletStartY = 180;
var i = 0;//frame num
var once = 0;
var second = 0;
var lineStepX = 0.02;

var arrayX = new Array();
var arrayY = new Array();
var GRAVITY_FORCE = 9.81;
var FlightTime = 0;
var html = '';
var str = "("+ bulletStartX + " , " + bulletStartY +")";
//draw the path of the ball
function drawBulletPath()
{
	context.beginPath();
	context.moveTo(bulletStartX+BIGBALL_WIDTH/2,bulletStartY+BIGBALL_WIDTH/4);
	for(var i =0;i<context.canvas.height;i+=lineStepX)
	{
		context.lineTo(bulletStartX+BIGBALL_WIDTH/2+bullet.velocityX*i,bulletStartY+BIGBALL_WIDTH/4+0.5*GRAVITY_FORCE*i*i);
	}
	context.stroke();
}


//draw the path of the ball
function drawPath()
{
	context.beginPath();
	context.arc(circlePointX,circlePointY,150,0,Math.PI*2,false);
	context.stroke();
}

function ballPainterFun(x,y)
{
	context.save();
	context.beginPath();
	context.arc(x,y,BIGBALL_WIDTH/4,0,Math.PI*2,false);
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

function init()
{
	ball.width = BIGBALL_WIDTH/2;
	bullet.width = BIGBALL_WIDTH/2;
	bullet.left=bulletStartX;
	bullet.top=bulletStartY;
	bullet.velocityY = 0;
	lob2.angle = 0;
	drawGrid();
	drawPath();
	ballPainterFun(bulletStartX+BIGBALL_WIDTH/4,bulletStartY+BIGBALL_WIDTH/4);
	ballPainterFun(circlePointX - ball.width/2,circlePointY - lob2.R);
	writeWord(str,bulletStartX,bulletStartY+BIGBALL_WIDTH);
	writeWord('A',circlePointX - ball.width*1.5/2,circlePointY - lob2.R + ball.width/2);
	writeWord('B',bulletStartX+ball.width/4,bulletStartY+BIGBALL_WIDTH/2);
}

init();

function animate(time)
{
	if(!start)
	{
		if((time - 1000 * second) > 0)
		{
			second++;
		}
		lob.lastTime = time;
		lob2.lastTime = time;

		window.requestNextAnimationFrame(animate);
		return;
	}
	
	context.clearRect(0,0,canvas.width,canvas.height);
	drawGrid();
	drawPath();
	writeWord(str,bulletStartX,bulletStartY+BIGBALL_WIDTH);
	
	if($("#Avelocity").val() != undefined && $("#Avelocity").val() != '' && $("#Avelocity").val() != null)
		lob2.angle = $("#Avelocity").val() * Math.PI/360;

	if($("#BvelocityX").val() != undefined && $("#BvelocityX").val() != '' && $("#BvelocityX").val() != null)
		bullet.velocityX = $("#BvelocityX").val();
	
	ball.update(context, time);
	ball.paint(context);
	context.font="15px Verdana";
	context.fillText('A',ball.left+BIGBALL_WIDTH*0.6/4,ball.top+BIGBALL_WIDTH*1.3/4);

	
	bullet.update(context, time);
	bullet.paint(context);
	context.font="15px Verdana";
	context.fillText('B',bullet.left+BIGBALL_WIDTH*0.6/4,bullet.top+BIGBALL_WIDTH*1.3/4);
	i++;//frame num
	if((time - 1000 * second) > 0)
		{
			second++;
			arrayX.push(ball.left - BIGBALL_WIDTH/2);
			arrayY.push(ball.top - BIGBALL_WIDTH/2);
			
			html = '';
			html +="<tr><td>" + Math.round(globalFlightTime*100)/100 + "</td><td>" + Math.round(lob2.angle*100)/100 + "</td><td>" + Math.round(lob2.angle * globalFlightTime*100)/100 
				+ "</td><td>" + Math.round(lob2.angle * 180/Math.PI * globalFlightTime*100)/100 + "</td></tr>";
			$(".tableA").append(html);
			
			html = '';
			html +="<tr><td>" + Math.round(globalFlightTime*100)/100 + "</td><td>" + bullet.velocityX + "</td><td>" + Math.round(GRAVITY_FORCE * globalFlightTime*100)/100 + "</td></tr>";
			$(".tableB").append(html);
		}
		
	if(i<600)
	{
		window.requestNextAnimationFrame(animate);
	} 
	else
	{
		//draw the path of the ball
		//drawKeyPoint();
		drawPath();
		drawBulletPath();
		
		writeWord("jojo!",10,50);
	}
}

function writeWord(txt,x,y)
{
	context.font="20px Georgia";
	context.fillText(txt,x,y);
}

//draw some key points
function drawKeyPoint()
{
	context.save();
	for(var i=0;i<arrayX.length;i++)
	{
		ball.left = arrayX[i]-3;
		ball.top = arrayY[i]-3;
		ball.width=6;
		ball.paint(context);
	}
}

function startFun()
{
	start = true;
	window.requestNextAnimationFrame(animate);
}

function stopFun()
{
	window.location.href = window.location.href;
}

window.requestNextAnimationFrame(animate);