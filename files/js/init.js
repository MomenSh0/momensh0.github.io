(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();
    $('.scrollspy').scrollSpy();

    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false // Displays dropdown below the button
      }
    );

// Skills progress
var an = 0;
$('#skills').waypoint(function() {
    //console.log('skills');
    $(function() {
        $('#skills_progress progress').each(function() {
            if (an < 6) {
                var max = $(this).val();
                $(this).val(0).animate({
                    value: max
                }, {
                    duration: 2000,
                    easing: 'easeOutCirc'
                });
                an++;
            }
        });
    });
});

// remove the loading overlay
$('.loading').remove();

// Go to top
/*Add class when scroll down*/
$(window).scroll(function(event) {
    var scroll = $(window).scrollTop();
    if (scroll >= 50) {
        $(".go-top").addClass("show");
    } else {
        $(".go-top").removeClass("show");
    }
});
/*Animation anchor*/
$('.go-top-top').click(function() {
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, 1000);
});

  }); // end of document ready
})(jQuery); // end of jQuery name space
