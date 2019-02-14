$(function(){
    var year;      //年
    var month;     //月
    var date;      //日
    var startYear=1900;
    var endYear=2050;
    var iNow=0;
    var myDate=new Date();
    var t=myDate.getDate();
    var m=myDate.getMonth();
    function run(str){
        //计算本月有多少天
        myDate=new Date();
        myDate.setDate(1);  //时间调整到本月第一天
        myDate.setMonth(myDate.getMonth()+str);//设置月份
        year=myDate.getFullYear();
        month=myDate.getMonth();
        date=myDate.getDate();
        var aMonthDay=[31,28,31,30,31,30,31,31,30,31,30,31][month];
        //判断闰年
        if(month==1) {
            if(year%4==0&&year%100!=0||year%400==0){
                aMonthDay=29;
            }
        }
        //判断本月第一天是星期几
        var week=myDate.getDay();   //读取本月第一天是星期几
        $('.dateList').empty();

        for(var i=0;i<week;i++){
            $('.dateList').append('<li></li>');
        }

        for(var i=1;i<=aMonthDay;i++){
            $('.dateList').append('<li value='+year+month+i+'>'+i+'</li>');
        }
        if(str==0)
            $('.dateList li').eq(t+week-1).addClass('onColor');
        else
            $('.dateList li').eq(week).addClass('onColor');
    }
    run(0);
    $('.year').change(function(){
        var changeYear=$(this).children('option:selected').val();
        var yearSum=changeYear-year;
        run(iNow+yearSum*12);
        iNow+=yearSum*12;
        if(month!=m)          //换月时备忘录切换至切换到的月份一号
            var IdSum=year+''+month+''+date;
        else             //如果切换到的月份为当前月，则备忘录切换至当前日
            var IdSum=year+''+month+''+t;
        selectId(IdSum);
    })
    $('.month').change(function(){
        var changeMonth=$(this).children('option:selected').val();//获取月份下拉表改变后的值
        var monthSum=changeMonth-month;
        run(iNow+monthSum);
        iNow+=monthSum;
        if(month!=m)          //换月时备忘录切换至切换到的月份一号
            var IdSum=year+''+month+''+date;
        else             //如果切换到的月份为当前月，则备忘录切换至当前日
            var IdSum=year+''+month+''+t;
        selectId(IdSum);
    });
    $(".button_left").click(function(){
        iNow--;
        run(iNow);
        var month_left=document.getElementById('month');
        var year_left=document.getElementById('year');
        for(var i=0;i<month_left.length;i++){
            if(month_left[i].value==month)
                month_left[i].selected=true;
        }
        for(var i=startYear;i<=endYear;i++){
            if(year_left[i-1900].value==year)
                year_left[i-1900].selected=true;
        }
        if(month!=m)
            var IdSum=year+''+month+''+date;
        else
            var IdSum=year+''+month+''+t;
        selectId(IdSum);
    });
    $(".button_right").click(function(){
        iNow++;
        run(iNow);
        var month_right=document.getElementById('month');
        var year_right=document.getElementById('year');
        for(var i=0;i<month_right.length;i++){
            if(month_right[i].value==month)
                month_right[i].selected=true;
        }
        for(var i=startYear;i<=endYear;i++){
            if(year_right[i-1900].value==year)
                year_right[i-1900].selected=true;
        }
        if(month!=m)          //换月时备忘录切换至切换到的月份一号
            var IdSum=year+''+month+''+date;
        else             //如果切换到的月份为当前月，则备忘录切换至当前日
            var IdSum=year+''+month+''+t;
        selectId(IdSum);
    });
    $(".return_today").click(function(){
        run(0);
        document.getElementById('month')[month].selected=true;
        document.getElementById('year')[year-1900].selected=true;
        iNow=0;
        var IdSum=year+''+month+''+t;
        selectId(IdSum);
    });
    //年份下拉框
    var Select_year=[];
    for(var i=startYear;i<=endYear;i++){
        if(i==year){
            Select_year+='<option value="'+i+'" selected>'+i+'年'+'</option>';
        }
        else{
            Select_year+='<option value='+i+'>'+i+'年'+'</option>';
        }
    }
    $(".year").append(Select_year);
    //月份下拉框
    var Select_month=[];
    for(var i=0;i<=11;i++){
        if(i==month){
            Select_month+='<option value="'+i+'" selected>'+(i+1)+'月'+'</option>';
        }
        else{
            Select_month += '<option value='+i+'>'+(i+1)+'月'+'</option>';
        }
    }
    $(".month").append(Select_month);	
});

function selectId(id){
    $(".list li").each(function(){
        if($(this).attr("value") == id){
            $(this).addClass("onColor");
        }else{
            $(this).removeClass("onColor");
        }
    })
}
$(document).on("click", ".dateList li", function () {//事件委托，显示当前日期需做的事务。
    var date;
    date = $(this).attr("value");
    if($(this).html() != '') 
        $(this).addClass("onColor").siblings().removeClass("onColor");
    selectId(date);
});


$("#text_input").keyup(function(){
    if(event.keyCode==13){
        var v=$("#text_input").val();
        if(v){
            $("#text_input").val("");
            
            saveMessage(v);
        }
    }
});

window.onload = function() {
    showMessage()
}

function saveMessage(v) {
	var addMessage = $(".dateList li.onColor").attr("value");
	var message = {
        "date": addMessage,
		"text": v
	};
    var key = "message" + (new Date()).getTime();
	var keys = getKeys();
	keys.push(key);
	localStorage.setItem(key, JSON.stringify(message));
	localStorage.setItem("keys", JSON.stringify(keys));
	showMessage();
}

function showMessage() {
	//每次都要刷新
	var messages = document.getElementById("list");
	var messagesChilds = messages.childNodes;
	//首先清除所有message节点
	while(messagesChilds.length > 0) {
		messages.removeChild(messagesChilds[0]);
	}
	var keys = getKeys();
	for(var i = 0; i < keys.length; i++) {
        var sendText,addli,addMessage;
        addli = $("<li class='onColor'></li>");    
        addMessage=$(".dateList li.onColor").attr("value");
        var message = JSON.parse(localStorage.getItem(keys[i]));
        if(addMessage!=message["date"])
            addli.removeClass('onColor');
        sendText = "<span class='discrib'>"+'▪ '+message["text"];+"</span>";   
        addli.attr("value",message["date"]).html(sendText);   //将正在点击日期的value值,以及内容v赋予创建的备忘录列表中的li
        $('.list').append(addli);
        $(".list").scrollTop($(".list")[0].scrollHeight);
	}
}

$('.clear').click(function(){
    $('.list li').remove();
    localStorage.clear();
});

function getKeys() {
	//获取Keys的对象
	//keys是专门存储localStorage的key的
	var keys = JSON.parse(localStorage.getItem("keys"));
	if(keys == null) {
		keys = [];
		localStorage.setItem("keys", JSON.stringify(keys));
	} 
	return keys;
}



