if(S(window.navigator.appVersion).include("Android")) {
    //alert("this is android webview");

     try{
     //we replace default localStorage with our Android Database one
     window.localStorage=LocalStorage;
     }catch(e){
     //LocalStorage class was not found. be sure to add it to the webview
     alert("LocalStorage ERROR : can't find android class LocalStorage. switching to raw localStorage")
     }

    //then use your localStorage as usual
    //localStorage.setItem('foo','it works');
    //alert(localStorage.getItem('foo'));
}else{
    //alert("this is Not android webview");
}

var ClientId = localStorage.getItem("clientId");

var deployOnce = function() {
    if (!isExist(ClientId)) {
        ClientId = getRamdonID(24);
        localStorage.setItem("clientId", ClientId);
    }
};

var buildSocketIoConnector = function(){
    var t = this;
    this.cServer = null;
    this.isConnected = false;
    this.timer = null;

    this.connectReleaseServer = function(server, port, funs) {

        if (!t.isConnected && isExist(t.cServer)) {
            t.cServer.destroy();
            //delete t.cServer;
            t.cServer = null;
        }

        if (isExist(server) && isExist(port) && !isExist(t.cServer) && !t.isConnected) {
            t.cServer = io.connect("http://" + server + ":" + port, {
                'force new connection' : true
            });
            console.log("try to connect server");

            t.cServer.on("connect", function(data) {
                console.log("connecting server!");
                if (!t.isConnected) {
                    t.cServer = this;
                    console.log("connected server");
                    t.registMeInServer();
                    
                    if (isExist(funs) && isExist(funs["connect"]))
                        funs["connect"](data, t.cServer);

                    t.isConnected = true;
                } else {
                    this.disconnect();
                }
            });
            t.cServer.on("disconnect", function(data) {

                if (isExist(funs) && isExist(funs["disconnect"]))
                    funs["disconnect"](data, t.cServer);

                console.log("disconnect server");
                this.disconnect();
                delete this;
                t.cServer.destroy();
                t.cServer = null;
                t.isConnected = false;
            });
            t.cServer.on("connect_failed", function(data) {
                if (isExist(funs) && isExist(funs["connect_failed"]))
                    funs["connect_failed"](data, t.cServer);

                console.log("connect_failed server");

                this.disconnect();
                delete this;
                t.cServer.destroy();
                t.cServer = null;
                t.isConnected = false;
            });
        }
    };

    this.registMeInServer = function() {
        if (isExist(t.cServer)) {
            console.log("regist in server");
            t.cServer.emit('registClient', {
                id : ClientId
            });
        }
    };

    this.sendBackData = function(sdata,callback,callback_failed) {
        if (isExist(t.cServer) && t.isConnected) {
            //sendCounter++;
            t.cServer.emit("answerData", sdata);

            if(isExist(callback))
                callback();
        }
        else if(isExist(callback_failed)){
            callback_failed();
        }
        else{
            console.log("sendBackData fail as Lost Server!");
        }
    };

    deployOnce();

    t.initConnecter = function(server, ip, funs) {
        t.timer = setInterval(function() {
            t.connectReleaseServer(server, ip, funs);
        }, 2000);
    };
    return t;
};

