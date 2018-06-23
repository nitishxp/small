function init_trigger() {
    $(document).ready(function () {
        $(".show_panel").hide();
        $(".show_panel_btn").click(function () {
            $(".show_panel_btn").hide();
            $(".show_panel").slideToggle();
            // Initialize filter column
            __init_filter_col()
            // Initialize platforms column
            __init_platform_col()

        });
    });

    function __init_filter_col(){
        var form  = $('.show_panel').find('form');
        var target = form.find('[name=filter]')
        $.ajax({
            method : 'GET',
            url : '/api/chatbot/filter/',
            success : function(result){
                var option = ''
                option += '<option>Select A Value</option>'
                for (i=0;i<result.length;i++){
                    option += '<option value="'+result[i]+'">' + (result[i].charAt(0).toUpperCase() + result[i].slice(1)) + '</option>'
                }
                $(target).html(option)
            }
        })

    }

    function __init_platform_col(){
        var form  = $('.show_panel').find('form');
        var target = form.find('[name=platform]')
        $.ajax({
            method : 'GET',
            url : '/api/chatbot/platform/',
            success : function(result){
                var option = ''
                option += '<option>Select A Value</option>'
                for (i=0;i<result.length;i++){
                    option += '<option value="'+result[i]+'">' + (result[i].charAt(0).toUpperCase() + result[i].slice(1)) + '</option>'
                }
                $(target).html(option)
            }
        })
    }

    $(function () {
        $('#groups').on('change', function () {
            var val = $(this).val();
            var sub = $('#sub_groups');
            $('option', sub).filter(function () {
                if (
                    $(this).attr('data-group') === val
                    || $(this).attr('data-group') === 'SHOW'
                ) {
                    if ($(this).parent('span').length) {
                        $(this).unwrap();
                    }
                } else {
                    if (!$(this).parent('span').length) {
                        $(this).wrap("<span>").parent().hide();
                    }
                }
            });
        });
        $('#groups').trigger('change');
    });

    $(function () {
        $('#groups1').on('change', function () {
            var val = $(this).val();
            var sub = $('#sub_groups1');
            $('option', sub).filter(function () {
                if (
                    $(this).attr('data-group') === val
                    || $(this).attr('data-group') === 'SHOW'
                ) {
                    if ($(this).parent('span').length) {
                        $(this).unwrap();
                    }
                } else {
                    if (!$(this).parent('span').length) {
                        $(this).wrap("<span>").parent().hide();
                    }
                }
            });
        });
        $('#groups1').trigger('change');
    });

    $(document).on('change', '.filter', function () {

        var form = $(this).closest('form');
        var target = form.find('[name*=filter_level]')
        $.ajax({
            method: 'GET',
            url: '/api/chatbot/filter/' + $(this).val()+'/',
            success: function (result) {
                var option = ''
                option += '<option value="">Select A Value</option>'
                $.each(result, function (k, v) {
                    option += '<option  value="'+ v['colname'] +'" data-type="'+v['coltype']+'">' + v['colname'] + '</option>'
                })
                $(target).html(option)
            }
        })
    })

    // choose type
    $(document).on('change', '[name=filter_level]', function () {
        var form = $(this).closest('form');
        var target = $(this)
        var filtertype = $(form).find('[name=type]')

        if ($(target).val()){
            var type = $(target).find(':selected').data('type')

            // if text
            if (type == "text"){
                typeArray = [
                    {'label':'Equal To','value':'='},
                ]
            }
            // if numeric
            else if(type=="numeric"){
                typeArray = [
                    {'label':'Less Than','value':'<'},
                    {'label':'Less Than Equal To','value':'<='},
                    {'label':'Equal To','value':'='},
                    {'label':'Greater Than Equal To','value':'>='},
                    {'label':'Greater Than','value':'>'}
                ]
            }else if(type=="boolean"){
                typeArray = [
                    {'label':'Equal To','value':'='},
                ]
            }else{
                alert('Error Fetching Type \nPlease contact the Server Administrator')
                $(filtertype).html('')
                return
            }
            // now append this array to the filter type
            var option = '<option>Select A Value</option>'
            for (i = 0 ;i < typeArray.length;i++){
                option += '<option value="'+ typeArray[i]['value'] +'">' + typeArray[i]['label'] + '</option>'
            }
            $(filtertype).html(option)
        }

    })

    $(document).on('change', '.query', function (e) {
        var inputQuery = {}
        var form
        inputQuery['data'] = []
        var formLength = $('.addmore form').length
        var initial = 0
        $('.addmore form').each(function () {
            form = this
            var filter_level = $(form).find('[name=filter_level]').val()
            var filtertype = $(form).find('[name=type]').val()
            var filtervalue = $(form).find('[name*=value]').val()
            var joinCondition = $(form).find('[name*=joinCondition]').val()
            if (filtervalue == "" || filter_level == "" || filtertype == "") {
                e.stopImmediatePropagation()
            } else {
                var a = {
                    'filter_level': filter_level,
                    'filtertype': filtertype,
                    'filtervalue': filtervalue,
                }
                if (initial != 0 || initial != formLength - 1) {
                    a['joinCondition'] = joinCondition
                }
                inputQuery['data'].push(a)
            }
        })
        if (inputQuery['data'].length > 0) {
            console.log(inputQuery)
            $.ajax({
                method: 'POST',
                data: { 'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(), 'inputQuery': JSON.stringify(inputQuery) },
                url: '/trigger/inputvalue/',
                success: function (result) {
                    console.log(result)
                    if (result == "False" || result == false) {
                        alert('The Query you selected does not contain any result')
                        $('[name=submit]').prop('disabled', true);
                        $('[name=platform]').prop('disabled', true);
                    } else if (result == "change") {
                        alert('Previous unsend campaign data found and deleted\n' +
                            'Form will be reload once again')
                        location.reload(true)
                    }
                    else {
                        $('[name=submit]').prop('disabled', false);
                        $('[name=platform]').prop('disabled', false);
                    }
                }
            })
        }
    })

    $("[name='platform']").on('change', function () {
        var parrentDiv = $(this).parent().parent().parent().parent().parent().parent().parent()
        var targetPane = $(parrentDiv).data('pane')
        var platform = $(this).val()
        // if(platform == "facebook"){
        //     $("[name='template_type']").prop('disabled',false)
        // }
        // else{
        //     $("[name='template_type']").prop('disabled',true)
        // }
        if (platform == "facebook" || platform == "twitter") {
            var askConfirmation = confirm('You will be redirected to the login page!\n' +
                'After this you are not allowed to change platform, to change please reset the form')
            if (askConfirmation == false) {
                $(this).val('')
                return
            }
        }
        else{
            return
        }

        $.ajax({
            method: 'GET',
            url: '/trigger/checklogin/?platform=' + platform,
            success: function (result) {
                console.log(result)
                try{
                    if (result.status == false || result.status == "False") {
                        var parse = JSON.parse(result.message)
                        console.log(result.message)
                        // alert(parse.message)
                        var win = window.open(parse.url, '_blank');
                        if (win) {
                            win.focus();
                        } else {
                            alert('Please allow popups for this website');
                        }
                    }
                    if(result.status == true){
                        alert('You are already Logged In!')
                    }

                }catch(e){
                    alert(result.message)
                }
            }
        })
    })
    // code for disabling the template option for other integrations other than facebook
    // $("[name='platform']").on('change',function(){
    //     alert('hiiii')
    // })

    // functions for handling the submit request of trigger page
    $("[name='submit']").on('click', function () {
        $(this).prop('disabled', true);
        var targetDiv = $(this).attr('data-targetForm')
        var div = $("#" + targetDiv)
        var platform = $(div).find("[name='platform']").val()
        var campaign_name = $(div).find("[name='campaign_name']").val()
        var campaign_objective = $(div).find("[name='campaign_objective']").val()
        var custom_audience = $(div).find("[name='audience_name']").val()
        var campaign_type = $(div).find("[name='campaign_type']").val()
        var experiment_type = $(div).find("[name='experiment_type']").val()

        // for designing the custom template i.e. mailchimp integration
        var template_type = $(div).find("[name='template_type']").val()
        var canva_image_list = $(div).find("[name='canva_image_list']").val()

        if (campaign_name == "" || campaign_objective == "" || campaign_type == "" || platform == "") {
            alert('Some fields are not filled please fill them!')
            $(this).prop('disabled', false);
            return
        }
        query = {
            'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(), 'campaign_name': campaign_name,
            'campaign_objective': campaign_objective, 'custom_audience': custom_audience,
            'campaign_type': campaign_type, 'platform': platform, 'experiment': experiment_type,'template_type':template_type, 'canva_image_list':canva_image_list
        }
        $.ajax({
            method: "POST",
            data: query,
            url: "/trigger/createcampaign/",
            success: function (result) {
                console.log(result)
                var parse = JSON.parse(result)
                try {
                    alert(parse.message)
                    if (parse['url'].length > 0) {
                        for (i = 0; i < parse['url'].length; i++) {
                            var win = window.open(parse['url'][i], '_blank');
                            if (win) {
                                win.focus();
                            } else {
                                alert('Please allow popups for this website');
                            }
                        }
                    }
                    location.reload(true)
                } catch (err) {
                    alert(parse)
                    alert('Form will be reset now')
                    $("#resetbtn").click()
                }
            }
        })
    })

    $("[name='platform']").on('change', function () {
        var platform = $(this).val()
        $.ajax({
            method : 'GET',
            url : '/api/chatbot/platform/'+platform+'/',
            success : function(result){
                var option = ''
                option += '<option>Select A Value</option>'
                $.each(result, function (k, v) {
                    option += '<option value=' + v.value + '>' + v.label + '</option>'
                })
                $("[name='campaign_objective']").html(option)
            }
        })
        // var list = {}
        // list['facebook'] = {
        //     '1': 'BRAND_AWARENESS',
        //     '2': 'CANVAS_APP_ENGAGEMENT',
        //     '3': 'CANVAS_APP_INSTALLS',
        //     '4': 'CONVERSIONS',
        //     '5': 'EVENT_RESPONSES',
        //     '6': 'LEAD_GENERATION',
        //     '7': 'LINK_CLICKS',
        //     '8': 'LOCAL_AWARENESS',
        //     '9': 'MOBILE_APP_ENGAGEMENT',
        //     '10': 'MOBILE_APP_INSTALLS',
        //     '11': 'OFFER_CLAIMS',
        //     '12': 'PAGE_LIKES',
        //     '13': 'POST_ENGAGEMENT',
        //     '14': 'REACH',
        //     '15': 'VIDEO_VIEWS',
        // }
        // list['mailchimp'] = { '1': 'regular', '2': 'plaintext' }
        // list['twitter'] = { '1': 'regular', '2': 'plaintext' }
        // list['adwords'] = { '1': 'Search', '2': 'Display' }
        // var option = ''
        // option += '<option value="">Select A Value</option>'
        // $.each(list[platform], function (k, v) {
        //     option += '<option value=' + k + '>' + v + '</option>'
        // })
        // $("[name='campaign_objective']").html(option)
    })

    $(".addfilter").on('click', function () {

        var size = $('.addmore form').size()
        var f = '<form action="." method="post"><div class="row">' +
            '<div class="col col-lg-6 col-lg-offset-5">' +
            '<select class="form-group query" name="joinCondition">' +
            '<option value="and">And</option><option value="or">Or</option></select>' +
            '</div></div><div class="row"> <div class="col col-lg-10"> <div class="col-md-3">' +
            ' <div class="form-group"> <label>Filter</label> ' +
            '<select class="col-lg-12 query filter form-control" name="filter" data-target_name="filter_level">' +
            ' <option value="">Select A Value</option> <option value="predictions">Predictions</option> ' +
            '<option value="profile">Profile</option> </select> </div> </div><div class="col-md-3"> <div class="form-group"> <label>Filter Level</label> ' +
            '<select class="col-md-12 query form-control" name="filter_level"> </select> </div> </div> <div class="col-md-3"> ' +
            '<div class="form-group"> <label>Choose Type</label> ' +
            '<select class="col-lg-12 query form-control" name="type"> <option value="<">Less Than</option>' +
            ' <option value="<=">Less Than Equal To</option> <option value="=">Equal To</option>' +
            ' <option value=">=">Greater Than Equal To</option> <option value=">">Greater Than</option> ' +
            '</select> </div> </div> ' +
            ' <div class="col-md-3"> <div class="form-group"> <label>Value</label>' +
            ' <input type="text" class="query trigger_input form-control" name="value"> </div> </div> </div> ' +
            '<div style="margin-top: 11px"></div><br><div class="col col-lg-2 text-center">' +
            '<button id="removefilter" type="button" onclick="removered()" class="btn btn-primary btn-sm trigger_remove ">' +
            '<span class="glyphicon glyphicon-remove"></span> REMOVE </button></div> </div> </form>'

        $(".addmore").append(f)
    })
    $("#resetbtn, #submit").on("click", function () {
        $('.show_panel form').each(function () {
            $(this)[0].reset();
        })
        $('[name=submit]').prop('disabled', true);
        $('[name=platform]').prop('disabled', true);
        $.ajax({
            'url': '/trigger/refresh/',
        })
    });
    //confirm js

    $(document).on('click', '.deletebtn', function () {
        var askConfirm = confirm("Are you sure you want to delete this campaign?")
        if (askConfirm) {
            var div = $(this).closest('.clients-edit');
            var unique_campaign_id = $(div).data('campaign_id')
            $.ajax({
                url: '/trigger/deletecampaign/',
                method: 'POST',
                data: { 'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(), 'unique_campaign_id': unique_campaign_id },
                success: function (result) {
                    if (result == true) {
                        alert('Campaign Successfully Deleted')
                        $(div).remove();
                    } else {
                        alert('ERROR')
                    }
                }
            })
            //ajax request
        }
    });
    $(document).on('click', '.powerbtn', function () {
        var askConfirm = confirm("Are you sure you want to end this campaign?")
        if (askConfirm) {
            var currentClass = this
            var div = $(this).closest('.clients-edit');
            var unique_campaign_id = $(div).data('campaign_id')
            $.ajax({
                url: '/trigger/endcampaign/',
                method: 'POST',
                data: { 'csrfmiddlewaretoken': $("[name='csrfmiddlewaretoken']").val(), 'unique_campaign_id': unique_campaign_id },
                success: function (result) {
                    if (result == true) {
                        alert('Campaign Successfully Ended')
                        $(currentClass).removeClass('powerbtn')
                        $(currentClass).addClass('triggeremove')
                    } else {
                        alert('ERROR')
                    }
                }
            })
        }
    });
    $(document).on("click", ".trigger_remove", function (e) { //user click on remove text
        e.preventDefault();
        var form = $(this).closest('form');
        $(form).remove();
    })

//    remove template button on click of u want tempalate yes or no
    $("[name='template_type']").on('change',function () {
        if ($(this).val() == "yes"){
            $('.bs-example-modal-lg').modal('show');
            // $('.content_button').show()
        }
        if ($(this).val() == "no"){
            $('.close_content').click()
        }
    })

    // reseting the template type when the button close of content is clicked
    $('.close_content').on('click', function () {
        var data = $("[name='template_type']").val('no')
        $('body').on('hidden.bs.modal', '.modal', function () {
            $(this).removeData('bs.modal');
        });
        $('.render_template').html('')
        $(document).find('.choosen-active').removeClass('choosen-active')
        $("[name='canva_image_name_listing']").val('')
        $("[name='canva_image_list']").val('')
        $("[name='upload_image']").val('')
        // $('.modal-content').html("")
    })

    
}
if (window.location.pathname.toLowerCase().includes('/trigger/')) {
    init_trigger();
    console.log('init_trigger')
}