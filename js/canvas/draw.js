var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var centerX=parseInt($("#centerX").val());
var centerY=parseInt($("#centerY").val());
var radius=parseInt($("#radius").val());
var sides=parseInt($("#sides").val());

var points = [];
var Point = function(x, y){
	this.x = x;
	this.y = y;
};

var angle = 0;
var type = 1;

function drawAxes()
{
	context.save();
	context.beginPath();
	context.moveTo(0,centerY);
	context.lineTo(400,centerY);
	context.moveTo(395,centerY - 5);
	context.lineTo(400,centerY);
	context.lineTo(395,centerY + 5);
	context.moveTo(centerX,0);
	context.lineTo(centerX,400);
	context.moveTo(centerX - 5,5);
	context.lineTo(centerX,0);
	context.lineTo(centerX + 5,5);
	context.stroke();
	context.restore();
}


function init()
{
	drawPolygon(centerX,centerY,sides);
	drawAxes();
}
init();

function changetype()
{
	type = parseInt($("#drawtype").val());
	switch(type) {
		case 1:
			//$("#sideslabel").html("direction:");
			$("#sideslabel").css("display","none");
			$("#sides").css("display","none");
			break;
		case 2:	
			$("#sideslabel").css("display","");
			$("#sides").css("display","");
			$("#sideslabel").html("horizontal length:");
			$("#radiuslabel").html("vertical length:");
			break;
		case 3:
			$("#sideslabel").css("display","");
			$("#sides").css("display","");
			$("#sideslabel").html("sides:");
		   	$("#radiuslabel").html("radius:");
		   	break;
	}
	
}

function drawCircle(x,y,r)
{
	context.save();
	context.beginPath();
	context.arc(x,y,r,0,Math.PI*2,false);
	context.stroke();
	context.restore();
}

//with translate
function drawCircle(x,y,r,translateX,translateY)
{
	context.save();
	context.translate(translateX,translateY);
	context.beginPath();
	context.arc(x,y,r,0,Math.PI*2,false);
	context.stroke();
	context.restore();
}


function drawPolygon(centerx,centery,sides)
{
	for(var i=0;i<sides;i++)
	{
		points.push(new Point(centerx + radius*Math.sin(angle),centery - radius*Math.cos(angle)));
		angle += 2*Math.PI/sides;
	}

	context.beginPath();
	context.moveTo(points[0].x,points[0].y);
	for(var i=1;i<sides;i++)
	{
		context.lineTo(points[i].x,points[i].y);
	}
	context.closePath();
	context.stroke();
}

function ParamEllipse(context, x, y, a, b)
{
   var step = (a > b) ? 1 / a : 1 / b;
   context.beginPath();
   context.moveTo(x + a, y); 
   for (var i = 0; i < 2 * Math.PI; i += step)
   {
	  context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
   }
    context.closePath();
	context.stroke();
};


function EvenCompEllipse(x, y, a, b)
{
   context.save();
   var r = (a > b) ? a : b; 
   var ratioX = a / r; 
   var ratioY = b / r; 
   context.scale(ratioX, ratioY); 
   context.beginPath();
   context.moveTo((x + a) / ratioX, y / ratioY);
   context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI);
   context.closePath();
   context.stroke();
   context.restore();
   
   if(a > b)
   {
	   //context.move(Math.sqrt(Math.pow(a,2)-Math.pow(b,2)),0);
	   var c = Math.sqrt(Math.pow(a,2)-Math.pow(b,2));
	   drawCircle(c,0,3,centerX,centerY);
	   drawCircle(-c,0,3,centerX,centerY);
	} else {
	   var c = Math.sqrt(Math.pow(b,2)-Math.pow(a,2));
	   drawCircle(0,c,3,centerX,centerY);
	   drawCircle(0,-c,3,centerX,centerY);
	}
};

function start()
{
	context.clearRect(0,0,canvas.width,canvas.height);
	points = [];
	centerX=parseInt($("#centerX").val());
	centerY=parseInt($("#centerY").val());
	radius=parseInt($("#radius").val());
	sides=parseInt($("#sides").val());
	type = parseInt($("#drawtype").val());
	switch(type) {
		case 1: drawCircle(centerX,centerY,radius); break;
		case 2: 
			var v = radius;
			var h = sides;
			EvenCompEllipse(centerX,centerY,h,v);break;
		case 3: drawPolygon(centerX,centerY,sides); break;
	}
	drawAxes();
}

function reset()
{
	$("#centerX").val(200);
	$("#centerY").val(200);
	$("#radius").val(120);
	$("#sides").val(5);
	$("#drawtype").val(3);
	changetype();
	points = [];
	context.clearRect(0,0,canvas.width,canvas.height);
	init();
}

function windowToCanvas(x, y) {
	   var bbox = canvas.getBoundingClientRect();
	   return { x: x - bbox.left * (canvas.width  / bbox.width),
	            y: y - bbox.top  * (canvas.height / bbox.height) };
	}

canvas.onmousemove = function (e) {
	var loc;
	loc = windowToCanvas(e.clientX, e.clientY);
	
	//the position is relative to the base point
	var str = "x:" + toFix(loc.x -centerX);
	var str2 = "y:" + toFix(loc.y - centerY);
	//the should be some const values;
	context.clearRect(canvas.width/2,canvas.height/2,100,120);
	writeWord(str,canvas.width/2,canvas.height/2+20);
	writeWord(str2,canvas.width/2,canvas.height/2+50);
}

function toFix(data){
	var temp_data = data;
	return Math.round(temp_data*100)/100;
}

function writeWord(txt,x,y)
{
	context.font="10px Tahoma";
	context.fillText(txt,x,y);
}