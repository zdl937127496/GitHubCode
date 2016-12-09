(function(){
    //实物类
    var Food = window.Food = function(game){
        this.game = game;

        //随机产生一个位置
        //为了让产生的食物肯定不在蛇的身上，我们的算法就是不断的产生食物，直到某一个食物不在蛇的身上。
        while(true){
            this.row = this.getRandom(this.game.row);
            this.col = this.getRandom(this.game.col);
            //验证是否在蛇的身上，如果在就结束for循环，此时i的值就不是数组长度
            for(var i = 0 ; i < this.game.snake.body.length ; i++){
                if(
                    this.row == this.game.snake.body[i].row &&
                    this.col == this.game.snake.body[i].col
                ){
                    break;
                }
            }
            //验证i
            if(i == this.game.snake.body.length){
                break;  //结束while循环
            }
        }
        //显示自己
        this.game.changeHTML(this.row , this.col, "*");
    }
    //得到随机数
    Food.prototype.getRandom = function(){
        return parseInt(Math.random() * 1000) % 15;
    }

    //检查自己有没有被吃，每pers帧执行
    Food.prototype.check = function(){
        if(this.row == this.game.snake.body[0].row && this.col == this.game.snake.body[0].col){
            //吃到了
            return true;
        }
        return false;
    }

    //清除显示的
    Food.prototype.clear = function(){
        //显示自己
        this.game.changeHTML(this.row , this.col, "");
        this.game = null;//取消引用 方便回收
    }
})();