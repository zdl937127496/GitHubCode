/**
 * Created by zdl64 on 2016/8/10.
 * 使用时请注意 imgBaseUrl的路径
 * 调用方式
 * SearchDownload.create();//创建
 * SearchDownload.destroy();//销毁
 */
var SearchDownload = (function(){
    var createFlag = false;
    var showFlag = false;//正在显示标识
    var imgBaseUrl = "";//图片的基础地址
    var baseImgUrl = imgBaseUrl + "search-download-img.png";
    var circleImgUrl = imgBaseUrl + "search-download-circle.png";
    var timer = null;//校验高度的定时器
    var $elem  = null;
    var $bg = null;
    var startDate = null;//开始时间的时间戳
    var endDate = null;//结束时间的时间戳 两个差最少为1000时才可以销毁
    var showTime = 1000;//至少显示时间
    var _create = function(text){
        if(showFlag) {
            _checkHeight();
            return;
        }
        showFlag = true;
        if(createFlag){
            $elem.show();
            $bg.show();
        }else{
            _addCss();
            createFlag = true;
            $elem = $('<div id="search-download"></div>');
            $bg = $('<div id="search-download-bg"></div>');
            $("body").append($elem).append($bg);
            $elem.append('<img src="'+baseImgUrl+'">');
            $elem.append('<img class="search-download-circle"  src="'+circleImgUrl+'">');
        }
        _checkHeight();
        timer = setInterval(_checkHeight,200);
        startDate = new Date().getTime();
    }

    //校验高度
    var _checkHeight = function(){
        var hw = $(window).height();
        var hb = $("body").height();
        var h = hb < hw ? hw : hb;
        $bg.height(h);
    }


    //销毁
    var _destroy = function(flag){
        if(!createFlag) return;//未创建则不处理
        if(flag === true){//如果传入true 则直接清除
            _startDestroy();
        }else{
            endDate = new Date().getTime();
            var timeDifference = endDate - startDate;
            if(timeDifference > showTime){//如果显示时间已经超过showTime秒，则直接销毁
                _startDestroy();
            }else{//如果显示事件未超过showTime秒，则在剩余的时间完成后再销毁
                setTimeout(_startDestroy,showTime - timeDifference);
            }
        }
    }
    //开始执行销毁
    var _startDestroy = function(){
        clearInterval(timer);
        $elem.hide();
        $bg.hide();
        showFlag = false;
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
    //设置图片的基础路径
    var _setImgBaseUrl = function(imgBase){
        imgBaseUrl = imgBase;//图片的基础地址
        baseImgUrl = imgBase + "search-download-img.png";
        circleImgUrl = imgBase + "search-download-circle.png";
    }
    //动态写入css
    var _addCss = function(){
        //通过style动态写入css
        var cssText = '#search-download{width: 120px;height: 120px;margin-top: -60px;margin-left: -60px;top:50%;left: 50%;position: fixed;z-index: 9999;}'
            +'#search-download>img{position: absolute;top:0px;left: 0px;}'
            +'#search-download>.search-download-circle{animation:TurnAround 2s infinite;animation-timing-function:linear;-webkit-animation-timing-function:linear;}'
            +'@keyframes TurnAround{from {transform:rotate(360deg);}to {transform:rotate(0deg);}}'
            +'#search-download-bg{width: 100%;height: 100%;opacity: 0.63;filter: alpha(opacity=63);background-color: #2b2b2b;position: absolute;top: 0;left: 0;z-index: 9998;}';
        comAddCSS(cssText);
    };
    return {
        setImgBaseUrl:_setImgBaseUrl,
        create:_create,
        destroy:_destroy
    }
})();
