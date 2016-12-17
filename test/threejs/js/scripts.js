$(document).ready( function() {
    
    Pace.on('done', function(){
        $("#blackScreen").hide();
    });

    var topTen;
    $.ajax({url: "https://script.google.com/macros/s/AKfycbzPxn0GgPN5gVYi9h8yk6nejt2q3qtu12_C2UtfjmhVh2RjmDXS/exec", success: function(result){
        topTen = result.topTen;
        //console.log(topTen)
        //globalTopScore = 0;
        elements = "<tr>";
        for(i=0 ; i<topTen.length ; i++){
            elements += "<tr><td>"+(i+1)+"</td><td>"+topTen[i]['id']+"</td><td>"+topTen[i]['score']+"</td><td>"+topTen[i]['difficulty']+"</td></tr>";
            if(topTen[i]['score'] > globalTopScore){
                globalTopScore = topTen[i]['score'];
            }
        }
        elements += "</tr>";
        $("#leaderboardBody").append(elements);
        console.log(globalTopScore);
    }});
    
    
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
    //Leaderboard button click event
    $("#leaderboardBtn").click(function(){
        $("#UI1").fadeOut(function(){
            $("#leaderboard").fadeIn();
        });
    });
    //Leaderboard back button click event
    $("#leaderboardBackBtn").click(function(){
        $("#leaderboard").fadeOut(function(){
            $("#UI1").fadeIn();
        });
    });
    //Game start button event
    $("#gameStartBtn").click(function(){
        if($("#nameInput").val() != ''){
            playerName = $("#nameInput").val();
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
                        difficultyText = "Easy";
                        break;
                    case 1:
                        ambientLight.intensity = 0.5;
                        stoneZIncreaseMin = 3;
                        stoneZIncreaseMax = 5;
                        difficultyText = "Average";
                        break;
                    case 2:
                        ambientLight.intensity = 0.3;
                        stoneZIncreaseMin = 3;
                        stoneZIncreaseMax = 7;
                        difficultyText = "Hard";
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
