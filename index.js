/* header 햄버거 메뉴 */
document.addEventListener("DOMContentLoaded", function() {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const menu = document.getElementById('menu');

  hamburgerMenu.addEventListener('click', function() {
    menu.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
  });
});

/* business 드래그 슬라이드(모바일) */
var mx = 0;

$(".business-img-slide").on({
  mousemove: function (e) {
    var mx2 = e.pageX - this.offsetLeft;
    if (mx) this.scrollLeft = this.sx + mx - mx2;
  },
  mousedown: function (e) {
    this.sx = this.scrollLeft;
    mx = e.pageX - this.offsetLeft;
  }
});

$(document).on("mouseup", function () {
  mx = 0;
});

/* business 버튼 슬라이드(PC) */
$(document).ready(function() {
  var currentTranslateX = 0;
  var slideWidth = 380;
  var maxSlides = $('.business-img-wrapper').length;
  var maxTranslateX = -(slideWidth * (maxSlides - 1));

  $('.arrow-left').on('click', function(e) {
    e.preventDefault();
    if (currentTranslateX < 0) {
      currentTranslateX += slideWidth;
      $('.business-img-slide').css('transform', 'translateX(' + currentTranslateX + 'px)');
    }
  });

  $('.arrow-right').on('click', function(e) {
    e.preventDefault();
    if (currentTranslateX > maxTranslateX) {
      currentTranslateX -= slideWidth;
      $('.business-img-slide').css('transform', 'translateX(' + currentTranslateX + 'px)');
    }
  });
});