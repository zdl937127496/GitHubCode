(function(){
	//游戏类，构造函数
	var Game = window.Game = function(){
		//表格
		this.table = null;
		//实例化蛇
		this.snake = new Snake(this);
		//设置参数
		this.setPar();
		//初始化
		this.init();
		//游戏开始
		this.start();
		//绑定事件监听
		this.bindEvent();
	}
	//设置参数
	Game.prototype.setPar = function(){
		//帧编号
		this.f = 0;
		//多少帧刷新一次
		this.perf = 30;
		//临时刷新帧
		this.tmpPerf = 0;//空格按下时变成10
		//分数
		this.score = 1;
		//列数
		this.col = 15;
		//行数
		this.row = 15;
		//定时器
		this.timer = null;
		//食物
		this.food = null;

		this.ff = 0;
	}

	//初始化方法
	Game.prototype.init = function(){
		//创建表格
		this.table = document.getElementById("table");
		//创建格子
		for(var row = 0 ; row < this.row ; row++){
			var tr = document.createElement("tr");
			for(var col = 0 ; col < this.col ; col++){
				var td = document.createElement("td");
				tr.appendChild(td);
			}
			this.table.appendChild(tr);
		}
	}
	//让某一个小格变色
	Game.prototype.changeColor = function(row,col,color){
		this.table.getElementsByTagName("tr")[row].getElementsByTagName("td")[col].style.background = color;
	}
	//让某一个小格有innerHTML
	Game.prototype.changeHTML = function(row,col,html){
		this.table.getElementsByTagName("tr")[row].getElementsByTagName("td")[col].innerHTML = html;
	}

	//重新开始
	Game.prototype.resStart = function(){
		this.setPar();
		this.snake.setPar();
		this.start();
	}
	//清屏
	Game.prototype.clear = function(){
		for(var row = 0 ; row < this.row ; row++){
			for(var col = 0 ; col < this.col ; col++){
				this.changeColor(row,col,"white");
			}
		}
	}
	//游戏开始
	Game.prototype.start = function(){
		var self = this;
		this.timer = setInterval(function(){
			//检查有没有食物的实例，如果没有重新new一个
			if(!self.food){
				self.food = new Food(self);
			}
			//每帧都要清除屏幕
			self.clear();
			var tf = self.tmpPerf || self.perf;
			//每固定的间隔就要更新蛇
			if(self.f % tf == 0 && self.f - self.ff >= tf / 2){
				//蛇的更新，蛇的更新方法里面有食物check方法
				self.snake.update();
				self.ff = self.f;
			}
			//渲染蛇，检查蛇是否死亡
			if(self.snake.checkDie()){
				self.snake.render();
				self.showInfo(1);
			}else{
				//蛇死了
				clearInterval(self.timer);
				self.showInfo(2);
				self.food.clear();
			}
		},20);
	}
	//按shift时改变游戏状态
	Game.prototype.changeStatus = function(){
		if(this.timer){
			clearInterval(this.timer);
			this.timer = null;
			this.showInfo(3);
		}else{
			this.start();
		}
	}
	//绑定事件监听
	Game.prototype.bindEvent = function(){
		var self = this;
		//给页面添加按下键盘的监听
		document.onkeydown = function(event){
			if(event.shiftKey){
				self.changeStatus();
			}
			if(!self.timer) {//未在游戏中
				return;
			}
			event = event || window.event;
			switch (event.keyCode) {
				case 37:
					self.snake.changeDirection("L");
					break;
				case 38:
					self.snake.changeDirection("U");
					break;
				case 39:
					self.snake.changeDirection("R");
					break;
				case 40:
					self.snake.changeDirection("D");
					break;
				case 32:
					self.tmpPerf = 10;
					break;
			}
		}
		document.onkeyup = function(event){
			if(!self.timer) {//未在游戏中
				return;
			}
			event = event || window.event;
			switch (event.keyCode){
				case 32:
					self.tmpPerf = 0;
					break;
			}
		}
	}

	//显示内容
	Game.prototype.showInfo = function(flag){
		var self = this;
		var info = "帧号:"+ ++self.f + "<br/>";
		info += "刷新帧:" + (self.tmpPerf || self.perf) +"<br/>";
		info += "分数:" + self.score +"<br/>";
		if(flag == 1){//存活
			info += "状态:存活</br>";
			document.getElementById("info").innerHTML = info;
		}else if(flag == 2) {//死亡
			info += "状态:<span style='color:red;'>您已死亡!</span><br/>";
			document.getElementById("info").innerHTML = info;
			var resStartElem = document.createElement("span");
			resStartElem.style.color = "blue";
			resStartElem.style.cursor = "pointer";
			resStartElem.innerText = "点击重新开始";
			resStartElem.onclick = function () {
				self.resStart();
			}
			document.getElementById("info").appendChild(resStartElem);
		}else if(flag == 3){
			info += "状态:<span style='color: #770088'>暂停中</span></br>";
			document.getElementById("info").innerHTML = info;
		}
	}

	//蛇吃了食物
	Game.prototype.snakeEatFood = function(){
		this.food.clear();
		this.food = null;
		//分数加1
		this.score++;
		//改变perf
		if(this.perf > 10 && this.score %2 == 0 ){//每两分加速一次
			this.perf --;
		}
	}
})();