/**
 * Created by zhang on 15/6/14.
 */

var initInfoBoxType = "";

var onHiddenInitBox = function(){
    $('#initInfoBox').on('hide.bs.modal', function (e) {
        initInfoBoxType = "";
        $(".modal-backdrop.fade.in").remove();
    })
};

onHiddenInitBox();

var openInitBox = function () {
    reqData({reqType: "reqInitBox",
        clientId: localStorage.getItem("clientId"),
        clientName: localStorage.getItem("clientName"),
        clientType: localStorage.getItem("clientType")
    }, function (data1) {
        $("#initInfoBox").html(data1.html);
        $("#initInfoBox").modal("show");
        initInfoBoxType = "InitBox";

        $("#updateClientInfo").click(function () {
            $("#initInfoBox").modal('hide');
            //$(".modal-backdrop.fade.in").remove();
            var info = $("#clientInfo").val();
            var vdata2 = {
                reqType: "reqUpdateClientInfo",
                info: $("#clientInfo").val(),
                clientId: localStorage.getItem("clientId"),
                clientName: localStorage.getItem("clientName"),
                clientType: localStorage.getItem("clientType")
            };

            reqData(vdata2, function (data2) {
                if (!data2.done) {
                    $.notify(data2.msg, "error");
                } else {
                    $("#initInfoBox").html(data2.html);
                    $("#initInfoBox").modal("show");
                    initInfoBoxType = "UpdateClientInfo";
                    $.notify(data2.msg, "success");
                }
            });
        });
    });
};

setInterval(function () {
    var vdata = {
        reqType: "reqState",
        clientId: localStorage.getItem("clientId"),
        clientName: localStorage.getItem("clientName"),
        clientType: localStorage.getItem("clientType")
    }
    reqData(vdata, function (data) {
        if (data.state == "unknown") {
            if (initInfoBoxType == "") {
                console.log("initInfoBox show:" + $("#initInfoBox").is(":visible"));
                if (!$("#initInfoBox").is(":visible")) openInitBox();
            }
        } else if (data.state == "Unregistered" && initInfoBoxType == "") {
            openInitBox();
        }
        else {
            if ($("#initInfoBox").is(":visible")) {
                if (initInfoBoxType != "RegisterInfo") {
                    $("#initInfoBox").modal('hide');
                    //$(".modal-backdrop.fade.in").remove();
                    var vdata2 = {
                        reqType: "reqRegisterInfo",
                        clientId: localStorage.getItem("clientId"),
                        clientName: localStorage.getItem("clientName"),
                        clientType: localStorage.getItem("clientType")
                    };

                    reqData(vdata2, function (data2) {
                        $("#initInfoBox").html(data2.html);
                        $("#initInfoBox").modal("show");
                        initInfoBoxType = "RegisterInfo";
                    });
                }else{
                    location.reload();
                }
            }else if (initInfoBoxType != "") {
                location.reload();
            }

        }
    });
}, 1000);