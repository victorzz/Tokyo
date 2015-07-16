/**
 * Created by zhang on 15/6/14.
 */

$(".adminpage").click(function(){
    $(this).attr("page");
    var data = {
        cmd:"switchPage",
        page:$(this).attr("page")
    }

    reqData(data,function(){
        location.reload();
    });
});

