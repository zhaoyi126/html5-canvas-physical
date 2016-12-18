
var canvas = document.getElementById('canvas');
var	context = canvas.getContext('2d');
var startFlag = false;
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
	
	context.clearRect(2*canvas.width/4,0,canvas.width,canvas.height);
	context.save();
	for(var i=2*canvas.width/4;i<canvas.width;i+=10) 
	{
		for(var j=0;j<canvas.height;j+=10) {
			context.beginPath();
			context.fillText("x",i,j);
			context.stroke();
		}
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

//var lineStepY;
var lob = {
		lastTime:0,
		GRAVITY_FORCE: 9.81,
		R:120,//(radius)circle movement in the magnetic
		angle:Math.PI*2/6,//angle velocity
		angle_temp:0,
		circleX:0,
		circleY:0,
		alpha:0,
		enterFlag:false,
		inMagnetic:false,
		enter_ballleft:0,
		enter_balltop:0,
		
		applyGravity: function(elapsed) {
			ball.velocityY = (this.GRAVITY_FORCE * elapsed);
		},
		
		updateBallPosition: function(updateDelta) {
			if(ball.left + RADIUS < 400)
			{
				ball.left += ball.velocityX * (updateDelta);
				ball.top += ball.velocityY * (updateDelta);
				//console.log(ball.left);
			}
			else 
			{
				//return;
				//the circel movement in the magnetic
				if(!this.enterFlag) {
					//it will be easier to deal for y/x
					this.alpha = Math.atan(ball.velocityX/ball.velocityY);//the angle when the ball enter the magnetic
					this.circleX = ball.left + this.R * Math.sqrt(k) * Math.cos(this.alpha);
					this.circleY= ball.top - this.R * Math.sqrt(k) * Math.sin(this.alpha);
					alpArray.push(this.alpha);
					centerxArray.push(this.circleX);
					centeryArray.push(this.circleY);
					
					this.enter_ballleft = ball.left;
					this.enter_balltop = ball.top;
					enterleftArray.push(this.enter_ballleft);
					entertopArray.push(this.enter_balltop);
					kArray.push(k);
					
					this.enterFlag = true;
					this.angle_temp = this.alpha;
					console.log("##"+this.angle_temp);
				}
				
				this.angle_temp += this.angle*Math.sqrt(k)*updateDelta;
				if((ball.left > 400))
				{
					this.inMagnetic = true;
					//return;
				}
				
				if((ball.left < 400) && this.inMagnetic)
				{
					startFlag = false;
					arrayX.push(arrayX_temp);
					arrayY.push(arrayY_temp);
					arrayX_temp = [];
					arrayY_temp = [];
					drawKeyPoint();
					paths();
					return;
				}
				ball.left = this.circleX - this.R * Math.sqrt(k) * Math.cos(this.angle_temp);//modefy the position
				ball.top = this.circleY + this.R * Math.sqrt(k) * Math.sin(this.angle_temp);//modefy the position
			}
		},
		
		execute: function(ball, context, time) {
			//var updateDelta;
			var elapsedFlightTime;
			
			if(launchTime == undefined) launchTime = time;
			elapsedFrameTime = (time - this.lastTime)/1000;
			elapsedFlightTime = (time - launchTime)/1000;
			
			this.applyGravity(elapsedFlightTime);
			this.updateBallPosition(elapsedFrameTime);
			this.lastTime = time;
		}
	};

var GRAVITY_FORCE = 9.81; // m/s/s
var RADIUS = 10;
var ball = new Sprite('ball',ballPainter, [lob]);
var launchTime = undefined;
var UNIT_VELOCITY = 60;//v0
var k = 1;//a variable to indict v1/v0
var startX = 0;
var startY = 0;
var stepX =2;
var stepY = 3;
var second = 0;
var lineStepX = 0.2;
var arrayX = new Array();
var arrayY = new Array();
var arrayX_temp = new Array();
var arrayY_temp = new Array();

var enterleftArray = new Array();
var entertopArray = new Array();
var kArray = new Array();
var alpArray = new Array();
var centerxArray = new Array();
var centeryArray = new Array();

function init()
{
	startX = parseInt($("#positionx").val());
	startY = parseInt($("#positiony").val());
	ball.left = startX;
	ball.top = startY;
	ball.velocityY = 0;
	ball.velocityX = parseInt($("#velocity").val());//v1
	k = parseInt($("#velocity").val())/UNIT_VELOCITY;//v1/v0
	ball.width = RADIUS * 2;
	drawGrid();
	//ball.update(context, time);
	ball.paint(context);
	writeWord("+",ball.left+RADIUS*0.45,ball.top+RADIUS*1.5);
}

init();

function magnitude()
{
	return sqrt(Math.pow(ball.velocityX,2),Math.pow(ball.velocityY,2));
}

/*
 * (TODO)
 */
function animate(time)
{
	if((!startFlag))
	{
		lob.lastTime = time;
		window.requestNextAnimationFrame(animate);
		return;
	}
	
	context.clearRect(0,0,canvas.width,canvas.height);
	drawGrid();
	ball.update(context, time);
	ball.paint(context);
	writeWord("+",ball.left+RADIUS*0.45,ball.top+RADIUS*1.5);
	if((time - 1000 * second) > 0)
		{
			second++;
			arrayX_temp.push(ball.left + RADIUS);
			arrayY_temp.push(ball.top + RADIUS);
			//console.log("球的x坐标是："　+ ball.left + "，球的y坐标是：" + ball.top);
		}
	window.requestNextAnimationFrame(animate);
}

function paths()
{
	for(var i=0;i<kArray.length;i++)
	{
		drawPath(centerxArray[i],centeryArray[i],enterleftArray[i],entertopArray[i],alpArray[i],kArray[i]);
	}
}

//draw the path of the ball
//the parabola
function drawPath(centerx,centery,left,top,alp,n)
{
	context.beginPath();
	context.moveTo(startX,startY);
	for(var i =0;i<(context.canvas.width/2-startX)/(UNIT_VELOCITY * n);i+=lineStepX)
	{
		context.lineTo(startX + UNIT_VELOCITY * n * i,startY + 0.5*GRAVITY_FORCE*i*i);
	}
	context.stroke();
	
	context.beginPath();
	context.arc(centerx,centery,lob.R * Math.sqrt(n),(Math.PI - alp),(Math.PI + alp),true);
	context.stroke();
	
	context.beginPath();
	context.moveTo(centerx,centery);
	context.lineTo(left,top);
	context.stroke();
}

//draw some key points
function drawKeyPoint()
{
	context.save();
	for(var i=0;i<arrayX.length;i++)
	{
		ball.left = arrayX[i];
		ball.top = arrayY[i]-RADIUS;
		ball.width=6;
		ball.paint(context);
	}
}

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
window.requestNextAnimationFrame(animate);

function start(){
	startFlag = true;
	init();
}

function reset(){
	startFlag = true;
	lob.angle_temp = 0;
	lob.circleX = 0;
	lob.circleY = 0;
	lob.alpha = 0;
	lob.enterFlag = false;
	lob.inMagnetic = false;
	lob.enter_ballleft = 0;
	lob.enter_balltop = 0;
	launchTime = undefined;
	init();
}