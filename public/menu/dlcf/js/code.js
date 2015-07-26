var initPage = function(){
    var Menu = {};
    Menu.mainMenu = $("#mainMenu");
    Menu.notificationPanel = $("#notificationPanel");
    Menu.menuPanel   = $("#MenuPanel ");
    Menu.orderPanel = $("#orderPanel");
    Menu.confirmAlert = $("#confirmAlert");
    Menu.toolBar = $("#toolBar");
    
    console.log("inited page!");

    var showPanel = function(panels){
        for(var i in Menu)
            Menu[i].hide();
        
        for(var n in panels)
            Menu[panels[n]].show();
            
    }
    
    var gotoTopMenu = function(){
        showPanel(["mainMenu","toolBar"]);
    };
    
    gotoTopMenu();
    
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
    
    //--------
    $("#qcBtn").click(function(){
        console.log("qcBtn clicked");
        showPanel(["menuPanel","toolBar"]);
    });
    
    $("#hxBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
    });
    
    $("#hcBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
    });
    
    $("#rouBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
        });

    
    $("#tdBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
        });

    
    $("#zsBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
    });

    $("#drinkBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
       });

    $("#qcBtn").click(function(){
        showPanel(["menuPanel","toolBar"]);
     });

    $(".countlabelbtn.div").click(function(){
        var num = $(this).parent().find("dt")[0];
        $(num).text(""+((parseInt($(num).text())-1) >= 0 ? (parseInt($(num).text())-1):0));
        console.log("div ");
    });
    
    $(".countlabelbtn.plus").click(function(){
        var num = $(this).parent().find("dt")[0];
        $(num).text(""+((parseInt($(num).text())+1) <= 9 ? (parseInt($(num).text())+1):9));
        console.log("plus ");
    });
    
}

window.onload = initPage;