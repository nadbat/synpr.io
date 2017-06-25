$(document).on('ready', function () {
    if (!$('.j-gallery').length) {
        return;
    } else {
        $('.j-gallery').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            infinite: false,
            prevArrow: '<span class="partners__arrow-left"></span>',
            nextArrow: '<span class="partners__arrow-right">></span>',
            mobileFirst: true,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        arrows: true,
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        arrows: true,
                        slidesToShow: 3
                    }
                }
            ]
        });
    }

});


$('.j-docs-tab').each(function () {
    $(this).on('click', function () {
        $(this).find('.b-docs__sublist').slideToggle();
    });
});


$('.j-content-tab').each(function () {
    $(this).on('click', function () {
        $(this).find('.b-content__sublist').slideToggle();
        $(this).find('.b-content__arrow').toggleClass('is-active');
    });
});

(function ($tabs) {
    if (!$tabs.length) {
        return;
    }
    var $link = $tabs; //ссылка
    var $tab = $('.b-content__list'); //контент

    $link.on('click', function (e) {
        var $self = $(this);
        var index = $self.index();
        e.preventDefault();
        if (!$self.hasClass('is-active')) {
            $link.removeClass('is-active');
            $self.addClass('is-active');
            $tab.hide();
            $tab.eq(index).fadeIn();
        }
    });
})($('.j-tabs'));

$(document).on('ready', function () {
    (function ($descriptionTabs) {
        if (!$descriptionTabs.length) {
            return;
        }
        var $link = $descriptionTabs; //ссылка
        var $tab = $('.description-content'); //контент

        $link.on('click', function (e) {
            var $self = $(this);
            var index = $self.index();
            e.preventDefault();
            if (!$self.hasClass('is-active')) {
                $link.removeClass('is-active');
                $self.addClass('is-active');
                $tab.hide();
                $tab.eq(index).fadeIn();
            }
        });
    })($('.j-description-tab'));
})


$(document).on('ready', function () {
    (function ($descriptionTabs) {
        if (!$descriptionTabs.length) {
            return;
        }
        var $link = $descriptionTabs; //ссылка
        var $tab = $('.devices-content'); //контент

        $link.on('click', function (e) {
            var $self = $(this);
            var index = $self.index();
            e.preventDefault();
            if (!$self.hasClass('is-active')) {
                $link.removeClass('is-active');
                $self.addClass('is-active');
                $tab.hide();
                $tab.eq(index).fadeIn();
            }
        });
    })($('.j-devices-tab'));
})

$(document).on('ready', function () {
    (function ($svgHouse) {
        if (!$svgHouse.length) {
            return;
        }

        //убираем active класс со всех иконок
        function removeActive() {
            iconWrap.forEach(function (item) {
                item.classList.remove('is-active');
            });
        }

        //логика текстовых блоков

        var svg = document.querySelector('#houseset');
        var iconWrap = svg.querySelectorAll('.icon-wrap');
        if (window.matchMedia('(min-width: 1280px)').matches) {
            iconWrap.forEach(function (item) {
                item.addEventListener('mousemove', function () {
                    removeActive();
                    this.classList.add('is-active');
                    var iconId = this.getAttribute('id');
                    var textBlock = document.querySelectorAll('.j-smart-text');
                    textBlock.forEach(function (item) {
                        item.classList.remove('is-active');
                        var textId = item.getAttribute('data-id');
                        if (iconId === textId) {
                            item.classList.add('is-active');
                        }
                    });
                });
            });
        } else {
            iconWrap.forEach(function (item) {
                item.addEventListener('click', function () {
                    removeActive();
                    this.classList.add('is-active');
                    var iconId = this.getAttribute('id');
                    var textBlock = document.querySelectorAll('.j-smart-text');
                    textBlock.forEach(function (item) {
                        item.classList.remove('is-active');
                        var textId = item.getAttribute('data-id');
                        if (iconId === textId) {
                            item.classList.add('is-active');
                        }
                    });
                });
            });
        }

    })($('.j-svg-house'));
});

(function($burger) {
    if (!$burger.length) {
        return;
    }

    $burger.on('click', function() {
        $('.j-mobile-menu').toggleClass('is-active');
        console.log('test');
    });
})($('.j-burger'))