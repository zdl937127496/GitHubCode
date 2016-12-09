(function(){
	var Snake = window.Snake = function(game){
		this.setPar();
		this.game = game;
	}
	Snake.prototype.setPar = function(){
		//自己的身体
		this.body = [
			{"row" : 3 , "col" : 6},
			{"row" : 3 , "col" : 5},
			{"row" : 3 , "col" : 4}
		];
		//方向
		this.direction = "R";
		//为了验证方向的有效性，记录一下老方向
		this.olddirection = "R";
	}
	//更改方向
	Snake.prototype.changeDirection = function(str){
		this.direction = str;
	}
	//渲染
	Snake.prototype.render = function(){
		//蛇头渲染
		this.game.changeColor(this.body[0].row , this.body[0].col , "-webkit-linear-gradient(top,orange,red)");
		//蛇身体渲染
		for(var i = 1 ; i < this.body.length ; i++){
			this.game.changeColor(this.body[i].row , this.body[i].col , "red");
		}
	}

	//更新蛇，每帧执行
	Snake.prototype.update = function() {
		//验证方向，如果这一帧的间隔中用户按了错误的方向，给他换回来
		if(
			this.olddirection == "U" && this.direction == "D"
				||
			this.olddirection == "D" && this.direction == "U"
				||
			this.olddirection == "L" && this.direction == "R"
				||
			this.olddirection == "R" && this.direction == "L"
		){
			//不合法的方向换回来
			this.direction = this.olddirection;
		}
		//备份此时的方向
		this.olddirection = this.direction;

		//头部插入一节，插入的关节取决于方向
		switch (this.direction){
			case "L" :
				var head = {"row" : this.body[0].row , "col" : this.body[0].col - 1};
				break;
			case "R" :
				var head = {"row" : this.body[0].row , "col" : this.body[0].col + 1};
				break;
			case "D" :
				var head = {"row" : this.body[0].row + 1 , "col" : this.body[0].col};
				break;
			case "U" :
				var head = {"row" : this.body[0].row - 1 , "col" : this.body[0].col};
				break;
		}
		//插入头部
		this.body.unshift(head);

		//进行检测新的头部是不是碰到了食物，如果没有吃到食物，删除自己的尾巴。
		if(this.game.food.check()){
			this.game.snakeEatFood();
		}else{
			this.body.pop();
		}
	}
	//死亡判定
	Snake.prototype.checkDie = function(){
		//返回值false表示死了，true表示活着
		//我们现在要检测蛇头是不是出界了
		if(this.body[0].row < 0 || this.body[0].row > 14 || this.body[0].col < 0 || this.body[0].col > 14){
			//出界了
			return false;
		}
		//检查是不是撞到了自己的身体
		for(var i = 1 ; i < this.body.length ; i++){
			if(this.body[0].row == this.body[i].row && this.body[0].col == this.body[i].col){
				return false;
			}
		}
		return true;
	}
})();