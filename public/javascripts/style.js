

$(document).ready(function () {


var windowWidth = window.innerWidth;
var navHt = $('#navbar1').height();
var bodyHt = $('body').height();


$('#myCarousel').carousel
    ({
        interval: 5000,


    });

var ht = bodyHt-navHt;

$(".img1").css('height',ht);
$(".img1").css('width',windowWidth);


});
