$(document).ready( function() {
    //Start button click event
    $("#startBtn").click(function(){
        $("#UI1").fadeOut(function(){
            $("#UI2").fadeIn();
        });
    });
    //Back button click event
    $("#backBtn").click(function(){
        $("#UI2").fadeOut(function(){
            $("#UI1").fadeIn();
        });
    });
    //Game start button event
    $("#gameStartBtn").click(function(){
        if($("#nameInput").val() != ''){
            $(".scores").show();
            $(".bottomInstructions").show();
            $("#gameStartUI").fadeOut("slow",function(){
//                d = parseInt($('input[name=difficulty]:checked').val());
//                localStorage.setItem("d", d);
                gameStarted = true;
            });
        } else {
            $(".nameWarning").fadeIn();
        }
    });
    
    
    //Buttons hover sound effect
    $(".button").mouseover(function(){
        new Audio('audio/button_hover.mp3').play();
    });
});
