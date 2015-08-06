String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

var myOrder = {};

var initOrderData = function () {
    myOrder = {
        date: "",
        foods: {},
        lumpsum: 0.0
    }
    $("#orderList").html("");
};


var updateLumpSum = function () {
    var all = 0.0;
    for (var food in myOrder.foods) {
        all = all + myOrder.foods[food].foodprice * myOrder.foods[food].count;
    }
    myOrder.lumpsum = all;
}

var addFood = function(foodName,foodprice){
    if (!isExist(myOrder.foods[foodName])) {
        myOrder.foods[foodName] = {}
        myOrder.foods[foodName].foodname = foodName;
        myOrder.foods[foodName].foodprice = foodprice;
        myOrder.foods[foodName].count = 0;
        $.notify("あなたは" + foodName + "を注文", "success");
    }

    if (myOrder.foods[foodName].count < 9) {
        myOrder.foods[foodName].count += 1;
        updateLumpSumHtml();
        updateItemToOrderList(foodName,myOrder.foods[foodName].count,foodprice);
    }
}

var divFood = function(foodName,foodprice){
    if (!isExist(myOrder.foods[foodName])) {
        myOrder.foods[foodName] = {}
        myOrder.foods[foodName].foodname = foodName;
        myOrder.foods[foodName].foodprice = foodprice;
        myOrder.foods[foodName].count = 1;
        //$.notify("あなたは" + foodName + "を注文", "success");
    }

    if (myOrder.foods[foodName].count >= 1) {
        myOrder.foods[foodName].count -= 1;
        updateLumpSumHtml();
        updateItemToOrderList(foodName,myOrder.foods[foodName].count,foodprice);
    }

}

var updateItemToOrderList = function(foodName,count,price){
    var x = $("#orderList").find("[foodName='"+foodName+"']");

    if(x.length > 0){
        if(parseInt(count) > 0){
            var c = x.find(".count");
            x.find(".count").text(count);
            x.find(".memory").text(parseInt(count)*parseFloat(price)+"円");
        }else{
            //$("#orderList").remove("[foodName='"+foodName+"']");
            x.remove();
        }
    }else{
         var html = "<tr foodName='"+foodName+"'><td align='left' class='bkdi1'>"+foodName+"</td><td class='bkdi1 count'>"+count+"</td><td class='bkdi1 memory'>"
             +parseInt(count)*parseFloat(price)+"円</td><td class='bkdi1'><a><img class='addFoodItem' foodname='"+foodName+"' foodCount='"+count+"' foodprice='"+price+"' src='../menu/dlcf/image/jia.png' height='75%'></a></td><td class='bkdi1'><a><img class='divFoodItem' foodname='"+foodName+"' foodCount='"+count+"' foodprice='"+price+"' src='../menu/dlcf/image/jian.png' height='75%'></a></td></tr>";
        $("#orderList").append(html);
    }

    $(".addFoodItem").unbind("click");
    $(".divFoodItem").unbind("click");

    $(".addFoodItem").click(function(){
        var foodName = $(this).attr("foodname");
        var foodprice = $(this).attr("foodprice");
        addFood(foodName,foodprice);
    });

    $(".divFoodItem").click(function(){
        var foodName = $(this).attr("foodname");
        var foodprice = $(this).attr("foodprice");
        divFood(foodName,foodprice);
    });
}

var updateLumpSumHtml = function () {
    updateLumpSum();
    $("#orderLumpSum").val("￥ "+myOrder.lumpsum);
}

var updateOrder = function () {
    myOrder.date = new Date();
    updateLumpSum();

    var tdata = {
        order: myOrder,
        clientId: localStorage.getItem("clientId"),
        reqType: "updateOrder"
    };
    reqData(tdata);
}

var Menu = {};
    Menu.mainMenu = $("#mainMenu");
    Menu.notificationPanel = $("#notificationPanel");
    Menu.menuPanel   = $("#MenuPanel");
    Menu.dirnkMenuPanel   = $("#DrinkMenuPanel");
    Menu.orderPanel = $("#orderPanel");
    Menu.confirmAlert = $("#confirmAlert");
    Menu.cancelAlert = $("#cancelAlert");
    Menu.toolBar = $("#toolBar");

    console.log("inited page!");

    var showPanel = function(panels){
        for(var i in Menu)
            Menu[i].hide();

        for(var n in panels)
            Menu[panels[n]].show();

    }

var initPage = function(){
    initOrderData();
    

    var gotoTopMenu = function(){
        showPanel(["mainMenu","toolBar"]);
    };

    gotoTopMenu();

    var clearSelectedSubMenu = function(){
        var s =  $(".submenuBtnImg");
        $(".submenuBtnImg").each(function(){
            var path = $(this).attr("src");
            if(path[19]=="s"){
                path = path.splice(19,1,"");
                $(this).attr("src",path);
            }
        });
    }

    var selectedSubMenu = function(id){
        var path = $("."+id).attr("src");
        if(path[19]=="e"){
            path = path.splice(19,0,"s");
            $("."+id).attr("src",path);
        }
    }

    var showMenuPage=function(id){
        $(".menupage.current").hide();
        $(".menupage.current").removeClass("current");

        $("#"+id).show();
        $("#"+id).addClass("current");

        if($(".menupage.current").find(".subMenu.current").length == 0)
            $("#"+id).find( "[subid='0']").show().addClass("current");
    }

    $(".bd_rbtn").click(function(){
        var s = $(".menupage.current").find(".subMenu.current");
        var cur = $(s).attr("subid");

        if((parseInt(cur)+1) < $(".menupage.current").find(".subMenu").length){
            s.hide().removeClass("current");
            $(".menupage.current").find( "[subid='"+(parseInt(cur)+1)+"']").show().addClass("current");
        }
    });

    $(".bd_lbtn").click(function(){
        var s = $(".menupage.current").find(".subMenu.current");
        var cur = $(s).attr("subid");

        if((parseInt(cur)-1) >= 0){
            s.hide().removeClass("current");
            $(".menupage.current").find( "[subid='"+(parseInt(cur)-1)+"']").show().addClass("current");
        }
    });

    $(".submenuBtnImg").click(function(){
        clearSelectedSubMenu();
        var path = $(this).attr("src");
        if(path[19]=="e"){
            path = path.splice(19,0,"s");
            $(this).attr("src",path);
            var id = path[21];
            showMenuPage("f"+id);
        }
    });

    $("#topMenu").click(function(){
        Menu.mainMenu.show();
        gotoTopMenu();
    });

    $("#countNow").click(function(){
        gotoTopMenu();
        Menu.mainMenu.hide();
        Menu.orderPanel.show();
    });

    $("#dxBtn").click(function(){
        console.log("dxBtn");
        gotoTopMenu();
        Menu.mainMenu.hide();
        Menu.orderPanel.show();
    });

    $("#notificationBar").click(function(){
        showPanel(["notificationPanel","toolBar"]);
    });

    $("#drinkMenuBtn").click(function(){
        showPanel(["dirnkMenuPanel","toolBar"]);
    });

    backToMenu
    $("#backToMenu").click(function(){
        console.log("backToMenu clicked");
        showPanel(["menuPanel","toolBar"]);
    });

    //--------
    $("#qcBtn").click(function(){
        console.log("qcBtn clicked");
        showPanel(["menuPanel","toolBar"]);
        clearSelectedSubMenu();
        selectedSubMenu("qcImg");
        showMenuPage("f1");
    });

    $("#hxBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
        clearSelectedSubMenu();
        selectedSubMenu("hxImg");
        showMenuPage("f2");
    });

    $("#hcBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
        clearSelectedSubMenu();
        selectedSubMenu("ycImg");
        showMenuPage("f3");
    });

    $("#rouBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
        clearSelectedSubMenu();
        selectedSubMenu("orImg");
        showMenuPage("f4");
    });


    $("#tdBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
        clearSelectedSubMenu();
        selectedSubMenu("dxImg");
        showMenuPage("f5");
    });


    $("#zsBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
        clearSelectedSubMenu();
        selectedSubMenu("zsImg");
        showMenuPage("f6");
    });

    $("#drinkBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
        clearSelectedSubMenu();
        selectedSubMenu("ylImg");
        showMenuPage("f7");
    });

    $(".countlabel").hide();

    var initTuanbox = function(){
        $(".tuanbox").click(function(){
            var s = $(this).find(".countlabel");
            console.log("s:"+s.is(':visible'));
            if(!s.is(':visible')){
                s.fadeIn(300).delay(5000).fadeOut(500,function(){
                    initTuanbox();
                });

                $(this).unbind("click");
                var x = $(this).find(".countlabelbtn.div");
                var p = $(this).find(".countlabelbtn.plus");

                $(x[0]).unbind("click");
                $(x[0]).click(function(){
                    var num = $(this).parent().find("dt")[0];
                    $(num).text(""+((parseInt($(num).text())-1) >= 0 ? (parseInt($(num).text())-1):0));
                    console.log("div ");


                    var foodName = $(this).attr("foodname");
                    var foodprice = $(this).attr("foodprice");
                    divFood(foodName,foodprice);
                });

                $(p[0]).unbind("click");
                $(p[0]).click(function(){
                    var num = $(this).parent().find("dt")[0];
                    $(num).text(""+((parseInt($(num).text())+1) <= 9 ? (parseInt($(num).text())+1):9));
                    console.log("plus ");

                    var foodName = $(this).attr("foodname");
                    var foodprice = $(this).attr("foodprice");

                    addFood(foodName,foodprice);

                });
            }
        });
    };

    initTuanbox();

    $('#orderOk').click(function () {
        updateLumpSum();
        if (myOrder.lumpsum > 0) {
            showPanel(["orderPanel","confirmAlert","toolBar"]);
        }
    });

    $('#orderCancel').click(function () {
        updateLumpSum();
        if (myOrder.lumpsum > 0)
            showPanel(["orderPanel","cancelAlert","toolBar"]);
    });

    $("#cancelAlertYes").click(function () {
        initOrderData();
        showPanel(["mainMenu","toolBar"]);
    });

    $("#cancelAlertNo").click(function () {
        showPanel(["orderPanel","toolBar"]);
    });

    $("#confirmAlertYes").click(function () {
            var tdata = {
                order: myOrder,
                clientId: localStorage.getItem("clientId"),
                reqType: "confirmedOrder"
            };

        reqData(tdata, function (data) {
            //initOrderData();

            $.notify("私たちはあなたのために準備ができている、お待ちください:", "success");
            showPanel(["mainMenu","toolBar"]);
            $('#orderOk').attr("disable");
            $('#orderCancel').attr("disable");
        });
    });

    $("#confirmAlertNo").click(function () {
        showPanel(["orderPanel","toolBar"]);
    });


}

window.onload = initPage;