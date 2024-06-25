/* header 햄버거 메뉴 */
document.addEventListener("DOMContentLoaded", function () {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const menu = document.getElementById('menu');

  hamburgerMenu.addEventListener('click', function () {
    menu.classList.toggle('active');
    hamburgerMenu.classList.toggle('active');
  });
});

/* business 드래그 슬라이드(모바일) */
var isDragging = false;
var startX;
var scrollLeft;
var mx = 0;

function handleMouseMove(e) {
  if (!isDragging) return;
  var mx2 = e.pageX - this.offsetLeft;
  this.scrollLeft = this.sx + mx - mx2;
}

function handleMouseDown(e) {
  isDragging = true;
  this.sx = this.scrollLeft;
  mx = e.pageX - this.offsetLeft;
  $(this).css("cursor", "grabbing");
}

function handleMouseUp() {
  isDragging = false;
  $(".business-img-slide").css("cursor", "grab");
}

function handleTouchMove(e) {
  if (!isDragging) return;
  var touch = e.touches[0];
  var mx2 = touch.pageX - this.offsetLeft;
  this.scrollLeft = this.sx + mx - mx2;
  e.preventDefault();
}

function handleTouchStart(e) {
  isDragging = true;
  var touch = e.touches[0];
  this.sx = this.scrollLeft;
  mx = touch.pageX - this.offsetLeft;
  $(this).css("cursor", "grabbing");
}

function handleTouchEnd() {
  isDragging = false;
  $(".business-img-slide").css("cursor", "grab");
}

$(document).ready(function () {
  var slider = document.querySelector('.business-img-slide');

  slider.addEventListener('mousemove', handleMouseMove);
  slider.addEventListener('mousedown', handleMouseDown);
  slider.addEventListener('mouseup', handleMouseUp);
  slider.addEventListener('mouseleave', handleMouseUp);

  slider.addEventListener('touchmove', handleTouchMove, { passive: false });
  slider.addEventListener('touchstart', handleTouchStart, { passive: false });
  slider.addEventListener('touchend', handleTouchEnd);
});

$(document).on("mouseup touchend", function () {
  isDragging = false;
  $(".business-img-slide").css("cursor", "grab");
});

/* business 버튼 슬라이드(PC) */
$(document).ready(function () {
  var currentTranslateX = 0;
  var slideWidth = 380;
  var maxSlides = $('.business-img-wrapper').length;
  var maxTranslateX = -(slideWidth * (maxSlides - 1));

  $('.arrow-left').on('click', function (e) {
    e.preventDefault();
    if (currentTranslateX < 0) {
      currentTranslateX += slideWidth;
      $('.business-img-slide').css('transform', 'translateX(' + currentTranslateX + 'px)');
    }
  });

  $('.arrow-right').on('click', function (e) {
    e.preventDefault();
    if (currentTranslateX > maxTranslateX) {
      currentTranslateX -= slideWidth;
      $('.business-img-slide').css('transform', 'translateX(' + currentTranslateX + 'px)');
    }
  });
});

/* flavor 버튼 슬라이드(PC) */
$(function () {

  var s1 = $('#slider').sliderRotate({ displayItems: 5 });
  var s2 = $('#slider-2').sliderRotate({ autoSlide: true });

});

(function ($, window, document, undefined) {

  "use strict";

  var pluginName = "sliderRotate",
    dataKey = "plugin_" + pluginName;

  var SliderRotate = function (element, options) {

    this.plugin_element = $(element);
    this.itemClass;
    this.arrowClass;
    this.$item;
    this.$arrow;
    this.$sliderContainer;
    this.numItens;
    this.indexActive;
    this.displayItens;
    this.autoSlide;
    this.slider_timer;
    this.time;

    this.PREV_CLASS = "slider-rotate__item--prev";
    this.PREV2_CLASS = "slider-rotate__item--prev-2";
    this.NEXT_CLASS = "slider-rotate__item--next";
    this.NEXT2_CLASS = "slider-rotate__item--next-2";
    this.ACTIVE_CLASS = "slider-rotate__item--active";

    this.CLASS_DISPLAY_3 = "slider-rotate--3";
    this.CLASS_DISPLAY_5 = "slider-rotate--5";

    this.DISPLAY_3 = 3;
    this.DISPLAY_5 = 5;

    this.SLIDER_CONTAINER = "slider-rotate__container";

    this.options = {
      time: 4,
      autoSlide: false,
      displayItems: 3,
      activate: function () { }
    };

    this.init(options);

  };

  SliderRotate.prototype = {
    init: function (options) {

      _init(options, this);

    },
    destroy: function () {
      this.plugin_element.unbind().removeData();
      $('*', this.plugin_element).unbind().removeData();
      this.$sliderContainer.unbind('mouseenter.slider');
      this.$sliderContainer.unbind('mouseleave.slider');
      _pauseSlide(this); //remove timer
    }
  };

  function _init(__options__, __this__) {

    var opts = __this__.options;
    $.extend(opts, __options__);
    opts.activate.call(__this__);

    __this__.displayItens = (opts.displayItems == 3 || opts.displayItems == 5) ? opts.displayItems : __this__.DISPLAY_3;
    __this__.itemClass = opts.itemClass || 'slider-rotate__item';
    __this__.arrowClass = opts.arrowClass || 'js-slider-rotate-arrow';
    __this__.$item = __this__.plugin_element.find('.' + __this__.itemClass);
    __this__.$arrow = __this__.plugin_element.find('.' + __this__.arrowClass);
    __this__.numItens = __this__.$item.length;
    __this__.indexActive = 0;
    __this__.$sliderContainer = $("." + __this__.SLIDER_CONTAINER);
    __this__.autoSlide = opts.autoSlide;
    __this__.time = opts.time;

    __this__.plugin_element.addClass((__this__.displayItens == __this__.DISPLAY_3) ? __this__.CLASS_DISPLAY_3 : __this__.CLASS_DISPLAY_5);

    _moveSlide(__this__.indexActive, __this__);

    setTimeout(function () {
      __this__.$sliderContainer.css("visibility", "visible");
    }, 400);

    __this__.$item.on('click.rotate', function () {

      if ($(this).hasClass(__this__.ACTIVE_CLASS)) return false;

      _moveSlide($(this).index(), __this__);

      return false;
    });

    __this__.$arrow.on('click.rotate', function () {

      var _action = $(this).data('action');

      if (_action == 'next') {

        _moveNext(__this__);

      } else if (_action == 'prev') {

        _movePrev(__this__);

      }

    });

    if (__this__.autoSlide) {
      _autoSlide(__this__);
    }
  }

  function _autoSlide(__this__) {
    _pauseSlide(__this__);

    var _miliseconds = Number(__this__.time) * 1000;
    __this__.slider_timer = setTimeout(function () {
      _moveNext(__this__);
    }, _miliseconds);

    __this__.$sliderContainer.unbind('mouseenter.slider').on('mouseenter.slider', function () {
      _pauseSlide(__this__);
    });

    __this__.$sliderContainer.unbind('mouseleave.slider').on('mouseleave.slider', function () {
      _autoSlide(__this__);
    });

  }

  function _pauseSlide(__this__) {
    clearTimeout(__this__.slider_timer);
  }

  function _moveNext(__this__) {

    var _index = (__this__.indexActive == __this__.numItens - 1) ? 0 : (__this__.indexActive + 1);

    _moveSlide(_index, __this__);

  }

  function _movePrev(__this__) {

    var _index = (__this__.indexActive == 0) ? (__this__.numItens - 1) : (__this__.indexActive - 1);

    _moveSlide(_index, __this__);

  }

  function _moveSlide(__index__, __this__) {

    __this__.indexActive = __index__;

    __this__.plugin_element.find('.' + __this__.ACTIVE_CLASS).removeClass(__this__.ACTIVE_CLASS);
    __this__.plugin_element.find('.' + __this__.NEXT_CLASS).removeClass(__this__.NEXT_CLASS);
    __this__.plugin_element.find('.' + __this__.PREV_CLASS).removeClass(__this__.PREV_CLASS);
    __this__.plugin_element.find('.' + __this__.PREV2_CLASS).removeClass(__this__.PREV2_CLASS);
    __this__.plugin_element.find('.' + __this__.NEXT2_CLASS).removeClass(__this__.NEXT2_CLASS);

    if (__index__ == __this__.numItens - 1) {

      __this__.$item.eq(0).addClass(__this__.NEXT_CLASS);

      if (__this__.displayItens == __this__.DISPLAY_5) {
        __this__.$item.eq(1).addClass(__this__.NEXT2_CLASS);
      }

    }

    if (__index__ == 0) {

      __this__.$item.eq(__this__.numItens - 1).addClass(__this__.PREV_CLASS);

      if (__this__.displayItens == __this__.DISPLAY_5) {
        __this__.$item.eq(__this__.numItens - 2).addClass(__this__.PREV2_CLASS);
      }

    }

    __this__.$item.each(function (index) {

      if (index == __index__) {

        __this__.$item.eq(index).addClass(__this__.ACTIVE_CLASS);

      }

      if (index == __index__ + 1) {

        __this__.$item.eq(index).addClass(__this__.NEXT_CLASS);

      }

      if (index == __index__ - 1) {

        __this__.$item.eq(index).addClass(__this__.PREV_CLASS);

      }

      if (__this__.displayItens == __this__.DISPLAY_5) {

        if (index == __index__ + 2) {

          __this__.$item.eq(index).addClass(__this__.NEXT2_CLASS);

        }

        if (__index__ == (__this__.numItens - 2)) {
          __this__.$item.eq(0).addClass(__this__.NEXT2_CLASS);
        }

        if ((__index__ - 2) == -1) {
          __this__.$item.eq(__this__.numItens - 1).addClass(__this__.PREV2_CLASS);
        }

        if (index == __index__ - 2) {
          __this__.$item.eq(index).addClass(__this__.PREV2_CLASS);
        }

      }

      if (__this__.autoSlide) {
        _autoSlide(__this__);
      }

    });

  }


  $.fn[pluginName] = function (options) {

    var plugin = this.data(dataKey);

    if (plugin instanceof SliderRotate) {
      if (typeof options !== 'undefined') {
        plugin.init(options);
      }
    } else {
      plugin = new SliderRotate(this, options);
      this.data(dataKey, plugin);
    }

    return plugin;
  };

}(jQuery, window, document));


/* flavor 드래그 슬라이드(모바일) */
var isDragging = false;
var startX;
var scrollLeft;

function handleMouseMove(e) {
  if (!isDragging) return;
  e.preventDefault();
  var x = e.pageX - this.offsetLeft;
  var walk = (x - startX) * 1;
  this.scrollLeft = scrollLeft - walk;
}

function handleMouseDown(e) {
  isDragging = true;
  startX = e.pageX - this.offsetLeft;
  scrollLeft = this.scrollLeft;
  this.style.cursor = "grabbing";
}

function handleMouseUp() {
  isDragging = false;
  document.querySelector('.slider-rotate').style.cursor = "grab";
}

function handleTouchMove(e) {
  if (!isDragging) return;
  var touch = e.touches[0];
  var x = touch.pageX - this.offsetLeft;
  var walk = (x - startX) * 1;
  this.scrollLeft = scrollLeft - walk;
}

function handleTouchStart(e) {
  isDragging = true;
  var touch = e.touches[0];
  startX = touch.pageX - this.offsetLeft;
  scrollLeft = this.scrollLeft;
  this.style.cursor = "grabbing";
}

function handleTouchEnd() {
  isDragging = false;
  document.querySelector('.slider-rotate').style.cursor = "grab";
}

$(document).ready(function () {
  var slider = document.querySelector('.slider-rotate');

  slider.addEventListener('mousemove', handleMouseMove);
  slider.addEventListener('mousedown', handleMouseDown);
  slider.addEventListener('mouseup', handleMouseUp);
  slider.addEventListener('mouseleave', handleMouseUp);

  slider.addEventListener('touchmove', handleTouchMove, { passive: false });
  slider.addEventListener('touchstart', handleTouchStart, { passive: false });
  slider.addEventListener('touchend', handleTouchEnd);
});

$(document).on("mouseup touchend", function () {
  isDragging = false;
});