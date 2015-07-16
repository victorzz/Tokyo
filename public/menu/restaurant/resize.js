/**
 * Created by zhang on 15/7/5.
 */

console.log("resize ready!");

var fitScreen = function(){

    var WHeight = window.innerHeight;
    var WWeith = window.innerWidth;

    var HWRite = 800*1.0/1280;
    var RHWRite = WHeight/WWeith;

    if(HWRite > RHWRite)
        WWeith = WHeight/HWRite;

    var HRite = 1.0*WHeight/800;
    var WRite = 1.0*WWeith/1280;

    $(".container").css("height",parseFloat(HRite * 800 ).toFixed(0)+"px");
    $(".container").css("width",parseFloat(WRite * 1280 ).toFixed(0)+"px");


    $(".menuItem.areaH > .col-xs-4").css("height",parseFloat(HRite * 272 ).toFixed(0)+"px");
    $(".menuItem.areaH > .col-xs-4").css("width",parseFloat(HRite * 220 ).toFixed(0)+"px");

    $(".menuItem").css("height",parseFloat(HRite * 116 ).toFixed(0)+"px");
    $(".menuItem > img").css("height",parseFloat(HRite * 116 ).toFixed(0)+"px");
    $(".menuItem > .col-xs-6 > img").css("height",parseFloat(HRite * 116 ).toFixed(0)+"px");
    //$(".menuItem > .col-xs-6 > img").css("width",parseFloat(WRite * 116 ).toFixed(0)+"px");

    $(".menuItem > .col-xs-6").css("width",parseFloat(WRite * (658/2.0)).toFixed(0)+"px");

    $(".menuItem.areaH > img").css("height",parseFloat(HRite * 272 ).toFixed(0)+"px");
    $(".menuItem").css("margin-bottom",parseFloat(HRite * 16 ).toFixed(0)+"px");

    $(".areaH").css("height",parseFloat(HRite * 272 ).toFixed(0)+"px");
    $(".footbar").css("height",parseFloat(HRite * 99 ).toFixed(0)+"px");
    $(".footBtn").css("width",parseFloat(WRite * 170 ).toFixed(0)+"px");
    $(".footBtn > img").css("width",parseFloat(WRite * 170 ).toFixed(0)+"px");
    $(".footInput").css("width",parseFloat(WRite * 600 ).toFixed(0)+"px");
    $(".footInput > textarea").css("font-size",parseFloat(WRite * (50-7) ).toFixed(0)+"px");

    $(".footBtn").css("margin-left",parseFloat(WRite * 16 ).toFixed(0)+"px");
    $(".footBtn").css("margin-top",parseFloat(WRite * 7 ).toFixed(0)+"px");
    $(".footBtn").css("margin-right",parseFloat(WRite * 5 ).toFixed(0)+"px");
    $(".footBtn").css("padding-right",parseFloat(WRite * 15 ).toFixed(0)+"px");
    $(".footBtn").css("padding-left",parseFloat(WRite * 15 ).toFixed(0)+"px");

    $("#callbtn").css("width",parseFloat(WRite * 135 ).toFixed(0)+"px");
    $("#callbtn > img").css("width",parseFloat(WRite * 135 ).toFixed(0)+"px");
    $("#callbtn > img").css("height",parseFloat(HRite * (99 - 14)).toFixed(0)+"px");
    $("#callbtn").css("margin-left","0px");
    $("#callbtn").css("margin-right","0px");
    $("#callbtn").css("padding-right","0px");
    $("#callbtn").css("padding-left","0px");


    $(".mainArea").css("margin-left",parseFloat(WRite * 53 - 15 ).toFixed(0)+"px");
    $(".menuItem.areaH > .col-xs-4.left").css("margin-right",parseFloat(WRite * 3 ).toFixed(0)+"px");
    $(".menuItem.areaH > .col-xs-4.right").css("margin-left",parseFloat(WRite * 3 ).toFixed(0)+"px");
    $(".mainArea").css("margin-top",parseFloat(HRite * 20 ).toFixed(0)+"px");

    $(".mainMenu").css("width",parseFloat(WRite * 660 ).toFixed(0)+"px");
    $("#welcome").css("height",parseFloat(HRite * (800-20-99) ).toFixed(0)+"px");
    $("#welcome").css("font-size",parseFloat(HRite * 50 ).toFixed(0)+"px");
    $("#clientInfo").css("font-size",parseFloat(HRite * 50-7 ).toFixed(0)+"px");
    $(".clientInfoBox").css("width",parseFloat(WRite * 120 ).toFixed(0)+"px");
    $(".highlightBox").css("margin-left",parseFloat(WRite * 40 ).toFixed(0)+"px");



    console.log("fitScreen "+WHeight+" "+WWeith);
}
fitScreen();
$( window ).resize(function() {
    fitScreen();
});