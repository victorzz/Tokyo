/**
 * Created by zhang on 15/6/14.
 */

var ClientType = localStorage.getItem("clientType");
var ClientName = localStorage.getItem("clientName");

var deployMenuClientOnce = function() {
    if (!isExist(ClientName)) {
        ClientType = "MenuClient";
        ClientName = "MenuClient-"+getRamdonID(6);
        localStorage.setItem("clientName", ClientName);
        localStorage.setItem("clientType", ClientType);
    }
};

deployMenuClientOnce();

$(".foodtouchimg").click(function () {
    $("#foodname").text($(this).attr("foodname"));
    $("#fooddescrip").text($(this).attr("fooddescrip"));
    $("#foodprice").text($(this).attr("foodprice"));
    $("#foodimage").attr("src", $(this).attr("foodimage"));

    $("#foodIntroducationBox").modal();
});


var myOrder = {};

var initOrderData = function () {
    myOrder = {
        date: "",
        foods: {},
        lumpsum: 0.0
    }
};

initOrderData();

var updateLumpSum = function () {
    var all = 0.0;
    for (var food in myOrder.foods) {
        all = all + myOrder.foods[food].foodprice * myOrder.foods[food].count;
    }
    myOrder.lumpsum = all;
}

var updateLumpSumHtml = function () {
    updateLumpSum();
    $("#orderLumpSum").text(myOrder.lumpsum);
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

var updateOrderHtml = function () {
    myOrder.date = new Date();
    updateLumpSum();
    var tdata = {
        order: myOrder,
        clientId: localStorage.getItem("clientId"),
        reqType: "getOrderHtml"
    };

    reqData(tdata, function (data) {
        $("#myOrder").html(data.html);
        initOrderflow();
    });
}

var initOrderflow = function () {

    $(".food-order-div").unbind("click");
    $(".food-order-plus").unbind("click");
    $("#submitOrder").unbind("click");
    $("#confirmedOrder").unbind("click");
    $(".reOrder").unbind("click");

    $(".food-order-div").click(function () {
        var countSpan = $(this).parent().children(".food-menu-count");
        var foodName = $(this).attr("foodname");
        var count = myOrder.foods[foodName].count;

        if (myOrder.foods[foodName].count >= 1) {
            myOrder.foods[foodName].count -= 1;
            countSpan.text(myOrder.foods[foodName].count);
            updateLumpSumHtml();
        }
    });

    $(".food-order-plus").click(function () {
        var countSpan = $(this).parent().children(".food-menu-count");
        var foodName = $(this).attr("foodname");
        var count = myOrder.foods[foodName].count;

        if (myOrder.foods[foodName].count < 100) {
            myOrder.foods[foodName].count += 1;
            countSpan.text(myOrder.foods[foodName].count);
            updateLumpSumHtml();
        }
    });

    $("#submitOrder").click(function () {
        if (myOrder.lumpsum > 0) {
            $('#myOrder').modal('hide');
            $("#confirmMyOrder").modal();


        } else {
            $('#myOrder').modal('hide');
            $("#emptyOrder").modal();
        }
    });

    $("#confirmedOrder").click(function () {

        updateLumpSum();

        if (myOrder.lumpsum > 0) {
            var tdata = {
                order: myOrder,
                clientId: localStorage.getItem("clientId"),
                reqType: "confirmedOrder"
            };

            reqData(tdata, function (data) {
                initOrderData();
                $.notify("私たちはあなたのために準備ができている、お待ちください:", "success");
            });
        } else {
            $('#myOrder').modal('hide');
            $("#emptyOrder").modal();
        }
    });

    $(".reOrder").click(function () {
        $('#myOrder').modal('show');
    });
}


$("#addFood").click(function () {
    $("#foodIntroducationBox").modal('hide');

    var foodname = $("#foodname").text();
    var foodprice = $("#foodprice").text();
    var foodimage = $("#foodimage").attr("src");

    if (!isExist(myOrder.foods[foodname])) {
        myOrder.foods[foodname] = {}
        myOrder.foods[foodname].foodname = foodname;
        myOrder.foods[foodname].foodprice = foodprice;
        myOrder.foods[foodname].foodimage = foodimage;
        myOrder.foods[foodname].count = 1;
        $.notify("あなたは" + foodname + "を注文", "success");
    } else {
        myOrder.foods[foodname].count += 1;
        $.notify("あなたと" + foodname + "を注文", "success");
    }
    //updateOrder();
    updateOrderHtml();
});
