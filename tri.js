
/*

Triangular - Cellular automation toy
Copyright (C) 2013  Antoine Morin-Paulhus

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see http://www.gnu.org/licenses/.

*/

function ready(){
	var app = new App()
	
	//Default app.pattern
	q.d(".patt-line").eq(5).find(".patt-button").eq(3)
		.and(q.d(".patt-line").eq(5).find(".patt-button").eq(5))
			.addClass("selected")

	//Default points	
	app.data[app.size/2][2*app.patternSize] = true
	
	app.updatePattern()
	app.drawData()
	
	app.iterate()
	app.drawData()
	
}

function App(){
	var app = this;
	
	app.pointSize = 1
	app.size = 300
	app.slowTime = 40
	app.iterationTimeout = 40
	app.patternSize = 9
	
	app.data = null
	
	app.pattern = new Array(app.patternSize)
	
	for (var i = 0; i < app.patternSize; i++){
		app.pattern[i] = new Array(app.patternSize)
	}
	
	q.d("#mainCanvas").append("<canvas></canvas>")
	
	var $c = q.d("#mainCanvas canvas")
	app.ctx = $c.item(0).getContext("2d")
	app.c = app.ctx.canvas
	
	//Building the app.pattern selector
	var pattButton = "<div class='patt-button'></div>"
	var centerButton = "<div class='center-button'></div>"
	var buttons = ""
	var patternSelectorContent = ""
	var middle = parseInt(app.patternSize/2)
	
	app.draw = function(e){
		var dEl = q.d(this).elements[0]
		var clickX = e.pageX - dEl.offsetLeft
		var clickY = e.pageY - dEl.offsetTop
		
		coordX = parseInt(clickX / app.pointSize)
		coordY = parseInt(clickY / app.pointSize)
		
		app.data[coordX][coordY] = !app.data[coordX][coordY]
		
		app.pixelChange(coordX,coordY,app.data[coordX][coordY])
	}
	
	
	app.initDataArray = function(s){
		app.data = new Array(s)
		
		for (var i = 0; i < s; i++){
			app.data[i] = new Array(s)
		}
	}
	
	app.initCanvasSize = function(s){
		app.c.width = app.pointSize*s
		app.c.height = app.pointSize*s
	}
	app.clearAppData = function(value){
		for(i = 0; i < app.size;i++){
			for(j = 0; j < app.size; j++){
				app.data[j][i] = value
			}
		}
	}
	
	/**
	@param slow bool Go step by step with sleep between steps
	*/
	app.iterate = function(){
		
		var ps = app.patternSize	//Pattern app.size
		var hps = parseInt(app.patternSize/2)	//Half app.pattern app.size
		
		//For each point...
		for(i = hps; i < app.size - hps;i++){
			for(j = hps; j < app.size -hps; j++){
				if(app.data[j][i] == 1){
					//...do app.pattern
					for( var k = 0; k < app.patternSize; k++)
						for(var l = 0; l < app.patternSize; l++){
							if(app.pattern[l][k] == true){	
								app.data[j+k-hps]
									[i+l-hps] =
									 !app.data[j+k-hps][i+l-hps]
							}
						}					
					//Historical code
					//app.data[j-1][i+1] = !app.data[j-1][i+1]
					//app.data[j+1][i+1] = !app.data[j+1][i+1]
				}
			}
		}
		app.drawData();
	}
	
	app.pixelChange = function(x,y,value){
		if(value){
			app.ctx.fillStyle = "#000"
		}
		else{
			app.ctx.fillStyle = "#fff"
		}
		app.ctx.fillRect(x*app.pointSize,y*app.pointSize,app.pointSize,app.pointSize)
	}
	
	app.drawData = function(){
		
		app.ctx.fillStyle = "#fff"
		app.ctx.fillRect(0,0,app.pointSize*app.size,app.pointSize*app.size)
		app.ctx.fillStyle = "#000"
		
		for (var i = 0; i < app.size; i++){
			for (var j = 0; j < app.size; j++){
				if(app.data[i][j] == 1){
					app.pixelChange(i,j,true)
				}
				
			}
		}
	}
	
	app.initDataArray(app.size)
	app.initCanvasSize(app.size)
	
	for(var i = 0; i < app.patternSize; i++){
		var pattLine = "<div class='patt-line'>"
		for(var j = 0; j < app.patternSize; j++){
			if(i == middle)
				if(j == middle){
					pattLine += centerButton
					continue
				}
			pattLine += pattButton
		}
		pattLine += "</div>"
		
		patternSelectorContent += pattLine
	}
	
	
	q.d("#mainCanvas").prepend("<div id='control-panel'><div id='buttons'></div></div>")
	q.d("#buttons").prepend("<input type='button' id='zoom-in' value='Zoom in'>")
	q.d("#buttons").prepend("<input type='button' id='zoom-out' value='Zoom out'>")
	q.d("#buttons").prepend("<input type='button' id='fill-black' value='Fill black'>")
	q.d("#buttons").prepend("<input type='button' id='fill-white' value='Fill white'>")
	q.d("#buttons").prepend("<input type='button' id='next-iteration' value='Next Iteration'>")
	q.d("#buttons").prepend("<input type='button' id='iterate' value='Iterate'>")
	q.d("#buttons").append("<br>")
	q.d("#buttons").append("<input type='button' id='bigger-canvas' value='Bigger canvas'>")
	q.d("#buttons").append("<input type='button' id='smaller-canvas' value='Smaller canvas'>")
	q.d("#buttons").append("<input type='button' id='randomize-colors' value='Randomize colors'>")
	q.d("#buttons").append("<input type='button' id='clear-pattern' value='Clear pattern'>")
	
	q.d("#control-panel").prepend("<div id='pattern-selector'>"+patternSelectorContent+"</div>")
	
	q.d(".patt-button").on("click",function(){
		q.d(this).toggleClass("selected")
		app.updatePattern()
	})
	
	app.updatePattern = function(){
		var i = 0
		var j = 0
		
		q.d(".patt-line").each(function(){
			q.d(this).find(".patt-button").each(function(){
				app.pattern[i][j] = q.d(this).hasClass("selected")
				j++
			})
			i++
			j = 0
		})
	}
	
	var drawing = false;
	
	q.d("#mainCanvas canvas").on("mousedown",function(){
		drawing = true
	})
	
	q.d("#mainCanvas canvas").on("mouseup",function(){
		drawing = false
	})
	
	q.d("#mainCanvas canvas").on("click",app.draw)
	q.d("#mainCanvas canvas").on("mousemove",function(e){
		if(drawing){
			app.draw.call(this,e)
		}
	})
	
	q.d("#bigger-canvas").on("click",function(){
		app.size+=100
		
		app.initDataArray(app.size)
		app.initCanvasSize(app.size)
		
		app.drawData()
	})
	
	q.d("#smaller-canvas").on("click",function(){
		if(app.size >= 200)
			app.size-=100
		app.initCanvasSize(app.size)
		app.drawData()
	})
	
	q.d("#zoom-out").on("click",function(){	
		if(app.pointSize > 1)
			app.pointSize--
		app.initCanvasSize(app.size)
		app.drawData()
	})
	
	q.d("#zoom-in").on("click",function(){	
		app.pointSize++
		app.initCanvasSize(app.size)
		app.drawData()
	})
	
	q.d("#fill-black").on("click",function(){
		app.clearAppData(true)
		app.drawData()
	})
	q.d("#fill-white").on("click",function(){
		app.clearAppData(false)
		app.drawData()
	})
	
	q.d("#clear-pattern").on("click",function(){
		q.d(".patt-button.selected").removeClass("selected")
		app.updatePattern()
	})
	
	q.d("#randomize-colors").on("click",function(){
		var tempPC = app.pixelChange
		
		app.pixelChange = function(x,y,value){
			if(value)
				app.ctx.fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16)
			else
				app.ctx.fillStyle = "#fff"
				
			app.ctx.fillRect(x*app.pointSize,y*app.pointSize,app.pointSize,app.pointSize)
		}
		
		app.drawData()
		
		//Change pixelChange method to the old one
		app.pixelChange = tempPC
	})
	
	var iterating = false
	
	q.d("#next-iteration").on("mousedown",function(){
		app.iterate()
	})
	
	q.d("#iterate").on("mousedown",function(){
		iterating = true
		iterateTimeout()
		function iterateTimeout(){
			app.iterate()
			if(iterating)
				setTimeout(iterateTimeout,app.iterationTimeout)
		}
		
		q.d("body").one("mouseup",function(){
			iterating = false
		})
		
	})
	
	
}
