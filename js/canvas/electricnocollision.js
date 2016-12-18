
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    shapes = [],
    
    shapeBeingDragged = undefined,
	RADIUS = 20,
	startY = 150,
	c1 = new Circle(20, startY, RADIUS),
    c2 = new Circle(canvas.width-20, startY, RADIUS);

//function init()
//{
//	if($())
//}

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
	writeWord(str,600,300);
	writeWord(str2,600,330);
}

shapes.push(c1);
shapes.push(c2);

drawShapes();

var linear = AnimationTimer.makeLinear(),
easeIn    = AnimationTimer.makeEaseIn(2),
easeOut   = AnimationTimer.makeEaseOut(1),
easeInOut = AnimationTimer.makeEaseInOut(),
elastic   = AnimationTimer.makeElastic(4),
bounce    = AnimationTimer.makeBounce(5),
PUSH_ANIMATION_DURATION = 4000;
pushAnimationTimer = new AnimationTimer(PUSH_ANIMATION_DURATION);
pushAnimationTimer2 = new AnimationTimer(PUSH_ANIMATION_DURATION);

var v_x_c1 = 60;
var v_x_c2 = 0;
var startTime = undefined;
var lastTime = 0;
//var GRAVITY_FORCE = 9.81;
var GRAVITY_FORCE = 0;//no gravity
var elapsedTime = 0;
var flightTime = 0;
var flightTime2 = 0;
shapeBeingDragged = c1;
var collision = false;
var hasCrashed = false;

var arrVa = new Array();
var arrVb = new Array();

var collisionX = 0;//the position x where the collision happens

function drawHorizontalLine()
{
	context.save();
	context.beginPath();
	context.moveTo(0,startY+RADIUS);
	context.lineTo(canvas.width,startY+RADIUS);
	context.stroke();
	context.restore();
}
function start()
{
	pushAnimationTimer.timeWarp = easeIn;
	pushAnimationTimer.start();
	pushAnimationTimer2.timeWarp = easeInOut;
	pushAnimationTimer2.start();
	window.requestNextAnimationFrame(animation);
}

var arrA = new Array();
var arrB = new Array();
var Eflag = false;

function animation(time)
{
	var animationElapsed = pushAnimationTimer.getElapsedTime();
	var animationElapsed2 = pushAnimationTimer2.getElapsedTime();
	if(!pushAnimationTimer2.isOver())
	{
//		console.log("stop");
//		drawChart();
//		return;
//		c1.move(chargeProperties * (v_x_c1/2) * elapsedTime,GRAVITY_FORCE * flightTime * elapsedTime);
//		c2.move(chargeProperties * (v_x_c1/2) * elapsedTime,GRAVITY_FORCE * flightTime * elapsedTime);
		arrVa.push(v_x_c1 - flightTime2 * 7.5);
		arrVb.push(flightTime2 * 7.5);
	}
	
	if(startTime == undefined) startTime = animationElapsed;
	elapsedTime = (animationElapsed - lastTime)/1000;
	flightTime = (animationElapsed - startTime)/1000;
	
	if(startTime == undefined) startTime = animationElapsed2;
	elapsedTime2 = (animationElapsed2 - lastTime)/1000;
	flightTime2 = (animationElapsed2 - startTime)/1000;
	
	if(!collision && !hasCrashed)
	{
		//(=) -> (<=)
		if(v_x_c1 - flightTime * 7.5 <= flightTime * 7.5) {
			Eflag = true;
			c1.move(chargeProperties * (v_x_c1/2) * elapsedTime,GRAVITY_FORCE * flightTime * elapsedTime);
			c2.move(chargeProperties * (v_x_c1/2) * elapsedTime,GRAVITY_FORCE * flightTime * elapsedTime);
			arrVa.push(v_x_c1/2);
			arrVb.push(v_x_c1/2);
		} else {
			//no collision(the distance > S(A) - S(B))
			//when the mini distance happens(v(A) = v(B))
			//the velocity exchange
			//7.5 = (60/2)/duration(duration=4)
			c1.move(chargeProperties * (v_x_c1 - flightTime * 7.5) * elapsedTime,GRAVITY_FORCE * flightTime * elapsedTime);
			c2.move(chargeProperties * flightTime * 7.5 * elapsedTime,GRAVITY_FORCE * flightTime * elapsedTime);
//			arrVa.push(v_x_c1 - flightTime * 7.5);
//			arrVb.push(flightTime * 7.5);
		}
	} else {
		//collision(the distance <= S(A) - S(B))
		if(!hasCrashed)
		{
			hasCrashed = true;
			pushAnimationTimer.stop();
			//mtv
			c1.move((c2.x - c1.x - 2 * RADIUS),GRAVITY_FORCE * flightTime * elapsedTime);
			collisionX = c1.x + RADIUS;
		}
	}
	
	//stop
	if((c1.x - RADIUS <= 0) || c2.x + RADIUS >= canvas.width) {
		drawLine(collisionX,0,collisionX,canvas.height);
		drawChart();
		return;
	}
	
	lastTime = animationElapsed;
	context.clearRect(0,0,canvas.width,canvas.height);
    drawShapes();
    detectCollisions();
    drawHorizontalLine();
    if(!Eflag)
    	writeSymbol();
	window.requestNextAnimationFrame(animation);
}

var previous_x = $("#positionA").val();
$("#positionA").on('input',function(e){  
	if($("#positionA").val() != null && $("#positionA").val() != "") 
	{
		var temp_x = parseInt($("#positionA").val());
		
		if(temp_x < RADIUS) {
			temp_x = RADIUS;
		} else if(temp_x > canvas.width/2 - RADIUS) {
			temp_x = canvas.width/2 - RADIUS;
		}
			
		c1.move(-previous_x,0);
		c1.move(temp_x,0);
		previous_x = temp_x;
		init();
	}
});

var previous_Bx = $("#positionB").val();
$("#positionB").on('input',function(e){  
	if($("#positionB").val() != null && $("#positionB").val() != "") 
	{
		var temp_x = parseInt($("#positionB").val());
		
		if(temp_x < canvas.width/2 + RADIUS) {
			temp_x = canvas.width/2 + RADIUS;
		} else if(temp_x > canvas.width - RADIUS) {
			temp_x = canvas.width - RADIUS;
		}
		
		c2.move(-previous_Bx,0);
		c2.move(temp_x,0);
		previous_Bx = temp_x;
		init();
	}
}); 

$("#chargeB").on('input',function(e){
	chargeB = $("#chargeB").val();
	init();
});

$("#chargeA").on('input',function(e){
	chargeA = $("#chargeA").val();
	init();
});

var chargeA = $("#chargeA").val();
var chargeB = $("#chargeB").val();
function init() {
	if(chargeA != null && chargeA != "" && chargeB != null && chargeB != "" && chargeA != "-" && chargeB != "-") {
		context.clearRect(0,0,canvas.width,canvas.height);
		drawShapes();
		drawHorizontalLine();
		if(parseInt(chargeA) == parseInt(chargeB)) {
			chargeProperties = 1;//the same charge
		} else {
			chargeProperties = -1;//different charge
		}
		
		writeSymbol();
	}
}

//init();
//write +/-
function writeSymbol() {
	if(parseInt(chargeA) == 1) 
	{
		writeWord('+',c1.x - RADIUS/4,c1.y + RADIUS/4);
	} else {
		writeWord('-',c1.x - RADIUS/4,c1.y + RADIUS/4);
	}
	
	if(parseInt(chargeB) == 1) 
	{
		writeWord('+',c2.x - RADIUS/4,c2.y + RADIUS/4);
	} else {
		writeWord('-',c2.x - RADIUS/4,c2.y + RADIUS/4);
	}
}

function middle()
{
	$("#chargeB").val(1);
	$("#positionA").val(20);
	$("#positionB").val(220);
	chargeA = $("#chargeA").val();
	chargeB = $("#chargeB").val();
	
	var temp_x = parseInt($("#positionA").val());
	var temp_Bx = parseInt($("#positionB").val());
	c1.move(-previous_x,0);
	c1.move(temp_x,0);
	previous_x = temp_Bx;
	c2.move(-previous_Bx,0);
	c2.move(temp_Bx,0);
	previous_Bx = temp_Bx;
	init();
}

middle();
function reset()
{
	window.location.href = window.location.href;
//	init();
//	collision = false;
//	hasCrashed = false;
//	pushAnimationTimer.start();
//	window.requestNextAnimationFrame(animation);
}


var labels = new Array();
var data1 = new Array();
var data2 = new Array();
for(var i=1;i<36;i++)
{
	labels.push(i);
	//data1.push(Math.random()*50 + 50);
	//data2.push(Math.random()*50);
}

var ctx = document.getElementById("myChart");

function drawChart()
{
	for(var i=0;i<arrVa.length;i++) {
		if(i%10 == 1)
			{
				arrA.push(arrVa[i]);
				arrB.push(arrVb[i]);
			}
	}
	//console.log(arrA);
	//console.log(arrB);
	data1 = arrA;
	data2 = arrB;
	
    var lineChartData = {
        //labels : ["January","February","March","April","May","June","July"],
		labels : labels,
        datasets : [
            {
				label: 'Ball A',
                fillColor : "rgba(255,255,255, 0.2)",
                strokeColor : "rgba(255,255,255, 1)",
                pointColor : "rgba(220,220,220, 1)",
                pointStrokeColor : "#0f0",
				backgroundColor: 'rgba(0, 255, 0, 0.2)',
                //data : [65,59,90,81,56,55,40]
				data: data1
            },
            {
				label: 'Ball B',
                fillColor : "rgba(0,0,0, 0.2)",
                strokeColor : "rgba(0,0,0, 1)",
                pointColor : "rgba(151,187,205, 1)",
                pointStrokeColor : "#f0f",
                //the public region is made by the ball a and ball b,
                //so you should pay attention to the capacity
				backgroundColor: 'rgba(255, 0, 255, 0.8)',
                data : data2
            }
        ]
    };
	
	new Chart(ctx, {
		data: lineChartData,
		type: 'line',
			options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		},
		//options: options
	});
}