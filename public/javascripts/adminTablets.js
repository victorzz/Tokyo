/**
 * Created by zhang on 15/6/14.
 */

var doRequst = function(cmd,clientId,listId){

    var data = {cmd:cmd,clientId:clientId,listId:listId};

    reqData(data,function(data){
        if(data.done){
            $("#"+clientId).html(data.html);
            $.notify(data.msg, "success");
            initTabletListFuns();
        }else{
            $.notify(data.msg, "error");
        }
    });

};

var doRequstForClick = function(whatbtn){
    $("."+whatbtn).unbind( "click" );
    $("."+whatbtn).click(function(){
        doRequst(whatbtn,$(this).attr("clientId"),$($("#"+$(this).attr("clientId"))[0]).children("td.listId").text());
    });
}

var initTabletListFuns = function(){
    doRequstForClick("tabletRegister");
    doRequstForClick("tabletOff");
    doRequstForClick("tabletOn");
    doRequstForClick("tabletStop");
    doRequstForClick("tabletDel");
    doRequstForClick("tabletEnable");
};

initTabletListFuns();