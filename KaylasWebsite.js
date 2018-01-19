$(function() {
  //var pull = $('#pull');
  var remove =$('#remove');
  var menu = $('nav ul');
  //menuHeight	= menu.height();

  $('#pull').on('click', function(e) {
    e.preventDefault();
    menu.slideToggle();
  });

  $('.remove').on('click', function(d) {
    //d.preventDefault();
    var w = $(window).width();
    if(w < 490){
      // Store hash
      if (this.hash !== "") {
        var hash = this.hash;
        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
          scrollTop: $(hash).offset().top
        }, 800, function(){
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
          menu.slideUp();
        });
      }
    } // End if
    else {
      if (this.hash !== "") {
        // Prevent default anchor click behavior
        d.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
          scrollTop: $(hash).offset().top
        }, 800, function(){
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        });
      }
    } // End if
  });

  $(window).resize(function(){
    var w = $(window).width();
    if(w > 320 && menu.is(':hidden')) {
      menu.removeAttr('style');
    }
  });
});
