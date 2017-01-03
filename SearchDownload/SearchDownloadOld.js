/**
 * Created by zdl64 on 2016/8/10.
 * 使用时请注意 imgBaseUrl的路径
 * 调用方式
 * SearchDownload.create();//创建 可传入文字
 * SearchDownload.destroy();//销毁 
 * SearchDownload.setDefaultText();//设置默认文字
 * SearchDownload.setDefaultImgUrl();//设置图片路径
 */
var SearchDownload = (function(){
    var createFlag = false;
    var imgNum = 6;//总图片数量
    var whiteNum = 0;//白色图片数量
    var blueNum = 0;//蓝色图片数量
    var imgBaseUrl = "./";//图片的基础地址
    var blueImgUrl = imgBaseUrl + "search-download-blue.png";
    var whiteImgUrl = imgBaseUrl + "search-download-white.png";
    var defaultText = "正在加载，请稍候";
    var timer = null;//定时器
    var timerSpace = 200;
    var $imgs = null;
    var $elem  = null;
    var $bg = null;
    var startDate = null;//开始时间的时间戳
    var endDate = null;//结束时间的时间戳 两个差最少为1000时才可以销毁
    var _create = function(text){
        if(createFlag){
            $elem.show();
            $bg.show();
        }else{
			_addCss();
            createFlag = true;
            $elem = $('<div id="search-download"></div>');
            $bg = $('<div id="search-download-bg"></div>');
            $("body").append($elem).append($bg);
            $elem.append('<div class="search-download-left"><img src="'+imgBaseUrl+'search-download.png"></div>');
            /*开始处理右侧*/
            var $right = $('<div class="search-download-right"></div>');
            text = text || defaultText;
            $right.append('<span>'+text+'</span>');
            var $tmp = $('<div></div>');
            for(var i = 0; i < imgNum; i++){
                var $img = $('<img src="'+whiteImgUrl+'">')
                            .data("blue",blueImgUrl)
                            .data("white",whiteImgUrl);
                $tmp.append($img);
            }
            $elem.append($right.append($tmp));
            /*右侧处理完毕*/
            $imgs = $right.find("img");
        }
        _checkPostion();
        _startChange();
        startDate = new Date().getTime();
    }
    //校验位置
    var _checkPostion = function(){
        var w = $elem.width();
        var h = $elem.height();
        var bh = $("body").height();
        var wh = $(window).height();
        bh < wh ?  $bg.height(wh) : $bg.height(bh);
        $elem.css({"margin-top":(-h/2)+"px","margin-left":(-w/2)+"px"});
    }
    //定时器响应函数
    var _timerFuc = function(){
        if(blueNum === imgNum){
        	if(whiteNum === imgNum){
        		blueNum = whiteNum = 0;
        		_setBlue($imgs.eq(blueNum++));
        	}else{
        		_setWhite($imgs.eq(whiteNum++));
        	}
        }else{
            _setBlue($imgs.eq(blueNum++));
        }
    }
    //开始显示
    var _startChange = function(){
        _timerFuc();
        timer = setInterval(_timerFuc,timerSpace);
    }
    //设置成蓝色
    var _setBlue = function($elem){
        $elem.attr("src",$elem.data("blue"));
    }
    //设置成白色
    var _setWhite = function($elem){
        $elem.attr("src",$elem.data("white"));
    }
    //销毁
    var _destroy = function(){
    	if(!createFlag) return;//未创建则处理
    	endDate = new Date().getTime();
    	var timeDifference = endDate - startDate;
    	if(timeDifference > 1000){//如果显示时间已经超过1秒，则直接销毁
    		_startDestroy();
    	}else{//如果显示事件未超过1秒，则在剩余的时间完成后再销毁
    		setTimeout(_startDestroy,timeDifference);
    	}
    }
    //开始执行销毁
    var _startDestroy = function(){
    	clearInterval(timer);
        _setWhite($imgs);
        $elem.hide();
        $bg.hide();
        blueNum = 0;
    }
    
    //设置默认显示文字
    var _setDefaultText = function(text){
    	defaultText = text || defaultText;
    }
    //设置默认图片路径
    var _setDefaultImgUrl = function(url){
    	imgBaseUrl = url;
    	blueImgUrl = imgBaseUrl + "search-download-blue.png";
        whiteImgUrl = imgBaseUrl + "search-download-white.png";
    }
    //动态添加css style
    var comAddCSS = function(cssText){
        var style = document.createElement('style'),  //创建一个style元素
            head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
        style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        if(style.styleSheet){ //IE
            var func = function(){
                try{ //防止IE中stylesheet数量超过限制而发生错误
                    style.styleSheet.cssText = cssText;
                }catch(e){

                }
            }
            //如果当前styleSheet还不能用，则放到异步中则行
            if(style.styleSheet.disabled){
                setTimeout(func,10);
            }else{
                func();
            }
        }else{ //w3c
            //w3c浏览器中只要创建文本节点插入到style元素中就行了
            var textNode = document.createTextNode(cssText);
            style.appendChild(textNode);
        }
        head.appendChild(style); //把创建的style元素插入到head中
    }
    //动态写入css
    var _addCss = function(){
        //通过style动态写入css
        var cssText = '#search-download{height: 180px;top:50%;left: 50%;position: fixed;z-index: 9999;}'
            +'#search-download:after{content: "";clear: both;}'
            +'#search-download-bg{width: 100%;height: 100%;opacity: 0.63;filter: alpha(opacity=63);background-color: #2b2b2b;position: absolute;top: 0;left: 0;z-index: 9998;}'
            +'.search-download-left{width: 126px;height: 176px;margin-top: 2px;float: left;}'
            +'.search-download-right{margin-left: 30px;float: left;}'
            +'.search-download-right:after{content: "";clear: both;}'
            +'.search-download-right>span{margin-top: 66px;display: block;float: left;width: 100%;font-size: 27px;line-height: 28px;color: #ffffff;}'
            +'.search-download-right img{display: block;float: left;width: 14px;height: 14px;margin-top:15px;margin-right: 15px;}';
        comAddCSS(cssText);
    };
    return {
        create:_create,//如果未显示出来，请确认是否引入了相应样式
        destroy:_destroy,
        setDefaultText:_setDefaultText,
        setDefaultImgUrl:_setDefaultImgUrl
    }
})();