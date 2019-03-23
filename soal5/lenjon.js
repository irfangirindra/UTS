/* 
	lenjon.js 20190322
	Lennard Jones Potensial
	Muhammad Irfan Girindra
	"https://github.com/irfangirindra/UTS"
 
	Include: <script src="lenjon.js"></script> in a HTML file
	Execute: Refresh web browser viewing the HTML file
*/

// Define global variables for visual elements
var taIn, caOut, taOut0, taOut1;
var btClear, btLoad, btRead, btStart, btInfo;
var teIn, inIn;

// Define global variables for simulation
var tstep, tbeg, tend, tdata, tproc, proc, t, Ndata, idata;
var eps, sig, r, rx, ry, x1, x2, y1, y2, vx1, vx2, vy1, vy2, ax1, ax2,  ay1, ay2, nx, ny, Fx, Fy;

// Execute main function
main();

function main(){
	// Set layout of visual elements
	setElementsLayout();
	
	// Initialize physical parameters
	initParams();
}

// Perform simulation
function simulate() {
	// Stop simulation
	if(t >= tend) {
		btStart.innerHTML = "Start";
		btStart.disabled = true;
		btRead.disabled = false;
		taIn.disabled = false;
		tout(taOut1, "Simulation stops, t = end\n\n");
		clearInterval(proc);
	}
	
	// Verbose result each tdata period
	if(idata == Ndata) {
		
		// Display header information
		if(t == tbeg) {
			tout(taOut0, "#t \t x1 \t y1 \t vx1 \t vy1 \t x2 \t y2 \t vx2 \t vy2\n");
		}

		// Display results on textarea
		taOut0.value += t.toFixed(3) + "\t"
		+ x1.toFixed(2) + "\t" + y1.toFixed (2) + "\t"
		+ vx1.toFixed(2) + "\t" + vy1.toFixed(2) + "\t"  
		+ x2.toFixed(2) + "\t" + y2.toFixed(2) + "\t"
		+ vx2.toFixed(2) + "\t" + vy2.toFixed(2) + "\n" 
		taOut0. scrollTop = taOut0. scrollHeight ;	
		
		// Display mass position of canvas
		clearCanvas () ;
		drawMassOnCanvas (x1 , y1 , 0.5 * 1.1224 * sig , cL1 , cF1 , caOut ) ;
		drawMassOnCanvas (x2 , y2 , 0.5 * 1.1224 * sig , cL2 , cF2 , caOut ) ;

		idata = 0;
	}

	//Calculate the distance
	rx=Math.abs(x2-x1);
	ry=Math.abs(y2-y1);
	r=Math.sqrt((rx*rx)+(ry*ry));
	
	//Calculate the unit vector
	nx=rx/r;
	ny=ry/r;

	// Calculate the force
	if(rx==0){
		var Fx = 0;
	}else{
		var Fx = (24*eps/r)*(2*(sig/r)^12-(sig/r)^6) ;
	}
	var Fx1 = Fx * nx;
	var Fx2 = -Fx1;
	
	if(ry==0){
		var Fy = 0;
	}else{
		var Fy = (24*eps/(r))*(2*(sig/r)^12-(sig/r)^6) ;
	}
	var Fy1 = Fy * ny;
	var Fy2 = -Fy1;

	// Use Newton 2nd law of motion
	var ax1 = Fx1 / m1;
	var ay1 = Fy1 / m1;
	var ax2 = Fx2 / m2;
	var ay2 = Fy2 / m2;

	// Implement Euler method
	vx1 = vx1 + ax1*tstep;
	vy1 = vy1 + ay1*tstep;

	//Check if the particle 1 hits the border
	if(x1 <= xmin + (0.5*sig) || x1 >= xmax -(0.5*sig)){
		vx1=-vx1;
	}
	if(y1 <= ymin + (0.5*sig) || y1 >= ymax -(0.5*sig)){
		vy1=-vy1;
	}

	x1 = x1 + vx1*tstep;
	y1 = y1 + vy1*tstep;

	vx2 = vx2 + ax2*tstep;
	vy2 = vy2 + ay2*tstep;

	//Check if the particle 2 hits the border
	if(x2 <= xmin + (0.5*sig) || x2 >= xmax -(0.5*sig)){
		vx2=-vx2;
	}if(y2 <= ymin + (0.5*sig) || y2 >= ymax -(0.5*sig)){
		vy2=-vy2;
	}

	x2 = x2 + vx2*tstep;
	y2 = y2 + vy2*tstep;

	// Increase time
	idata++;
	t += tstep;
}

// Clear canvas
function clearCanvas() {
	var cx = caOut.getContext("2d");
	cx.fillStyle = "#fff";
	cx.fillRect(0, 0, caOut.width, caOut.height);	
}
   
// Display mass position of canvas
function drawMassOnCanvas (x, y, R, cLine , cFill , caOut) {
	var cx = caOut . getContext ("2d") ;
   
	// Get canvas coordinate
	var XMIN = 0;
	
	var YMIN = caOut . height ;
	var XMAX = caOut . width ;
	var YMAX = 0;
	
	var RR = tx (2* R) - tx(R) ;
	cx. beginPath () ;
	cx. strokeStyle = cLine ;
	cx. lineWidth = 4;
	cx.arc (tx(x) , ty(y) , RR , 0 , 2* Math .PI) ;
	cx. stroke () ;
	cx. fillStyle = cFill ;
	cx. fill () ;
   
	// Transform x from real coordinate to canvas coordinate
	function tx(x) {
		var xx = (x - xmin ) / ( xmax - xmin ) * ( XMAX - XMIN ) +
   		XMIN ;
   		return xx;
	}
   
	// Transform y from real coordinate to canvas coordinate
	function ty(y) {
		var yy = (y - ymin ) / ( ymax - ymin ) * ( YMAX - YMIN ) +
   		YMIN ;
		return yy;
	}
}

function setElementsLayout(){
	// Create input textarea
	taIn = document.createElement("textarea");
	taIn.style.width = "200px";
	taIn.style.height = "400px";
	taIn.style.overflowY = "scroll"
	taIn.style.float = "left";

	// Create ouput textarea 1
	taOut0 = document.createElement("textarea");
	taOut0.style.width = "550px";
	taOut0.style.height = "200px";
	taOut0.style.overflowY = "scroll";
	taOut0.style.float = "left";

	// Create ouput textarea 1
	taOut1 = document.createElement("textarea");
	taOut1.style.width = "200px";
	taOut1.style.height = "200px";
	taOut1.style.overflowY = "scroll";
	taOut1.style.float = "left";

	var div0 = document.createElement("div");
	div0.style.width = 1100 + "px";
	div0.style.height = 600 + "px";

	// Create output canvas
	caOut = document.createElement("canvas");
	caOut.width = "400";
	caOut.height = "400";
	caOut.style.width = caOut.width + "px";
	caOut.style.height = caOut.height + "px";
	caOut.style.float = "left";
	caOut.style.border = "#aaa 1px solid";
	caOut.style.paddingRight = "2px";

	// Create buttons
	btClear = document.createElement("button");
	btClear.innerHTML = "Clear";
	btClear.style.width = "70px";
	btClear.addEventListener("click", buttonClick);

	btLoad = document.createElement("button");
	btLoad.innerHTML = "Load";
	btLoad.style.width = "70px";
	btLoad.addEventListener("click", buttonClick);
	
	btRead = document.createElement("button");
	btRead.innerHTML = "Read";
	btRead.style.width = "70px";
	btRead.disabled = true;
	btRead.addEventListener("click", buttonClick);

	btStart = document.createElement("button");
	btStart.innerHTML = "Start";
	btStart.style.width = "70px";
	btStart.disabled = true;
	btStart.addEventListener("click", buttonClick);

	btInfo = document.createElement("button");
	btInfo.innerHTML = "Info";
	btInfo.style.width = "70px";
	btInfo.addEventListener("click", buttonClick);
	
	// Create button division
	var div1 = document.createElement("div");
	div1.style.width = "70px";
	div1.style.height = "198px";
	div1.style.float = "left";
	div1.style.border = "#aaa 1px solid";

	// Set layout of visual components
	document.body.append(div0)
		div0.append(taIn);
		div0.append(caOut);
		div0.append(div1);
			div1.append(btClear);
			div1.append(btLoad);
			div1.append(btRead);
			div1.append(btStart);
			div1.append(btInfo);
			div0.append(taOut1);
			div0.append(taOut0);
}

// Load parameters to textarea
function loadParameters() {
	var lines = "";
	lines += "# Parameters\n";
	lines += "EPSILON 3\n";    // Minimum potential 
	lines += "SIGMA 3 \n";    // Distance where the potential is 0 

	
	lines += "\n";
	lines += "# Simulation\n";
	lines += "TSTEP 0.001\n";   // Time step        s
	lines += "TBEG 0\n";        // Initial time     s
	lines += "TEND 100\n";      // Final time       s
	lines += "TDATA 0.01\n";    // Data period      s
	lines += "TPROC 1\n";       // Event period     ms
	
	lines += "\n";
	lines += "# Coordinates\n"; 
	lines += "XMIN -50\n";   // xmin             m
	lines += "YMIN -50\n";   // ymin             m
	lines += "XMAX 50\n";    // xmax             m
	lines += "YMAX 50\n";    // ymax             m
	
	lines += "\n";
	lines += "# Particle 1\n"; 
	lines += "X1 0\n";   // xmin             m
	lines += "Y1 0\n";   // ymin             m
	lines += "m1 1\n";    // mass             m

	lines += "\n";
	lines += "# Particle 2\n"; 
	lines += "X2 4\n";   // xmin             m
	lines += "Y2 4\n";   // ymin             m
	lines += "m2 1\n";    // mass             m

	var ta = arguments[0];
	ta.value = lines;
	ta.scrollTop = ta.scrollHeight;
}

// Read parameters
function readParameters() {
	var lines = arguments[0].value;
	
	// Get parameters information
	eps = getValue(lines, "EPSILON");
	sig = getValue(lines, "SIGMA");

	// Get simulation information
	tstep = getValue(lines, "TSTEP");
	tbeg = getValue(lines, "TBEG");
	tend = getValue(lines, "TEND");
	tdata = getValue(lines, "TDATA");
	tproc = getValue(lines, "TPROC");

	// Get coordinates information
	xmin = getValue(lines, "XMIN");
	ymin = getValue(lines, "YMIN");
	xmax = getValue(lines, "XMAX");
	ymax = getValue(lines, "YMAX");

	// Get patricle information
	x1 = getValue(lines, "X1");
	y1 = getValue(lines, "Y1");
	m1 = getValue(lines, "m1");


	x2 = getValue(lines, "X2");
	y2 = getValue(lines, "Y2");
	m2 = getValue(lines, "m2");
}

// Get value from a line inside parameter textarea
function getValue(lines, key) {
	var value = undefined;
	var line = lines.split("\n");
	var N = line.length;
	for(var i = 0; i < N; i++) {
		var col = line[i].split(" ");
		if(col[0] == key) {
			value = parseFloat(col[1]);
		}
	}
	return value;
}

// Do something when buttons clicked
function buttonClick() {
	// Get target and verbose to taOut1
	var target = event.target;
	var cap = target.innerHTML;
	tout(taOut1, cap + "\n");
	
	// Perform according to the clicked button
	if(cap == "Load") {
		loadParameters(taIn);
		btRead.disabled = false;
		tout(taOut1, "Parameters are loaded\n\n");
	} else if(cap == "Clear") {
		clearAll();
		btRead.disabled = true;
		btStart.disabled = true;
		tout(taOut1, "All are cleared except this element\n\n");
	} else if(cap == "Read") {
		readParameters(taIn);
		initParams();
		clearCanvas();
		drawMassOnCanvas (x1 , y1 , 0.5 * 1.1224 * sig , cL1 , cF1 , caOut ) ;
		drawMassOnCanvas (x2 , y2 , 0.5 * 1.1224 * sig , cL2 , cF2 , caOut ) ;
		btStart.disabled = false;
		tout(taOut1, "Parameters are read\n");
		tout(taOut1, "Slightly random grains position "
			+ "are generated\n\n");
	} else if(cap == "Start") {
		target.innerHTML = "Stop";
		btRead.disabled = true;
		taIn.disabled = true;
		tout(taOut1, "Simulation starts\n\n");
		proc = setInterval(simulate, tproc);
	} else if(cap == "Stop") {
		target.innerHTML = "Start";
		btRead.disabled = false;
		taIn.disabled = false;
		tout(taOut1, "Simulation stops\n\n");
		clearInterval(proc);
	} else if(cap == "Info") {
		tout(taOut1, "lenjon.js -- 20190322\n"
			+ "Lennard Jones Potensial "
			+ "Muhammad Irfan Girindra | "
			+ "https://github.com/irfangirindra/UTS"
		);
	}
}

// Display text in an output textarea
function tout() {
	var taOut = arguments[0];
	var msg = arguments[1];
	taOut.value += msg;
	taOut.scrollTop = taOut.scrollHeight;
}

// Initialize parameters
function initParams(){

	 // Set color of particle 1 and particle 2
	 cL1 = "#f00 ";
 	 cF1 = "#fcc ";
	 cL2 = "#00f";
	 cF2 = "#ccf ";


	// Initialize the velocity and acceleration
	vx1=0;
	vy1=0;
	vx2=0;
	vy2=0;

	// Initialize simulation parameters
	t = tbeg;
	Ndata = Math.floor(tdata / tstep);
	idata = Ndata;
}

// Clear all
function clearAll() {
	taIn.value = "";
	taOut0.value = "";
	clearCanvas();
}