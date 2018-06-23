/**
 * Resize function without multiple trigger
 *
 * Usage:
 * $(window).smartresize(function(){
 *     // code here
 * });
 */
// global variables
var etheme;
(function ($, sr) {
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this, args = arguments;
            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize
    jQuery.fn[sr] = function (fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery, 'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');



// Sidebar
function init_sidebar() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function (ev) {
        console.log('clicked - sidebar_menu');
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function () {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            } else {
                if ($BODY.is(".nav-sm")) {
                    $SIDEBAR_MENU.find("li").removeClass("active active-sm");
                    $SIDEBAR_MENU.find("li ul").slideUp();
                }
            }
            $li.addClass('active');

            $('ul:first', $li).slideDown(function () {
                setContentHeight();
            });
        }
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function () {
        console.log('clicked - menu toggle');

        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();

        $('.dataTable').each(function () { $(this).dataTable().fnDraw(); });
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function () {
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: { preventDefault: true }
        });
    }
};
// /Sidebar

var randNum = function () {
    return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
};


// Panel toolbox
$(document).ready(function () {
    $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function () {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}
// /Progressbar

// Switchery
$(document).ready(function () {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery


// iCheck
$(document).ready(function () {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck

// Table
$('table input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}


//news btn
$(window).load(function () {
    $(".news-box").hide()
    $(".slide-toggle").click(function () {
        $('.slide-toggle').find('i').toggleClass('fa fa-caret-up').toggleClass('fa fa-caret-down');
        // $('.news-box').slideToggle('slow');
        $(".news-box").animate({
            height: 'toggle'
        });
    });
});


// Accordion
$(document).ready(function () {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}


//hover and retain popover when on popover content
var originalLeave = $.fn.popover.Constructor.prototype.leave;
$.fn.popover.Constructor.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
        obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
    var container, timeout;

    originalLeave.call(this, obj);

    if (obj.currentTarget) {
        container = $(obj.currentTarget).siblings('.popover');
        timeout = self.timeout;
        container.one('mouseenter', function () {
            //We entered the actual popover – call off the dogs
            clearTimeout(timeout);
            //Let's monitor popover content instead
            container.one('mouseleave', function () {
                $.fn.popover.Constructor.prototype.leave.call(self, self);
            });
        });
    }
};

$('body').popover({
    selector: '[data-popover]',
    trigger: 'click hover',
    delay: {
        show: 50,
        hide: 400
    }
});


function gd(year, month, day) {
    return new Date(year, month - 1, day).getTime();
}


function init_flot_chart() {

    if (typeof ($.plot) === 'undefined') { return; }

    console.log('init_flot_chart');



    var arr_data1 = [
        [gd(2012, 1, 1), 17],
        [gd(2012, 1, 2), 74],
        [gd(2012, 1, 3), 6],
        [gd(2012, 1, 4), 39],
        [gd(2012, 1, 5), 20],
        [gd(2012, 1, 6), 85],
        [gd(2012, 1, 7), 7]
    ];

    var arr_data2 = [
        [gd(2012, 1, 1), 82],
        [gd(2012, 1, 2), 23],
        [gd(2012, 1, 3), 66],
        [gd(2012, 1, 4), 9],
        [gd(2012, 1, 5), 119],
        [gd(2012, 1, 6), 6],
        [gd(2012, 1, 7), 9]
    ];

    var arr_data3 = [
        [0, 1],
        [1, 9],
        [2, 6],
        [3, 10],
        [4, 5],
        [5, 17],
        [6, 6],
        [7, 10],
        [8, 7],
        [9, 11],
        [10, 35],
        [11, 9],
        [12, 12],
        [13, 5],
        [14, 3],
        [15, 4],
        [16, 9]
    ];

    var chart_plot_02_data = [];

    var chart_plot_03_data = [
        [0, 1],
        [1, 9],
        [2, 6],
        [3, 10],
        [4, 5],
        [5, 17],
        [6, 6],
        [7, 10],
        [8, 7],
        [9, 11],
        [10, 35],
        [11, 9],
        [12, 12],
        [13, 5],
        [14, 3],
        [15, 4],
        [16, 9]
    ];


    for (var i = 0; i < 30; i++) {
        chart_plot_02_data.push([new Date(Date.today().add(i).days()).getTime(), randNum() + i + i + 10]);
    }


    var chart_plot_01_settings = {
        series: {
            lines: {
                show: false,
                fill: true
            },
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.4
            },
            points: {
                radius: 0,
                show: true
            },
            shadowSize: 2
        },
        grid: {
            verticalLines: true,
            hoverable: true,
            clickable: true,
            tickColor: "#d5d5d5",
            borderWidth: 1,
            color: '#fff'
        },
        colors: ["rgba(38, 185, 154, 0.38)", "rgba(3, 88, 106, 0.38)"],
        xaxis: {
            tickColor: "rgba(51, 51, 51, 0.06)",
            mode: "time",
            tickSize: [1, "day"],
            //tickLength: 10,
            axisLabel: "Date",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10
        },
        yaxis: {
            ticks: 8,
            tickColor: "rgba(51, 51, 51, 0.06)",
        },
        tooltip: false
    }

    var chart_plot_02_settings = {
        grid: {
            show: true,
            aboveData: true,
            color: "#3f3f3f",
            labelMargin: 10,
            axisMargin: 0,
            borderWidth: 0,
            borderColor: null,
            minBorderMargin: 5,
            clickable: true,
            hoverable: true,
            autoHighlight: true,
            mouseActiveRadius: 100
        },
        series: {
            lines: {
                show: true,
                fill: true,
                lineWidth: 2,
                steps: false
            },
            points: {
                show: true,
                radius: 4.5,
                symbol: "circle",
                lineWidth: 3.0
            }
        },
        legend: {
            position: "ne",
            margin: [0, -25],
            noColumns: 0,
            labelBoxBorderColor: null,
            labelFormatter: function (label, series) {
                return label + '&nbsp;&nbsp;';
            },
            width: 40,
            height: 1
        },
        colors: ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'],
        shadowSize: 0,
        tooltip: true,
        tooltipOpts: {
            content: "%s: %y.0",
            xDateFormat: "%d/%m",
            shifts: {
                x: -30,
                y: -50
            },
            defaultTheme: false
        },
        yaxis: {
            min: 0
        },
        xaxis: {
            mode: "time",
            minTickSize: [1, "day"],
            timeformat: "%d/%m/%y",
            min: chart_plot_02_data[0][0],
            max: chart_plot_02_data[20][0]
        }
    };

    var chart_plot_03_settings = {
        series: {
            curvedLines: {
                apply: true,
                active: true,
                monotonicFit: true
            }
        },
        colors: ["#26B99A"],
        grid: {
            borderWidth: {
                top: 0,
                right: 0,
                bottom: 1,
                left: 1
            },
            borderColor: {
                bottom: "#7F8790",
                left: "#7F8790"
            }
        }
    };


    if ($("#chart_plot_01").length) {
        console.log('Plot1');

        $.plot($("#chart_plot_01"), [arr_data1, arr_data2], chart_plot_01_settings);
    }


    if ($("#chart_plot_02").length) {
        console.log('Plot2');

        $.plot($("#chart_plot_02"),
            [{
                label: "Email Sent",
                data: chart_plot_02_data,
                lines: {
                    fillColor: "rgba(150, 202, 89, 0.12)"
                },
                points: {
                    fillColor: "#fff"
                }
            }], chart_plot_02_settings);

    }

    if ($("#chart_plot_03").length) {
        console.log('Plot3');


        $.plot($("#chart_plot_03"), [{
            label: "Registrations",
            data: chart_plot_03_data,
            lines: {
                fillColor: "rgba(150, 202, 89, 0.12)"
            },
            points: {
                fillColor: "#fff"
            }
        }], chart_plot_03_settings);

    };

}


/* STARRR */

function init_starrr() {

    if (typeof (starrr) === 'undefined') { return; }
    console.log('init_starrr');

    $(".stars").starrr();

    $('.stars-existing').starrr({
        rating: 4
    });

    $('.stars').on('starrr:change', function (e, value) {
        $('.stars-count').html(value);
    });

    $('.stars-existing').on('starrr:change', function (e, value) {
        $('.stars-count-existing').html(value);
    });

};


function init_JQVmap() {

    //console.log('check init_JQVmap [' + typeof (VectorCanvas) + '][' + typeof (jQuery.fn.vectorMap) + ']' );

    if (typeof (jQuery.fn.vectorMap) === 'undefined') { return; }

    console.log('init_JQVmap');

    if ($('#world-map-gdp').length) {

        $('#world-map-gdp').vectorMap({
            map: 'world_en',
            backgroundColor: null,
            color: '#ffffff',
            hoverOpacity: 0.7,
            selectedColor: '#666666',
            enableZoom: true,
            showTooltip: true,
            values: sample_data,
            scaleColors: ['#E6F2F0', '#149B7E'],
            normalizeFunction: 'polynomial'
        });

    }

    if ($('#usa_map').length) {

        $('#usa_map').vectorMap({
            map: 'usa_en',
            backgroundColor: null,
            color: '#ffffff',
            hoverOpacity: 0.7,
            selectedColor: '#666666',
            enableZoom: true,
            showTooltip: true,
            values: sample_data,
            scaleColors: ['#E6F2F0', '#149B7E'],
            normalizeFunction: 'polynomial'
        });

    }

};


function init_skycons() {

    if (typeof (Skycons) === 'undefined') { return; }
    console.log('init_skycons');

    var icons = new Skycons({
        "color": "#73879C"
    }),
        list = [
            "clear-day", "clear-night", "partly-cloudy-day",
            "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
            "fog"
        ],
        i;

    for (i = list.length; i--;)
        icons.set(list[i], list[i]);

    icons.play();

}


function init_chart_doughnut() {

    if (typeof (Chart) === 'undefined') { return; }

    console.log('init_chart_doughnut');

    if ($('.canvasDoughnut').length) {

        var chart_doughnut_settings = {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: {
                labels: [
                    "Symbian",
                    "Blackberry",
                    "Other",
                    "Android",
                    "IOS"
                ],
                datasets: [{
                    data: [15, 20, 30, 10, 30],
                    backgroundColor: [
                        "#BDC3C7",
                        "#9B59B6",
                        "#E74C3C",
                        "#26B99A",
                        "#3498DB"
                    ],
                    hoverBackgroundColor: [
                        "#CFD4D8",
                        "#B370CF",
                        "#E95E4F",
                        "#36CAAB",
                        "#49A9EA"
                    ]
                }]
            },
            options: {
                legend: false,
                responsive: false
            }
        }

        $('.canvasDoughnut').each(function () {

            var chart_element = $(this);
            var chart_doughnut = new Chart(chart_element, chart_doughnut_settings);

        });

    }

}

function init_gauge() {

    if (typeof (Gauge) === 'undefined') { return; }

    console.log('init_gauge [' + $('.gauge-chart').length + ']');

    console.log('init_gauge');


    var chart_gauge_settings = {
        lines: 12,
        angle: 0,
        lineWidth: 0.4,
        pointer: {
            length: 0.75,
            strokeWidth: 0.042,
            color: '#1D212A'
        },
        limitMax: 'false',
        colorStart: '#1ABC9C',
        colorStop: '#1ABC9C',
        strokeColor: '#F0F3F3',
        generateGradient: true
    };


    if ($('#chart_gauge_01').length) {

        var chart_gauge_01_elem = document.getElementById('chart_gauge_01');
        var chart_gauge_01 = new Gauge(chart_gauge_01_elem).setOptions(chart_gauge_settings);

    }


    if ($('#gauge-text').length) {

        chart_gauge_01.maxValue = 6000;
        chart_gauge_01.animationSpeed = 32;
        chart_gauge_01.set(3200);
        chart_gauge_01.setTextField(document.getElementById("gauge-text"));

    }

    if ($('#chart_gauge_02').length) {

        var chart_gauge_02_elem = document.getElementById('chart_gauge_02');
        var chart_gauge_02 = new Gauge(chart_gauge_02_elem).setOptions(chart_gauge_settings);

    }


    if ($('#gauge-text2').length) {

        chart_gauge_02.maxValue = 9000;
        chart_gauge_02.animationSpeed = 32;
        chart_gauge_02.set(2400);
        chart_gauge_02.setTextField(document.getElementById("gauge-text2"));

    }


}

/* SPARKLINES */

function init_sparklines() {

    if (typeof (jQuery.fn.sparkline) === 'undefined') { return; }
    console.log('init_sparklines');


    $(".sparkline_one").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
        type: 'bar',
        height: '125',
        barWidth: 13,
        colorMap: {
            '7': '#a1a1a1'
        },
        barSpacing: 2,
        barColor: '#26B99A'
    });


    $(".sparkline_two").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
        type: 'bar',
        height: '40',
        barWidth: 9,
        colorMap: {
            '7': '#a1a1a1'
        },
        barSpacing: 2,
        barColor: '#26B99A'
    });


    $(".sparkline_three").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
        type: 'line',
        width: '200',
        height: '40',
        lineColor: '#26B99A',
        fillColor: 'rgba(223, 223, 223, 0.57)',
        lineWidth: 2,
        spotColor: '#26B99A',
        minSpotColor: '#26B99A'
    });


    $(".sparkline11").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 6, 2, 4, 3, 4, 5, 4, 5, 4, 3], {
        type: 'bar',
        height: '40',
        barWidth: 8,
        colorMap: {
            '7': '#a1a1a1'
        },
        barSpacing: 2,
        barColor: '#26B99A'
    });


    $(".sparkline22").sparkline([2, 4, 3, 4, 7, 5, 4, 3, 5, 6, 2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 6], {
        type: 'line',
        height: '40',
        width: '200',
        lineColor: '#26B99A',
        fillColor: '#ffffff',
        lineWidth: 3,
        spotColor: '#34495E',
        minSpotColor: '#34495E'
    });


    $(".sparkline_bar").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5], {
        type: 'bar',
        colorMap: {
            '7': '#a1a1a1'
        },
        barColor: '#26B99A'
    });


    $(".sparkline_area").sparkline([5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], {
        type: 'line',
        lineColor: '#26B99A',
        fillColor: '#26B99A',
        spotColor: '#4578a0',
        minSpotColor: '#728fb2',
        maxSpotColor: '#6d93c4',
        highlightSpotColor: '#ef5179',
        highlightLineColor: '#8ba8bf',
        spotRadius: 2.5,
        width: 85
    });


    $(".sparkline_line").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5], {
        type: 'line',
        lineColor: '#26B99A',
        fillColor: '#ffffff',
        width: 85,
        spotColor: '#34495E',
        minSpotColor: '#34495E'
    });


    $(".sparkline_pie").sparkline([1, 1, 2, 1], {
        type: 'pie',
        sliceColors: ['#26B99A', '#ccc', '#75BCDD', '#D66DE2']
    });


    $(".sparkline_discreet").sparkline([4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 2, 4, 3, 7, 8, 9, 7, 6, 4, 3], {
        type: 'discrete',
        barWidth: 3,
        lineColor: '#26B99A',
        width: '85',
    });


};


/* AUTOCOMPLETE */

function init_autocomplete() {

    if (typeof (autocomplete) === 'undefined') { return; }
    console.log('init_autocomplete');

    var countries = { AD: "Andorra", A2: "Andorra Test", AE: "United Arab Emirates", AF: "Afghanistan", AG: "Antigua and Barbuda", AI: "Anguilla", AL: "Albania", AM: "Armenia", AN: "Netherlands Antilles", AO: "Angola", AQ: "Antarctica", AR: "Argentina", AS: "American Samoa", AT: "Austria", AU: "Australia", AW: "Aruba", AX: "Åland Islands", AZ: "Azerbaijan", BA: "Bosnia and Herzegovina", BB: "Barbados", BD: "Bangladesh", BE: "Belgium", BF: "Burkina Faso", BG: "Bulgaria", BH: "Bahrain", BI: "Burundi", BJ: "Benin", BL: "Saint Barthélemy", BM: "Bermuda", BN: "Brunei", BO: "Bolivia", BQ: "British Antarctic Territory", BR: "Brazil", BS: "Bahamas", BT: "Bhutan", BV: "Bouvet Island", BW: "Botswana", BY: "Belarus", BZ: "Belize", CA: "Canada", CC: "Cocos [Keeling] Islands", CD: "Congo - Kinshasa", CF: "Central African Republic", CG: "Congo - Brazzaville", CH: "Switzerland", CI: "Côte d’Ivoire", CK: "Cook Islands", CL: "Chile", CM: "Cameroon", CN: "China", CO: "Colombia", CR: "Costa Rica", CS: "Serbia and Montenegro", CT: "Canton and Enderbury Islands", CU: "Cuba", CV: "Cape Verde", CX: "Christmas Island", CY: "Cyprus", CZ: "Czech Republic", DD: "East Germany", DE: "Germany", DJ: "Djibouti", DK: "Denmark", DM: "Dominica", DO: "Dominican Republic", DZ: "Algeria", EC: "Ecuador", EE: "Estonia", EG: "Egypt", EH: "Western Sahara", ER: "Eritrea", ES: "Spain", ET: "Ethiopia", FI: "Finland", FJ: "Fiji", FK: "Falkland Islands", FM: "Micronesia", FO: "Faroe Islands", FQ: "French Southern and Antarctic Territories", FR: "France", FX: "Metropolitan France", GA: "Gabon", GB: "United Kingdom", GD: "Grenada", GE: "Georgia", GF: "French Guiana", GG: "Guernsey", GH: "Ghana", GI: "Gibraltar", GL: "Greenland", GM: "Gambia", GN: "Guinea", GP: "Guadeloupe", GQ: "Equatorial Guinea", GR: "Greece", GS: "South Georgia and the South Sandwich Islands", GT: "Guatemala", GU: "Guam", GW: "Guinea-Bissau", GY: "Guyana", HK: "Hong Kong SAR China", HM: "Heard Island and McDonald Islands", HN: "Honduras", HR: "Croatia", HT: "Haiti", HU: "Hungary", ID: "Indonesia", IE: "Ireland", IL: "Israel", IM: "Isle of Man", IN: "India", IO: "British Indian Ocean Territory", IQ: "Iraq", IR: "Iran", IS: "Iceland", IT: "Italy", JE: "Jersey", JM: "Jamaica", JO: "Jordan", JP: "Japan", JT: "Johnston Island", KE: "Kenya", KG: "Kyrgyzstan", KH: "Cambodia", KI: "Kiribati", KM: "Comoros", KN: "Saint Kitts and Nevis", KP: "North Korea", KR: "South Korea", KW: "Kuwait", KY: "Cayman Islands", KZ: "Kazakhstan", LA: "Laos", LB: "Lebanon", LC: "Saint Lucia", LI: "Liechtenstein", LK: "Sri Lanka", LR: "Liberia", LS: "Lesotho", LT: "Lithuania", LU: "Luxembourg", LV: "Latvia", LY: "Libya", MA: "Morocco", MC: "Monaco", MD: "Moldova", ME: "Montenegro", MF: "Saint Martin", MG: "Madagascar", MH: "Marshall Islands", MI: "Midway Islands", MK: "Macedonia", ML: "Mali", MM: "Myanmar [Burma]", MN: "Mongolia", MO: "Macau SAR China", MP: "Northern Mariana Islands", MQ: "Martinique", MR: "Mauritania", MS: "Montserrat", MT: "Malta", MU: "Mauritius", MV: "Maldives", MW: "Malawi", MX: "Mexico", MY: "Malaysia", MZ: "Mozambique", NA: "Namibia", NC: "New Caledonia", NE: "Niger", NF: "Norfolk Island", NG: "Nigeria", NI: "Nicaragua", NL: "Netherlands", NO: "Norway", NP: "Nepal", NQ: "Dronning Maud Land", NR: "Nauru", NT: "Neutral Zone", NU: "Niue", NZ: "New Zealand", OM: "Oman", PA: "Panama", PC: "Pacific Islands Trust Territory", PE: "Peru", PF: "French Polynesia", PG: "Papua New Guinea", PH: "Philippines", PK: "Pakistan", PL: "Poland", PM: "Saint Pierre and Miquelon", PN: "Pitcairn Islands", PR: "Puerto Rico", PS: "Palestinian Territories", PT: "Portugal", PU: "U.S. Miscellaneous Pacific Islands", PW: "Palau", PY: "Paraguay", PZ: "Panama Canal Zone", QA: "Qatar", RE: "Réunion", RO: "Romania", RS: "Serbia", RU: "Russia", RW: "Rwanda", SA: "Saudi Arabia", SB: "Solomon Islands", SC: "Seychelles", SD: "Sudan", SE: "Sweden", SG: "Singapore", SH: "Saint Helena", SI: "Slovenia", SJ: "Svalbard and Jan Mayen", SK: "Slovakia", SL: "Sierra Leone", SM: "San Marino", SN: "Senegal", SO: "Somalia", SR: "Suriname", ST: "São Tomé and Príncipe", SU: "Union of Soviet Socialist Republics", SV: "El Salvador", SY: "Syria", SZ: "Swaziland", TC: "Turks and Caicos Islands", TD: "Chad", TF: "French Southern Territories", TG: "Togo", TH: "Thailand", TJ: "Tajikistan", TK: "Tokelau", TL: "Timor-Leste", TM: "Turkmenistan", TN: "Tunisia", TO: "Tonga", TR: "Turkey", TT: "Trinidad and Tobago", TV: "Tuvalu", TW: "Taiwan", TZ: "Tanzania", UA: "Ukraine", UG: "Uganda", UM: "U.S. Minor Outlying Islands", US: "United States", UY: "Uruguay", UZ: "Uzbekistan", VA: "Vatican City", VC: "Saint Vincent and the Grenadines", VD: "North Vietnam", VE: "Venezuela", VG: "British Virgin Islands", VI: "U.S. Virgin Islands", VN: "Vietnam", VU: "Vanuatu", WF: "Wallis and Futuna", WK: "Wake Island", WS: "Samoa", YD: "People's Democratic Republic of Yemen", YE: "Yemen", YT: "Mayotte", ZA: "South Africa", ZM: "Zambia", ZW: "Zimbabwe", ZZ: "Unknown or Invalid Region" };

    var countriesArray = $.map(countries, function (value, key) {
        return {
            value: value,
            data: key
        };
    });

    // initialize autocomplete with custom appendTo
    $('#autocomplete-custom-append').autocomplete({
        lookup: countriesArray
    });

};

/* AUTOSIZE */

function init_autosize() {

    if (typeof $.fn.autosize !== 'undefined') {

        autosize($('.resizable_textarea'));

    }

};

/* PARSLEY */

function init_parsley() {

    if (typeof (parsley) === 'undefined') { return; }
    console.log('init_parsley');

    $/*.listen*/('parsley:field:validate', function () {
        validateFront();
    });
    $('#demo-form .btn').on('click', function () {
        $('#demo-form').parsley().validate();
        validateFront();
    });
    var validateFront = function () {
        if (true === $('#demo-form').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
        }
    };

    $/*.listen*/('parsley:field:validate', function () {
        validateFront();
    });
    $('#demo-form2 .btn').on('click', function () {
        $('#demo-form2').parsley().validate();
        validateFront();
    });
    var validateFront = function () {
        if (true === $('#demo-form2').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');
        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
        }
    };

    try {
        hljs.initHighlightingOnLoad();
    } catch (err) { }

};


/* INPUTS */

function onAddTag(tag) {
    alert("Added a tag: " + tag);
}

function onRemoveTag(tag) {
    alert("Removed a tag: " + tag);
}

function onChangeTag(input, tag) {
    alert("Changed a tag: " + tag);
}

//tags input
function init_TagsInput() {

    if (typeof $.fn.tagsInput !== 'undefined') {

        $('#tags_1').tagsInput({
            width: 'auto'
        });

    }

};

/* SELECT2 */

function init_select2() {

    if (typeof (select2) === 'undefined') { return; }
    console.log('init_toolbox');

    $(".select2_single").select2({
        placeholder: "Select a state",
        allowClear: true
    });
    $(".select2_group").select2({});
    $(".select2_multiple").select2({
        maximumSelectionLength: 4,
        placeholder: "With Max Selection limit 4",
        allowClear: true
    });

};

/* WYSIWYG EDITOR */

function init_wysiwyg() {

    if (typeof ($.fn.wysiwyg) === 'undefined') { return; }
    console.log('init_wysiwyg');

    function init_ToolbarBootstrapBindings() {
        var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
            'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
            'Times New Roman', 'Verdana'
        ],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
        $.each(fonts, function (idx, fontName) {
            fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
        });
        $('a[title]').tooltip({
            container: 'body'
        });
        $('.dropdown-menu input').click(function () {
            return false;
        })
            .change(function () {
                $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
            })
            .keydown('esc', function () {
                this.value = '';
                $(this).change();
            });

        $('[data-role=magic-overlay]').each(function () {
            var overlay = $(this),
                target = $(overlay.data('target'));
            overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
        });

        if ("onwebkitspeechchange" in document.createElement("input")) {
            var editorOffset = $('#editor').offset();

            $('.voiceBtn').css('position', 'absolute').offset({
                top: editorOffset.top,
                left: editorOffset.left + $('#editor').innerWidth() - 35
            });
        } else {
            $('.voiceBtn').hide();
        }
    }

    function showErrorAlert(reason, detail) {
        var msg = '';
        if (reason === 'unsupported-file-type') {
            msg = "Unsupported format " + detail;
        } else {
            console.log("error uploading file", reason, detail);
        }
        $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
    }

    $('.editor-wrapper').each(function () {
        var id = $(this).attr('id');    //editor-one

        $(this).wysiwyg({
            toolbarSelector: '[data-target="#' + id + '"]',
            fileUploadError: showErrorAlert
        });
    });


    window.prettyPrint;
    prettyPrint();

};

/* CROPPER */

function init_cropper() {


    if (typeof ($.fn.cropper) === 'undefined') { return; }
    console.log('init_cropper');

    var $image = $('#image');
    var $download = $('#download');
    var $dataX = $('#dataX');
    var $dataY = $('#dataY');
    var $dataHeight = $('#dataHeight');
    var $dataWidth = $('#dataWidth');
    var $dataRotate = $('#dataRotate');
    var $dataScaleX = $('#dataScaleX');
    var $dataScaleY = $('#dataScaleY');
    var options = {
        aspectRatio: 16 / 9,
        preview: '.img-preview',
        crop: function (e) {
            $dataX.val(Math.round(e.x));
            $dataY.val(Math.round(e.y));
            $dataHeight.val(Math.round(e.height));
            $dataWidth.val(Math.round(e.width));
            $dataRotate.val(e.rotate);
            $dataScaleX.val(e.scaleX);
            $dataScaleY.val(e.scaleY);
        }
    };


    // Tooltip
    $('[data-toggle="tooltip"]').tooltip();


    // Cropper
    $image.on({
        'build.cropper': function (e) {
            console.log(e.type);
        },
        'built.cropper': function (e) {
            console.log(e.type);
        },
        'cropstart.cropper': function (e) {
            console.log(e.type, e.action);
        },
        'cropmove.cropper': function (e) {
            console.log(e.type, e.action);
        },
        'cropend.cropper': function (e) {
            console.log(e.type, e.action);
        },
        'crop.cropper': function (e) {
            console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
        },
        'zoom.cropper': function (e) {
            console.log(e.type, e.ratio);
        }
    }).cropper(options);


    // Buttons
    if (!$.isFunction(document.createElement('canvas').getContext)) {
        $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
    }

    if (typeof document.createElement('cropper').style.transition === 'undefined') {
        $('button[data-method="rotate"]').prop('disabled', true);
        $('button[data-method="scale"]').prop('disabled', true);
    }


    // Download
    if (typeof $download[0].download === 'undefined') {
        $download.addClass('disabled');
    }


    // Options
    $('.docs-toggles').on('change', 'input', function () {
        var $this = $(this);
        var name = $this.attr('name');
        var type = $this.prop('type');
        var cropBoxData;
        var canvasData;

        if (!$image.data('cropper')) {
            return;
        }

        if (type === 'checkbox') {
            options[name] = $this.prop('checked');
            cropBoxData = $image.cropper('getCropBoxData');
            canvasData = $image.cropper('getCanvasData');

            options.built = function () {
                $image.cropper('setCropBoxData', cropBoxData);
                $image.cropper('setCanvasData', canvasData);
            };
        } else if (type === 'radio') {
            options[name] = $this.val();
        }

        $image.cropper('destroy').cropper(options);
    });


    // Methods
    $('.docs-buttons').on('click', '[data-method]', function () {
        var $this = $(this);
        var data = $this.data();
        var $target;
        var result;

        if ($this.prop('disabled') || $this.hasClass('disabled')) {
            return;
        }

        if ($image.data('cropper') && data.method) {
            data = $.extend({}, data); // Clone a new one

            if (typeof data.target !== 'undefined') {
                $target = $(data.target);

                if (typeof data.option === 'undefined') {
                    try {
                        data.option = JSON.parse($target.val());
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }

            result = $image.cropper(data.method, data.option, data.secondOption);

            switch (data.method) {
                case 'scaleX':
                case 'scaleY':
                    $(this).data('option', -data.option);
                    break;

                case 'getCroppedCanvas':
                    if (result) {

                        // Bootstrap's Modal
                        $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

                        if (!$download.hasClass('disabled')) {
                            $download.attr('href', result.toDataURL());
                        }
                    }

                    break;
            }

            if ($.isPlainObject(result) && $target) {
                try {
                    $target.val(JSON.stringify(result));
                } catch (e) {
                    console.log(e.message);
                }
            }

        }
    });

    // Keyboard
    $(document.body).on('keydown', function (e) {
        if (!$image.data('cropper') || this.scrollTop > 300) {
            return;
        }

        switch (e.which) {
            case 37:
                e.preventDefault();
                $image.cropper('move', -1, 0);
                break;

            case 38:
                e.preventDefault();
                $image.cropper('move', 0, -1);
                break;

            case 39:
                e.preventDefault();
                $image.cropper('move', 1, 0);
                break;

            case 40:
                e.preventDefault();
                $image.cropper('move', 0, 1);
                break;
        }
    });

    // Import image
    var $inputImage = $('#inputImage');
    var URL = window.URL || window.webkitURL;
    var blobURL;

    if (URL) {
        $inputImage.change(function () {
            var files = this.files;
            var file;

            if (!$image.data('cropper')) {
                return;
            }

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function () {

                        // Revoke when load complete
                        URL.revokeObjectURL(blobURL);
                    }).cropper('reset').cropper('replace', blobURL);
                    $inputImage.val('');
                } else {
                    window.alert('Please choose an image file.');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }


};

/* CROPPER --- end */

/* KNOB */

function init_knob() {

    if (typeof ($.fn.knob) === 'undefined') { return; }
    console.log('init_knob');

    $(".knob").knob({
        change: function (value) {
            //console.log("change : " + value);
        },
        release: function (value) {
            //console.log(this.$.attr('value'));
            console.log("release : " + value);
        },
        cancel: function () {
            console.log("cancel : ", this);
        },
        /*format : function (value) {
         return value + '%';
         },*/
        draw: function () {

            // "tron" case
            if (this.$.data('skin') == 'tron') {

                this.cursorExt = 0.3;

                var a = this.arc(this.cv) // Arc
                    ,
                    pa // Previous arc
                    , r = 1;

                this.g.lineWidth = this.lineWidth;

                if (this.o.displayPrevious) {
                    pa = this.arc(this.v);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }

    });

    // Example of infinite knob, iPod click wheel
    var v, up = 0,
        down = 0,
        i = 0,
        $idir = $("div.idir"),
        $ival = $("div.ival"),
        incr = function () {
            i++;
            $idir.show().html("+").fadeOut();
            $ival.html(i);
        },
        decr = function () {
            i--;
            $idir.show().html("-").fadeOut();
            $ival.html(i);
        };
    $("input.infinite").knob({
        min: 0,
        max: 20,
        stopper: false,
        change: function () {
            if (v > this.cv) {
                if (up) {
                    decr();
                    up = 0;
                } else {
                    up = 1;
                    down = 0;
                }
            } else {
                if (v < this.cv) {
                    if (down) {
                        incr();
                        down = 0;
                    } else {
                        down = 1;
                        up = 0;
                    }
                }
            }
            v = this.cv;
        }
    });

};

/* INPUT MASK */

function init_InputMask() {

    if (typeof ($.fn.inputmask) === 'undefined') { return; }
    console.log('init_InputMask');

    $(":input").inputmask();

};

/* COLOR PICKER */

function init_ColorPicker() {

    if (typeof ($.fn.colorpicker) === 'undefined') { return; }
    console.log('init_ColorPicker');

    $('.demo1').colorpicker();
    $('.demo2').colorpicker();

    $('#demo_forceformat').colorpicker({
        format: 'rgba',
        horizontal: true
    });

    $('#demo_forceformat3').colorpicker({
        format: 'rgba',
    });

    $('.demo-auto').colorpicker();

};


/* ION RANGE SLIDER */

function init_IonRangeSlider() {

    if (typeof ($.fn.ionRangeSlider) === 'undefined') { return; }
    console.log('init_IonRangeSlider');

    $("#range_27").ionRangeSlider({
        type: "double",
        min: 1000000,
        max: 2000000,
        grid: true,
        force_edges: true
    });
    $("#range").ionRangeSlider({
        hide_min_max: true,
        keyboard: true,
        min: 0,
        max: 5000,
        from: 1000,
        to: 4000,
        type: 'double',
        step: 1,
        prefix: "$",
        grid: true
    });
    $("#range_25").ionRangeSlider({
        type: "double",
        min: 1000000,
        max: 2000000,
        grid: true
    });
    $("#range_26").ionRangeSlider({
        type: "double",
        min: 0,
        max: 10000,
        step: 500,
        grid: true,
        grid_snap: true
    });
    $("#range_31").ionRangeSlider({
        type: "double",
        min: 0,
        max: 100,
        from: 30,
        to: 70,
        from_fixed: true
    });
    $(".range_min_max").ionRangeSlider({
        type: "double",
        min: 0,
        max: 100,
        from: 30,
        to: 70,
        max_interval: 50
    });
    $(".range_time24").ionRangeSlider({
        min: +moment().subtract(12, "hours").format("X"),
        max: +moment().format("X"),
        from: +moment().subtract(6, "hours").format("X"),
        grid: true,
        force_edges: true,
        prettify: function (num) {
            var m = moment(num, "X");
            return m.format("Do MMMM, HH:mm");
        }
    });

};


/* DATERANGEPICKER */

function init_daterangepicker() {

    if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker');

    var cb = function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    var optionSet1 = {
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2015',
        dateLimit: {
            days: 60
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    };

    $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
    $('#reportrange').daterangepicker(optionSet1, cb);
    $('#reportrange').on('show.daterangepicker', function () {
        console.log("show event fired");
    });
    $('#reportrange').on('hide.daterangepicker', function () {
        console.log("hide event fired");
    });
    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
        console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
    });
    $('#reportrange').on('cancel.daterangepicker', function (ev, picker) {
        console.log("cancel event fired");
    });
    $('#options1').click(function () {
        $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
    });
    $('#options2').click(function () {
        $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
    });
    $('#destroy').click(function () {
        $('#reportrange').data('daterangepicker').remove();
    });

}

function init_daterangepicker_right() {

    if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker_right');

    var cb = function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
        $('#reportrange_right span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    var optionSet1 = {
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2020',
        dateLimit: {
            days: 60
        },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'right',
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Clear',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    };

    $('#reportrange_right span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

    $('#reportrange_right').daterangepicker(optionSet1, cb);

    $('#reportrange_right').on('show.daterangepicker', function () {
        console.log("show event fired");
    });
    $('#reportrange_right').on('hide.daterangepicker', function () {
        console.log("hide event fired");
    });
    $('#reportrange_right').on('apply.daterangepicker', function (ev, picker) {
        console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
    });
    $('#reportrange_right').on('cancel.daterangepicker', function (ev, picker) {
        console.log("cancel event fired");
    });

    $('#options1').click(function () {
        $('#reportrange_right').data('daterangepicker').setOptions(optionSet1, cb);
    });

    $('#options2').click(function () {
        $('#reportrange_right').data('daterangepicker').setOptions(optionSet2, cb);
    });

    $('#destroy').click(function () {
        $('#reportrange_right').data('daterangepicker').remove();
    });

}

function init_daterangepicker_single_call() {

    if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker_single_call');

    $('#single_cal1').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_1"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#single_cal2').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_2"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#single_cal3').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_3"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
    $('#single_cal4').daterangepicker({
        singleDatePicker: true,
        singleClasses: "picker_4"
    }, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });


}


function init_daterangepicker_reservation() {

    if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
    console.log('init_daterangepicker_reservation');

    $('#reservation').daterangepicker(null, function (start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });

    $('#reservation-time').daterangepicker({
        timePicker: true,
        timePickerIncrement: 30,
        locale: {
            format: 'MM/DD/YYYY h:mm A'
        }
    });

}

/* SMART WIZARD */

function init_SmartWizard() {

    if (typeof ($.fn.smartWizard) === 'undefined') { return; }
    console.log('init_SmartWizard');

    $('#wizard').smartWizard();

    $('#wizard_verticle').smartWizard({
        transitionEffect: 'slide'
    });

    $('.buttonNext').addClass('btn btn-success');
    $('.buttonPrevious').addClass('btn btn-primary');
    $('.buttonFinish').addClass('btn btn-default');

};


/* VALIDATOR */

function init_validator() {

    if (typeof (validator) === 'undefined') { return; }
    console.log('init_validator');

    // initialize the validator function
    validator.message.date = 'not a real date';

    // validate a field on "blur" event, a 'select' on 'change' event & a '.reuired' classed multifield on 'keyup':
    $('form')
        .on('blur', 'input[required], input.optional, select.required', validator.checkField)
        .on('change', 'select.required', validator.checkField)
        .on('keypress', 'input[required][pattern]', validator.keypress);

    $('.multi.required').on('keyup blur', 'input', function () {
        validator.checkField.apply($(this).siblings().last()[0]);
    });

    $('form').submit(function (e) {
        e.preventDefault();
        var submit = true;

        // evaluate the form using generic validaing
        if (!validator.checkAll($(this))) {
            submit = false;
        }

        if (submit)
            this.submit();

        return false;
    });

};

/* PNotify */

function init_PNotify() {

    if (typeof (PNotify) === 'undefined') { return; }
    console.log('init_PNotify');
    

    // new PNotify({
    //     title: "PNotify",
    //     type: "info",
    //     text: "Welcome. Try hovering over me. You can click things behind me, because I'm non-blocking.",
    //     nonblock: {
    //         nonblock: true
    //     },
    //     addclass: 'dark',
    //     styling: 'bootstrap3',
    //     hide: false,
    //     before_close: function (PNotify) {
    //         PNotify.update({
    //             title: PNotify.options.title + " - Enjoy your Stay",
    //             before_close: null
    //         });

    //         PNotify.queueRemove();

    //         return false;
    //     }
    // });

};


/* CUSTOM NOTIFICATION */

function init_CustomNotification() {

    console.log('run_customtabs');

    if (typeof (CustomTabs) === 'undefined') { return; }
    console.log('init_CustomTabs');

    var cnt = 10;

    TabbedNotification = function (options) {
        var message = "<div id='ntf" + cnt + "' class='text alert-" + options.type + "' style='display:none'><h2><i class='fa fa-bell'></i> " + options.title +
            "</h2><div class='close'><a href='javascript:;' class='notification_close'><i class='fa fa-close'></i></a></div><p>" + options.text + "</p></div>";

        if (!document.getElementById('custom_notifications')) {
            alert('doesnt exists');
        } else {
            $('#custom_notifications ul.notifications').append("<li><a id='ntlink" + cnt + "' class='alert-" + options.type + "' href='#ntf" + cnt + "'><i class='fa fa-bell animated shake'></i></a></li>");
            $('#custom_notifications #notif-group').append(message);
            cnt++;
            CustomTabs(options);
        }
    };

    CustomTabs = function (options) {
        $('.tabbed_notifications > div').hide();
        $('.tabbed_notifications > div:first-of-type').show();
        $('#custom_notifications').removeClass('dsp_none');
        $('.notifications a').click(function (e) {
            e.preventDefault();
            var $this = $(this),
                tabbed_notifications = '#' + $this.parents('.notifications').data('tabbed_notifications'),
                others = $this.closest('li').siblings().children('a'),
                target = $this.attr('href');
            others.removeClass('active');
            $this.addClass('active');
            $(tabbed_notifications).children('div').hide();
            $(target).show();
        });
    };

    CustomTabs();

    var tabid = idname = '';

    $(document).on('click', '.notification_close', function (e) {
        idname = $(this).parent().parent().attr("id");
        tabid = idname.substr(-2);
        $('#ntf' + tabid).remove();
        $('#ntlink' + tabid).parent().remove();
        $('.notifications a').first().addClass('active');
        $('#notif-group div').first().css('display', 'block');
    });

};

/* EASYPIECHART */

function init_EasyPieChart() {

    if (typeof ($.fn.easyPieChart) === 'undefined') { return; }
    console.log('init_EasyPieChart');

    $('.chart').easyPieChart({
        easing: 'easeOutElastic',
        delay: 2000,
        barColor: '#26B99A',
        trackColor: '#fff',
        scaleColor: false,
        lineWidth: 5,
        trackWidth: 16,
        lineCap: 'butt',
        onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    });
    var chart = window.chart = $('.chart').data('easyPieChart');
    $('.js_update').on('click', function () {
        chart.update(Math.random() * 200 - 100);
    });

    //hover and retain popover when on popover content
    var originalLeave = $.fn.popover.Constructor.prototype.leave;
    $.fn.popover.Constructor.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
        var container, timeout;

        originalLeave.call(this, obj);

        if (obj.currentTarget) {
            container = $(obj.currentTarget).siblings('.popover');
            timeout = self.timeout;
            container.one('mouseenter', function () {
                //We entered the actual popover – call off the dogs
                clearTimeout(timeout);
                //Let's monitor popover content instead
                container.one('mouseleave', function () {
                    $.fn.popover.Constructor.prototype.leave.call(self, self);
                });
            });
        }
    };

    $('body').popover({
        selector: '[data-popover]',
        trigger: 'click hover',
        delay: {
            show: 50,
            hide: 400
        }
    });

};


function init_charts() {

    console.log('run_charts  typeof [' + typeof (Chart) + ']');

    if (typeof (Chart) === 'undefined') { return; }

    console.log('init_charts');


    Chart.defaults.global.legend = {
        enabled: false
    };



    if ($('#canvas_line').length) {

        var canvas_line_00 = new Chart(document.getElementById("canvas_line"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line1').length) {

        var canvas_line_01 = new Chart(document.getElementById("canvas_line1"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line2').length) {

        var canvas_line_02 = new Chart(document.getElementById("canvas_line2"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line3').length) {

        var canvas_line_03 = new Chart(document.getElementById("canvas_line3"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    if ($('#canvas_line4').length) {

        var canvas_line_04 = new Chart(document.getElementById("canvas_line4"), {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }


    // Line chart

    if ($('#lineChart').length) {

        var ctx = document.getElementById("lineChart");
        var lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    backgroundColor: "rgba(38, 185, 154, 0.31)",
                    borderColor: "rgba(38, 185, 154, 0.7)",
                    pointBorderColor: "rgba(38, 185, 154, 0.7)",
                    pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointBorderWidth: 1,
                    data: [31, 74, 6, 39, 20, 85, 7]
                }, {
                    label: "My Second dataset",
                    backgroundColor: "rgba(3, 88, 106, 0.3)",
                    borderColor: "rgba(3, 88, 106, 0.70)",
                    pointBorderColor: "rgba(3, 88, 106, 0.70)",
                    pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(151,187,205,1)",
                    pointBorderWidth: 1,
                    data: [82, 23, 66, 9, 99, 4, 2]
                }]
            },
        });

    }

    // Bar chart

    if ($('#mybarChart').length) {

        var ctx = document.getElementById("mybarChart");
        var mybarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: '# of Votes',
                    backgroundColor: "#26B99A",
                    data: [51, 30, 40, 28, 92, 50, 45]
                }, {
                    label: '# of Votes',
                    backgroundColor: "#03586A",
                    data: [41, 56, 25, 48, 72, 34, 12]
                }]
            },

            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    }


    // Doughnut chart

    if ($('#canvasDoughnut').length) {

        var ctx = document.getElementById("canvasDoughnut");
        var data = {
            labels: [
                "Dark Grey",
                "Purple Color",
                "Gray Color",
                "Green Color",
                "Blue Color"
            ],
            datasets: [{
                data: [120, 50, 140, 180, 100],
                backgroundColor: [
                    "#455C73",
                    "#9B59B6",
                    "#BDC3C7",
                    "#26B99A",
                    "#3498DB"
                ],
                hoverBackgroundColor: [
                    "#34495E",
                    "#B370CF",
                    "#CFD4D8",
                    "#36CAAB",
                    "#49A9EA"
                ]

            }]
        };

        var canvasDoughnut = new Chart(ctx, {
            type: 'doughnut',
            tooltipFillColor: "rgba(51, 51, 51, 0.55)",
            data: data
        });

    }

    // Radar chart

    if ($('#canvasRadar').length) {

        var ctx = document.getElementById("canvasRadar");
        var data = {
            labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: "rgba(3, 88, 106, 0.2)",
                borderColor: "rgba(3, 88, 106, 0.80)",
                pointBorderColor: "rgba(3, 88, 106, 0.80)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.80)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                data: [65, 59, 90, 81, 56, 55, 40]
            }, {
                label: "My Second dataset",
                backgroundColor: "rgba(38, 185, 154, 0.2)",
                borderColor: "rgba(38, 185, 154, 0.85)",
                pointColor: "rgba(38, 185, 154, 0.85)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 96, 27, 100]
            }]
        };

        var canvasRadar = new Chart(ctx, {
            type: 'radar',
            data: data,
        });

    }


    // Pie chart
    if ($('#pieChart').length) {

        var ctx = document.getElementById("pieChart");
        var data = {
            datasets: [{
                data: [120, 50, 140, 180, 100],
                backgroundColor: [
                    "#455C73",
                    "#9B59B6",
                    "#BDC3C7",
                    "#26B99A",
                    "#3498DB"
                ],
                label: 'My dataset' // for legend
            }],
            labels: [
                "Dark Gray",
                "Purple",
                "Gray",
                "Green",
                "Blue"
            ]
        };

        var pieChart = new Chart(ctx, {
            data: data,
            type: 'pie',
            otpions: {
                legend: false
            }
        });

    }


    // PolarArea chart

    if ($('#polarArea').length) {

        var ctx = document.getElementById("polarArea");
        var data = {
            datasets: [{
                data: [120, 50, 140, 180, 100],
                backgroundColor: [
                    "#455C73",
                    "#9B59B6",
                    "#BDC3C7",
                    "#26B99A",
                    "#3498DB"
                ],
                label: 'My dataset'
            }],
            labels: [
                "Dark Gray",
                "Purple",
                "Gray",
                "Green",
                "Blue"
            ]
        };

        var polarArea = new Chart(ctx, {
            data: data,
            type: 'polarArea',
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        });

    }
}

/* COMPOSE */

function init_compose() {

    if (typeof ($.fn.slideToggle) === 'undefined') { return; }
    console.log('init_compose');

    $('#compose, .compose-close').click(function () {
        $('.compose').slideToggle();
    });

};

/* CALENDAR */

function init_calendar() {

    if (typeof ($.fn.fullCalendar) === 'undefined') { return; }
    console.log('init_calendar');

    var date = new Date(),
        d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear(),
        started,
        categoryClass;

    var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listMonth'
        },
        selectable: true,
        selectHelper: true,
        select: function (start, end, allDay) {
            $('#fc_create').click();

            started = start;
            ended = end;

            $(".antosubmit").on("click", function () {
                var title = $("#title").val();
                if (end) {
                    ended = end;
                }

                categoryClass = $("#event_type").val();

                if (title) {
                    calendar.fullCalendar('renderEvent', {
                        title: title,
                        start: started,
                        end: end,
                        allDay: allDay
                    },
                        true // make the event "stick"
                    );
                }

                $('#title').val('');

                calendar.fullCalendar('unselect');

                $('.antoclose').click();

                return false;
            });
        },
        eventClick: function (calEvent, jsEvent, view) {
            $('#fc_edit').click();
            $('#title2').val(calEvent.title);

            categoryClass = $("#event_type").val();

            $(".antosubmit2").on("click", function () {
                calEvent.title = $("#title2").val();

                calendar.fullCalendar('updateEvent', calEvent);
                $('.antoclose2').click();
            });

            calendar.fullCalendar('unselect');
        },
        editable: true,
        events: [{
            title: 'All Day Event',
            start: new Date(y, m, 1)
        }, {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2)
        }, {
            title: 'Meeting',
            start: new Date(y, m, d, 10, 30),
            allDay: false
        }, {
            title: 'Lunch',
            start: new Date(y, m, d + 14, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false
        }, {
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false
        }, {
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'
        }]
    });

};

/* DATA TABLES */

function init_DataTables() {

    console.log('run_datatables');

    if (typeof ($.fn.DataTable) === 'undefined') { return; }
    console.log('init_DataTables');

    var handleDataTableButtons = function () {
        if ($("#datatable-buttons").length) {
            $("#datatable-buttons").DataTable({
                processing: true,
                serverSide: true,
                ajax: {
                    method: "POST",
                    url: "/master-view/ajax-customers/",
                    data: { csrfmiddlewaretoken: $("input[name*='csrfmiddlewaretoken']").val() }
                },
                deferRender: true,
                dom: "Bfrtip",
                buttons: [
                    {
                        extend: "copy",
                        className: "btn-sm"
                    },
                    {
                        extend: "csv",
                        className: "btn-sm"
                    },
                    {
                        extend: "excel",
                        className: "btn-sm"
                    },
                    {
                        extend: "pdfHtml5",
                        className: "btn-sm"
                    },
                    {
                        extend: "print",
                        className: "btn-sm"
                    },
                ],
                responsive: true,
                order: [[1, 'asc']],
                columnDefs: [
                    { orderable: true, targets: [0] }
                ]
            });
        }
    };

    TableManageButtons = function () {
        "use strict";
        return {
            init: function () {
                handleDataTableButtons();
            }
        };
    }();

    // $('#datatable').dataTable();
    //
    // $('#datatable-keytable').DataTable({
    //     keys: true
    // });
    //
    // $('#datatable-responsive').DataTable();
    //
    // $('#datatable-scroller').DataTable({
    //     ajax: "js/datatables/json/scroller-demo.json",
    //     deferRender: true,
    //     scrollY: 380,
    //     scrollCollapse: true,
    //     scroller: true
    // });
    //
    // $('#datatable-fixed-header').DataTable({
    //     fixedHeader: true
    // });
    //
    // var $datatable = $('#datatable-checkbox');
    //
    // $datatable.dataTable({
    //     'order': [[ 1, 'asc' ]],
    //     'columnDefs': [
    //         { orderable: false, targets: [0] }
    //     ]
    // });
    // $datatable.on('draw.dt', function() {
    //     $('checkbox input').iCheck({
    //         checkboxClass: 'icheckbox_flat-green'
    //     });
    // });

    TableManageButtons.init();

};

// function init_DataTables() {
//
//     console.log('run_datatables');
//
//     if( typeof ($.fn.DataTable) === 'undefined'){ return; }
//     console.log('init_DataTables');
//
//     var handleDataTableButtons = function() {
//         if ($("#datatable-buttons").length) {
//             $("#datatable-buttons").DataTable({
//                 dom: "Bfrtip",
//                 buttons: [
//                     {
//                         extend: "copy",
//                         className: "btn-sm"
//                     },
//                     {
//                         extend: "csv",
//                         className: "btn-sm"
//                     },
//                     {
//                         extend: "excel",
//                         className: "btn-sm"
//                     },
//                     {
//                         extend: "pdfHtml5",
//                         className: "btn-sm"
//                     },
//                     {
//                         extend: "print",
//                         className: "btn-sm"
//                     },
//                 ],
//                 responsive: true
//             });
//         }
//     };
//
//     TableManageButtons = function() {
//         "use strict";
//         return {
//             init: function() {
//                 handleDataTableButtons();
//             }
//         };
//     }();
//
//     $('#datatable').dataTable();
//
//     $('#datatable-keytable').DataTable({
//         keys: true
//     });
//
//     $('#datatable-responsive').DataTable();
//
//     $('#datatable-scroller').DataTable({
//         ajax: "js/datatables/json/scroller-demo.json",
//         deferRender: true,
//         scrollY: 380,
//         scrollCollapse: true,
//         scroller: true
//     });
//
//     $('#datatable-fixed-header').DataTable({
//         fixedHeader: true
//     });
//
//     var $datatable = $('#datatable-checkbox');
//
//     $datatable.dataTable({
//         'order': [[ 1, 'asc' ]],
//         'columnDefs': [
//             { orderable: false, targets: [0] }
//         ]
//     });
//     $datatable.on('draw.dt', function() {
//         $('checkbox input').iCheck({
//             checkboxClass: 'icheckbox_flat-green'
//         });
//     });
//
//     TableManageButtons.init();
//
// };

/* CHART - MORRIS  */

function init_morris_charts() {

    if (typeof (Morris) === 'undefined') { return; }
    console.log('init_morris_charts');

    if ($('#graph_bar').length) {

        Morris.Bar({
            element: 'graph_bar',
            data: [
                { device: 'iPhone 4', geekbench: 380 },
                { device: 'iPhone 4S', geekbench: 655 },
                { device: 'iPhone 3GS', geekbench: 275 },
                { device: 'iPhone 5', geekbench: 1571 },
                { device: 'iPhone 5S', geekbench: 655 },
                { device: 'iPhone 6', geekbench: 2154 },
                { device: 'iPhone 6 Plus', geekbench: 1144 },
                { device: 'iPhone 6S', geekbench: 2371 },
                { device: 'iPhone 6S Plus', geekbench: 1471 },
                { device: 'Other', geekbench: 1371 }
            ],
            xkey: 'device',
            ykeys: ['geekbench'],
            labels: ['Geekbench'],
            barRatio: 0.4,
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            xLabelAngle: 35,
            hideHover: 'auto',
            resize: true
        });

    }

    if ($('#graph_bar_group').length) {

        Morris.Bar({
            element: 'graph_bar_group',
            data: [
                { "period": "2016-10-01", "licensed": 807, "sorned": 660 },
                { "period": "2016-09-30", "licensed": 1251, "sorned": 729 },
                { "period": "2016-09-29", "licensed": 1769, "sorned": 1018 },
                { "period": "2016-09-20", "licensed": 2246, "sorned": 1461 },
                { "period": "2016-09-19", "licensed": 2657, "sorned": 1967 },
                { "period": "2016-09-18", "licensed": 3148, "sorned": 2627 },
                { "period": "2016-09-17", "licensed": 3471, "sorned": 3740 },
                { "period": "2016-09-16", "licensed": 2871, "sorned": 2216 },
                { "period": "2016-09-15", "licensed": 2401, "sorned": 1656 },
                { "period": "2016-09-10", "licensed": 2115, "sorned": 1022 }
            ],
            xkey: 'period',
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            ykeys: ['licensed', 'sorned'],
            labels: ['Licensed', 'SORN'],
            hideHover: 'auto',
            xLabelAngle: 60,
            resize: true
        });

    }

    if ($('#graphx').length) {

        Morris.Bar({
            element: 'graphx',
            data: [
                { x: '2015 Q1', y: 2, z: 3, a: 4 },
                { x: '2015 Q2', y: 3, z: 5, a: 6 },
                { x: '2015 Q3', y: 4, z: 3, a: 2 },
                { x: '2015 Q4', y: 2, z: 4, a: 5 }
            ],
            xkey: 'x',
            ykeys: ['y', 'z', 'a'],
            barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            hideHover: 'auto',
            labels: ['Y', 'Z', 'A'],
            resize: true
        }).on('click', function (i, row) {
            console.log(i, row);
        });

    }

    if ($('#graph_area').length) {

        Morris.Area({
            element: 'graph_area',
            data: [
                { period: '2014 Q1', iphone: 2666, ipad: null, itouch: 2647 },
                { period: '2014 Q2', iphone: 2778, ipad: 2294, itouch: 2441 },
                { period: '2014 Q3', iphone: 4912, ipad: 1969, itouch: 2501 },
                { period: '2014 Q4', iphone: 3767, ipad: 3597, itouch: 5689 },
                { period: '2015 Q1', iphone: 6810, ipad: 1914, itouch: 2293 },
                { period: '2015 Q2', iphone: 5670, ipad: 4293, itouch: 1881 },
                { period: '2015 Q3', iphone: 4820, ipad: 3795, itouch: 1588 },
                { period: '2015 Q4', iphone: 15073, ipad: 5967, itouch: 5175 },
                { period: '2016 Q1', iphone: 10687, ipad: 4460, itouch: 2028 },
                { period: '2016 Q2', iphone: 8432, ipad: 5713, itouch: 1791 }
            ],
            xkey: 'period',
            ykeys: ['iphone', 'ipad', 'itouch'],
            lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            labels: ['iPhone', 'iPad', 'iPod Touch'],
            pointSize: 2,
            hideHover: 'auto',
            resize: true
        });

    }

    if ($('#graph_donut').length) {

        Morris.Donut({
            element: 'graph_donut',
            data: [
                { label: 'Jam', value: 25 },
                { label: 'Frosted', value: 40 },
                { label: 'Custard', value: 25 },
                { label: 'Sugar', value: 10 }
            ],
            colors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            formatter: function (y) {
                return y + "%";
            },
            resize: true
        });

    }

    if ($('#graph_line').length) {

        Morris.Line({
            element: 'graph_line',
            xkey: 'year',
            ykeys: ['value'],
            labels: ['Value'],
            hideHover: 'auto',
            lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
            data: [
                { year: '2012', value: 20 },
                { year: '2013', value: 10 },
                { year: '2014', value: 5 },
                { year: '2015', value: 5 },
                { year: '2016', value: 20 }
            ],
            resize: true
        });

        $MENU_TOGGLE.on('click', function () {
            $(window).resize();
        });

    }

};



/* ECHRTS */


function init_echarts() {

    if (typeof (echarts) === 'undefined') { return; }
    console.log('init_echarts');


    var theme = {
        color: [
            '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],

        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#408829'
            }
        },

        dataRange: {
            color: ['#1f610a', '#97b58d']
        },

        toolbox: {
            color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#408829'
                },
                shadowStyle: {
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(64,136,41,0.2)',
            handleColor: '#408829'
        },
        grid: {
            borderWidth: 0
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#408829'
            },
            controlStyle: {
                normal: { color: '#408829' },
                emphasis: { color: '#408829' }
            }
        },

        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    color0: '#a9cba2',
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        color0: '#86b379'
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                },
                emphasis: {
                    areaStyle: {
                        color: '#99d2dd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                }
            }
        },
        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        strokeColor: '#408829'
                    }
                }
            }
        },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                show: true,
                lineStyle: {
                    color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                    width: 8
                }
            },
            axisTick: {
                splitNumber: 10,
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    color: 'auto'
                }
            }
        },
        textStyle: {
            fontFamily: 'Arial, Verdana, sans-serif'
        }
    };

    etheme = theme
    //echart Bar

    if ($('#mainb').length) {

        var echartBar = echarts.init(document.getElementById('mainb'), theme);

        echartBar.setOption({
            title: {
                text: 'Graph title',
                subtext: 'Graph Sub-text'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['sales', 'purchases']
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                data: ['1?', '2?', '3?', '4?', '5?', '6?', '7?', '8?', '9?', '10?', '11?', '12?']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'sales',
                type: 'bar',
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: '???'
                    }, {
                        type: 'min',
                        name: '???'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '???'
                    }]
                }
            }, {
                name: 'purchases',
                type: 'bar',
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                markPoint: {
                    data: [{
                        name: 'sales',
                        value: 182.2,
                        xAxis: 7,
                        yAxis: 183,
                    }, {
                        name: 'purchases',
                        value: 2.3,
                        xAxis: 11,
                        yAxis: 3
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: '???'
                    }]
                }
            }]
        });

    }




    //echart Radar

    if ($('#echart_sonar').length) {

        var echartRadar = echarts.init(document.getElementById('echart_sonar'), theme);

        echartRadar.setOption({
            title: {
                text: 'Budget vs spending',
                subtext: 'Subtitle'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'bottom',
                data: ['Allocated Budget', 'Actual Spending']
            },
            toolbox: {
                show: true,
                feature: {
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            polar: [{
                indicator: [{
                    text: 'Sales',
                    max: 6000
                }, {
                    text: 'Administration',
                    max: 16000
                }, {
                    text: 'Information Techology',
                    max: 30000
                }, {
                    text: 'Customer Support',
                    max: 38000
                }, {
                    text: 'Development',
                    max: 52000
                }, {
                    text: 'Marketing',
                    max: 25000
                }]
            }],
            calculable: true,
            series: [{
                name: 'Budget vs spending',
                type: 'radar',
                data: [{
                    value: [4300, 10000, 28000, 35000, 50000, 19000],
                    name: 'Allocated Budget'
                }, {
                    value: [5000, 14000, 28000, 31000, 42000, 21000],
                    name: 'Actual Spending'
                }]
            }]
        });

    }

    //echart Funnel

    if ($('#echart_pyramid').length) {

        var echartFunnel = echarts.init(document.getElementById('echart_pyramid'), theme);

        echartFunnel.setOption({
            title: {
                text: 'Echart Pyramid Graph',
                subtext: 'Subtitle'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            legend: {
                data: ['Something #1', 'Something #2', 'Something #3', 'Something #4', 'Something #5'],
                orient: 'vertical',
                x: 'left',
                y: 'bottom'
            },
            calculable: true,
            series: [{
                name: '漏斗图',
                type: 'funnel',
                width: '40%',
                data: [{
                    value: 60,
                    name: 'Something #1'
                }, {
                    value: 40,
                    name: 'Something #2'
                }, {
                    value: 20,
                    name: 'Something #3'
                }, {
                    value: 80,
                    name: 'Something #4'
                }, {
                    value: 100,
                    name: 'Something #5'
                }]
            }]
        });

    }

    //echart Gauge

    if ($('#echart_gauge').length) {

        var echartGauge = echarts.init(document.getElementById('echart_gauge'), theme);

        echartGauge.setOption({
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: 'Performance',
                type: 'gauge',
                center: ['50%', '50%'],
                startAngle: 140,
                endAngle: -140,
                min: 0,
                max: 100,
                precision: 0,
                splitNumber: 10,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [
                            [0.2, 'lightgreen'],
                            [0.4, 'orange'],
                            [0.8, 'skyblue'],
                            [1, '#ff4500']
                        ],
                        width: 30
                    }
                },
                axisTick: {
                    show: true,
                    splitNumber: 5,
                    length: 8,
                    lineStyle: {
                        color: '#eee',
                        width: 1,
                        type: 'solid'
                    }
                },
                axisLabel: {
                    show: true,
                    formatter: function (v) {
                        switch (v + '') {
                            case '10':
                                return 'a';
                            case '30':
                                return 'b';
                            case '60':
                                return 'c';
                            case '90':
                                return 'd';
                            default:
                                return '';
                        }
                    },
                    textStyle: {
                        color: '#333'
                    }
                },
                splitLine: {
                    show: true,
                    length: 30,
                    lineStyle: {
                        color: '#eee',
                        width: 2,
                        type: 'solid'
                    }
                },
                pointer: {
                    length: '80%',
                    width: 8,
                    color: 'auto'
                },
                title: {
                    show: true,
                    offsetCenter: ['-65%', -10],
                    textStyle: {
                        color: '#333',
                        fontSize: 15
                    }
                },
                detail: {
                    show: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: '#ccc',
                    width: 100,
                    height: 40,
                    offsetCenter: ['-60%', 10],
                    formatter: '{value}%',
                    textStyle: {
                        color: 'auto',
                        fontSize: 30
                    }
                },
                data: [{
                    value: 50,
                    name: 'Performance'
                }]
            }]
        });

    }

    //echart Line

    if ($('#echart_line').length) {

        var echartLine = echarts.init(document.getElementById('echart_line'), theme);

        echartLine.setOption({
            title: {
                text: 'Line Graph',
                subtext: 'Subtitle'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 40,
                data: ['Intent', 'Pre-order', 'Deal']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar',
                            stack: 'Stack',
                            tiled: 'Tiled'
                        },
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'Deal',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [10, 12, 21, 54, 260, 830, 710]
            }, {
                name: 'Pre-order',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [30, 182, 434, 791, 390, 30, 10]
            }, {
                name: 'Intent',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: [1320, 1132, 601, 234, 120, 90, 20]
            }]
        });

    }

    //echart Scatter

    if ($('#echart_scatter').length) {

        var echartScatter = echarts.init(document.getElementById('echart_scatter'), theme);

        echartScatter.setOption({
            title: {
                text: 'Scatter Graph',
                subtext: 'Heinz  2003'
            },
            tooltip: {
                trigger: 'axis',
                showDelay: 0,
                axisPointer: {
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            legend: {
                data: ['Data2', 'Data1']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            xAxis: [{
                type: 'value',
                scale: true,
                axisLabel: {
                    formatter: '{value} cm'
                }
            }],
            yAxis: [{
                type: 'value',
                scale: true,
                axisLabel: {
                    formatter: '{value} kg'
                }
            }],
            series: [{
                name: 'Data1',
                type: 'scatter',
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        if (params.value.length > 1) {
                            return params.seriesName + ' :<br/>' + params.value[0] + 'cm ' + params.value[1] + 'kg ';
                        } else {
                            return params.seriesName + ' :<br/>' + params.name + ' : ' + params.value + 'kg ';
                        }
                    }
                },
                data: [
                    [161.2, 51.6],
                    [167.5, 59.0],
                    [159.5, 49.2],
                    [157.0, 63.0],
                    [155.8, 53.6],
                    [170.0, 59.0],
                    [159.1, 47.6],
                    [166.0, 69.8],
                    [176.2, 66.8],
                    [160.2, 75.2],
                    [172.5, 55.2],
                    [170.9, 54.2],
                    [172.9, 62.5],
                    [153.4, 42.0],
                    [160.0, 50.0],
                    [147.2, 49.8],
                    [168.2, 49.2],
                    [175.0, 73.2],
                    [157.0, 47.8],
                    [167.6, 68.8],
                    [159.5, 50.6],
                    [175.0, 82.5],
                    [166.8, 57.2],
                    [176.5, 87.8],
                    [170.2, 72.8],
                    [174.0, 54.5],
                    [173.0, 59.8],
                    [179.9, 67.3],
                    [170.5, 67.8],
                    [160.0, 47.0],
                    [154.4, 46.2],
                    [162.0, 55.0],
                    [176.5, 83.0],
                    [160.0, 54.4],
                    [152.0, 45.8],
                    [162.1, 53.6],
                    [170.0, 73.2],
                    [160.2, 52.1],
                    [161.3, 67.9],
                    [166.4, 56.6],
                    [168.9, 62.3],
                    [163.8, 58.5],
                    [167.6, 54.5],
                    [160.0, 50.2],
                    [161.3, 60.3],
                    [167.6, 58.3],
                    [165.1, 56.2],
                    [160.0, 50.2],
                    [170.0, 72.9],
                    [157.5, 59.8],
                    [167.6, 61.0],
                    [160.7, 69.1],
                    [163.2, 55.9],
                    [152.4, 46.5],
                    [157.5, 54.3],
                    [168.3, 54.8],
                    [180.3, 60.7],
                    [165.5, 60.0],
                    [165.0, 62.0],
                    [164.5, 60.3],
                    [156.0, 52.7],
                    [160.0, 74.3],
                    [163.0, 62.0],
                    [165.7, 73.1],
                    [161.0, 80.0],
                    [162.0, 54.7],
                    [166.0, 53.2],
                    [174.0, 75.7],
                    [172.7, 61.1],
                    [167.6, 55.7],
                    [151.1, 48.7],
                    [164.5, 52.3],
                    [163.5, 50.0],
                    [152.0, 59.3],
                    [169.0, 62.5],
                    [164.0, 55.7],
                    [161.2, 54.8],
                    [155.0, 45.9],
                    [170.0, 70.6],
                    [176.2, 67.2],
                    [170.0, 69.4],
                    [162.5, 58.2],
                    [170.3, 64.8],
                    [164.1, 71.6],
                    [169.5, 52.8],
                    [163.2, 59.8],
                    [154.5, 49.0],
                    [159.8, 50.0],
                    [173.2, 69.2],
                    [170.0, 55.9],
                    [161.4, 63.4],
                    [169.0, 58.2],
                    [166.2, 58.6],
                    [159.4, 45.7],
                    [162.5, 52.2],
                    [159.0, 48.6],
                    [162.8, 57.8],
                    [159.0, 55.6],
                    [179.8, 66.8],
                    [162.9, 59.4],
                    [161.0, 53.6],
                    [151.1, 73.2],
                    [168.2, 53.4],
                    [168.9, 69.0],
                    [173.2, 58.4],
                    [171.8, 56.2],
                    [178.0, 70.6],
                    [164.3, 59.8],
                    [163.0, 72.0],
                    [168.5, 65.2],
                    [166.8, 56.6],
                    [172.7, 105.2],
                    [163.5, 51.8],
                    [169.4, 63.4],
                    [167.8, 59.0],
                    [159.5, 47.6],
                    [167.6, 63.0],
                    [161.2, 55.2],
                    [160.0, 45.0],
                    [163.2, 54.0],
                    [162.2, 50.2],
                    [161.3, 60.2],
                    [149.5, 44.8],
                    [157.5, 58.8],
                    [163.2, 56.4],
                    [172.7, 62.0],
                    [155.0, 49.2],
                    [156.5, 67.2],
                    [164.0, 53.8],
                    [160.9, 54.4],
                    [162.8, 58.0],
                    [167.0, 59.8],
                    [160.0, 54.8],
                    [160.0, 43.2],
                    [168.9, 60.5],
                    [158.2, 46.4],
                    [156.0, 64.4],
                    [160.0, 48.8],
                    [167.1, 62.2],
                    [158.0, 55.5],
                    [167.6, 57.8],
                    [156.0, 54.6],
                    [162.1, 59.2],
                    [173.4, 52.7],
                    [159.8, 53.2],
                    [170.5, 64.5],
                    [159.2, 51.8],
                    [157.5, 56.0],
                    [161.3, 63.6],
                    [162.6, 63.2],
                    [160.0, 59.5],
                    [168.9, 56.8],
                    [165.1, 64.1],
                    [162.6, 50.0],
                    [165.1, 72.3],
                    [166.4, 55.0],
                    [160.0, 55.9],
                    [152.4, 60.4],
                    [170.2, 69.1],
                    [162.6, 84.5],
                    [170.2, 55.9],
                    [158.8, 55.5],
                    [172.7, 69.5],
                    [167.6, 76.4],
                    [162.6, 61.4],
                    [167.6, 65.9],
                    [156.2, 58.6],
                    [175.2, 66.8],
                    [172.1, 56.6],
                    [162.6, 58.6],
                    [160.0, 55.9],
                    [165.1, 59.1],
                    [182.9, 81.8],
                    [166.4, 70.7],
                    [165.1, 56.8],
                    [177.8, 60.0],
                    [165.1, 58.2],
                    [175.3, 72.7],
                    [154.9, 54.1],
                    [158.8, 49.1],
                    [172.7, 75.9],
                    [168.9, 55.0],
                    [161.3, 57.3],
                    [167.6, 55.0],
                    [165.1, 65.5],
                    [175.3, 65.5],
                    [157.5, 48.6],
                    [163.8, 58.6],
                    [167.6, 63.6],
                    [165.1, 55.2],
                    [165.1, 62.7],
                    [168.9, 56.6],
                    [162.6, 53.9],
                    [164.5, 63.2],
                    [176.5, 73.6],
                    [168.9, 62.0],
                    [175.3, 63.6],
                    [159.4, 53.2],
                    [160.0, 53.4],
                    [170.2, 55.0],
                    [162.6, 70.5],
                    [167.6, 54.5],
                    [162.6, 54.5],
                    [160.7, 55.9],
                    [160.0, 59.0],
                    [157.5, 63.6],
                    [162.6, 54.5],
                    [152.4, 47.3],
                    [170.2, 67.7],
                    [165.1, 80.9],
                    [172.7, 70.5],
                    [165.1, 60.9],
                    [170.2, 63.6],
                    [170.2, 54.5],
                    [170.2, 59.1],
                    [161.3, 70.5],
                    [167.6, 52.7],
                    [167.6, 62.7],
                    [165.1, 86.3],
                    [162.6, 66.4],
                    [152.4, 67.3],
                    [168.9, 63.0],
                    [170.2, 73.6],
                    [175.2, 62.3],
                    [175.2, 57.7],
                    [160.0, 55.4],
                    [165.1, 104.1],
                    [174.0, 55.5],
                    [170.2, 77.3],
                    [160.0, 80.5],
                    [167.6, 64.5],
                    [167.6, 72.3],
                    [167.6, 61.4],
                    [154.9, 58.2],
                    [162.6, 81.8],
                    [175.3, 63.6],
                    [171.4, 53.4],
                    [157.5, 54.5],
                    [165.1, 53.6],
                    [160.0, 60.0],
                    [174.0, 73.6],
                    [162.6, 61.4],
                    [174.0, 55.5],
                    [162.6, 63.6],
                    [161.3, 60.9],
                    [156.2, 60.0],
                    [149.9, 46.8],
                    [169.5, 57.3],
                    [160.0, 64.1],
                    [175.3, 63.6],
                    [169.5, 67.3],
                    [160.0, 75.5],
                    [172.7, 68.2],
                    [162.6, 61.4],
                    [157.5, 76.8],
                    [176.5, 71.8],
                    [164.4, 55.5],
                    [160.7, 48.6],
                    [174.0, 66.4],
                    [163.8, 67.3]
                ],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: 'Max'
                    }, {
                        type: 'min',
                        name: 'Min'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: 'Mean'
                    }]
                }
            }, {
                name: 'Data2',
                type: 'scatter',
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        if (params.value.length > 1) {
                            return params.seriesName + ' :<br/>' + params.value[0] + 'cm ' + params.value[1] + 'kg ';
                        } else {
                            return params.seriesName + ' :<br/>' + params.name + ' : ' + params.value + 'kg ';
                        }
                    }
                },
                data: [
                    [174.0, 65.6],
                    [175.3, 71.8],
                    [193.5, 80.7],
                    [186.5, 72.6],
                    [187.2, 78.8],
                    [181.5, 74.8],
                    [184.0, 86.4],
                    [184.5, 78.4],
                    [175.0, 62.0],
                    [184.0, 81.6],
                    [180.0, 76.6],
                    [177.8, 83.6],
                    [192.0, 90.0],
                    [176.0, 74.6],
                    [174.0, 71.0],
                    [184.0, 79.6],
                    [192.7, 93.8],
                    [171.5, 70.0],
                    [173.0, 72.4],
                    [176.0, 85.9],
                    [176.0, 78.8],
                    [180.5, 77.8],
                    [172.7, 66.2],
                    [176.0, 86.4],
                    [173.5, 81.8],
                    [178.0, 89.6],
                    [180.3, 82.8],
                    [180.3, 76.4],
                    [164.5, 63.2],
                    [173.0, 60.9],
                    [183.5, 74.8],
                    [175.5, 70.0],
                    [188.0, 72.4],
                    [189.2, 84.1],
                    [172.8, 69.1],
                    [170.0, 59.5],
                    [182.0, 67.2],
                    [170.0, 61.3],
                    [177.8, 68.6],
                    [184.2, 80.1],
                    [186.7, 87.8],
                    [171.4, 84.7],
                    [172.7, 73.4],
                    [175.3, 72.1],
                    [180.3, 82.6],
                    [182.9, 88.7],
                    [188.0, 84.1],
                    [177.2, 94.1],
                    [172.1, 74.9],
                    [167.0, 59.1],
                    [169.5, 75.6],
                    [174.0, 86.2],
                    [172.7, 75.3],
                    [182.2, 87.1],
                    [164.1, 55.2],
                    [163.0, 57.0],
                    [171.5, 61.4],
                    [184.2, 76.8],
                    [174.0, 86.8],
                    [174.0, 72.2],
                    [177.0, 71.6],
                    [186.0, 84.8],
                    [167.0, 68.2],
                    [171.8, 66.1],
                    [182.0, 72.0],
                    [167.0, 64.6],
                    [177.8, 74.8],
                    [164.5, 70.0],
                    [192.0, 101.6],
                    [175.5, 63.2],
                    [171.2, 79.1],
                    [181.6, 78.9],
                    [167.4, 67.7],
                    [181.1, 66.0],
                    [177.0, 68.2],
                    [174.5, 63.9],
                    [177.5, 72.0],
                    [170.5, 56.8],
                    [182.4, 74.5],
                    [197.1, 90.9],
                    [180.1, 93.0],
                    [175.5, 80.9],
                    [180.6, 72.7],
                    [184.4, 68.0],
                    [175.5, 70.9],
                    [180.6, 72.5],
                    [177.0, 72.5],
                    [177.1, 83.4],
                    [181.6, 75.5],
                    [176.5, 73.0],
                    [175.0, 70.2],
                    [174.0, 73.4],
                    [165.1, 70.5],
                    [177.0, 68.9],
                    [192.0, 102.3],
                    [176.5, 68.4],
                    [169.4, 65.9],
                    [182.1, 75.7],
                    [179.8, 84.5],
                    [175.3, 87.7],
                    [184.9, 86.4],
                    [177.3, 73.2],
                    [167.4, 53.9],
                    [178.1, 72.0],
                    [168.9, 55.5],
                    [157.2, 58.4],
                    [180.3, 83.2],
                    [170.2, 72.7],
                    [177.8, 64.1],
                    [172.7, 72.3],
                    [165.1, 65.0],
                    [186.7, 86.4],
                    [165.1, 65.0],
                    [174.0, 88.6],
                    [175.3, 84.1],
                    [185.4, 66.8],
                    [177.8, 75.5],
                    [180.3, 93.2],
                    [180.3, 82.7],
                    [177.8, 58.0],
                    [177.8, 79.5],
                    [177.8, 78.6],
                    [177.8, 71.8],
                    [177.8, 116.4],
                    [163.8, 72.2],
                    [188.0, 83.6],
                    [198.1, 85.5],
                    [175.3, 90.9],
                    [166.4, 85.9],
                    [190.5, 89.1],
                    [166.4, 75.0],
                    [177.8, 77.7],
                    [179.7, 86.4],
                    [172.7, 90.9],
                    [190.5, 73.6],
                    [185.4, 76.4],
                    [168.9, 69.1],
                    [167.6, 84.5],
                    [175.3, 64.5],
                    [170.2, 69.1],
                    [190.5, 108.6],
                    [177.8, 86.4],
                    [190.5, 80.9],
                    [177.8, 87.7],
                    [184.2, 94.5],
                    [176.5, 80.2],
                    [177.8, 72.0],
                    [180.3, 71.4],
                    [171.4, 72.7],
                    [172.7, 84.1],
                    [172.7, 76.8],
                    [177.8, 63.6],
                    [177.8, 80.9],
                    [182.9, 80.9],
                    [170.2, 85.5],
                    [167.6, 68.6],
                    [175.3, 67.7],
                    [165.1, 66.4],
                    [185.4, 102.3],
                    [181.6, 70.5],
                    [172.7, 95.9],
                    [190.5, 84.1],
                    [179.1, 87.3],
                    [175.3, 71.8],
                    [170.2, 65.9],
                    [193.0, 95.9],
                    [171.4, 91.4],
                    [177.8, 81.8],
                    [177.8, 96.8],
                    [167.6, 69.1],
                    [167.6, 82.7],
                    [180.3, 75.5],
                    [182.9, 79.5],
                    [176.5, 73.6],
                    [186.7, 91.8],
                    [188.0, 84.1],
                    [188.0, 85.9],
                    [177.8, 81.8],
                    [174.0, 82.5],
                    [177.8, 80.5],
                    [171.4, 70.0],
                    [185.4, 81.8],
                    [185.4, 84.1],
                    [188.0, 90.5],
                    [188.0, 91.4],
                    [182.9, 89.1],
                    [176.5, 85.0],
                    [175.3, 69.1],
                    [175.3, 73.6],
                    [188.0, 80.5],
                    [188.0, 82.7],
                    [175.3, 86.4],
                    [170.5, 67.7],
                    [179.1, 92.7],
                    [177.8, 93.6],
                    [175.3, 70.9],
                    [182.9, 75.0],
                    [170.8, 93.2],
                    [188.0, 93.2],
                    [180.3, 77.7],
                    [177.8, 61.4],
                    [185.4, 94.1],
                    [168.9, 75.0],
                    [185.4, 83.6],
                    [180.3, 85.5],
                    [174.0, 73.9],
                    [167.6, 66.8],
                    [182.9, 87.3],
                    [160.0, 72.3],
                    [180.3, 88.6],
                    [167.6, 75.5],
                    [186.7, 101.4],
                    [175.3, 91.1],
                    [175.3, 67.3],
                    [175.9, 77.7],
                    [175.3, 81.8],
                    [179.1, 75.5],
                    [181.6, 84.5],
                    [177.8, 76.6],
                    [182.9, 85.0],
                    [177.8, 102.5],
                    [184.2, 77.3],
                    [179.1, 71.8],
                    [176.5, 87.9],
                    [188.0, 94.3],
                    [174.0, 70.9],
                    [167.6, 64.5],
                    [170.2, 77.3],
                    [167.6, 72.3],
                    [188.0, 87.3],
                    [174.0, 80.0],
                    [176.5, 82.3],
                    [180.3, 73.6],
                    [167.6, 74.1],
                    [188.0, 85.9],
                    [180.3, 73.2],
                    [167.6, 76.3],
                    [183.0, 65.9],
                    [183.0, 90.9],
                    [179.1, 89.1],
                    [170.2, 62.3],
                    [177.8, 82.7],
                    [179.1, 79.1],
                    [190.5, 98.2],
                    [177.8, 84.1],
                    [180.3, 83.2],
                    [180.3, 83.2]
                ],
                markPoint: {
                    data: [{
                        type: 'max',
                        name: 'Max'
                    }, {
                        type: 'min',
                        name: 'Min'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: 'Mean'
                    }]
                }
            }]
        });

    }

    //echart Bar Horizontal

    if ($('#echart_bar_horizontal').length) {

        var echartBar = echarts.init(document.getElementById('echart_bar_horizontal'), theme);

        echartBar.setOption({
            title: {
                text: 'Bar Graph',
                subtext: 'Graph subtitle'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 100,
                data: ['2015', '2016']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'value',
                boundaryGap: [0, 0.01]
            }],
            yAxis: [{
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            }],
            series: [{
                name: '2015',
                type: 'bar',
                data: [18203, 23489, 29034, 104970, 131744, 630230]
            }, {
                name: '2016',
                type: 'bar',
                data: [19325, 23438, 31000, 121594, 134141, 681807]
            }]
        });

    }

    //echart Pie Collapse

    if ($('#echart_pie2').length) {

        var echartPieCollapse = echarts.init(document.getElementById('echart_pie2'), theme);

        echartPieCollapse.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            series: [{
                name: 'Area Mode',
                type: 'pie',
                radius: [25, 90],
                center: ['50%', 170],
                roseType: 'area',
                x: '50%',
                max: 40,
                sort: 'ascending',
                data: [{
                    value: 10,
                    name: 'rose1'
                }, {
                    value: 5,
                    name: 'rose2'
                }, {
                    value: 15,
                    name: 'rose3'
                }, {
                    value: 25,
                    name: 'rose4'
                }, {
                    value: 20,
                    name: 'rose5'
                }, {
                    value: 35,
                    name: 'rose6'
                }]
            }]
        });

    }

    //echart Donut

    if ($('#echart_donut').length) {

        var echartDonut = echarts.init(document.getElementById('echart_donut'), theme);

        echartDonut.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'center',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: 'Access to the resource',
                type: 'pie',
                radius: ['35%', '55%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal'
                            }
                        }
                    }
                },
                data: [{
                    value: 335,
                    name: 'Direct Access'
                }, {
                    value: 310,
                    name: 'E-mail Marketing'
                }, {
                    value: 234,
                    name: 'Union Ad'
                }, {
                    value: 135,
                    name: 'Video Ads'
                }, {
                    value: 1548,
                    name: 'Search Engine'
                }]
            }]
        });

    }

    //echart Pie

    if ($('#echart_pie').length) {

        var echartPie = echarts.init(document.getElementById('echart_pie'), theme);

        echartPie.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '48%'],
                data: [{
                    value: 335,
                    name: 'Direct Access'
                }, {
                    value: 310,
                    name: 'E-mail Marketing'
                }, {
                    value: 234,
                    name: 'Union Ad'
                }, {
                    value: 135,
                    name: 'Video Ads'
                }, {
                    value: 1548,
                    name: 'Search Engine'
                }]
            }]
        });

        var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }
        };

        var placeHolderStyle = {
            normal: {
                color: 'rgba(0,0,0,0)',
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };

    }

    //echart Mini Pie

    if ($('#echart_mini_pie').length) {

        var echartMiniPie = echarts.init(document.getElementById('echart_mini_pie'), theme);

        echartMiniPie.setOption({
            title: {
                text: 'Chart #2',
                subtext: 'From ExcelHome',
                sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
                x: 'center',
                y: 'center',
                itemGap: 20,
                textStyle: {
                    color: 'rgba(30,144,255,0.8)',
                    fontFamily: '微软雅黑',
                    fontSize: 35,
                    fontWeight: 'bolder'
                }
            },
            tooltip: {
                show: true,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 170,
                y: 45,
                itemGap: 12,
                data: ['68%Something #1', '29%Something #2', '3%Something #3'],
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        title: "Text View",
                        lang: [
                            "Text View",
                            "Close",
                            "Refresh",
                        ],
                        readOnly: false
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: '1',
                type: 'pie',
                clockWise: false,
                radius: [105, 130],
                itemStyle: dataStyle,
                data: [{
                    value: 68,
                    name: '68%Something #1'
                }, {
                    value: 32,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }, {
                name: '2',
                type: 'pie',
                clockWise: false,
                radius: [80, 105],
                itemStyle: dataStyle,
                data: [{
                    value: 29,
                    name: '29%Something #2'
                }, {
                    value: 71,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }, {
                name: '3',
                type: 'pie',
                clockWise: false,
                radius: [25, 80],
                itemStyle: dataStyle,
                data: [{
                    value: 3,
                    name: '3%Something #3'
                }, {
                    value: 97,
                    name: 'invisible',
                    itemStyle: placeHolderStyle
                }]
            }]
        });

    }

    //echart Map

    if ($('#echart_world_map').length) {

        var echartMap = echarts.init(document.getElementById('echart_world_map'), theme);


        echartMap.setOption({
            title: {
                text: 'World Population (2010)',
                subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
                x: 'center',
                y: 'top'
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
                    return params.seriesName + '<br/>' + params.name + ' : ' + value;
                }
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        title: "Text View",
                        lang: [
                            "Text View",
                            "Close",
                            "Refresh",
                        ],
                        readOnly: false
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            dataRange: {
                min: 0,
                max: 1000000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                color: ['#087E65', '#26B99A', '#CBEAE3']
            },
            series: [{
                name: 'World Population (2010)',
                type: 'map',
                mapType: 'world',
                roam: false,
                mapLocation: {
                    y: 60
                },
                itemStyle: {
                    emphasis: {
                        label: {
                            show: true
                        }
                    }
                },
                data: [{
                    name: 'Afghanistan',
                    value: 28397.812
                }, {
                    name: 'Angola',
                    value: 19549.124
                }, {
                    name: 'Albania',
                    value: 3150.143
                }, {
                    name: 'United Arab Emirates',
                    value: 8441.537
                }, {
                    name: 'Argentina',
                    value: 40374.224
                }, {
                    name: 'Armenia',
                    value: 2963.496
                }, {
                    name: 'French Southern and Antarctic Lands',
                    value: 268.065
                }, {
                    name: 'Australia',
                    value: 22404.488
                }, {
                    name: 'Austria',
                    value: 8401.924
                }, {
                    name: 'Azerbaijan',
                    value: 9094.718
                }, {
                    name: 'Burundi',
                    value: 9232.753
                }, {
                    name: 'Belgium',
                    value: 10941.288
                }, {
                    name: 'Benin',
                    value: 9509.798
                }, {
                    name: 'Burkina Faso',
                    value: 15540.284
                }, {
                    name: 'Bangladesh',
                    value: 151125.475
                }, {
                    name: 'Bulgaria',
                    value: 7389.175
                }, {
                    name: 'The Bahamas',
                    value: 66402.316
                }, {
                    name: 'Bosnia and Herzegovina',
                    value: 3845.929
                }, {
                    name: 'Belarus',
                    value: 9491.07
                }, {
                    name: 'Belize',
                    value: 308.595
                }, {
                    name: 'Bermuda',
                    value: 64.951
                }, {
                    name: 'Bolivia',
                    value: 716.939
                }, {
                    name: 'Brazil',
                    value: 195210.154
                }, {
                    name: 'Brunei',
                    value: 27.223
                }, {
                    name: 'Bhutan',
                    value: 716.939
                }, {
                    name: 'Botswana',
                    value: 1969.341
                }, {
                    name: 'Central African Republic',
                    value: 4349.921
                }, {
                    name: 'Canada',
                    value: 34126.24
                }, {
                    name: 'Switzerland',
                    value: 7830.534
                }, {
                    name: 'Chile',
                    value: 17150.76
                }, {
                    name: 'China',
                    value: 1359821.465
                }, {
                    name: 'Ivory Coast',
                    value: 60508.978
                }, {
                    name: 'Cameroon',
                    value: 20624.343
                }, {
                    name: 'Democratic Republic of the Congo',
                    value: 62191.161
                }, {
                    name: 'Republic of the Congo',
                    value: 3573.024
                }, {
                    name: 'Colombia',
                    value: 46444.798
                }, {
                    name: 'Costa Rica',
                    value: 4669.685
                }, {
                    name: 'Cuba',
                    value: 11281.768
                }, {
                    name: 'Northern Cyprus',
                    value: 1.468
                }, {
                    name: 'Cyprus',
                    value: 1103.685
                }, {
                    name: 'Czech Republic',
                    value: 10553.701
                }, {
                    name: 'Germany',
                    value: 83017.404
                }, {
                    name: 'Djibouti',
                    value: 834.036
                }, {
                    name: 'Denmark',
                    value: 5550.959
                }, {
                    name: 'Dominican Republic',
                    value: 10016.797
                }, {
                    name: 'Algeria',
                    value: 37062.82
                }, {
                    name: 'Ecuador',
                    value: 15001.072
                }, {
                    name: 'Egypt',
                    value: 78075.705
                }, {
                    name: 'Eritrea',
                    value: 5741.159
                }, {
                    name: 'Spain',
                    value: 46182.038
                }, {
                    name: 'Estonia',
                    value: 1298.533
                }, {
                    name: 'Ethiopia',
                    value: 87095.281
                }, {
                    name: 'Finland',
                    value: 5367.693
                }, {
                    name: 'Fiji',
                    value: 860.559
                }, {
                    name: 'Falkland Islands',
                    value: 49.581
                }, {
                    name: 'France',
                    value: 63230.866
                }, {
                    name: 'Gabon',
                    value: 1556.222
                }, {
                    name: 'United Kingdom',
                    value: 62066.35
                }, {
                    name: 'Georgia',
                    value: 4388.674
                }, {
                    name: 'Ghana',
                    value: 24262.901
                }, {
                    name: 'Guinea',
                    value: 10876.033
                }, {
                    name: 'Gambia',
                    value: 1680.64
                }, {
                    name: 'Guinea Bissau',
                    value: 10876.033
                }, {
                    name: 'Equatorial Guinea',
                    value: 696.167
                }, {
                    name: 'Greece',
                    value: 11109.999
                }, {
                    name: 'Greenland',
                    value: 56.546
                }, {
                    name: 'Guatemala',
                    value: 14341.576
                }, {
                    name: 'French Guiana',
                    value: 231.169
                }, {
                    name: 'Guyana',
                    value: 786.126
                }, {
                    name: 'Honduras',
                    value: 7621.204
                }, {
                    name: 'Croatia',
                    value: 4338.027
                }, {
                    name: 'Haiti',
                    value: 9896.4
                }, {
                    name: 'Hungary',
                    value: 10014.633
                }, {
                    name: 'Indonesia',
                    value: 240676.485
                }, {
                    name: 'India',
                    value: 1205624.648
                }, {
                    name: 'Ireland',
                    value: 4467.561
                }, {
                    name: 'Iran',
                    value: 240676.485
                }, {
                    name: 'Iraq',
                    value: 30962.38
                }, {
                    name: 'Iceland',
                    value: 318.042
                }, {
                    name: 'Israel',
                    value: 7420.368
                }, {
                    name: 'Italy',
                    value: 60508.978
                }, {
                    name: 'Jamaica',
                    value: 2741.485
                }, {
                    name: 'Jordan',
                    value: 6454.554
                }, {
                    name: 'Japan',
                    value: 127352.833
                }, {
                    name: 'Kazakhstan',
                    value: 15921.127
                }, {
                    name: 'Kenya',
                    value: 40909.194
                }, {
                    name: 'Kyrgyzstan',
                    value: 5334.223
                }, {
                    name: 'Cambodia',
                    value: 14364.931
                }, {
                    name: 'South Korea',
                    value: 51452.352
                }, {
                    name: 'Kosovo',
                    value: 97.743
                }, {
                    name: 'Kuwait',
                    value: 2991.58
                }, {
                    name: 'Laos',
                    value: 6395.713
                }, {
                    name: 'Lebanon',
                    value: 4341.092
                }, {
                    name: 'Liberia',
                    value: 3957.99
                }, {
                    name: 'Libya',
                    value: 6040.612
                }, {
                    name: 'Sri Lanka',
                    value: 20758.779
                }, {
                    name: 'Lesotho',
                    value: 2008.921
                }, {
                    name: 'Lithuania',
                    value: 3068.457
                }, {
                    name: 'Luxembourg',
                    value: 507.885
                }, {
                    name: 'Latvia',
                    value: 2090.519
                }, {
                    name: 'Morocco',
                    value: 31642.36
                }, {
                    name: 'Moldova',
                    value: 103.619
                }, {
                    name: 'Madagascar',
                    value: 21079.532
                }, {
                    name: 'Mexico',
                    value: 117886.404
                }, {
                    name: 'Macedonia',
                    value: 507.885
                }, {
                    name: 'Mali',
                    value: 13985.961
                }, {
                    name: 'Myanmar',
                    value: 51931.231
                }, {
                    name: 'Montenegro',
                    value: 620.078
                }, {
                    name: 'Mongolia',
                    value: 2712.738
                }, {
                    name: 'Mozambique',
                    value: 23967.265
                }, {
                    name: 'Mauritania',
                    value: 3609.42
                }, {
                    name: 'Malawi',
                    value: 15013.694
                }, {
                    name: 'Malaysia',
                    value: 28275.835
                }, {
                    name: 'Namibia',
                    value: 2178.967
                }, {
                    name: 'New Caledonia',
                    value: 246.379
                }, {
                    name: 'Niger',
                    value: 15893.746
                }, {
                    name: 'Nigeria',
                    value: 159707.78
                }, {
                    name: 'Nicaragua',
                    value: 5822.209
                }, {
                    name: 'Netherlands',
                    value: 16615.243
                }, {
                    name: 'Norway',
                    value: 4891.251
                }, {
                    name: 'Nepal',
                    value: 26846.016
                }, {
                    name: 'New Zealand',
                    value: 4368.136
                }, {
                    name: 'Oman',
                    value: 2802.768
                }, {
                    name: 'Pakistan',
                    value: 173149.306
                }, {
                    name: 'Panama',
                    value: 3678.128
                }, {
                    name: 'Peru',
                    value: 29262.83
                }, {
                    name: 'Philippines',
                    value: 93444.322
                }, {
                    name: 'Papua New Guinea',
                    value: 6858.945
                }, {
                    name: 'Poland',
                    value: 38198.754
                }, {
                    name: 'Puerto Rico',
                    value: 3709.671
                }, {
                    name: 'North Korea',
                    value: 1.468
                }, {
                    name: 'Portugal',
                    value: 10589.792
                }, {
                    name: 'Paraguay',
                    value: 6459.721
                }, {
                    name: 'Qatar',
                    value: 1749.713
                }, {
                    name: 'Romania',
                    value: 21861.476
                }, {
                    name: 'Russia',
                    value: 21861.476
                }, {
                    name: 'Rwanda',
                    value: 10836.732
                }, {
                    name: 'Western Sahara',
                    value: 514.648
                }, {
                    name: 'Saudi Arabia',
                    value: 27258.387
                }, {
                    name: 'Sudan',
                    value: 35652.002
                }, {
                    name: 'South Sudan',
                    value: 9940.929
                }, {
                    name: 'Senegal',
                    value: 12950.564
                }, {
                    name: 'Solomon Islands',
                    value: 526.447
                }, {
                    name: 'Sierra Leone',
                    value: 5751.976
                }, {
                    name: 'El Salvador',
                    value: 6218.195
                }, {
                    name: 'Somaliland',
                    value: 9636.173
                }, {
                    name: 'Somalia',
                    value: 9636.173
                }, {
                    name: 'Republic of Serbia',
                    value: 3573.024
                }, {
                    name: 'Suriname',
                    value: 524.96
                }, {
                    name: 'Slovakia',
                    value: 5433.437
                }, {
                    name: 'Slovenia',
                    value: 2054.232
                }, {
                    name: 'Sweden',
                    value: 9382.297
                }, {
                    name: 'Swaziland',
                    value: 1193.148
                }, {
                    name: 'Syria',
                    value: 7830.534
                }, {
                    name: 'Chad',
                    value: 11720.781
                }, {
                    name: 'Togo',
                    value: 6306.014
                }, {
                    name: 'Thailand',
                    value: 66402.316
                }, {
                    name: 'Tajikistan',
                    value: 7627.326
                }, {
                    name: 'Turkmenistan',
                    value: 5041.995
                }, {
                    name: 'East Timor',
                    value: 10016.797
                }, {
                    name: 'Trinidad and Tobago',
                    value: 1328.095
                }, {
                    name: 'Tunisia',
                    value: 10631.83
                }, {
                    name: 'Turkey',
                    value: 72137.546
                }, {
                    name: 'United Republic of Tanzania',
                    value: 44973.33
                }, {
                    name: 'Uganda',
                    value: 33987.213
                }, {
                    name: 'Ukraine',
                    value: 46050.22
                }, {
                    name: 'Uruguay',
                    value: 3371.982
                }, {
                    name: 'United States of America',
                    value: 312247.116
                }, {
                    name: 'Uzbekistan',
                    value: 27769.27
                }, {
                    name: 'Venezuela',
                    value: 236.299
                }, {
                    name: 'Vietnam',
                    value: 89047.397
                }, {
                    name: 'Vanuatu',
                    value: 236.299
                }, {
                    name: 'West Bank',
                    value: 13.565
                }, {
                    name: 'Yemen',
                    value: 22763.008
                }, {
                    name: 'South Africa',
                    value: 51452.352
                }, {
                    name: 'Zambia',
                    value: 13216.985
                }, {
                    name: 'Zimbabwe',
                    value: 13076.978
                }]
            }]
        });

    }

}

function download_csv() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            headers: { "X-CSRFToken": $("input[name*='csrfmiddlewaretoken']").val() },
            url: '/master-view/download-csv/',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            // data: JSON.stringify(data),
            // dataType: 'json',
            success: function (result) {
                console.log(result);
                if (result != null || typeof result != 'undefined') {
                    var output = $.parseJSON(result);
                    console.log(output);
                    if (output['status'] != 'ERROR') {
                        window.location = output['path'];
                        resolve(output);
                    }
                    else {
                        console.log(output);
                        reject(output);
                    }
                }
            },
            error: function (e) {
                console.log(e);
                reject(e);
            }
        });
    });
}


function init_master_view_current(category) {
    console.log('run_datatables');
    if (typeof ($.fn.DataTable) === 'undefined') { return; }
    console.log('init_DataTables');
    var url = '/master-view/ajax-customers/'
    if (category == 'previous') {
        url = '/master-view/ajax-customers-previous/'
    }
    $.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
        console.log(settings);
        console.log(helpPage);
        console.log(message);
    };
    var table = $("#master_view_current").DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            method: "POST",
            url: url,
            data: { csrfmiddlewaretoken: $("input[name*='csrfmiddlewaretoken']").val() }
        },
        deferRender: true,
        dom: "Bfrtip",
        lengthChange: false,
        bFilter: false,
        columns: [
            {
                className: 'details-control',
                orderable: false,
                data: null,
                defaultContent: ''
            },
            { data: 'fullname' },
            { data: 'cltv' },
            { data: 'churn' },
            { data: 'high_convertor' },
            { data: 'value' },
            { data: 'bio' },
            { data: 'engagement' },
            { data: 'lifestage' },
        ],
        buttons: [
            {
                text: 'CSV (Full Query Data)',
                className: "btn-sm",
                action: async function (e, dt, node, config) {
                    this.text('Downloading...');
                    this.enable(false);
                    await download_csv();
                    this.text('CSV Full');
                    this.enable(true);
                }
            },
            // {
            //     extend: "copy",
            //     className: "btn-sm"
            // },
            {
                text: "CSV (This Page Only)",
                extend: "csv",
                className: "btn-sm"
            },
            {
                extend: "excel",
                className: "btn-sm"
            },
            {
                extend: "pdfHtml5",
                className: "btn-sm"
            },
            {
                extend: "print",
                className: "btn-sm"
            },
        ],
    });
    return table;
}

function init_master_view() {
    console.log('init master view');
    $('#master_view_current').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
        init_EasyPieChart();
    });
    var c_parse = function (number) {
        if (isNaN(number)) return 0;
        else return parseFloat(number);
    }
    var format = function (d) {
        console.log(d);
        // `d` is the original data object for the row
        return '<table cellspacing="10" width="70%">' +
            '<tr>' +
            '<td><span class="image"><img src="/static/images/img.jpg" alt="img" style="height:100px;" /></span></td>' +
            '<td><span>Lifetime Value: ' + d.cltv + '</span><div class="clearfix"></div><span>CLTV Differentiator: 0</span></td>' +
            '<td><div style="text-align: center; margin-bottom: 17px"><span class="chart" data-percent="' + c_parse(d.percent_cltv) + '"><span class="percent"></span></span></div><div style="text-align: center;">Value</div></td>' +
            '<td><div style="text-align: center; margin-bottom: 17px"><span class="chart" data-percent="' + c_parse((c_parse(d.percent_cltv) + c_parse(d.percent_churn)) / 2) + '"><span class="percent"></span></span></div><div style="text-align: center;">Loyalty</div></td>' +
            '<td><div style="text-align: center; margin-bottom: 17px"><span class="chart" data-percent="' + c_parse(d.percent_churn) + '"><span class="percent"></span></span></div><div style="text-align: center;">Engagement</div></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Top Recommendations:</td>' +
            '<td colspan="4">' + d.top_recommendations + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Favorite Recommendations:</td>' +
            '<td colspan="4">' + d.favorite_recommendations + '</td>' +
            '</tr>' +
            '</table>';
    };

    var show_graphs = async function () {
        var graphs = $('.dashboard_graphs');
        console.log(graphs);
        for (var i = 0; i < graphs.length; i++) {
            var element = $(graphs[i]).attr('id');
            console.log(element);
            await _graphs(element);
        }
    }
    var _create_cltv_graph = function (obj) {
        return new Promise(function (resolve, reject) {
            try {
                console.log(obj);
                var xvalues = [obj['max'], obj['3q'], obj['median'], obj['mean'], obj['1q'], obj['min']];
                var yvalues = ['max', '3q', 'median', 'mean', '1q', 'min'];

                var trace1 = {
                    x: xvalues,
                    y: yvalues,
                    xaxis: 'x1',
                    yaxis: 'y1',
                    type: 'bar',
                    marker: {
                        color: 'rgba(26, 187, 156,0.7)',
                        line: {
                            color: 'rgba(115,135,156,0.7)',
                            width: 1
                        }
                    },
                    orientation: 'h'
                };

                var data = [trace1];

                var layout = {
                    margin: {
                        l: 60,
                        r: 20,
                        b: 40,
                        t: 20,
                        pad: 0
                    },
                    font: {
                        color: 'rgba(115,135,156,0.7)',
                        style: 'Trebuchet MS',
                        size: 12,
                    },
                    annotations: [],
                    xaxis: {
                        title: 'CLTV',
                        titlefont: {
                            color: '#73879C',
                            family: 'Trebuchet MS',
                            size: 12,
                        },
                        showgrid: true,
                    },
                    yaxis: {
                        title: "Summary",
                        titlefont: {
                            color: '#73879C',
                            family: 'Trebuchet MS',
                            size: 12,
                        },
                        type: "category",
                        showgrid: true,
                    }
                };

                for (var i = 0; i < xvalues.length; i++) {
                    var result = {
                        xref: 'x1',
                        yref: 'y1',
                        x: xvalues[i] + 2,
                        y: yvalues[i],
                        text: (xvalues[i]).toFixed(1),
                        showarrow: false,
                        font: {
                            family: 'Trebuchet MS',
                            size: 13,
                            color: "rgba(115,135,156,0.7)"
                        }
                    };
                    layout.annotations.push(result);
                }

                resolve(Plotly.newPlot('cltv_summary', data, layout, { displayModeBar: false }));
            }
            catch (e) {
                console.log(e);
                $('#cltv_summary').html('<div class="text-center"><h3>N/A</h3></div>')
                resolve(e);
            }
        });
    }
    var _create_value_graph = function (obj) {
        return new Promise(function (resolve, reject) {
            try {
                console.log(obj);
                var xvalues = ['Very High', 'High', 'Medium', 'Low', 'Very Low', 'Min'];
                var yvalues = [obj['Very High'], obj['High'], obj['Medium'], obj['Low'], obj['Very Low'], obj['Min']];

                var trace1 = {
                    x: xvalues,
                    y: yvalues,
                    type: 'scatter',
                    fill: 'tonexty',
                    marker: {
                        color: 'rgba(26, 187, 156,0.7)',
                        line: {
                            color: 'rgba(115,135,156,0.7)',
                            width: 1
                        }
                    }
                };

                var data = [trace1];

                var layout = {
                    annotations: [],
                    margin: {
                        l: 60,
                        r: 20,
                        b: 40,
                        t: 20,
                        pad: 0
                    },
                    font: {
                        color: 'rgba(115,135,156,0.7)',
                        family: 'Trebuchet MS',
                        size: 12,
                    },
                    showlegend: false,
                    xaxis: {
                        title: 'Value Segments',
                        titlefont: {
                            color: '#73879C',
                            family: 'Trebuchet MS',
                            size: 12,
                        }
                    },
                    yaxis: {
                        title: 'Lifetime Value $',
                        titlefont: {
                            color: '#73879C',
                            family: 'Trebuchet MS',
                            size: 12,
                        },
                        showline: true,
                    }
                };

                for (var i = 0; i < yvalues.length; i++) {
                    var result = {
                        x: xvalues[i],
                        y: yvalues[i] + 1,
                        text: (yvalues[i]).toFixed(1),
                        showarrow: false,
                        font: {
                            family: 'Trebuchet MS',
                            size: 13,
                            color: 'rgba(115,135,156,0.7)'
                        }
                    };
                    layout.annotations.push(result);
                }

                resolve(Plotly.newPlot('value', data, layout, { displayModeBar: false }));
            }
            catch (e) {
                console.log(e);
                $('#value').html('<div class="text-center"><h3>N/A</h3></div>');
                resolve(e);
            }
        });
    }
    var _create_engagement_graph = function (obj) {
        return new Promise(function (resolve, reject) {
            try {
                console.log(obj);
                var xvalues = ['Very High', 'High', 'Medium', 'Low', 'Very Low', 'Min'];
                var yvalues = [obj['Very High'], obj['High'], obj['Medium'], obj['Low'], obj['Very Low'], obj['Min']];

                var trace1 = {
                    x: xvalues,
                    y: yvalues,
                    type: 'scatter',
                    fill: 'tonexty',
                    marker: {
                        color: 'rgba(26, 187, 156,0.7)',
                        line: {
                            color: 'rgba(115,135,156,0.7)',
                            width: 1
                        }
                    }
                };

                var data = [trace1];

                var layout = {
                    annotations: [],
                    margin: {
                        l: 60,
                        r: 20,
                        b: 40,
                        t: 20,
                        pad: 0
                    },
                    font: {
                        color: 'rgba(115,135,156,0.7)',
                        family: 'Trebuchet MS',
                        size: 12,
                    },
                    showlegend: false,
                    xaxis: {
                        title: 'Engagement Segments',
                        titlefont: {
                            color: '#73879C',
                            family: 'Trebuchet MS',
                            size: 12,
                        },
                    },
                    yaxis: {
                        title: 'Transactions',
                        titlefont: {
                            color: '#73879C',
                            family: 'Trebuchet MS',
                            size: 12,
                        },
                        showline: true,
                    }
                };

                for (var i = 0; i < yvalues.length; i++) {
                    var result = {
                        x: xvalues[i],
                        y: yvalues[i] + 1,
                        text: (yvalues[i]).toFixed(1),
                        showarrow: false,
                        font: {
                            family: 'Trebuchet MS',
                            size: 13,
                            color: 'rgba(115,135,156,0.7)'
                        }
                    };
                    layout.annotations.push(result);
                }
                resolve(Plotly.newPlot('engagement', data, layout, { displayModeBar: false }));
            }
            catch (e) {
                console.log(e);
                $('#engagement').html('<div class="text-center"><h3>N/A</h3></div>')
                resolve(e);
            }
        });
    }
    var _create_bio_graph = function (obj) {
        return new Promise(function (resolve, reject) {
            try {
                console.log(obj);
                var xValue = [];
                var yValue = [];
                for (item in obj) {
                    xValue.push(obj[item]['arpu']);
                    yValue.push(obj[item]['cluster']);
                }
                var trace1 = {
                    x: xValue,
                    y: yValue,
                    type: 'bar',
                    marker: {
                        color: 'rgba(115,135,156,0.7)',
                        line: {
                            color: 'rgba(26, 187, 156,0.7)',
                            width: 1
                        }
                    },
                    orientation: 'h'
                };
                data = [trace1];

                var layout = {
                    margin: {
                        l: 60,
                        r: 20,
                        b: 40,
                        t: 20,
                        pad: 0
                    },
                    font: {
                        color: 'rgba(115,135,156,0.7)',
                        style: 'Trebuchet MS',
                        size: 12,
                    },
                    annotations: [],
                    xaxis: {
                        title: 'Profitability',
                        titlefont: {
                            color: '#73879C',
                            family: 'Trebuchet MS',
                            size: 12,
                        },
                        showgrid: true,
                    },
                    yaxis: {
                        title: "Bio-Clusters",
                        type: "category",
                        titlefont: {
                            color: '#73879C',
                            family: 'Trebuchet MS',
                            size: 12,
                        },
                        showgrid: true,
                    }
                };

                for (var i = 0; i < xValue.length; i++) {
                    var result = {
                        xref: 'x1',
                        yref: 'y1',
                        x: xValue[i] + 1,
                        y: yValue[i],
                        text: (xValue[i]).toFixed(1),
                        showarrow: false,
                        font: {
                            family: 'Trebuchet MS',
                            size: 13,
                            color: "rgba(115,135,156,0.7)"
                        }
                    };
                    layout.annotations.push(result);
                }

                resolve(Plotly.newPlot('bio', data, layout, { displayModeBar: false }));
            }
            catch (e) {
                console.log(e);
                $('#bio').html('<div class="text-center"><h3>N/A</h3></div>')
                resolve(e);
            }
        });
    }

    var _graphs = function (element) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                headers: { "X-CSRFToken": $("input[name*='csrfmiddlewaretoken']").val() },
                url: window.location.pathname.toLowerCase(),
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({ 'graph': element }),
                dataType: 'json',
                success: function (result) {
                    var response = result;
                    if (response['status'] == 'SUCCESS') {
                        var graph = response['graph'];
                        if (element == 'cltv_summary') {
                            resolve(_create_cltv_graph(graph));
                        }
                        else if (element == 'value') {
                            resolve(_create_value_graph(graph));
                        }
                        else if (element == 'engagement') {
                            resolve(_create_engagement_graph(graph));
                        }
                        else if (element == 'bio') {
                            resolve(_create_bio_graph(graph));
                        }
                    }
                    else {
                        console.log(result);
                        reject(result);
                    }
                },
                error: function (e) {
                    console.log(e);
                    reject(e);
                }
            });
        });
    }
    $('#master_table_status').html('(' + $('.current-page a').html() + ')');
    show_graphs();
}

function loading_html() {
    return `
    <div class="row" style="display: none;" id="loading-indicator">
        <div class="col-lg-2 col-lg-offset-5">
            <img src="/static/images/loading.gif" alt="">
        </div>
    </div>
    `
}

function init_experiments() {

    var graph_color = function (i) {
        if (i % 2 == 0) {
            return 'rgba(26,187,156, 0.7)'
        }
        else {
            return 'rgba(42,63,84, 0.7)'
        }
    }

    var user_data = function (start) {
        data = {
            sort: $('#filter-form #sort').val(),
            campaign_type: $('#filter-form #campaign_type').val(),
            campaign_platform: $('#filter-form #campaign_platform').val(),
            after_start_date: $('#filter-form #after_start_date').val(),
            experiment_type: $('#filter-form #experiment_type').val(),
            search: $('#filter-form #search').val(),
            experiment: $('#filter-form #experiment').val(),
            start: start,
        }
        return data;
    }

    var drawTable = function (json) {
        if (json == null) {
            return null;
        }
        var th = "";
        var tr = "";
        var headings = [];
        th += '<table class="table table-bordered"><thead>'
        tr += '<tbody>'
        for (var item in json) {
            th += '<td>' + prettifyCamelCase(item) + '</td>';
            headings.push(item);
        }
        th += '</thead>';
        for (var val in json[headings[0]]) {
            tr += '<tr>'
            for (var heading in headings) {
                if (isNaN(json[headings[heading]][val])) {
                    tr += '<td>' + json[headings[heading]][val] + '</td>'
                }
                else {
                    tr += '<td>' + parseFloat(json[headings[heading]][val]).toFixed(2) + '</td>'
                }

            }
            tr += '</tr>';
        }
        tr += '</tbody></table>'
        return th + tr;
    };

    var _createTable = function (element, data) {
        console.log(drawTable(data));
        $(element).html(drawTable(data));
        return true;
    };

    var _createGraph = function (element, graphs) {
        console.log(element);
        console.log(graphs);
        return new Promise(function (resolve, reject) {
            if (element.indexOf('filter') != -1) {
                resolve(_createFilterGraph(element, graphs));
            }
            else if (element.indexOf('metric') != -1) {
                resolve(_createMetricGraph(element, graphs));
            }
            else if (element.indexOf('dimension') != -1) {
                resolve(_createDimensionGraph(element, graphs));
            }
        });
    };

    var getMetricGraph = async function () {
        var campaign_id = $('#campaign_detail').attr('data-campaign_id');
        var metric = $('#metric').val();
        var time_dimension = $('#time_dimension').val();
        var tablename = $('#campaign_detail').attr('data-tablename');
        data = {
            'metric': metric,
            'time_dimension': time_dimension,
            'campaign_id': campaign_id,
            'experiment_table': tablename
        }
        element = {
            'graph': '#metricGraph',
            'table': '#metricTable'
        }
        console.log(data);
        console.log(element);
        await _getGraph(element, data);
    };

    var getDimensionGraph = async function () {
        var data = {
            'dimension': $('#dimension').val(),
            'metric': $('#metric').val(),
            'time_dimension': $('#time_dimension').val(),
            'campaign_id': $('#campaign_detail').attr('data-campaign_id'),
            'experiment_table': $('#campaign_detail').attr('data-tablename'),
        }
        var element = {
            'graph': '#dimensionGraph',
            'table': '#dimensionTable',
        }
        console.log(data);
        console.log(element);
        await _getGraph(element, data);
    };

    var getFilterGraph = async function () {
        var data = {
            'filter': $('#filter').val(),
            'condition': $('#condition').val(),
            'value': $('#value').val(),
            'metric': $('#metric').val(),
            'time_dimension': $('#time_dimension').val(),
            'campaign_id': $('#campaign_detail').attr('data-campaign_id'),
            'experiment_table': $('#campaign_detail').attr('data-tablename')
        }
        var element = {
            'graph': '#filterGraph',
            'table': '#filterTable',
        }
        console.log(data);
        console.log(element);
        await _getGraph(element, data);
    };

    var _getGraph = function (element, data) {
        return new Promise(function (resolve, reject) {
            var url = null;
            if (element['graph'].indexOf('dimension') != -1) {
                url = '/experiments/graphs-dimension'
            }
            else if (element['graph'].indexOf('filter') != -1) {
                url = '/experiments/graphs-filter'
            }
            else if (element['graph'].indexOf('metric') != -1) {
                url = '/experiments/graphs'
            }
            console.log(url);
            $.ajax({
                headers: { "X-CSRFToken": $("input[name*='csrfmiddlewaretoken']").val() },
                url: url,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    var response = [];
                    if (typeof result == 'object') {
                        if (result['table'] != null) {
                            var table = $.parseJSON(JSON.stringify(result['table']).split("null").join(/\bNaN\b/g));
                            response.push(_createTable(element['table'], table));
                        }
                        else {
                            response.push($(element['table']).html('No Result Found...'));
                        }
                        if (result['graphs'] != null) {
                            var graphs = $.parseJSON(JSON.stringify(result['graphs']).split("null").join(0));
                            response.push(_createGraph(element['graph'], graphs));
                        }
                        else {
                            response.push($(element['graph']).html('No Result Found...'));
                        }
                    }
                    else {
                        response.push($(element['graph']).html('Failed To Load Graph'));
                        response.push($(element['table']).html('Failed To Load Table'));
                    }
                    resolve(response);
                },
                error: function (e) {
                    console.log(e);
                    $(element['graphs']).html('Failed To Load Graph');
                    $(element['table']).html('Failed To Load Table');
                    resolve(e);
                }
            });
        });
    };

    var _createMetricGraph = function (element, graphs) {
        var data = [];
        var count = 0;
        for (item in graphs) {
            data.push({
                y: graphs[item],
                type: 'box',
                name: item.toString(),
                marker: {
                    color: graph_color(count)
                },
            });
            count++;
        }
        var layout = {
            font: {
                color: 'rgba(115,135,156,0.7)',
                style: 'Trebuchet MS',
                size: 12,
            },
        };
        $(element).html('');
        if (data == null) {
            $(element).html('No Result Found...');
        }
        else {
            Plotly.newPlot(element.replace('#', ''), data, layout, { displayModeBar: false });
        }
        return true;
    };

    var _createDimensionGraph = function (element, graphs) {
        var obj = graphs;
        var data = [];
        var count = 0;
        for (item in obj) {
            data.push({
                x: obj[item]['x'],
                y: obj[item]['y'],
                name: item,
                error_y: {
                    type: 'data',
                    array: obj[item]['z'],
                    visible: true,
                },
                marker: {
                    color: graph_color(count)
                },
                type: 'bar'
            });
            count++;
        }
        $(element).html('');
        var layout = {
            barmode: 'group',
            font: {
                color: 'rgba(115,135,156,0.7)',
                style: 'Trebuchet MS',
                size: 12,
            },
        };

        if (data == null) {
            $(element).html('No Result Found...');
        }
        else {
            Plotly.newPlot(element.replace('#', ''), data, layout, { displayModeBar: false });
        }
        return true;
    };

    var _createFilterGraph = function (element, graphs) {
        var data = [];
        var count = 0;
        for (item in graphs) {
            data.push({
                y: graphs[item],
                type: 'box',
                name: item.toString(),
                marker: {
                    color: graph_color(count)
                }
            });
            count++;
        }
        var layout = {
            font: {
                color: 'rgba(115,135,156,0.7)',
                style: 'Trebuchet MS',
                size: 12,
            },
        };

        $(element).html('');
        if (data == null) {
            $(element).html('No Result Found...');
        }
        else {
            Plotly.newPlot(element.replace('#', ''), data, layout, { displayModeBar: false });
        }
        return true;
    };







    var _createRevenue = function (revenue) {
        var revenue = parseFloat((revenue / 10000) * 100).toFixed(0);
        $('#revenue_bar #revenue_bar_div').attr('data-transitiongoal', revenue);
        $('#revenue_bar #revenue_bar_div').css('width', revenue + '%');
        $('#revenue_bar #revenue_bar_text').html(revenue + '%');
        $('#revenue_bar').css('display', 'block');
        return true;
    }



    var loadCampaigns = async function (data) {
        $('#no_result_found').css('display', 'none');
        $('#loadMoreButton').hide();
        $($('#loadMoreButton').attr('data-loading')).show();
        if (await _loadCampaigns(data) != 0) {
            $(this).attr('data-start', data['start'] * 2);
            $($('#loadMoreButton').attr('data-loading')).hide();
            $('#loadMoreButton').show();
            if (data['start'] != 0) {
                $('#campaign_list_scroll').animate({ scrollTop: $('#campaign_list_scroll')[0].scrollHeight }, 1500, 'swing');
            }
        }
        else {
            $($('#loadMoreButton').attr('data-loading')).hide();
            $('#no_result_found').css('display', 'block');
        }

    };

    var reloadCampaigns = async function (data) {
        $('#no_result_found').css('display', 'none');
        $('#campaign_list').html('');
        $('#campaign_detail_box').html("<h3>Click On Any Campaign On Left Side To View It's Details.</h3>");
        $('#loadMoreButton').hide();
        $($('#loadMoreButton').attr('data-loading')).show();
        if (await _loadCampaigns(data)) {
            $(this).attr('data-start', data['start'] * 2);
        }
        $($('#loadMoreButton').attr('data-loading')).hide();
        if ($('#campaign_list li').length == 0) {
            $('#no_result_found').css('display', 'block');
        }
        else {
            $('#loadMoreButton').show();
            if (data['start'] != 0) {
                $('#campaign_list_scroll').animate({ scrollTop: $('#campaign_list_scroll')[0].scrollHeight }, 1500, 'swing');
            }
        }
    };

    var parse_list_item = function (item) {
        var strVar = "";
        strVar += "<li @click='change' class='campaign_timeline' data-campaign_id='" + item['campaign_id'] + "' data-cust_id='" + item['cust_id'] + "' data-value='" + JSON.stringify(item) + "'>";
        strVar += "  <div class=\"block\">";
        strVar += "    <div class=\"tags\">";
        strVar += "      <a href=\"\" class=\"tag\">";
        strVar += "        <span>" + item['campaign_start_date'] + "<\/span>";
        strVar += "      <\/a>";
        strVar += "    <\/div>";
        strVar += "    <div class=\"block_content\">";
        strVar += "      <h2 class=\"title\">";
        strVar += "        <a>" + item['campaign_name'] + "<\/a>";
        strVar += "      <\/h2>";
        strVar += "      <div class=\"byline\">";
        strVar += "        <span>Platform<\/span> : <a>" + item['campaign_platform'] + "<\/a>";
        strVar += "      <\/div>";
        strVar += "      <div class=\"byline\">";
        strVar += "        <span>Type<\/span> : <a>" + item['campaign_type'] + "<\/a>";
        strVar += "      <\/div>";
        strVar += "    <\/div>";
        strVar += "  <\/div>";
        strVar += "<\/li>";
        return strVar;
    };

    var appendCampaigns = function (data) {
        for (item in data) {
            $('#campaign_list').append(parse_list_item(data[item]));
        }
        return true;
    };

    var _loadCampaigns = function (data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                headers: { "X-CSRFToken": $("input[name*='csrfmiddlewaretoken']").val() },
                url: '/experiments/',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function (response) {
                    console.log(response);
                    if (response['status'] == 'SUCCESS') {
                        if (response['data'].length == 0) {
                            resolve(0)
                        }
                        else {
                            resolve(appendCampaigns(response['data']));
                        }
                    }
                    else {
                        resolve(response);
                    }
                },
                error: function (e) {
                    console.log(e);
                    resolve(e);
                }
            });
        });
    };

    var _showCampaignDetail = function (campaign_id, cust_id, item) {
        return new Promise(function (resolve, reject) {
            data = {
                'campaign_id': campaign_id,
                'cust_id': cust_id
            };
            console.log(item);
            var template = $('#campaign_detail_template').html();;
            Mustache.parse(template);
            rendered = Mustache.render(template, {
                experiment: item
            });
            $('#campaign_detail_box').html(rendered);
            init_IonRangeSlider();
            resolve(data);

        });
    };

    var showCampaignDetail = async function (campaign_id, cust_id, item) {
        await _showCampaignDetail(campaign_id, cust_id, item);
    };

    $(document).on('click', '#loadMoreButton', function (event) {
        var start = parseInt($('#loadMoreButton').attr('data-start'));
        loadCampaigns(user_data(start));
    });

    $(document).on('click', '.campaign_timeline', function (event) {
        var campaign_id = $(this).attr('data-campaign_id');
        var cust_id = $(this).attr('data-cust_id');
        var item = $.parseJSON($(this).attr('data-value'));
        showCampaignDetail(campaign_id, cust_id, item);
        $('#loading-indicator2').css('display', 'block');
        $('#campaign_detail').css('display', 'none');
        setTimeout(function () {
            $.when(getMetricGraph(), getDimensionGraph(), getFilterGraph()).then(function () {
                $('#campaign_detail').css('display', 'block');
                $('#loading-indicator2').css('display', 'none');
            });
        }, 1500);
    });

    $(document).on('change', '#metric', function (event) {
        getMetricGraph();
    });

    $(document).on('change', '#time_dimension', function (event) {
        getMetricGraph();
    });

    $(document).on('change', '#dimension', function (event) {
        getDimensionGraph();
    });

    $(document).on('click', '#filter_submit', function (event) {
        event.stopPropagation();
        event.preventDefault();
        getFilterGraph();
    });

    $(document).on('click', '#submit_filter', function (event) {
        event.stopPropagation();
        event.preventDefault();
        reloadCampaigns(user_data(0));
    });

    loadCampaigns(user_data(0));
}

function init_mustachejs() {
    console.log('init mustachejs');
    Mustache.tags = ['[[', ']]'];
}

function prettifyCamelCase(str) {
    var output = "";
    var len = str.length;
    var char;

    for (var i = 0; i < len; i++) {
        char = str.charAt(i);

        if (i == 0) {
            output += char.toUpperCase();
        }
        else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
            output += " " + char;
        }
        else if (char == "-" || char == "_") {
            output += " ";
        }
        else {
            output += char;
        }
    }

    return output;
}

function init_chatbot() {
    $(document).on('click', '#chat_button', function (event) {
        event.stopPropagation();
        event.preventDefault();
        $('#chat_input').focus();
        $('#chat_input').select();
        $("#chat_window").animate({ height: 'toggle' });
        $('#chat_body').animate({ scrollTop: $('#chat_body')[0].scrollHeight }, '150', 'swing');
    });
    var _user_msg = function (message, time) {
        var msg = "";
        msg += "<li class='media event padded'>";
        msg += "    <a class='pull-left'>";
        msg += "        <img src='/static/images/img.jpg ' class='img-circle' style=' width:25px !important;'>";
        msg += "    </a>";
        msg += "    <div class='media-body text-muted received_msg'>";
        msg += "        <p class='chat_message'>" + message + "</p>";
        // msg += "        <p> <small class='chat_time'>"+time+"</small>";
        msg += "        </p>";
        msg += "    </div>";
        msg += "</li>";
        // var el = $(msg);
        // $(el).filter('#message').html(message.toString());
        // $(el).filter('#time').html(time);
        // return $(el);
        return msg;
    }
    var _bot_msg = function (message, time) {
        var msg = "";
        msg += "<li class='media event padded'>";
        msg += "    <a class='pull-right'>";
        msg += "        <img src='/static/images/mia.png ' class='img-circle' style=' width:25px !important;'>";
        msg += "    </a>";
        msg += "    <div class='media-body send_msg pull-right'>";
        msg += "        <p class='chat_message'>" + message + "</p>";
        // msg += "        <p> <small class='chat_time'>"+time+"</small>";
        msg += "        </p>";
        msg += "    </div>";
        msg += "</li>  ";
        // var el = $(msg);
        // $(el).filter('#message').html(message.toString());
        // $(el).filter('#time').html(time);
        // return $(el);
        return msg;
    }
    var _chatInit = function () {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: '/am/new_view/',
                type: 'GET',
                dataType: 'JSON',
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    for (t = 0; t < response.length; t++) {
                        updateChatbot(response[t].send_by, response[t].message, response[t].time);
                    }
                    resolve(true);
                },
                error: function (e) {
                    console.log(e);
                    reject(e);
                }
            });
        });
    }
    var updateChatbot = function (user, message, time) {
        $('#chat_body').append(function () {
            if (user == 'bot') {
                return _bot_msg(message, time);
            }
            else {
                return _user_msg(message, time);
            }
        });
        $('#chat_body').scrollTop($('#chat_body')[0].scrollHeight);
        return true;
    }
    var test_notification = function (message) {
        if (Notification.permission === "granted") {
            generateMessage(message)
        }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                alert("Please Accept Permission")
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    generateMessage(message)
                }
            });
        }

        function generateMessage(message) {
            var options = {
                body: message,
                icon: "/static/assets/images/mia.png"
            }
            var n = new Notification("Tuple Mia", options);
        }
    }
    var mia_writing = function (toggle) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (toggle == 'show') {
                    $('#chat_input').val('');
                    $('#chat_input').attr('disabled', 'disabled');
                    resolve($('#mia_writing').css('display', 'block'));
                }
                else {
                    $('#chat_input').removeAttr('disabled');
                    $('#chat_input').focus();
                    $('#chat_input').select();
                    resolve($('#mia_writing').css('display', 'none'));
                }
            }, 1000);
        });
    }
    var submitInput = async function (value) {
        console.log(value);
        try {
            await _getBotResponse(value);
            return true;
        }
        catch (e) {
            console.log('SubmitInputError');
            console.log(e);
            return false;
        }
    }
    var _getBotResponse = function (value) {
        return new Promise(function (resolve, reject) {
            try {
                $.ajax({
                    url: '/am/reply/?agent_type=bot&input=' + value,
                    type: 'GET',
                    dataType: 'text',
                    contentType: "application/text; charset=utf-8",
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (e) {
                        console.log(e);
                        reject(e);
                    }
                });
            }
            catch (e) {
                console.log(e);
                reject(e);
            }

        });
    }
    $(document).on('keypress', '#chat_input', function (event) {
        if (event.which == 13) {
            event.stopPropagation();
            event.preventDefault();
            var value = $(this).val();
            updateChatbot('user', value, 'Now');
            $('#chat_input').val('');
            $('#chat_input').attr('disabled', 'disabled');
            mia_writing('show').then(function (obj) {
                if (window.location.pathname.toLowerCase().includes('/master-view/previous/')) {
                    setTimeout(function () {
                        mia_writing('hide').then(function (obj) {
                            updateChatbot('bot', 'Please Go Back To Current Master View To Run Query.', 'Now');
                        })
                    }, 1000);
                }
                else {
                    _getBotResponse(value).then(function (response) {
                        console.log('when-then');
                        console.log(response);
                        if (response) {
                            try {
                                if (typeof response != 'undefined' || typeof response != 'null') {
                                    try {
                                        console.log(response);
                                        response = $.parseJSON(response);
                                        if (response['url'].length > 0) {
                                            mia_writing('hide').then(function (result) {
                                                for (i = 0; i < response['url'].length; i++) {

                                                    var win = window.open(response['url'][i], '_blank');
                                                    if (win) {
                                                        //Browser has allowed it to be opened
                                                        win.focus();
                                                    } else {
                                                        //Browser has blocked it
                                                        alert('Please allow popups for this website');
                                                    }
                                                    try {
                                                        if (response.notification_message) {
                                                            test_notification(response.notification_message)
                                                        }
                                                    } catch (err) {
                                                        console.log(err)
                                                    }

                                                }
                                            });
                                        }
                                        if (response.message instanceof Array) {
                                            for (i = 0; i < response.message.length; i++) {
                                                // console.log(response.message[i]);
                                                updateChatbot('bot', response.message[i], 'Now');
                                            }
                                        } else {
                                            mia_writing('hide').then(function (result) {
                                                updateChatbot('bot', response.message, 'Now');
                                            });
                                        }
                                    }
                                    catch (e) {
                                        console.log(e);
                                        mia_writing('hide').then(function (result) {
                                            updateChatbot('bot', response, 'Now');
                                            if (response.indexOf('No Result Found') != -1 || response.indexOf('Here is your result. Your data has been stored.') != -1) {
                                                table.ajax.reload();
                                            }
                                        });
                                    }
                                }
                            } catch (e) {
                                console.log(e);
                                mia_writing('hide').then(function (result) {
                                    updateChatbot('bot', 'Sorry Some Error Occurred.\n Please Try Again Or Contact Admin.', 'Now');
                                });
                            }
                            console.log('when-then');
                            console.log(response);
                        }
                    });
                }
            });
        }
    });

    $.when(_chatInit()).done(function (e) {
        console.log(e);
        console.log('Chatbot Init Finished');
        $('#mia_chatbot').css('display', 'block');
    });

}

function init_modeling() {
    var init_reports = function () {
        var els = $('.bio_report');
        for (var i = 0; i < els.length; i++) {
            $(els[i]).media({
                width: '100%',
                height: '400',
                src: $(els[i]).attr('data-path'),
            });
        }
    }
    init_reports();
}

// function init_trigger() {
//     $(document).ready(function () {
//         $(".show_panel").hide();
//         $(".show_panel_btn").click(function () {
//             $(".show_panel_btn").hide();
//             $(".show_panel").slideToggle();

//         });
//     });
//     $(function () {
//         $('#groups').on('change', function () {
//             var val = $(this).val();
//             var sub = $('#sub_groups');
//             $('option', sub).filter(function () {
//                 if (
//                     $(this).attr('data-group') === val
//                     || $(this).attr('data-group') === 'SHOW'
//                 ) {
//                     if ($(this).parent('span').length) {
//                         $(this).unwrap();
//                     }
//                 } else {
//                     if (!$(this).parent('span').length) {
//                         $(this).wrap("<span>").parent().hide();
//                     }
//                 }
//             });
//         });
//         $('#groups').trigger('change');
//     });

//     $(function () {
//         $('#groups1').on('change', function () {
//             var val = $(this).val();
//             var sub = $('#sub_groups1');
//             $('option', sub).filter(function () {
//                 if (
//                     $(this).attr('data-group') === val
//                     || $(this).attr('data-group') === 'SHOW'
//                 ) {
//                     if ($(this).parent('span').length) {
//                         $(this).unwrap();
//                     }
//                 } else {
//                     if (!$(this).parent('span').length) {
//                         $(this).wrap("<span>").parent().hide();
//                     }
//                 }
//             });
//         });
//         $('#groups1').trigger('change');
//     });

//     $(document).on('change', '.filter', function () {

//         var form = $(this).closest('form');
//         var target = form.find('[name*=filter_level]')
//         $.ajax({
//             method: 'GET',
//             url: '/trigger/getfilter/?filter=' + $(this).val(),
//             success: function (result) {
//                 var option = ''
//                 option += '<option value="">Select A Value</option>'
//                 $.each(result, function (k, v) {
//                     option += '<option>' + v + '</option>'
//                 })
//                 $(target).html(option)
//             }
//         })
//     })
//     $(document).on('change', '.query', function (e) {
//         var inputQuery = {}
//         var form
//         inputQuery['data'] = []
//         var formLength = $('.addmore form').length
//         var initial = 0
//         $('.addmore form').each(function () {
//             form = this
//             var filter_level = $(form).find('[name=filter_level]').val()
//             var filtertype = $(form).find('[name=type]').val()
//             var filtervalue = $(form).find('[name*=value]').val()
//             var joinCondition = $(form).find('[name*=joinCondition]').val()
//             if (filtervalue == "" || filter_level == "" || filtertype == "") {
//                 e.stopImmediatePropagation()
//             } else {
//                 var a = {
//                     'filter_level': filter_level,
//                     'filtertype': filtertype,
//                     'filtervalue': filtervalue,
//                 }
//                 if (initial != 0 || initial != formLength - 1) {
//                     a['joinCondition'] = joinCondition
//                 }
//                 inputQuery['data'].push(a)
//             }
//         })
//         if (inputQuery['data'].length > 0) {
//             console.log(inputQuery)
//             $.ajax({
//                 method: 'POST',
//                 data: { 'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(), 'inputQuery': JSON.stringify(inputQuery) },
//                 url: '/trigger/inputvalue/',
//                 success: function (result) {
//                     console.log(result)
//                     if (result == "False" || result == false) {
//                         alert('The Query you selected does not contain any result')
//                         $('[name=submit]').prop('disabled', true);
//                         $('[name=platform]').prop('disabled', true);
//                     } else if (result == "change") {
//                         alert('Previous unsend campaign data found and deleted\n' +
//                             'Form will be reload once again')
//                         location.reload(true)
//                     }
//                     else {
//                         $('[name=submit]').prop('disabled', false);
//                         $('[name=platform]').prop('disabled', false);
//                     }
//                 }
//             })
//         }
//     })

//     $("[name='platform']").on('change', function () {
//         var parrentDiv = $(this).parent().parent().parent().parent().parent().parent().parent()
//         var targetPane = $(parrentDiv).data('pane')
//         console.log(targetPane)
//         var platform = $(this).val()
//         if (platform == "facebook") {
//             var askConfirmation = confirm('You will be redirected to the login page!\n' +
//                 'After this you are not allowed to change platform, to change please reset the form')
//             if (askConfirmation == false) {
//                 $(this).val('')
//                 return
//             }
//         }
//         $.ajax({
//             method: 'GET',
//             url: '/trigger/checklogin/?platform=' + platform,
//             success: function (result) {
//                 console.log(result)
//                 if (result.status == false || result.status == "False") {
//                     var parse = JSON.parse(result.data)
//                     alert(parse.message)
//                     var win = window.open(parse.url, '_blank');
//                     if (win) {
//                         win.focus();
//                     } else {
//                         alert('Please allow popups for this website');
//                     }
//                 } else {
//                     $('#' + targetPane).html('')
//                 }
//             }
//         })
//     })

//     $("[name='submit']").on('click', function () {
//         $(this).prop('disabled', true);
//         var targetDiv = $(this).attr('data-targetForm')
//         var div = $("#" + targetDiv)
//         var platform = $(div).find("[name='platform']").val()
//         var campaign_name = $(div).find("[name='campaign_name']").val()
//         var campaign_objective = $(div).find("[name='campaign_objective']").val()
//         var custom_audience = $(div).find("[name='audience_name']").val()
//         var campaign_type = $(div).find("[name='campaign_type']").val()
//         var experiment_type = $(div).find("[name='experiment_type']").val()
//         if (campaign_name == "" || campaign_objective == "" || campaign_type == "" || platform == "") {
//             alert('Some fields are not filled please fill them!')
//             $(this).prop('disabled', false);
//             return
//         }
//         query = {
//             'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(), 'campaign_name': campaign_name,
//             'campaign_objective': campaign_objective, 'custom_audience': custom_audience,
//             'campaign_type': campaign_type, 'platform': platform, 'experiment': experiment_type
//         }
//         $.ajax({
//             method: "POST",
//             data: query,
//             url: "/trigger/createcampaign/",
//             success: function (result) {
//                 console.log(result)
//                 var parse = JSON.parse(result)
//                 try {
//                     alert(parse.message)
//                     if (parse['url'].length > 0) {
//                         for (i = 0; i < parse['url'].length; i++) {
//                             var win = window.open(parse['url'][i], '_blank');
//                             if (win) {
//                                 win.focus();
//                             } else {
//                                 alert('Please allow popups for this website');
//                             }
//                         }
//                     }
//                     location.reload(true)
//                 } catch (err) {
//                     alert(parse)
//                     alert('Form will be reset now')
//                     $("#resetbtn").click()
//                 }
//             }
//         })
//     })

//     $("[name='platform']").on('change', function () {
//         var list = {}
//         list['facebook'] = {
//             '1': 'BRAND_AWARENESS',
//             '2': 'CANVAS_APP_ENGAGEMENT',
//             '3': 'CANVAS_APP_INSTALLS',
//             '4': 'CONVERSIONS',
//             '5': 'EVENT_RESPONSES',
//             '6': 'LEAD_GENERATION',
//             '7': 'LINK_CLICKS',
//             '8': 'LOCAL_AWARENESS',
//             '9': 'MOBILE_APP_ENGAGEMENT',
//             '10': 'MOBILE_APP_INSTALLS',
//             '11': 'OFFER_CLAIMS',
//             '12': 'PAGE_LIKES',
//             '13': 'POST_ENGAGEMENT',
//             '14': 'REACH',
//             '15': 'VIDEO_VIEWS',
//         }
//         list['mailchimp'] = { '1': 'regular', '2': 'plaintext' }
//         list['adwords'] = { '1': 'Search', '2': 'Display' }
//         var platform = $(this).val()
//         var option = ''
//         option += '<option value="">Select A Value</option>'
//         $.each(list[platform], function (k, v) {
//             option += '<option value=' + k + '>' + v + '</option>'
//         })
//         $("[name='campaign_objective']").html(option)
//     })

//     $(".addfilter").on('click', function () {

//         var size = $('.addmore form').size()
//         var f = '<form action="." method="post"><div class="row">' +
//             '<div class="col col-lg-6 col-lg-offset-5">' +
//             '<select class="form-group query" name="joinCondition">' +
//             '<option value="and">And</option><option value="or">Or</option></select>' +
//             '</div></div><div class="row"> <div class="col col-lg-10"> <div class="col-md-3">' +
//             ' <div class="form-group"> <label>Filter</label> ' +
//             '<select class="col-lg-12 query filter form-control" name="filter" data-target_name="filter_level">' +
//             ' <option value="">Select A Value</option> <option value="predictions">Predictions</option> ' +
//             '<option value="profile">Profile</option> </select> </div> </div><div class="col-md-3"> <div class="form-group"> <label>Filter Level</label> ' +
//             '<select class="col-md-12 query form-control" name="filter_level"> </select> </div> </div> <div class="col-md-3"> ' +
//             '<div class="form-group"> <label>Choose Type</label> ' +
//             '<select class="col-lg-12 query form-control" name="type"> <option value="<">Less Than</option>' +
//             ' <option value="<=">Less Than Equal To</option> <option value="=">Equal To</option>' +
//             ' <option value=">=">Greater Than Equal To</option> <option value=">">Greater Than</option> ' +
//             '</select> </div> </div> ' +
//             ' <div class="col-md-3"> <div class="form-group"> <label>Value</label>' +
//             ' <input type="text" class="query trigger_input form-control" name="value"> </div> </div> </div> ' +
//             '<div style="margin-top: 11px"></div><br><div class="col col-lg-2 text-center">' +
//             '<button id="removefilter" type="button" onclick="removered()" class="btn btn-primary btn-sm trigger_remove ">' +
//             '<span class="glyphicon glyphicon-remove"></span> REMOVE </button></div> </div> </form>'

//         $(".addmore").append(f)
//     })
//     $("#resetbtn, #submit").on("click", function () {
//         $('.show_panel form').each(function () {
//             $(this)[0].reset();
//         })
//         $('[name=submit]').prop('disabled', true);
//         $('[name=platform]').prop('disabled', true);
//         $.ajax({
//             'url': '/trigger/refresh/',
//         })
//     });
//     //confirm js

//     $(document).on('click', '.deletebtn', function () {
//         var askConfirm = confirm("Are you sure you want to delete this campaign?")
//         if (askConfirm) {
//             var div = $(this).closest('.clients-edit');
//             var unique_campaign_id = $(div).data('campaign_id')
//             $.ajax({
//                 url: '/trigger/deletecampaign/',
//                 method: 'POST',
//                 data: { 'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(), 'unique_campaign_id': unique_campaign_id },
//                 success: function (result) {
//                     if (result == true) {
//                         alert('Campaign Successfully Deleted')
//                         $(div).remove();
//                     } else {
//                         alert('ERROR')
//                     }
//                 }
//             })
//             //ajax request
//         }
//     });
//     $(document).on('click', '.powerbtn', function () {
//         var askConfirm = confirm("Are you sure you want to end this campaign?")
//         if (askConfirm) {
//             var currentClass = this
//             var div = $(this).closest('.clients-edit');
//             var unique_campaign_id = $(div).data('campaign_id')
//             $.ajax({
//                 url: '/trigger/endcampaign/',
//                 method: 'POST',
//                 data: { 'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(), 'unique_campaign_id': unique_campaign_id },
//                 success: function (result) {
//                     if (result == true) {
//                         alert('Campaign Successfully Ended')
//                         $(currentClass).removeClass('powerbtn')
//                         $(currentClass).addClass('triggeremove')
//                     } else {
//                         alert('ERROR')
//                     }
//                 }
//             })
//         }
//     });
//     $(document).on("click", ".trigger_remove", function (e) { //user click on remove text
//         e.preventDefault();
//         var form = $(this).closest('form');
//         $(form).remove();
//     })
// }

function init_dashboard() {

    var dbdata;
    var tracedata = []
    var legendCol;
    var originalCol;
    var range = 'Max'
    var start_date;
    var end_date;

    // first col to fetch db data
    fetchdb()
    function fetchdb() {
        // var year = $("#graph_year").val()
        // var month = $("#graph_month").val()
        monthyear = getmonthyear()
        var month = monthyear[0]
        var year = monthyear[1]

        datetofetch = range
        $.ajax({
            url: 'fetchdata/' + year + '/' + month + '/' + datetofetch + '/',
            type: 'get',
            dataType: "JSON"
        }).done(function (result) {
            if (result['data'].length) {
                dbdata = result['data']
                legendCol = result['column_names']
                originalCol = JSON.parse(JSON.stringify(result['column_names']))
                start_date = result['start_date']
                end_date = result['end_date']
                createlegend()
                creategraph()
                createtable()
                fetchlatest()
                createheader()
                $(".data-loading").hide();
            } else {
                alert('Error Occured')
            }
        })
    }

    // this function is used for creating header
    function createheader(col_name = null, x = null, y = null) {

        // here the logic is to fetch the first data index as it contains the latest value
        latest = {}
        if (x == null || col_name == null || y == null) {
            latestvalue = dbdata[0]
            latest = makelatestObject(latestvalue)

        } else {
            // if the data is coming from graph click1
            col_name = col_name.toLowerCase()
            date_c = x
            y = y
            for (v in dbdata) {
                // check if date exists on first index 
                if (date_c == dbdata[v][originalCol.indexOf('date')]) {
                    if (y == dbdata[v][originalCol.indexOf(col_name)]) {
                        // now we have identified the columns not time to process it
                        latest = makelatestObject(dbdata[v])
                    } else {
                        continue
                    }
                    break
                }
            }
        }

        function makelatestObject(data) {
            var temp = {}
            temp['date'] = data[originalCol.indexOf('date')]
            temp['settle'] = data[originalCol.indexOf('settle')]
            temp['change'] = data[originalCol.indexOf('change')]
            temp['open'] = data[originalCol.indexOf('open')]
            temp['high'] = data[originalCol.indexOf('high')]
            temp['low'] = data[originalCol.indexOf('low')]
            temp['volume'] = parseFloat(data[originalCol.indexOf('volume')]).toLocaleString()
            if (parseFloat(temp['change']) > 0) {
                temp['icon'] = 'asc'
                temp['class'] = 'green'
            } else if (parseFloat(temp['change']) < 0) {
                temp['icon'] = 'desc'
                temp['class'] = 'red'

            } else {
                temp['icon'] = ''
                temp['class'] = 'green'

            }
            // process date here
            var date = new Date(temp['date'])
            temp['date'] = date.getDate() + ' ' + date.toLocaleString("en-us", { month: "short" }) + ' ' + date.getFullYear()

            return temp
        }
        // we have now data parse it to html
        for (key in latest) {
            if (key == "change") {
                var content = '<i class="' + latest["class"] + '">'
                content += '<i class="fa fa-sort-' + latest["icon"] + '"></i>'
                content += latest['change'] + ' </i> Change'
                $("#latest-" + key).html(content)
            } else {
                $("#latest-" + key).text(latest[key])
            }
        }

        // if (x == null){
        //     var year = $("#graph_year").val()
        //     var month = $("#graph_month").val()
        //     datetofetch = range
        //     $.ajax({
        //         url:'fetchlatestheader/'+year+'/'+month+'/',
        //         type:'get',
        //         dataType:"JSON",
        //         success:function(sucess){
        //             for (key in sucess){
        //                 if (key == "change"){
        //                     var content = '<i class="'+sucess["class"]+'">'
        //                     content += '<i class="fa fa-sort-'+sucess["icon"]+'"></i>'
        //                     content += sucess['change']+' </i> Change'
        //                     $("#latest-"+key).html(content)
        //                 }else{
        //                     $("#latest-"+key).text(sucess[key])
        //                 }
        //             }
        //         }
        //     })
        // }
    }

    // second now iterate the legend values to see which of the legends are set
    $(document).on('click', '.legend-label', function () {

        // set the click legend box property to true
        $(this).data('selector', $(this).data('selector') == 'enabled' ? 'disabled' : 'enabled')
        $(this).toggleClass("checked");
        creategraph()
    });

    function createTrace() {
        tracedata = []
        var i = 1
        $('.legend-label').each(function () {
            if ($(this).data('selector') == "disabled") {
                i = i + 1
            } else {
                var data = {}
                data['x'] = unpack(dbdata, 0)
                data['type'] = "scatter"
                data['mode'] = "lines"
                data['name'] = 'Open'
                data['line'] = {}
                data['connectgaps'] = true
                colors = ['#E77F52', '#4DA54C', '#9F588E', '#6698CB', '#6B8F4B', '#CE4839', '#8D3960', '#BCB955', '#1B75BB', '#42B0AD', '#E77F52']
                data['name'] = $(this).children().text()
                data['y'] = unpack(dbdata, i)
                data['line']['color'] = colors[i]
                data['hoverinfo'] = 'x+y'
                tracedata.push(data)
                i = i + 1
            }
            // if ($(this).data('legend') == "open"){
            //     data['name'] = 'Open'
            //     data['y'] = unpack(dbdata, 1)
            //     data['line']['color'] = '#E77F52'  
            // }else 
            // if ($(this).data('legend') == "high"){
            //     data['name'] = 'High'
            //     data['y'] = unpack(dbdata, 2)
            //     data['line']['color'] = '#4DA54C'
            // }else if ($(this).data('legend') == "low"){
            //     data['name'] = 'Low'
            //     data['y'] = unpack(dbdata, 3)
            //     data['line']['color'] = '#9F588E'
            // }else if ($(this).data('legend') == "settle"){
            //     data['name'] = 'Settle'
            //     data['y'] = unpack(dbdata, 4)
            //     data['line']['color'] = '#6698CB'
            // }else if ($(this).data('legend') == "change"){
            //     data['name'] = 'Change'
            //     data['y'] = unpack(dbdata, 5)
            //     data['line']['color'] = '#6B8F4B'
            // }else if ($(this).data('legend') == "wave"){
            //     data['name'] = 'Wave'
            //     data['y'] = unpack(dbdata, 6)
            //     data['line']['color'] = '#CE4839'
            // }else if ($(this).data('legend') == "volume"){
            //     data['name'] = 'Volume'
            //     data['y'] = unpack(dbdata, 7)
            //     data['line']['color'] = '#8D3960'
            // }else if ($(this).data('legend') == "prev_day_open_interest"){
            //     data['name'] = 'Prev. Day Open Interest'
            //     data['y'] = unpack(dbdata, 8)
            //     data['line']['color'] = '#BCB955'
            // }else if ($(this).data('legend') == "efp_volume"){
            //     data['name'] = 'EFP Volume'
            //     data['y'] = unpack(dbdata, 9)
            //     data['line']['color'] = '#1B75BB'
            // }else if ($(this).data('legend') == "efs_volume"){
            //     data['name'] = 'EFS Volume'
            //     data['y'] = unpack(dbdata, 10)
            //     data['line']['color'] = '#42B0AD'
            // }else if ($(this).data('legend') == "block_volume"){
            //     data['name'] = 'Block Volume'
            //     data['y'] = unpack(dbdata, 11)
            //     data['line']['color'] = '#E77F52'
            // }
        })
        return tracedata
    }

    function createlegend() {
        console.log('Creating Legend')
        var colnames = legendCol
        var index = colnames.indexOf('date')
        if (index > -1) {
            colnames.splice(index, 1)
        }
        var template = $('#legend_html').html();;
        var rendered = ''
        Mustache.parse(template);
        for (c in colnames) {
            d = colnames[c].replace(/_/g, ' ')
            if (c == 0) {
                selector = 'enabled'
                classT = 'checked'
            } else {
                selector = 'disabled'
                classT = ''
            }
            rendered += Mustache.render(template, {
                legend: d.toProperCase(),
                selector: selector,
                classT: classT
            });
        }
        $('.legend_html').html(rendered)
    }

    function unpack(rows, key) {
        return rows.map(function (row) {
            if (row[key] == "None") {
                return null
            }
            return row[key];
        });
    }

    function creategraph() {
        var data = createTrace();

        var layout = {
            margin: {
                l: 40,
                r: 20,
                b: 10,
                t: 40,
                pad: 0,
            },
            showlegend: false,
            // title: 'Time Series with Rangeslider',
            xaxis: {
                tickcolor: '#000',
                showline: true,
                autorange: true,
                range: [start_date, end_date],
                rangeselector: {
                    visible: false,
                    buttons: [
                        {
                            count: 1,
                            label: '1m',
                            step: 'month',
                            stepmode: 'backward'
                        },
                        {
                            count: 6,
                            label: '6m',
                            step: 'month',
                            stepmode: 'backward'
                        },
                        { step: 'all' }
                    ]
                },
                rangeslider: {
                    visible: true,
                    bgcolor: 'rgb(240, 236, 236)',
                    bordercolor: '#444',
                    borderwidth: 0,
                    thickness: 0.15,
                    autorange: true,
                },
                type: 'date'
            },
            yaxis: {
                tickcolor: '#000',
                showline: true,
                autorange: true,
                //   range: [86.8700008333, 138.870004167],
                type: 'linear'
            }
        };

        Plotly.newPlot('timeplot', data, layout, { displayModeBar: false });

        // intiate click event on plotly graph
        clickPlotlyEvent = document.getElementById('timeplot');

        clickPlotlyEvent.on('plotly_click', function (data) {
            // header change
            if (data.hasOwnProperty('points')) {
                if (data['points'].length > 0) {
                    x = data['points'][0]['x']
                    y = data['points'][0]['y']
                    col_name = data['points'][0]['data']['name']
                    createheader(col_name, x, y)
                }
            }
            // fetchLatest News
            fetchDateSpecficNews(x)
        })

        //Change pointer on hover
        dragLayer = document.getElementsByClassName('nsewdrag')[0]

        clickPlotlyEvent.on('plotly_hover', function(data){
          dragLayer.style.cursor = 'crosshair'
        });

    }

    // function for fetching graph values ie 3D, 3M, 5Y
    $(document).on('click', '.graph_data_range', function () {
        // we add selected class to click button
        $(this).addClass('selected')
        var selected = this
        $('.graph_data_range').each(function () {
            if (this == selected) {
                var a = $(this).children().text()
                range = a
            } else {
                $(this).removeClass('selected')
            }
        })
        // now fetch the data
        fetchdb()
    })

    // fetch latest values for the different table data
    function fetchlatest() {
        var monthyear = getmonthyear()
        var month = monthyear[0]
        var year = monthyear[1]
        $.ajax({
            // url:'/dashboard/fetchlatest/',
            url: 'fetchlatest/',
            data: { 'year': year, 'month': month },
            method: 'GET',
            success: function (result) {
                var table = '<table class="table table-bordered ">'
                for (key in result) {
                    table += '<tr>'
                    table += '<td class="table-link">'
                    table += '<a '
                    table += 'href="' + result[key]['url'] + '"'
                    table += '>'
                    table += result[key]['label']
                    table += '</a>'
                    table += '</td>'
                    table += '<td>'
                    table += result[key]['data']['settle']
                    table += '</td>'
                    table += '</tr>'
                }
                table += '</table>'
                $("#fetch_latest_data").html(table)
            }
        })
    }

    $(document).on('click', "#submityearmonth", function () {
        fetchdb()
    })

    // create table
    function createtable() {
        $('.graph_table').removeAttr('width').DataTable({
            data: dbdata,
            autoWidth: false,
            paging: false,
            scrollY: "400px",
            scrollCollapse: true,
            bFilter: false,
            bInfo: false,
            jQueryUI: true,
            sScrollX: "100%",
            bScrollCollapse: true,
            destroy: true,
            bAutoWidth: false,
            order: [[0, 'desc']],
            columns: colnames(),

        });
    }

    // prototype function to make Title Case Values for the table header
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };

    // fetching colnames for the table
    function colnames() {
        var names = []
        for (c in originalCol) {
            d = originalCol[c].replace(/_/g, ' ')
            t = {}
            t['title'] = d.toProperCase()
            names.push(t)
        }
        return names
    }

    function getmonthyear() {
        var month = $("#graph_month").val()
        var year = $("#graph_year").val()
        var date = new Date()
        if (month == undefined) {
            month = date.getMonth() + 1
        }
        if (year == undefined) {
            year = date.getFullYear()
        }
        return [month, year]
    }
}

function init_spreads() {

    var dbdata
    var origData
    var monthDefaultCol = 'avg'
    var yearCol = 'year'
    var dbMonthCol = 'month'
    var standardCol = 'std'
    // start the function initiation
    // fetch monthly graph
    monthlyGraph()
    function monthlyGraph() {
        $(".data-loading").show();
        $(".graph").hide();
        
        var commodity = $('.commodity').val()
        var commodity_metric = $('.commodity_metric').val()
        $.ajax({
            url: 'commodity_graph/',
            data: { 'commodity': commodity, 'commodity_metric': commodity_metric },
            type: 'get',
            dataType: "JSON"
        }).done(function (result) {
            if (result.hasOwnProperty('data')) {
                if (result['data'].length) {
                    $(".graph").show();
                    dbdata = result['data']
                    origData = result
                    makeMonthlyGraphData()
                    createStandardTable()
                    makeSeasonGraphData()
                    makeHeader()
                    createSpreadTable()

                    $(".data-loading").hide()
                } else {
                    alert('Error Occured')
                }
            } else {
                alert('Error Occured')
            }
        })
    }

    // to create spread table graph
    function createSpreadTable() {

        var x = $('.spreads_x').val().toLowerCase()
        var y = $('.spreads_y').val().toLowerCase()

        var x_year = $('.spreads_x_year').val()
        var y_year = $('.spreads_y_year').val()

        var xFetch = headerHeaderValue(x, x_year)
        var yFetch = headerHeaderValue(y, y_year)

        var yheader = yFetch[0]
        var yheaderValue = yFetch[1]

        var xheader = xFetch[0]
        var xheaderValue = xFetch[1]

        var body = []
        for (key in yheader) {
            body[key] = Array.from(Array(xheader.length + 1))
            body[key][0] = yheader[key]
            for (d in xheaderValue) {
                var tempIndex = parseFloat(d) + 1
                body[key][tempIndex] = (parseFloat(yheaderValue[key]) - parseFloat(xheaderValue[d])).toFixed(2)
            }
        }

        var header = $('#spreads_header').html();

        header = Mustache.render(header, {
            head: xheader,
        });

        $('#spreads_table').html(header)

        var bodyTemplate = $("#standard_body").html()

        bodyTemplate = Mustache.render(bodyTemplate, {
            body: body
        })

        $('#spreads_table').append(bodyTemplate)

    }
    // function for fetching header and its values for graph
    function headerHeaderValue(range, year_limit = null) {
        /*
            This function return header and header value
            based on the input range ie 
            range can be either month,year,season
            year_limit is for limit data to a particular year
        */
        if (year_limit == undefined) {
            year_limit = null
        }
        console.log(range, year_limit)
        var monthIndex = origData['colname'].indexOf(dbMonthCol)
        var colIndex = origData['colname'].indexOf(monthDefaultCol)
        var yearIndex = origData['colname'].indexOf(yearCol)
        header = []
        headerValue = []
        var year = getLegend()

        if (range == "year") {
            header = year
            for (yk in header) {
                var temp = []
                for (d in dbdata) {
                    if (dbdata[d][yearIndex] == header[yk]) {
                        temp.push(dbdata[d][colIndex])
                    }
                }
                var sum = temp.reduce(function (a, b) { return parseFloat(a) + parseFloat(b); });
                var avg = sum / temp.length;
                headerValue.push(parseFloat(avg).toFixed(2))
            }
        } else if (range == "month") {
            for (yk in year) {
                for (key in origData['month']) {
                    for (d in dbdata) {
                        if (year_limit == null) {
                            if ((parseFloat(key) + 1 == dbdata[d][monthIndex]) && year[yk] == dbdata[d][yearIndex]) {
                                header.push(origData['month'][key] + ' ' + year[yk])
                                headerValue.push(dbdata[d][colIndex])
                            }
                        } else {
                            if ((parseFloat(key) + 1 == dbdata[d][monthIndex]) && (year[yk] == dbdata[d][yearIndex]) && (year[yk] == year_limit)) {
                                header.push(origData['month'][key] + ' ' + year[yk])
                                headerValue.push(dbdata[d][colIndex])
                            }
                        }
                    }
                }
            }
        } else if (range == "seasonal") {
            var cus = {}
            custom_d = origData['custom_month']

            // here we are seggrating months with respect to the custom month
            for (key in custom_d) {
                if (cus.hasOwnProperty(custom_d[key])) {
                    cus[custom_d[key]].push(key)
                } else {
                    cus[custom_d[key]] = []
                    cus[custom_d[key]].push(key)
                }
            }
            var cusMonth = {}
            for (key in cus) {
                cusMonth[key] = {}
                for (mon in cus[key]) {
                    for (data in dbdata) {
                        // console.log(parseInt(cus[key][mon]) + 1)
                        if (parseInt(cus[key][mon]) + 1 == dbdata[data][monthIndex]) {
                            if (cusMonth[key].hasOwnProperty(dbdata[data][yearIndex])) {
                                var avg = dbdata[data][colIndex]
                                cusMonth[key][dbdata[data][yearIndex]].push(avg)
                            } else {
                                if (year_limit == null) {
                                    cusMonth[key][dbdata[data][yearIndex]] = []
                                    var avg = dbdata[data][colIndex]
                                    cusMonth[key][dbdata[data][yearIndex]].push(avg)
                                } else {
                                    if (year_limit == dbdata[data][yearIndex]) {
                                        cusMonth[key][dbdata[data][yearIndex]] = []
                                        var avg = dbdata[data][colIndex]
                                        cusMonth[key][dbdata[data][yearIndex]].push(avg)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for (key in cusMonth) {
                for (c in cusMonth[key]) {
                    var sum = cusMonth[key][c].reduce(function (a, b) { return parseFloat(a) + parseFloat(b); });
                    var avg = sum / cusMonth[key][c].length;
                    cusMonth[key][c] = avg
                }
            }

            // this seggrates the custom month values in terms of year
            // ie 2017: {S1: XXX,S2:XXX}
            var yearSeason = {}
            for (key in cusMonth) {
                for (y in cusMonth[key]) {
                    if (yearSeason.hasOwnProperty(y)) {
                        yearSeason[y][key] = cusMonth[key][y]
                    } else {
                        yearSeason[y] = {}
                        yearSeason[y][key] = cusMonth[key][y]
                    }
                }
            }

            for (year in yearSeason) {
                for (s in yearSeason[year]) {
                    header.push(s + ' ' + year)
                    headerValue.push(yearSeason[year][s])
                }
            }
        }

        return [header, headerValue]

    }
    // header layout
    function makeHeader() {
        var year = getLegend()
        var yearIndex = origData['colname'].indexOf(yearCol)
        var colIndex = origData['colname'].indexOf(monthDefaultCol)
        // calculate the avg value per year
        avg_year = {}
        for (key in year) {
            // avg_year[]
            avg_year[year[key]] = []
            for (d in dbdata) {
                if (year[key] == dbdata[d][yearIndex]) {
                    avg_year[year[key]].push(dbdata[d][colIndex])
                }
            }
            var sum = avg_year[year[key]].reduce(function (a, b) { return parseFloat(a) + parseFloat(b); });
            var avg = sum / avg_year[year[key]].length;
            avg_year[year[key]] = parseFloat(avg).toFixed(2);

        }
        // value has been calculated append it to template
        var template = $('#latest_header').html()
        var render = '';
        for (key in avg_year) {
            render += Mustache.render(template, {
                year: key,
                year_value: avg_year[key]
            })
        }
        // append it to template
        $('.latest_header').html(render)
    }
    // season graph
    function makeSeasonGraphData() {

        var series = []
        var cus = {}
        var yearIndex = origData['colname'].indexOf(yearCol)
        var colIndex = origData['colname'].indexOf(monthDefaultCol)
        var monthIndex = origData['colname'].indexOf(dbMonthCol)
        var cusMonth = {}

        custom_d = origData['custom_month']

        // here we are seggrating months with respect to the custom month
        // i.e S1:[1,2,3],S2:[5,6,7]

        for (key in custom_d) {
            if (cus.hasOwnProperty(custom_d[key])) {
                cus[custom_d[key]].push(key)
            } else {
                cus[custom_d[key]] = []
                cus[custom_d[key]].push(key)
            }
        }

        // here we are pushing column values to the array with year format
        // s1:{2017:[XXX,XX1],2018:[YYY,YYY1]},s2:{2018:[ZZZ,ZZ1]}

        for (key in cus) {
            cusMonth[key] = {}
            for (mon in cus[key]) {
                for (data in dbdata) {
                    if (parseInt(cus[key][mon]) + 1 == dbdata[data][monthIndex]) {
                        if (cusMonth[key].hasOwnProperty(dbdata[data][yearIndex])) {
                            var avg = dbdata[data][colIndex]
                            cusMonth[key][dbdata[data][yearIndex]].push(avg)
                        } else {
                            cusMonth[key][dbdata[data][yearIndex]] = []
                            var avg = dbdata[data][colIndex]
                            cusMonth[key][dbdata[data][yearIndex]].push(avg)
                        }
                    }
                }
            }
        }

        // now individually get the result from each year data and accumulate it
        // i.e find the average at each year
        // s1 : {2017:XXX,2018:yyyy}
        for (key in cusMonth) {
            for (c in cusMonth[key]) {
                var sum = cusMonth[key][c].reduce(function (a, b) { return parseFloat(a) + parseFloat(b); });
                var avg = sum / cusMonth[key][c].length;
                cusMonth[key][c] = avg
            }
        }

        // seggrate the col and avg data in year format
        var custColName = []
        var seasonData = {}

        for (key in cusMonth) {
            custColName.push(key)
            for (y in cusMonth[key]) {
                if (seasonData.hasOwnProperty(y)) {
                    seasonData[y].push(cusMonth[key][y])
                } else {
                    seasonData[y] = []
                    seasonData[y].push(cusMonth[key][y])
                }
            }
        }

        // now prepare the series data for the graph
        for (key in seasonData) {
            t = {}
            t['name'] = key
            t['type'] = 'line'
            t['smooth'] = true
            t['itemStyle'] = {}
            t['itemStyle']['normal'] = {}
            t['itemStyle']['normal']['areaStyle'] = {}
            t['itemStyle']['normal']['areaStyle']['type'] = 'default'
            t['data'] = seasonData[key]
            series.push(t)
        }

        // set graph data for displaying
        graph_data = {}
        graph_data['graph_area'] = 'seasonal_graph'
        graph_data['title'] = 'Seasonal Graph'
        graph_data['legend'] = getLegend()
        graph_data['x_axis'] = custColName
        graph_data['series'] = series
        createGraph(graph_data)

    }

    // monthly graph
    function makeMonthlyGraphData() {
        var series = []
        var d = {}
        var yearIndex = origData['colname'].indexOf(yearCol)
        var colIndex = origData['colname'].indexOf(monthDefaultCol)
        var monthIndex = origData['colname'].indexOf(dbMonthCol)
        for (key in dbdata) {
            if (d.hasOwnProperty(dbdata[key][yearIndex])) {
                var index = parseInt(dbdata[key][monthIndex])
                index = index - 1
                d[dbdata[key][yearIndex]][index] = dbdata[key][colIndex]
            } else {
                d[dbdata[key][yearIndex]] = Array.from(Array(12))
                // intilize the first variable
                var index = parseInt(dbdata[key][monthIndex])
                index = index - 1
                d[dbdata[key][yearIndex]][index] = dbdata[key][colIndex]
            }
        }
        // console.log(d)
        // now we have prepared the data start parsing it
        for (key in d) {
            t = {}
            t['name'] = key
            t['type'] = 'line'
            t['smooth'] = true
            t['itemStyle'] = {}
            t['itemStyle']['normal'] = {}
            t['itemStyle']['normal']['areaStyle'] = {}
            t['itemStyle']['normal']['areaStyle']['type'] = 'default'
            t['data'] = d[key]
            series.push(t)
        }

        // set graph data for displaying
        graph_data = {}
        graph_data['graph_area'] = 'monthly_graph'
        graph_data['x_axis'] = origData['month']
        graph_data['title'] = 'Monthly Graph'
        graph_data['legend'] = getLegend()
        graph_data['series'] = series
        createGraph(graph_data)
    }

    // return the unique year in array list
    // this is used as legend in graph and
    // can be called to get list of unique year
    function getLegend() {
        var year = []
        var yearIndex = origData['colname'].indexOf(yearCol)

        for (key in dbdata) {

            year.push(dbdata[key][yearIndex])
        }

        year = new Set(year)
        year = Array.from(year)
        year = year.sort(function (a, b) { return a - b })
        return year
    }

    // table creatiion
    function createStandardTable() {

        // first make the header
        var year = getLegend()
        var header = $('#standard_header').html();
        header = Mustache.render(header, {
            year: year,
        });

        // second make the body
        var yearIndex = origData['colname'].indexOf(yearCol)
        var colIndex = origData['colname'].indexOf(monthDefaultCol)
        var monthIndex = origData['colname'].indexOf(dbMonthCol)
        var standardIndex = origData['colname'].indexOf(standardCol)

        var body = []
        for (m in origData['month']) {
            body[m] = Array.from(Array(year.length + 1))
            body[m][0] = origData['month'][m]
        }
        for (key in dbdata) {
            var monthT = dbdata[key][monthIndex]
            var yearT = dbdata[key][yearIndex]
            bodyt = year.indexOf(yearT) + 1
            body[monthT - 1][bodyt] = dbdata[key][standardIndex] + '\n' + '(' + dbdata[key][colIndex] + ')'
        }

        var bodyTemplate = $("#standard_body").html()
        bodyTemplate = Mustache.render(bodyTemplate, {
            body: body
        })
        // first empty the html
        $('.standard_dev').html('')
        // append the header
        $('.standard_dev').append(header)
        // now append the body
        $('.standard_dev').append(bodyTemplate)
    }

    // common function for displaying graph 
    function createGraph(graph_data) {
        var echartLine = echarts.init(document.getElementById(graph_data['graph_area']), etheme);

        echartLine.setOption({
            title: {
                text: graph_data['title'],
                subtext: 'Subtitle'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 220,
                y: 40,
                data: graph_data['legend']
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        title: {
                            line: 'Line',
                            bar: 'Bar',
                            stack: 'Stack',
                            tiled: 'Tiled'
                        },
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: graph_data['x_axis']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: graph_data['series']
        });

    }

    // fetch commodity metric 
    $('.commodity').on('change', function () {
        var commodity = $(this).val()
        $.ajax({
            method: 'GET',
            data: { 'commodity': commodity },
            success: function (result) {
                if (result.length > 0) {
                    var select
                    for (key in result) {
                        select += '<option value="' + result[key]['value'] + '">' + result[key]['label'] + '</option>'
                    }
                    $('.commodity_metric').html(select)
                } else {
                    $('.commodity_metric').html()
                }
            }
        })
    })
    // event to change graph on submit button
    $('.submit_commodity').on('click', function () {
        monthlyGraph()
    })

    // event for spread Table
    $(document).on('change', '.spreads_x,.spreads_y', function () {
        // check if there is need to show the year table or not
        if ($('.spreads_x').val().toLowerCase() == "year") {
            $('.spreads_x_year').hide()
        } else {
            renderSpreadYear('spreads_x_year')
            $('.spreads_x_year').show()
        }
        if ($('.spreads_y').val().toLowerCase() == "year") {
            $('.spreads_y_year').hide()
        } else {
            renderSpreadYear('spreads_y_year')
            $('.spreads_y_year').show()
        }

        createSpreadTable()
    })

    // event for spreads year
    $(document).on('change', '.spreads_x_year,.spreads_y_year', function () {
        createSpreadTable()
    })

    // rendering of spreads year
    function renderSpreadYear(class_name) {
        var year = getLegend()
        var option = ''
        for (y in year) {
            option += '<option>' + year[y] + '</option>'
        }

        $('.' + class_name).html(option)
    }

}

$(document).ready(function () {
    // init_mustachejs();
    init_sparklines();
    init_flot_chart();
    init_sidebar();
    init_wysiwyg();
    init_InputMask();
    init_JQVmap();
    init_cropper();
    init_knob();
    init_IonRangeSlider();
    init_ColorPicker();
    init_TagsInput();
    init_parsley();
    init_daterangepicker();
    init_daterangepicker_right();
    init_daterangepicker_single_call();
    init_daterangepicker_reservation();
    init_SmartWizard();
    init_EasyPieChart();
    init_charts();
    init_echarts();
    init_morris_charts();
    init_skycons();
    init_select2();
    init_validator();
    // init_DataTables(); commented default ajax
    init_chart_doughnut();
    init_gauge();
    // init_PNotify();
    init_starrr();
    init_calendar();
    init_compose();
    init_CustomNotification();
    init_autosize();
    init_autocomplete();
    /* CUSTOM */
    if (window.location.pathname.toLowerCase().includes('/dashboard/')) {
        init_dashboard();
    }
    if (window.location.pathname.toLowerCase().includes('/spreads/')) {
        init_spreads();
    }
    // console.log('init_trigger')
    // if (window.location.pathname.toLowerCase().includes('/trigger/')) {
    //     init_trigger();
    //     console.log('init_trigger')
    // }
    // if (window.location.pathname.toLowerCase().includes('/master-view/')) {
    //     if (window.location.pathname.toLowerCase().includes('/previous/')) {
    //         table = init_master_view_current('previous');
    //         init_chatbot();
    //         init_master_view();
    //     }
    //     else {
    //         table = init_master_view_current('current');
    //         init_chatbot();
    //         init_master_view();
    //     }
    // }
});
// 
