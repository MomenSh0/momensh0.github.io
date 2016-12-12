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
            $(".blaster").show();
            $("#gameStartUI").fadeOut("slow",function(){
                d = parseInt($('input[name=difficulty]:checked').val());                
                difficulty = d;
                switch (difficulty) {
                    case 0:
                        ambientLight.intensity = 0.8;
                        stoneZIncreaseMin = 3;
                        stoneZIncreaseMax = 3;
                        break;
                    case 1:
                        ambientLight.intensity = 0.5;
                        stoneZIncreaseMin = 3;
                        stoneZIncreaseMax = 5;
                        break;
                    case 2:
                        ambientLight.intensity = 0.3;
                        stoneZIncreaseMin = 3;
                        stoneZIncreaseMax = 7;
                        break;
                }
                gameStarted = true;
                music.play();
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
