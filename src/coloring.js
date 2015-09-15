var paper = require('../bower_components/paper/dist/paper-core.min.js');

var Coloring = function(options){

	var self = {};
	self.options = options;
	//Set up the canvas element
	var canvas = document.getElementById(options.canvasId);
	paper.setup(canvas);

	//Set up the colors from option or defaults
	self.myColors = options.colors || [];
	if(!options.colors){
		self.myColors['red'] 	= "#c00d0d";
		self.myColors['orange'] = "#eaa000";
		self.myColors['yellow'] = "#fefb20";
		self.myColors['lgreen'] = "#bafb3b";
		self.myColors['dgreen'] = "#0ab40e";
		self.myColors['lblue'] 	= "#3bd0fb";
		self.myColors['dblue'] 	= "#2f33d7";
		self.myColors['purple'] = "#ac3bfb";
		self.myColors['white'] 	= "#ffffff";
		self.myColors['grey'] 	= "#b8b8c1";
		self.myColors['black'] 	= "#3a3a3a";
		self.myColors['skin1'] 	= "#eddc8e";
		self.myColors['skin2'] 	= "#cac498";
		self.myColors['skin3'] 	= "#584f31";
	}
	self.currentColor = options.currentColor || self.myColors['red'];

	//Set up brush sizes from options or defaults
	self.sizes = options.sizes || [];

	if(!options.sizes){
		self.sizes['small'] = 2;
		self.sizes['normal'] = 5;
		self.sizes['large'] = 10;
		self.sizes['huge'] = 20;
	}
	self.currentSize = options.currentSize || self.sizes['normal'];

	//Zoom & Pan Settings
	self.panAmount = 20;

	//Path Settings
	self.path = new paper.Path();

	//Mouse Tool Settings
	self.tool = new paper.Tool()
	self.tool.minDistance = 2;
	self.tool.maxDistance = 50;

	//Coloring page outline image
	self.outline = new paper.Raster(options.page);
	self = self;
	self.outline.onLoad = function() {
		paper.view.viewSize = self.outline.size;
		self.outline.position = paper.view.center;
	};

	//Run jQuery event handlers (color, brush, pan, Zoom)
	//Color Selection
	on('.controls-colorSelector', 'click', function(e){
		var color = this.getAttribute('data-color')
		self.currentColor = self.myColors[color];
		[].slice.call(document.querySelectorAll('.controls-colorSelector')).forEach(function(element){
			element.classList.remove('active');
		});
		this.classList.add('active');
	});

	//Size Selection
	on('.controls-sizeSelector', 'click', function(e){
		var newSize = this.getAttribute('data-size');
		self.currentSize = self.sizes[newSize];
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
		paper.view.center = [paper.view.center.x, paper.view.center.y-self.panAmount];
	});
	on('.controls-panDown', 'click', function(){
		paper.view.center = [paper.view.center.x, paper.view.center.y+self.panAmount];
	});
	on('.controls-panLeft', 'click', function(){
		paper.view.center = [paper.view.center.x-self.panAmount, paper.view.center.y];
	});
	on('.controls-panRight', 'click', function(){
		paper.view.center = [paper.view.center.x+self.panAmount, paper.view.center.y];
	});

	//Paper.js tool event handlers
	self.tool.onMouseDown = function(event) {
		makeEndCap(event);

		self.path = new paper.Path();
		self.path.strokeColor = self.currentColor;
		self.path.strokeWidth = self.currentSize;
		self.path.add(event.point);
		self.outline.bringToFront();
	}

	self.tool.onMouseDrag = function(event) {
		self.path.add(event.point);
		self.path.smooth();
		self.outline.bringToFront();
	}

	self.tool.onMouseUp = function(event) {
		makeEndCap(event);
		self.outline.bringToFront();
	}

	function makeEndCap(event){
		var myCircle = new paper.Path.Circle({
			center: event.point,
			radius: self.currentSize/2
		});
		myCircle.fillColor = self.currentColor;
	}

	function printCanvas(){
		var dataUrl = document.getElementById(self.options.canvasId).toDataURL(); //attempt to save base64 string to server using this var
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
	}
	function on(selector, event, callback){
		[].slice.call(document.querySelectorAll(selector)).forEach(function(element){
			element.addEventListener(event, callback);
		})
	}
};

export default Coloring;