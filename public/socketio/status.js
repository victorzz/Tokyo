
var StatusCollector = function(){
	var t = this;
	this.curStatus = {};

	t.curStatus.getRequestNum = 0;
	t.curStatus.finishedRequestNum = 0;
	t.curStatus.curHandlingRequstNum = 0;
	t.curStatus.RequestGetCounter = isExist(localStorage.getItem("RequestGetCounter")) ? localStorage.getItem("RequestGetCounter") : 0;
	t.curStatus.RequestFinishedCounter = isExist(localStorage.getItem("RequestFinishedCounter")) ? localStorage.getItem("RequestFinishedCounter") : 0;

	t.curStatus.eventConsume = {};

	t.addOneEventConsume = function(eventName,timeConsume){
		if(!isExist(t.curStatus.eventConsume[eventName]))
			t.curStatus.eventConsume[eventName] = {
				count:0,
				avarageTimeConsume:0
			};

		var tc = t.curStatus.eventConsume[eventName] ;
		tc.avarageTimeConsume = (tc.count * tc.avarageTimeConsume + timeConsume)/(tc.count + 1);
		tc.count = tc.count + 1;

		curStatus.eventConsume[eventName] = tc;
	};

	t.gotReqest = function(){
	    t.curStatus.getRequestNum++;
	    t.curStatus.RequestGetCounter++;
	};

	t.startHandleRequest = function(){
		t.curStatus.curHandlingRequstNum++;
	};

	t.finishedRequest = function(){
		t.curStatus.getRequestNum--;
		t.curStatus.curHandlingRequstNum--;
		t.curStatus.finishedRequestNum++;
		t.curStatus.RequestFinishedCounter++;
	};

	t.time = setInterval(function() {
	    localStorage.setItem("RequestGetCounter", t.curStatus.RequestGetCounter);
	    localStorage.setItem("RequestFinishedCounter", t.curStatus.RequestFinishedCounter);
	}, 1000);

	t.get = function(){
		return t.curStatus;
	}

	return t;
};