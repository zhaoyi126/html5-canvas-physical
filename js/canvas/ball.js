
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

//draw some key points
function drawKeyBPoint()
{
	context.save();
	for(var i=0;i<arrayBX.length;i++)
	{
		ball.left = arrayBX[i]-3;
		ball.top = arrayBY[i]-3;
		ball.width=6;
		ball.paint(context);
	}
}

var ballTopA = 0;
var ballTopB = 0;
var ballLeft = 120;
var GRAVITY = 9.81;
var BallAvelocityX = 40;
var BallBvelocityX = 80;

var lineStepX = 0.02;
var arrayBX = new Array();
var arrayBY = new Array();
var arrayAX = new Array();
var arrayAY = new Array();

var ball = new Sprite('ball',ballPainter);
var lauchedTime = undefined;
var flightTime = 0;
var frameTime = 0;
ball.left = ballLeft;
ball.top = ballTopA;
var RADIUS = 10;
ball.width = RADIUS * 2,
ball.paint(context);
var i = 0;

var lastAdvance = 0;
var second = 1;

var start = false;
var str = "("+ ballLeft + " , " + 0 +")";

function animate(time)
{
	if(!start)
	{
		if((time - 1000 * second) > 0)
		{
			second++;
		}
		writeWord("A(B)",ballLeft,RADIUS*4.3);
		writeWord(str,ballLeft,RADIUS*7.3);
		window.requestNextAnimationFrame(animate);
		return;
	}
		
	if($("#AvelocityX").val() != undefined && $("#AvelocityX").val() != '' && $("#AvelocityX").val() != null)
		BallAvelocityX = $("#AvelocityX").val();

	if($("#BvelocityX").val() != undefined && $("#BvelocityX").val() != '' && $("#BvelocityX").val() != null)
		BallBvelocityX = $("#BvelocityX").val();
	
	context.clearRect(0,0,canvas.width,canvas.height);
	if(lauchedTime == undefined) lauchedTime = time;
	flightTime = (time - lauchedTime)/1000;
	frameTime = (time - lastAdvance)/1000;
	ball.left = ballLeft + BallAvelocityX * flightTime;
	ball.top = ballTopA + GRAVITY * flightTime * frameTime;
	
	ballTopA = ball.top;
	ball.paint(context);
	context.font="15px Verdana";
	context.fillText('A',ball.left+RADIUS*0.5,ball.top+RADIUS*1.5);
	
	//console.log("球A的x坐标：" +　ball.left + ",球A的y坐标" + ball.top);
	if((time - 1000 * second) > 0) {
		arrayAX.push(ball.left);
		arrayAY.push(ball.top);
	}
	
	
	ball.left = ballLeft + BallBvelocityX * (time - lauchedTime)/1000;
	ball.top = ballTopB + GRAVITY * (time - lauchedTime) * (time - lastAdvance)/1000000;
	ballTopB = ball.top;
	ball.paint(context);
	context.fillText('B',ball.left+RADIUS*0.5,ball.top+RADIUS*1.5);

	//console.log("时间：" + time + ",球B的x坐标：" +　ball.left + ",球B的y坐标" + ball.top);
	var html = '';
	if((time - 1000 * second) > 0)
	{
		second++;
		arrayBX.push(ball.left);
		arrayBY.push(ball.top);
		html = '';
		html +="<tr><td>" + Math.round(flightTime*100)/100 + "</td><td>" + BallBvelocityX + "</td><td>" + Math.round(GRAVITY * flightTime*100)/100
		 + "</td><td>" + Math.round(BallBvelocityX * flightTime * 100)/100+ "</td><td>" + Math.round(GRAVITY * Math.pow(flightTime,2)*100)/200 +"</td></tr>";
		$(".tableB").append(html);
		
		html = '';
		html +="<tr><td>" + Math.round(flightTime*100)/100 + "</td><td>" + BallAvelocityX + "</td><td>" + Math.round(GRAVITY * flightTime*100)/100
			+ "</td><td>" + Math.round(BallAvelocityX * flightTime * 100)/100+ "</td><td>" + Math.round(GRAVITY * Math.pow(flightTime,2)*100)/200 +"</td></tr>";
		$(".tableA").append(html);
	}
	
	i++;
	lastAdvance = time;
		
	if(i >= 300)
	{
		start = false;
		drawKeyAPoint();
		drawKeyBPoint();
		drawAPath();
		drawBPath();
		//console.log("球的x坐标是："　+ ball.left + "，球的y坐标是：" + ball.top);
	} 

	window.requestNextAnimationFrame(animate);
}

function startFun()
{
	start = true;
}

function stopFun()
{
	context.clearRect(0,0,canvas.width,canvas.height);
	ballTopA = 0;
	ballTopB = 0;
	ballLeft = 120;
	ball.top = 0;
	ball.left = ballLeft;
	ball.width = 20,
	ball.paint(context);
	i = 0;
	lauchedTime = undefined;
	arrayBX = new Array();
	arrayBY = new Array();
	arrayAX = new Array();
	arrayAY = new Array();
	start = false;
	html='';
	$(".tableA").html("<tr><th>time</th><th>Vx</th><th>Vy</th><th>Sx</th><th>Sy</th></tr>");
	$(".tableB").html("<tr><th>time</th><th>Vx</th><th>Vy</th><th>Sx</th><th>Sy</th></tr>");
}

function writeWord(txt,x,y)
{
	context.font="20px Georgia";
	context.fillText(txt,x,y);
}

window.requestNextAnimationFrame(animate);