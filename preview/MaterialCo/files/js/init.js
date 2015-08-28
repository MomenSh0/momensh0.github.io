(function($){
  $(function(){

$('.button-collapse').sideNav();
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

// Plugins //

// Remove the loading overlay
$('.loading').remove();

// Flex slider
//create the slider
$('.cd-testimonials-wrapper').flexslider({
    selector: ".cd-testimonials > li",
    animation: "slide",
    controlNav: false,
    slideshow: true,
    smoothHeight: true,
    start: function() {
        $('.cd-testimonials').children('li').css({
            'opacity': 1,
            'position': 'relative'
        });
    }
});

//open the testimonials modal page
$('.cd-see-all').on('click', function() {
    $('.cd-testimonials-all').addClass('is-visible');
});

//close the testimonials modal page
$('.cd-testimonials-all .close-btn').on('click', function() {
    $('.cd-testimonials-all').removeClass('is-visible');
});
$(document).keyup(function(event) {
    //check if user has pressed 'Esc'
    if (event.which == '27') {
        $('.cd-testimonials-all').removeClass('is-visible');
    }
});

// Waypoints
var waypoint = new Waypoint({
    element: $('#about'),
    handler: function() {
        $('.services-container').addClass('animated zoomIn');
    }
})
var waypoint = new Waypoint({
    element: $('#services'),
    handler: function() {
        $('.news-item').addClass('animated fadeInUp');
    }
})
var waypoint = new Waypoint({
    element: $('#customers'),
    handler: function() {
        $('.contact-form').addClass('animated zoomInUp');
    }
})

// Back to top button
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
