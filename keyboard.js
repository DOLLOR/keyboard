/*
https://github.com/DOLLOR/keyboard
forked from https://github.com/vczero/keyboard

Usage:

var input1 = document.getElementById('text1');
var input2 = document.getElementById('text2');

input1.onclick = function(){
	new KeyBoard(input1);
};

input2.onclick = function(){
	new KeyBoard(input2,{
		keyLists:[[1,2,3],[4,5,6],[7,8,9],[".",0,"删除"]],
		keyStyles:{
			".":"background-color:#D3D9DF;",
			"删除":"background-color:#D3D9DF;"
		},
		onFinish(after,before,inputElement){
			//todo
		}
	});
};
*/
;(function(exports){
	"use strict";
	var DIV_ID;
	var KeyBoard = function(input, options){
		options = options || {};
		var body = (document.body)||(document.getElementsByTagName('body')[0]);
		DIV_ID = DIV_ID || `numberKeyBoard_${Math.random().toString().slice(2)}`;
		
		if(document.getElementById(DIV_ID)){
			return;
		}
		
		this.input = input;
		this.el = document.createElement('div');
		
		var self = this;
		var mobile = false;//always use onclick typeof orientation !== 'undefined';
		var keyLists = options.keyLists || [[1,2,3],[4,5,6],[7,8,9],[".",0,"删除"]];
		var keyStyles = options.keyStyles || {
			".":"background-color:#D3D9DF;",
			"删除":"background-color:#D3D9DF;"
		};
		var onFinish;
		if(typeof options.onFinish === "function"){
			onFinish = (function(el){
				var before = el.value;
				return function(){
					options.onFinish(input.value,before,input);
					onFinish = null;
					before = null;
				};
			})(input);
		}
		
		this.el.id = DIV_ID;
		
		//样式
		var arrayToHtml = function(arr,cb){
			return arr.map(cb).join("");
		};
		var inputPreviewId = "numberKeyBoardPreview";
		this.el.innerHTML =
			`<style type="text/css">
				#${DIV_ID}{
					position:fixed;
					left:0;
					right:0;
					bottom:0;
					border-top:1px solid #ddd;
					z-index: 1000;
					width: 100%;
					background-color:#FFF;
				}
				#${DIV_ID} *{
					-webkit-box-sizing: border-box;
					-moz-box-sizing: border-box;
					box-sizing: border-box;
				}
				#${DIV_ID} table{
					text-align:center;
					width:100%;
					border-top:1px solid #CECDCE;
				}
				#${DIV_ID} table td{
					width:${100 / keyLists[0].length}%;
					height:40px;
					border:1px solid #ddd;
					border-right:0;
					border-top:0;
				}
				#${DIV_ID} table td:hover{
					background-color:#1FB9FF;
					color:#FFF;
				}
			</style>
			<div class="${inputPreviewId}" style="float:left;height: 28px;line-height: 28px;margin:5px;">${input.value}</div>
			<div style="width:60px;height:28px;background-color:#1FB9FF;float:right;margin:5px;text-align:center;color:#fff;line-height:28px;border-radius:3px;cursor:pointer;">完成</div>
			<div style="
				width:60px;
				height:28px;
				float:right;
				margin:5px;
				text-align:center;
				line-height:28px;
				border-radius:3px;
				cursor:pointer;">清空</div>
			
			<table border="0" cellspacing="0" cellpadding="0">
			${arrayToHtml(keyLists,row=>
				`<tr>
					${arrayToHtml(row,key=>`<td style="${keyStyles[key] || ""}">${key}</td>`)}
				</tr>`
			)}
			</table>
		`;

		function addEvent(e){
			var ev = e || window.event;
			var clickEl = ev.element || ev.target;
			var value = clickEl.textContent || clickEl.innerText;

			if(clickEl.tagName.toLocaleLowerCase() === 'td' && value === "删除"){
				var num = self.input.value;
				if(num){
					self.input.value = num.slice(0,-1);
				}
			}else if(clickEl.tagName.toLocaleLowerCase() === 'div' && value === "完成"){
				//click on  finish
				body.removeChild(self.el);
				if(onFinish) onFinish();
				self.el = null;
			}else if(clickEl.tagName.toLocaleLowerCase() === 'div' && value === "清空"){
				//click on  empey
				if(self.input){
					self.input.value = "";
				}
			}else if(clickEl.tagName.toLocaleLowerCase() === 'td'){
				//click on a number
				if(self.input){
					self.input.value += value;
				}
			}
			//set display
			self&&self.el&&( self.el.getElementsByClassName(inputPreviewId)[0].innerText = self.input.value );
		}
		
		if(mobile){
			this.el.ontouchstart = addEvent;
		}else{
			this.el.onclick = addEvent;
		}
		body.appendChild(this.el);
	};
	
	exports.NumberKeyBoard = KeyBoard;

})((function(g){
	if(typeof module !== "undefined" && module.exports){
		return module.exports;
	}
	else if(typeof define !== "undefined" && define.amd){
		var out = {};
		define(function(require, exports, module){
			module.exports = out;
		});
		return out;
	}
	else{
		return g;
	}
})(this));
