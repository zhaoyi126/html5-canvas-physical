
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

var ball = new Sprite('ball',ballPainter);

var StartX = 40;
var StartY = 160;
var endX = StartX;
var endY = StartY;
var BIGBALL_WIDTH = 36;
var SMALLBALL_WIDTH = 16;

ball.left = StartX;
ball.top = StartY;
ball.width = BIGBALL_WIDTH,
ball.paint(context);
var i = 0;
var stepX =2;
var stepY = 3;
var start = false;

var lastAdvance = 0;
var second = 1;

function toFix(data){
	var temp_data = data;
	return Math.round(temp_data*100)/100;
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
	
   	//grid with a ball
	ball.left = StartX+10;
	ball.top = StartY+10;
	ball.width = SMALLBALL_WIDTH,
	ball.paint(context);
	
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

var pathX = 0;
var pathY = 0;

function animate(time)
{
	if(!start)
	{
		drawGrid();
		ball.left = endX;
		ball.top = endY;
		ball.width = BIGBALL_WIDTH;
		//ball.top += 0.0005 *stepY * i * (time - lastAdvance);
		ball.paint(context);
		lastAdvance = time;
		window.requestNextAnimationFrame(animate);
		return;
	}
	
	
	context.clearRect(0,0,canvas.width,canvas.height);
	drawGrid();
	endX += 0.08 * stepX * (time - lastAdvance);
	//endX = tempX;
	endY = StartY;
	//endY += 0.08 * stepY * (time - lastAdvance);
	
	ball.left = endX;
	ball.top = endY;
	ball.width = BIGBALL_WIDTH;
	//ball.top += 0.0005 *stepY * i * (time - lastAdvance);
	ball.paint(context);
	
	i++;
	lastAdvance = time;
	if((time - 1000 * second) > 0)
		{
			second++;
		}
		
	if(i <= 200)
	{
		window.requestNextAnimationFrame(animate);
	} 
	else
	{
		//path display in time(no intime)
		context.beginPath();
		context.strokeStyle = 'red';
		context.fillStyle = '#ffffff';
		context.lineWidth = 1.5;
		context.moveTo(StartX+BIGBALL_WIDTH/2,StartY+BIGBALL_WIDTH/2);
		context.lineTo(endX+BIGBALL_WIDTH/2,endY + BIGBALL_WIDTH/2);
		context.stroke();
		context.restore();

		pathX = endX - StartX;
		pathY = endY - StartY;
		
		$("#startPoint").html("startpoint:("+ StartX +","+ StartY +")");
		$("#endPoint").html("endpoint:("+ toFix(endX) +","+ endY +")");
		$("#runtime").html("runtime:("+ toFix(time/1000) +")");
	}

	//path display in time(no intime)
//	context.beginPath();
//	context.strokeStyle = 'red';
//	context.fillStyle = '#ffffff';
//	context.lineWidth = 1.5;
//	context.moveTo(StartX+BIGBALL_WIDTH/2,StartY+BIGBALL_WIDTH/2);
//	context.lineTo(endX+BIGBALL_WIDTH/2,endY + BIGBALL_WIDTH/2);
//	context.stroke();
}

function startFun()
{
	start = true;
}

function stopFun()
{
	window.location.href = window.location.href;
}
window.requestNextAnimationFrame(animate);