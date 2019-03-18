/* 
	Hello.js
	Output hello in text area
	
	Muhammad Irfan Girindra | https://github.com/irfangirindra/UTS
	
	Include: <script src="hello.js"></script> in
	         a HTML file
	Execute: Refresh web browser viewing the HTML file
	
*/

var taOut;


main();

function main(){
	// Set layout of visual elements
	setElementsLayout();
}

function setElementsLayout(){
	//Create text area output
	taOut = document.createElement("textarea");
	taOut.style.width = "500px";
	taOut.style.height = "150px"
	taOut.style.overflowY = "scroll";
	taOut.style.float = "left";
	taOut.value = "Hello, Muhammad Irfan Girindra yang ber-NIM 10215089!";
	
	document.body.append(taOut);
}
