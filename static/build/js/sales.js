(function () {
    var _ajax = function (url) {
        var _startdate = $('._startdate').attr('data-target');
        var _enddate = $('._enddate').attr('data-target');
        console.log(JSON.stringify({
            _startdate: _startdate,
            _enddate: _enddate
        }));
        return new Promise(function (resolve, reject) {
            $.ajax({
                headers: {"X-CSRFToken": $("input[name*='csrfmiddlewaretoken']").val()},
                url: url,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify({
                    _startdate: _startdate,
                    _enddate: _enddate
                }),
                success: function (result) {
                    resolve(result['data']);
                },
                error: function (e) {
                    console.log(e);
                    reject(e);
                }
            });
        });
    };

    var init_sales = function () {
        var yoy_url = '/sales/sales-owner/';
        var sales_revenue = function () {
            return new Promise(function (resolve, reject) {
                _ajax(yoy_url).then(function (data) {
                    console.log('revenue');
                    console.log(data);
                    try {
                        $('div[data-target="yoy_grouth_user"]').css('display', 'none');
                        var config = {
                            chart: {
                                zoomType: 'x'
                            },
                            title: {
                                text: ' '
                            },
                            subtitle: {
                                text: ' '
                            },
                            xAxis: {

                                type: 'datetime',
                                gridLineWidth: 1,

                                title: {
                                    text: 'Time Period'
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Profit'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                area: {
                                    fillColor: {
                                        linearGradient: {
                                            x1: 0,
                                            y1: 0,
                                            x2: 0,
                                            y2: 1
                                        },
                                        stops: [
                                            [0, '#1abb9c'],
                                            [1, Highcharts.Color('#1abb9c').setOpacity(0).get('rgba')]
                                        ]
                                    },
                                    marker: {
                                        radius: 2
                                    },
                                    lineWidth: 1,
                                    lineColor: '#1abb9c',
                                    states: {
                                        hover: {
                                            lineWidth: 1
                                        }
                                    },
                                    threshold: null
                                }
                            },
                            series: [{
                                type: 'area',
                                name: 'Profit in $',
                                data: data
                            }],
                            credits: {
                                enabled: false
                            }
                        };
                        resolve(Highcharts.chart('yoy_grouth_user', config));
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        };
        var _sales_store = '/sales/sales-store/';
        var sales_store = function () {
            return new Promise(function (resolve, reject) {
                _ajax(_sales_store).then(function (data) {
                    console.log('store');
                    console.log(data);
                    try {
                        var config = {
                            chart: {
                                zoomType: 'x'
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ' '
                            },
                            xAxis: {

                                type: 'datetime',
                                gridLineWidth: 1,

                                title: {
                                    text: 'Time Period'
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Revenue'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                area: {
                                    fillColor: {
                                        linearGradient: {
                                            x1: 0,
                                            y1: 0,
                                            x2: 0,
                                            y2: 1
                                        },
                                        stops: [
                                            [0, '#1abb9c'],
                                            [1, Highcharts.Color('#1abb9c').setOpacity(0).get('rgba')]
                                        ]
                                    },
                                    marker: {
                                        radius: 2
                                    },
                                    lineWidth: 1,
                                    lineColor: '#1abb9c',
                                    states: {
                                        hover: {
                                            lineWidth: 1
                                        }
                                    },
                                    threshold: null
                                }
                            },

                            series: [{
                                type: 'area',
                                name: 'Revenue in $',
                                data: data
                            }],
                            credits: {
                                enabled: false
                            }
                        };
                        resolve(Highcharts.chart('revenue_grouth_user', config));
                    } catch (e) {
                        reject(e);
                    }

                });
            });
        };
        var draw_graph = function () {
            sales_revenue().then(function () {
                sales_store();
            });
        };
        var get_maximum_date = function () {
            return new Promise(function (resolve, reject) {
                _ajax('/sales/get-maximum-date/').then(function (data) {
                    resolve(data);
                });
            });
        };
        var cb = function (start, end, label) {
            $('.daterange span').html(moment(start).format('LL') + ' - ' + moment(end).format('LL'));
            $('._startdate').html(moment(start).format('LL'));
            $('._enddate').html(moment(end).format('LL'));
            $('._startdate').attr('data-target', start);
            $('._enddate').attr('data-target', end);
        };
        $('.daterange').on('apply.daterangepicker', function (ev, picker) {
            draw_graph();
        });
        get_maximum_date().then(function (data) {
            console.log(data);
            var dat_opt = {
                showDropdowns: true,
                showWeekNumbers: true,
                maxDate: moment(data['max_date']),
                minDate: moment(data['min_date']),
                startDate: moment(data['min_date']),
                endDate: moment(data['max_date']),
                ranges: {
                    'Today': [moment(data['max_date']), moment(data['max_date'])],
                    'Yesterday': [moment(data['max_date']).subtract(1, 'days'), moment(data['max_date']).subtract(1, 'days')],
                    'Last 7 Days': [moment(data['max_date']).subtract(6, 'days'), moment(data['max_date'])],
                    'Last 30 Days': [moment(data['max_date']).subtract(29, 'days'), moment(data['max_date'])],
                    'This Month': [moment(data['max_date']).startOf('month'), moment(data['max_date']).endOf('month')],
                    'Last Month': [moment(data['max_date']).subtract(1, 'month').startOf('month'), moment(data['max_date']).subtract(1, 'month').endOf('month')]
                },
                opens: 'left',
                buttonClasses: ['btn btn-default'],
                applyClass: 'btn-small btn-primary',
                cancelClass: 'btn-small',
                format: 'DD-MM-YYYY',
                separator: ' to ',
                locale: {
                    applyLabel: 'Submit',
                    cancelLabel: 'Clear',
                    fromLabel: 'From',
                    toLabel: 'To',
                    customRangeLabel: 'Custom',
                    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    firstDay: 0
                }
            };
            console.log(dat_opt);
            $('.daterange').daterangepicker(dat_opt, cb);
            cb(data['min_date'], data['max_date']);
            draw_graph();
        });
    };

    $(document).ready(function () {
        if (window.location.pathname.toLowerCase().includes('/sales/')) {
            init_sales();
        }
    });

})();