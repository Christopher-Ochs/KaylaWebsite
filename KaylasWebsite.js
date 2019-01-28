$(function() {
    $(document.body).fadeIn(2000);
    var remove =$('#remove');
    var menu = $('nav ul');
    var prev = 0;
    var w = $(window).width();
    var h = $(window).height();
    var $window = $(window);
    var iScrollPos = 0;

    // Only want to happen in mobile
    if(w < 490 || h < 490) {
        $(window).scroll(function () {
            var iCurScrollPos = $(this).scrollTop();
            // Scrolling down
            if (iCurScrollPos - iScrollPos > 25) {
                $('#pull').slideUp();
            }
            // Scrolling up
            else if ((iCurScrollPos - iScrollPos) < -25) {
                $('#pull').slideDown();
            }
            iScrollPos = iCurScrollPos;
        });
    }

    $('#pull').on('click', function(e) {
        e.preventDefault();
        menu.slideToggle();
    });

    $('.remove').on('click', function(d) {
        if(w < 490 || h < 490){
            if (this.hash !== "") {
                var hash = this.hash;
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function(){
                    window.location.hash = hash;
                    menu.slideUp();
                });
            }
        } // End if
        else {
            if (this.hash !== "") {
                d.preventDefault();
                var hash = this.hash;
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function(){
                    window.location.hash = hash;
                });
            }
        } // End if
    });

    // Append available date to end of link in services
    var availableDAte = getNextDates();
    var aLink = document.getElementById('servicesLinks').getElementsByTagName('a');
    var aLength = aLink.length;
    var providerID = '/provider/580163';

    for( var i = 0; i < aLength; i++) {
        aLink[i].href += (availableDAte + providerID);
    }



    $(window).resize(function(){
        var w = $(window).width();
        if(w > 320 && menu.is(':hidden')) {
            menu.removeAttr('style');
        }
    });
});

// gets month in two digit string
function getTwoDigitMonth(date) {
    var month = date.getMonth();
    month += 1 ;
    if (month < 10) {
        var monthString = month.toString();
        return '0' + monthString;
    }
    return month.toString();
}

// function to return date of next wednesday, thursday, or saturday
// testing hyper link = https://go.booker.com/#/location/SalonLA/service/2331430/Womens%20Haircut/availability/2018-03-21/provider/580163
function getNextDates() {
    var validDays = [3, 4, 5, 6];
    var date = new Date();
    var today = date.getDay();
    var year = (date.getFullYear()).toString();
    var month = getTwoDigitMonth(date);
    var dateOfMonth = (date.getDate().toString());
    var returnDate = year + '-' + month + '-' + dateOfMonth;
    // Simply return today's date
    if (validDays.indexOf(today) !== -1) {
        return returnDate;
    }
    else if(today === 0 || today === 1 || today === 2){
        date.setDate(date.getDate()+(3-today));
        year = (date.getFullYear()).toString();
        month = getTwoDigitMonth(date);
        dateOfMonth = (date.getDate().toString());
        returnDate = year + '-' + month + '-' + dateOfMonth;
        return returnDate;
    }
    else {
        date.setDate(date.getDate() + 1);
        year = (date.getFullYear()).toString();
        month = getTwoDigitMonth(date);
        dateOfMonth = (date.getDate().toString());
        returnDate = year + '-' + month + '-' + dateOfMonth;
        return returnDate;
    }
}

function initMap() {
    var uluru = {lat: 39.146181, lng: -84.448497};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        scrollwheel: false,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        animation: google.maps.Animation.DROP,
        position: uluru
    });
}

function validEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function validateHuman(honeypot) {
    if (honeypot) {  //if hidden form filled up
        console.log("Robot Detected!");
        return true;
    } else {
        console.log("Welcome Human!");
    }
}

// get all data in form and return object
function getFormData() {
    var form = document.getElementById("gform");
    var elements = form.elements; // all form elements
    var fields = Object.keys(elements).map(function(k) {
        if(elements[k].name !== undefined) {
            return elements[k].name;
            // special case for Edge's html collection
        }else if(elements[k].length > 0){
            return elements[k].item(0).name;
        }
    }).filter(function(item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function(k){
        data[k] = elements[k].value;
        var str = "";
        if(elements[k].type === "checkbox"){
            str = str + elements[k].checked + ", ";
            data[k] = str.slice(0, -2);
        }else if(elements[k].length){
            for(var i = 0; i < elements[k].length; i++){
                if(elements[k].item(i).checked){
                    str = str + elements[k].item(i).value + ", "; // same as above
                    data[k] = str.slice(0, -2);
                }
            }
        }
    });

    // add form-specific values into the data
    data.formDataNameOrder = JSON.stringify(fields);
    data.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    data.formGoogleSendEmail = form.dataset.email || ""; // no email by default

    console.log(data);
    return data;
}

function handleFormSubmit(event) {
    event.preventDefault();
    var data = getFormData();

    if (validateHuman(data.honeypot)) {
      return false;
    }

    if( !validEmail(data.email) ) {
        document.getElementById('email-invalid').style.display = 'block';
        return false;
    } else {
        var url = event.target.action;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            console.log( xhr.status, xhr.statusText );
            console.log(xhr.responseText);
            document.getElementById('gform').style.display = 'none';
            document.getElementById('thankyou_message').style.display = 'block';
            return;
        };
        // url encode form data for sending as post data
        var encoded = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&')
        xhr.send(encoded);
    }
}
function loaded() {
    console.log('contact form submission handler loaded successfully');
    // bind to the submit event of our form
    var form = document.getElementById('gform');
    form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);
