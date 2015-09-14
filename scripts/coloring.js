/*!
 * Coloring
 * @description	a Paper.js & jQuery coloring book
 * @version		@@version - @@date
 * @author		Michael Jasper
 * @requires	paper.js, jQuery
 * @copyright	Copyright Intellectual Reserve Inc. All rights reserved.
 */

var Coloring = function(options){
	with(paper){
		self = this;
		self.options = options;
		//Set up the canvas element
		var canvas = document.getElementById(options.canvasId);
		paper.setup(canvas);

		//Set up the colors from option or defaults
		self.myColors = options.colors || [];
		if(!options.colors){
			self.myColors['red'] 	= "#c00d0d";
			self.myColors['orange']  = "#eaa000";
			self.myColors['yellow'] 	= "#fefb20";
			self.myColors['lgreen'] 	= "#bafb3b";
			self.myColors['dgreen'] 	= "#0ab40e";
			self.myColors['lblue'] 	= "#3bd0fb";
			self.myColors['dblue'] 	= "#2f33d7";
			self.myColors['purple'] 	= "#ac3bfb";
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
		self.tool = new Tool()
		self.tool.minDistance = 2;
		self.tool.maxDistance = 50;

		//Coloring page outline image
		self.outline = new Raster(options.page);
		self = self;
		self.outline.onLoad = function() {
			console.log("image loaded");
		    view.viewSize = self.outline.size;
			self.outline.position = view.center;
			$("#page").remove();
		};

		//Run jQuery event handlers (color, brush, pan, Zoom)
		//Color Selection
		$('.controls-colorSelector').click(function(e){
			var color = $(this).data('color');
			self.currentColor = self.myColors[color];
			$(".controls-colorSelector").removeClass('active');
			$(this).addClass('active')
		});

		//Size Selection
		$('.controls-sizeSelector').click(function(e){
			var newSize = $(this).data('size');
			self.currentSize = sizes[newSize];
			$(".controls-sizeSelector").removeClass('active');
			$(this).addClass('active')
		});

		//Zoom Slider
		$('.controls-zoom').change(function(evt) { 
		    paper.view.zoom = evt.target.valueAsNumber;
		});

		//Print Button
		$('.controls-print').click(function(evt) { 
		    printCanvas();
		}); 

		//Pan Controls
		$(".controls-panUp").click(function(){
			view.center = [view.center.x, view.center.y-panAmount];
		});
		$(".controls-panDown").click(function(){
			view.center = [view.center.x, view.center.y+panAmount];
		});
		$(".controls-panLeft").click(function(){
			view.center = [view.center.x-panAmount, view.center.y];
		});
		$(".controls-panRight").click(function(){
			view.center = [view.center.x+panAmount, view.center.y];
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
	}
};