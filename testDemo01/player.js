
var Player ={
		listNum : null,
		videoNum:null,
		myPlayer :null,
		frameRate:-1,
		listData:null,
		listDatalength:null,
		jqplotSeries:[
			{label : "X軸",color:'#FF3300'},
			{label : "Y軸",color:'#6666FF'},
			{label : "Z軸",color:'#66CC66'}
		]
}
//----------------------------放送--------------------
Player.playClick = function(rowId,videoListData){
	$("#popupId").dialog({
		resizable : false,
		height : 670,
		minWidth : 850,
		modal : true,
		close: function( event, ui ) {
			Player.videoNum = Player.listNum;
			Player.myPlayer.pause();
		},
		 buttons : [ {
			   text : "OK",
			   click : function(eventObject) {
				Player.videoNum = Player.listNum;
			    $(this).dialog('close');
			   }
			  }]
	});
	console.log("rowId"+rowId);
	console.log("videoListData[1]"+videoListData  +"length"+videoListData.length);
	Player.listData = videoListData;
	Player.listDatalength = Player.listData.length;
	console.log(" Player.listDatalength:"+ Player.listDatalength);
	Player.listNum = rowId-1;
	Player.videoNum = Player.listNum;
	var riskVideoName = Player.listData[Player.listNum].riskVideoName;
	console.log("riskVideoName+"+riskVideoName)
	
	
	
	if(Player.myPlayer == null){
		//ビデオのコンソール
		//Player.myPlayer = videojs("example_video_1");
		Player.myPlayer = videojs("example_video_1",{
			controlBar:{
				"remainingTimeDisplay":true
			}
		},function(){ 
			//design  button
			var divBySuntect = document.createElement('div');
			divBySuntect.innerHTML = '<button class ="vjs-control reduceRate-suntect-video" id ="reduceRateBtn"><font>-R<font></button>'+
					'<button class ="vjs-control increaseRate-suntect-video" id ="increaseRateBtn"><font>+R<font></button>'+
					'<button class ="vjs-control lastVideo-suntect-video" id ="lastVideoBtn"><font>V<-<font></button>'+
					'<button class ="vjs-control nextVideo-suntect-video" id ="nextVideoBtn"><font>->V<font></button>'+
					'<button class ="vjs-control lastFrame-suntect-video" id ="lastFrameBtn"><font>F<-<font></button>'+
					'<button class ="vjs-control nextFrame-suntect-video" id ="nextFrameBtn"><font>->F<font></button>';
			//add them to video	                      
			var controlBar = document.getElementsByClassName('vjs-control-bar')[0];
			var insertBeforeNode = document.getElementsByClassName('vjs-volume-menu-button')[0];
			controlBar.insertBefore(divBySuntect,insertBeforeNode);
			//increaseRate
			var videoRate = Player.myPlayer.player().playbackRate();
			$("#increaseRateBtn").on("click",function(){
				videoRate = videoRate+1;
				Player.myPlayer.player().playbackRate(videoRate);
				console.log("+:"+Player.myPlayer.player().playbackRate());
			});
			//reduceRate
			$("#reduceRateBtn").on("click",function(){
				videoRate = videoRate-1;
				if(videoRate>=0){
					Player.myPlayer.player().playbackRate(videoRate);
					console.log("-:"+Player.myPlayer.player().playbackRate());
					
				}
				else{
					console.log("rate = 0!!!");
				}
			});
			//lastVideo
			$("#lastVideoBtn").on("click",function(){
				if(Player.videoNum > 0){
					Player.videoNum = Player.videoNum-1;
					var riskVideoName = Player.listData[Player.videoNum].riskVideoName;
					Player.frameRate = Player.listData[Player.videoNum].frameRate;
					Player.myPlayer.src(ContextPath+urls.getRiskVideo+"?riskVideoName="+riskVideoName);
				}else{
					console.log("It is the first data");
				}
			});
			//nextVideo
			$("#nextVideoBtn").on("click",function(){
				if(Player.videoNum <Player.listDatalength-1){
					Player.videoNum = Player.videoNum+1;
					var riskVideoName = Player.listData[Player.videoNum].riskVideoName;
					Player.frameRate = Player.listData[Player.videoNum].frameRate;
					Player.myPlayer.src(ContextPath+urls.getRiskVideo+"?riskVideoName="+riskVideoName);
				}else{
					console.log("It is the last data");
				}
			});
			//nextFrame
			$("#nextFrameBtn").on("click",function(){
				if(Player.frameRate>0){
					var curTime = Player.myPlayer.player_.currentTime();
					var	frameTime = curTime + (1/Player.frameRate);
					Player.myPlayer.player_.currentTime(frameTime);
				}else{}
			});
			//lastFrame
			$("#lastFrameBtn").on("click",function(){
				if(Player.frameRate>0){
					var curTime = Player.myPlayer.player_.currentTime();
					var	frameTime = curTime - (1/Player.frameRate);
					Player.myPlayer.player_.currentTime(frameTime);
				}else{}
			});
			
		});
		Player.frameRate =Player.listData[Player.listNum].frameRate;
		Player.myPlayer.src(ContextPath+urls.getRiskVideo+"?riskVideoName="+riskVideoName);
		playerControl();
		//図の描画
		Player.jqplot();
		//地図の展示
		Player.mapShow();
	}else {
		Player.frameRate =Player.listData[Player.listNum].frameRate;
		Player.myPlayer.src(ContextPath+urls.getRiskVideo+"?riskVideoName="+riskVideoName);
		pauseVisible();
	}
	
};

//--------------------playerControl()の プログラム-----------------------
function playerControl(){
		playOrPause();
		volumeControl();
		rateControl();
		changeCurVideoControl();
		curTimeDisCon();
		frameRateControl();
}

function  frameRateControl(){
	
	$("#frameForwardId").on("click",function(){
		if(Player.frameRate>0){
			console.log("videoList.frameRate:"+Player.frameRate);
			var curTime = Player.myPlayer.player_.currentTime();
			var	frameTime = curTime + (1/Player.frameRate);
			console.log("curTime:"+curTime+";frameTime"+frameTime)
			Player.myPlayer.player_.currentTime(frameTime);
		}else{}
	});
	$("#frameRetreatId").on("click",function(){
		console.log("videoList.frameRate:"+Player.frameRate);
		if(Player.frameRate>0){
			var curTime = Player.myPlayer.player_.currentTime();
			var	frameTime = curTime - (1/Player.frameRate);
			console.log("curTime:"+curTime+";frameTime"+frameTime)
			Player.myPlayer.player_.currentTime(frameTime);
			
		}else{}
		
	});
	
}
function playOrPause(){
	
	$("#play-button-background").on("click",function(){
		if( $("#pause-button").css('display')=='none'){
			playVisible();
		}
		else{
			pauseVisible();
		}
		
	});

}

function playVisible(){
	Player.myPlayer.play();
	$("#play-button").css('display','none');
	$("#pause-button").css('display','block');
}
function pauseVisible(){
	Player.myPlayer.pause();
	$("#pause-button").css('display','none');
	$("#play-button").css('display','block');
}



function volumeControl(){	
	if(Player.myPlayer.player_.muted()){
		var volumeNum =  (Player.myPlayer.player_.volume() * 100).toFixed(2);
		voiceVisible();
		voiceLevel(volumeNum);
		Player.myPlayer.player_.volume(volumeNum);
	}else{
		var volumeNum =  (Player.myPlayer.player_.volume() * 100).toFixed(2);
		voiceVisible();
		voiceLevel(volumeNum);
	}
	
	$("#volumeControlBarId").mouseup(function(e){
		var  volumeDivPos = $("#volumeControlBarId").offset().left;
		var  volumeNumNew = e.pageX-volumeDivPos;
		if(volumeNumNew>0){
			voiceVisible();
			voiceLevel(volumeNumNew);
			
			Player.myPlayer.player_.volume(volumeNumNew/100);
		}
		else{
			volumeNumNew= 0;
			muteVisible();
			voiceLevel(volumeNumNew);
			Player.myPlayer.player_.volume(volumeNumNew/100);
		}
	
	});
	
	$("#volumeBackgroundId").on("click",function(){
		if($("#voiceId").css('display')=='block'){
			var  volumeNumNew = 0;
			muteVisible();
			voiceLevel(volumeNumNew);
			Player.myPlayer.player_.volume(volumeNumNew/100);
		}
		else{
			var  volumeNumNew = 50;
			voiceVisible();
			voiceLevel(volumeNumNew);	
			Player.myPlayer.player_.volume(volumeNumNew/100);
		}
		
	});
	

}


function muteVisible(){
	$("#voiceId").css('display','none');
	$("#noVoiceId").css('display','block');	
}
function voiceVisible(){
	$("#voiceId").css('display','block');
	$("#noVoiceId").css('display','none');
}
function voiceLevel(voiceLevel){
	$("#volumeLevelLeftId").css('width',voiceLevel+'px');
	$("#volumeLevelRightId").css('width',(100-voiceLevel)+'px');

}

//放送にスピー 
function  rateControl(){
	var videoRate = Player.myPlayer.player().playbackRate();
	$("#fastVideoId").on("click",function(){
		videoRate = videoRate+1;
		Player.myPlayer.player().playbackRate(videoRate);
		console.log("+:"+Player.myPlayer.player().playbackRate());
	});
	$("#slowVideoId").on("click",function(){
		videoRate = videoRate-1;
		if(videoRate>=0){
			Player.myPlayer.player().playbackRate(videoRate);
			console.log("-:"+Player.myPlayer.player().playbackRate());
			
		}
		else{
			console.log("rate = 0!!!");
		}
		
	});
}


function changeCurVideoControl(){
	
	
	$("#nextVideoId").on("click",function(){
		
		pauseVisible();
		console.log("videoList.videoNum  nextVideoId Player.listDatalength-1:"+Player.videoNum+"[]"+Player.listDatalength);
		if(Player.videoNum <Player.listDatalength-1){
			Player.videoNum = Player.videoNum+1;
			var riskVideoName = Player.listData[Player.videoNum].riskVideoName;
			console.log("Player.videoNum:"+Player.videoNum);
			console.log("changeCurVideoControl----riskVideoName:"+riskVideoName);
//			if( riskVideoName != null){
			Player.frameRate = Player.listData[Player.videoNum].frameRate;
			Player.myPlayer.src(ContextPath+urls.getRiskVideo+"?riskVideoName="+riskVideoName);
//			}else{
//				videoList.frameRate = -1;
//				videoList.myPlayer.src("");
//				console.log("This data doesn't contain video");
//			}
		}else{
			console.log("It is the last data");
		}
	});
	$("#lastVideoId").on("click",function(){
		
		pauseVisible();
		if(Player.videoNum > 0){
			Player.videoNum = Player.videoNum-1;
			var riskVideoName = Player.listData[Player.videoNum].riskVideoName;
//			if( riskVideoName != null){
			Player.frameRate = Player.listData[Player.videoNum].frameRate;
			Player.myPlayer.src(ContextPath+urls.getRiskVideo+"?riskVideoName="+riskVideoName);
//			}else{
//				videoList.frameRate = -1;
//				videoList.myPlayer.src("");
//				console.log("This data doesn't contain video");
//			}
		}else{
			console.log("It is the first data");
		}
	});

}

//放送に時間
function curTimeDisCon(){
	
	var timer = setInterval(function(){
		$("#totalTimeId").html(formateTime(Player.myPlayer.player_.duration()));
		$("#currentTimeId").html(formateTime(Player.myPlayer.player_.currentTime()));
		progressBarControl();
		
	},500); 
	
	
	


}

function  formateTime(time){
	var result = "";
	var minutes = 0;
	var seconds = 0;
	
	var timeTemp = parseInt(time);
	
	if(timeTemp > 59){
		var minutes = parseInt(timeTemp / 60);
		var seconds = timeTemp - minutes * 60;
	} else {
		minutes = 0;
		seconds = timeTemp;
	}
	
	if(minutes < 10){
		result += "0";
	}
	result += minutes;
	result += ":";
	
	if(seconds < 10){
		result += "0";
	}
	result += seconds;
	
	return result;
}
//進捗条
function progressBarControl(){
	
	var curTimeNum = Player.myPlayer.player_.currentTime();
	var totTimeNum = Player.myPlayer.player_.duration();
	var percentPlayVideo = curTimeNum/totTimeNum;
	var totalVideoWid = $("#progressBarWidthId").width();
	var progressPlayWid = totalVideoWid*percentPlayVideo;
	$("#progressBarPlayId").css('width',progressPlayWid+'px');
	
	var loadTimeNum= Player.myPlayer.player_.bufferedEnd();
	var percentLoadVideo = loadTimeNum/totTimeNum; 
	var progressLoadWid = totalVideoWid*percentLoadVideo;
	$("#progressBarLoadId").css('width',progressLoadWid+'px');

	$("#progressBar-background").mouseup(function(e){
		var  progressDivPos = $("#progressBar-background").offset().left;
		var  playNumNew = e.pageX-progressDivPos;
		var  totalVideoWid = $("#progressBar-background").width();
		var  percentPlayMouse = playNumNew/totalVideoWid
		var  currentTimeMouse = percentPlayMouse*totTimeNum;
		Player.myPlayer.player_.currentTime(currentTimeMouse);
		
		
		
	});
	
}
//-------------------------------------------
 Player.jqplot = function (){
	var jqplotData1 = [1,2,3,4,5,6,8,9,1,2,3,6,5,4,7,8,9,5,4,3,1,2,3];
	var jqplotData2 = [1,0,1,8,9,6,5,4,1,2,3,5,4,8,6,2,1,3,1,5,6,2,7];
	var jqplotData3 = [1,8,9,6,5,4,1,2,3,5,4,8,6,2,1,3,1,5,6,2,7,9,-5];
					
	var plotOne = $.jqplot("div_jqplotId", [jqplotData1,jqplotData2,jqplotData3],{
		grid: {
			drawGridLines: true,
			background: 'rgba(57,57,57,0.0)',
			drawBorder: false,
			shadow: false
		},
		 seriesDefaults: {
			 markerOptions: { 
				 	show : false
				 	}
		 },
		 series:Player.jqplotSeries,
		 legend: {
				show:true,
				placement: 'insideGrid',
				location: 'se'
			}
	});	
	//legendの属性を変更
	 $("#div_jqplotId table").html("<tr><td><font color='#FF3300'>X軸</font></td><td><font color='#6666FF'>Y軸</font></td><td><font color='#66CC66'>Z軸</font></td> </tr>");

}
//---------------------------------------------
Player.mapShow = function (){
	var lat = 35.67756510;
	var lon = 139.77034288;

	var zm = 15;
	var zmMin = 4;
	var zmMax = 19;
	var map = L.map("mapContent", {
		
		dragging : false,
		scrollWheelZoom : true,
		doubleClickZoom : false,
		zoomControl : false,
		attributionControl : false
	})
	.setView([ lat, lon ], zm);

	L.tileLayer(mapUrl, {
		minZoom : zmMin,
		maxZoom : zmMax,
		attribution : ''
	}).addTo(map);
// -=-=-=-=-=marker-=-=-=-=-=-=-=-=
//	L.marker([lat,lon]).addTo(map)
//		.bindPopup("I'm marker")
//		.openPopup();
// -=-=-=-=-=polyline-=-=-=-=-=-=-=-=
	var latlngs=new Array();
	var options = {color: '#385068', opacity: 1, weight:1};
	latlngs.push(new L.LatLng(lat, lon));
	latlngs.push(new L.LatLng(36+0.1, lon+0.1));
	latlngs.push(new L.LatLng(36+0.2, lon-0.1));
	latlngs.push(new L.LatLng(36+0.1, lon+0.0001));
	latlngs.push(new L.LatLng(36+0.3, lon-0.0001));
	latlngs.push(new L.LatLng(36+1, lon+0.0001));
	var polyline = L.polyline(latlngs, options).addTo(map);
	map.fitBounds(polyline.getBounds());
//-==-=-=-=-=Icon-=-=-=-=-=-=-
	videoList.riskImgUrl = ContextPath +'/images/dynamic/BZMAP_p5213.png';
	var myIcon = L.icon({
	    iconUrl:videoList.riskImgUrl,
	    iconRetinaUrl: '',
	    iconSize: [32, 46],
	    iconAnchor: [16, 16],
	    popupAnchor: [0, -49],
	    shadowUrl: '',
	    shadowSize: [41, 41],
	    shadowAnchor: [15, 30]
	});

	var marker01 = L.marker([lat+0.00001, lon+0.00001], {icon: myIcon}).addTo(map);
//-=-=-=-=-=-=
	var bounds = [[lat, lon], [lat+0.0003, lon+0.00003]];
	// create an orange rectangle
	L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
	// zoom the map to the rectangle bounds
	map.fitBounds(bounds);
	
//-=-=-=-=-=-=-=-=-=-=-=--=
	// 地図中心点
	//L.control.center().addTo(map);
	// 地図中心点名称
	//L.control.centerName().addTo(map);
	// 地図の縮尺
	//L.control.scale().addTo(map);
	
	// ====add jiangyubin 2016-03-30 start ph3.2 No2 地図共通,右クリック操作時のブラウザ標準画面表示の制御
//	$("#mapContent" ).bind("contextmenu", function() {
//		return false;
//	});
	// ====add jiangyubin 2016-03-30 end
	
	this.map = map;
	
}
