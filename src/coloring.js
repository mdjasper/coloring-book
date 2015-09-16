var paper = require('../bower_components/paper/dist/paper-core.min.js');

var Coloring = function({
	canvasId = 'canvasElement',
	myColors = {
		'red': '#c00d0d',
		'orange': '#eaa000',
		'yellow': '#fefb20',
		'lgreen': '#bafb3b',
		'dgreen': '#0ab40e',
		'lblue': '#3bd0fb',
		'dblue': '#2f33d7',
		'purple': '#ac3bfb',
		'white': '#ffffff',
		'grey': '#b8b8c1',
		'black': '#3a3a3a',
		'skin1': '#eddc8e',
		'skin2': '#cac498',
		'skin3': '#584f31'
		},
	currentColor = '#c00d0d',
	sizes = {
		'small': 2,
		'normal': 5,
		'large': 10,
		'huge': 20
	},
	currentSize = 5,
	panAmount = 20,
	page = 'images/pages/art.png'
	} = {}){

	//Set up the canvas element
	let canvas = document.getElementById(canvasId);
	paper.setup(canvas); //paper needs to be setup before initializing other paper objects

	//paper.js objects and helper functions
	let path = new paper.Path(), //user drawn coloring path
		tool = new paper.Tool(), //mouse pointer
		outline = new paper.Raster(page), //coloring page overlay
		makeEndCap = (event) => { //creates a circle at the endpoints of a path
			var myCircle = new paper.Path.Circle({
				center: event.point,
				radius: currentSize / 2
			});
			myCircle.fillColor = currentColor;
		},
		printCanvas = () => { //turn canvas to base64 encoded image and print it
			var dataUrl = document.getElementById(canvasId).toDataURL(); //attempt to save base64 string to server using this var
			var windowContent = '<!DOCTYPE html>';
			windowContent += '<html>'
			windowContent += '<head><title>Print canvas</title></head>';
			windowContent += '<body><center>'
			windowContent += '<img src="' + dataUrl + '">';
			windowContent += '</center></body>';
			windowContent += '</html>';
			var printWin = window.open('','','width=340,height=260');
			printWin.document.open();
			printWin.document.write(windowContent);
			printWin.document.close();
			printWin.focus();
			printWin.print();
			printWin.close();
		},
		on = (selector, event, callback) => { //Event Binder
			[...document.querySelectorAll(selector)].forEach(function(element){
				element.addEventListener(event, callback);
			})
		};
	//resize the canvas to the size of the outline image once it loads
	outline.onLoad = function() {
		paper.view.viewSize = outline.size;
		outline.position = paper.view.center;
	};

	//Event Handling

	//Color Selection
	on('.controls-colorSelector', 'click', function(e){
		var color = this.getAttribute('data-color')
		currentColor = myColors[color];
		[].slice.call(document.querySelectorAll('.controls-colorSelector')).forEach(function(element){
			element.classList.remove('active');
		});
		this.classList.add('active');
	});

	//Size Selection
	on('.controls-sizeSelector', 'click', function(e){
		var newSize = this.getAttribute('data-size');
		currentSize = sizes[newSize];
		[].slice.call(document.querySelectorAll('.controls-sizeSelector')).forEach(function(element){
			element.classList.remove('active');
		});
		this.classList.add('active');
	});

	//Zoom Slider
	on('.controls-zoom', 'change', function(evt) {
		paper.view.zoom = evt.target.valueAsNumber;
	});

	//Print Button
	on('.controls-print', 'click', function(evt) {
		printCanvas();
	});

	//Pan Controls
	on('.controls-panUp', 'click', function(){
		paper.view.center = [paper.view.center.x, paper.view.center.y - panAmount];
	});
	on('.controls-panDown', 'click', function(){
		paper.view.center = [paper.view.center.x, paper.view.center.y + panAmount];
	});
	on('.controls-panLeft', 'click', function(){
		paper.view.center = [paper.view.center.x - panAmount, paper.view.center.y];
	});
	on('.controls-panRight', 'click', function(){
		paper.view.center = [paper.view.center.x + panAmount, paper.view.center.y];
	});

	//Paper.js tool event handlers
	tool.onMouseDown = function(event) {
		makeEndCap(event);

		path = new paper.Path();
		path.strokeColor = currentColor;
		path.strokeWidth = currentSize;
		path.add(event.point);
		outline.bringToFront();
	}

	tool.onMouseDrag = (event) => {
		path.add(event.point);
		path.smooth();
		outline.bringToFront();
	}

	tool.onMouseUp = (event) => {
		makeEndCap(event);
		outline.bringToFront();
	}
};

export default Coloring;