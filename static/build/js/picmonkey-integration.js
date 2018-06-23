(function() {
    var image_array = []
    var image_name_a = []

    var init_picmonkey_integration = function () {
        var file_upload_url = '/trigger/upload-image/';

        var file_upload = function (file) {
            return new Promise(function (resolve, reject) {
                // var file = $(element).get(0).files;
                // console.log(file)
                var formData = new FormData();
                formData.append('upload_image', file, file.name);
                // console.log(formData)
                $.ajax({
                    headers: {"X-CSRFToken": $("input[name*='csrfmiddlewaretoken']").val()},
                    url: file_upload_url,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    data: formData,
                    success: function (response) {
                        if (response['status'] == 'SUCCESS') {
                            resolve(response);
                        }
                        else {
                            reject(response);
                        }
                    },
                    error: function (err) {
                        reject(err);
                    }
                })
            });
        };

        $(document).on('change', 'input[name="upload_image"]', function () {
            var $this = $(this);
            $this.closest('.upload_new_image').addClass('choosen-active')
            var input = document.getElementById('upload_image')
            $('input[name="upload_image"]').siblings('.upload_new_image').addClass('choosen-active')
            for (var i=0; i<input.files.length; ++i){
                // console.log(input.files[i].name)
                file_upload(input.files[i]).then(function (success) {
                    image_array.push(success)
                    create_preview()
                    // image_name_a.push($('.trigger-thumbnail-text-upload').val())                
                });
            }
        });


        function create_preview() {
            var img_arr = []
            var input = document.getElementById('upload_image')
            for (var i=0; i<input.files.length; ++i){
                img_arr.push(input.files[i].name)
            }
            console.log(img_arr)

            var template = ''
            template += '<div class="x_content template">'
            template += '<div class="row">'
            for (var c in image_array) {

                template += '<div class="col-md-4 col-sm-6 col-xl-6">'
                template += '<div class="thumbnail">'
                template += '<div class="image view view-first image-checkbox">'
                template += '<img class="img-responsive" style="width: 100%; display: block;" src="' + image_array[c]['url'] + '" alt="image">'
                template += '</div>'
                template += '<div class="trigger-thumbnail-text caption"><input type="text" class="form-control trigger-thumbnail-text-upload" readonly="true" value="' + image_array[c]['filename'] + '"><span class="fa fa-pencil-square-o right editimgicon" aria-hidden="true"></span></div>'
                template += '<button type="button" class="btn btn-primary btn-xs submit_thumbnail_name_change" style="display: none">Save</button>'
                template += '</div>'
                template += '</div>'

            }
            template += '</div>'
            template += '</div>'

            $('.render_template').html(template)
        }
        // function for choose exisiting image template section

        var get_template_images = function(e){
            return new Promise(function (resolve, reject) {
                $.ajax({
                    headers: {"X-CSRFToken": $("input[name*='csrfmiddlewaretoken']").val()},
                    url: '/trigger/get_existing_template/',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    // data: JSON.stringify({
                    //     'period_val': period_val,
                    //     'user_input_x_axis_type': user_input_x_axis_type
                    // }),
                    success: function (response) {
                        console.log(response)
                        if (response['status'] == 'SUCCESS') {
                            if (response['data'].length == 0) {
                                resolve(0)
                            } else {
                                resolve(response['data'])
                            }
                        } else {
                            resolve(response)
                        }
                    },
                    error: function (e) {
                        console.log(e)
                        resolve(0)
                    }
                })
            });
        }
        async function get_existing_template_data() {
            var existing_data = await get_template_images();

            var template = ''
            template += '<div class="x_content template">'
            template += '<div class="row">'
            $.each(existing_data,function(key,val){
                template += '<div class="col-md-4 col-sm-6 col-xl-6">'
                template += '<div class="thumbnail">'
                template += '<div class="image view view-first image-checkbox">'
                template += '<img class="img-responsive" style="width: 100%; display: block;" src="/static/images/'+val['platform']+'_image/'+val['campaign_id']+'/'+val['image_name']+'" alt="image">'
                template += '<input type="checkbox" name="image[]" value="" />'
                template += '<i class="fa fa-check hidden"></i>'
                template += '</div>'
                template += '</div>'
                template += '</div>'
            })
            template += '</div>'
            template += '</div>'
            $('.render_template').html(template)

            $(".image-checkbox").each(function () {
                if ($(this).find('input[type="checkbox"]').first().attr("checked")) {

                    $(this).addClass('image-checkbox-checked').css("color","green");
                }
                else {
                    $(this).removeClass('image-checkbox-checked');
                }
            });

            // sync the state to the input
            $(".image-checkbox").on("click", function (e) {
                $(this).toggleClass('image-checkbox-checked');
                var $checkbox = $(this).find('input[type="checkbox"]');
                $checkbox.prop("checked",!$checkbox.prop("checked"))
                // $('.creative_submit').css('display','block');
                e.preventDefault();
            });

        }


        $(document).on('click','.choose_existing_template',function(){
            // alert('gggggg')
            $(this).addClass('choosen-active')
            get_existing_template_data()

        });

        $(document).on('click','.customize_photo', function(e) {
            $(this).addClass('choosen-active')
            e.preventDefault();
            e.stopPropagation();
            try {
                var el = 'input[value="'+$('#picmonkey_form input[name="_import"]').val()+'"]';
                // console.log('Element To Remove');
                // console.log(el);
                $('#picmonkey_form').remove($(el));
            }catch(e) {
                console.log(e);
            }
            var $this = $('input[name="upload_image"]');
            $this.clone().appendTo($('#picmonkey_form'));
            $('#picmonkey_form input[name="_import"]').val($this.attr('name'));
            // console.log($('#picmonkey_form'));
            $('#picmonkey_form').submit();
            $('#picmonkey_modal').modal('show');
        });

        function downloadPicMonkeyUrl(img_url) {

            // first make the global array empty
            image_array = []
            $.ajax({
                url: '/trigger/download_url/',
                data: { 'img_url': img_url },
                success: function (result) {
                    console.log(result)
                    if (result['status'] == 'SUCCESS'){
                        image_array.push(result)
                        create_preview()
                    }else{
                        alert('Error')
                    }
                }
            })

        }

        $('iframe[name="an_iframe"]').on('load',function(e) {
            console.log('trigger edited photo save');
            console.log($('iframe[name="an_iframe"]').get(0).contentWindow.location);
            var img_url = $('iframe[name="an_iframe"]').get(0).contentWindow.location.search.replace('?exported_img=','');
            img_url = decodeURIComponent(img_url);
            // img_url = "'" + img_url + "'"
            img_url = img_url.match(/\bhttps?:\/\/\S+/gi)
            console.log(img_url);
            // image_array.push(img_url[0])
            // image_name_a.push(img_url[0].split('/').pop(-1))
            // $('#upload_image_preview').attr('src', img_url);
            downloadPicMonkeyUrl(img_url)
            $('#picmonkey_modal').modal('hide');
        });

        $(document).on('click','#save_upload_image', function() {
            try {
                var return_array = ''
                var image_name_return_arr = ''
                var chosen_element = $(document).find('.choosen-active').text()
                // alert(chosen_element)
                if (chosen_element == "Choose Existing Template"){
                    var existing_array = []
                    var image_name_arr = []
                    $(".image-checkbox").each(function () {
                        console.log($(this).find('input[type="checkbox"]').is(":checked"))
                        if ($(this).find('input[type="checkbox"]').is(":checked")) {
                            var img_path = $(this).find('.img-responsive').attr('src');
                            existing_array.push(window.location.origin+img_path)
                            alert($(this).siblings().find('.trigger-thumbnail-text-existing').val())
                            image_name_arr.push($(this).siblings().find('.trigger-thumbnail-text-existing').val())
                            // image_name_arr.push(img_path.split('/').pop(-1))

                        }
                    })
                    return_array = existing_array
                    image_name_return_arr = image_name_arr

                }
                if(chosen_element == "Upload Image" || chosen_element == "Create New" ){
                    image_array = []
                    image_name_a = []

                    $('.render_template').find('img').each(function(){
                        image_array.push(window.location.origin+$(this).attr("src"))
                    })
                    $('.render_template').find('.trigger-thumbnail-text-upload').each(function(){
                        image_name_a.push($(this).val())
                    })

                    return_array = image_array
                    image_name_return_arr = image_name_a
                }
                // if (chosen_element == "Create New"){
                //     return_array = image_array
                //     image_name_return_arr = image_name_a
                // }
                // var img_path = $('#upload_image_preview').attr('src');
                // var img_path = $('.img-responsive').attr('src');
                // image_array.push(img_path)
                // console.log(image_array)
                // var img_name = img_path.split('/').pop();
                // console.log(img_name);
                $('input[name="canva_image_name_listing"]').show()
                $('input[name="canva_image_name_listing"]').val(image_name_return_arr)
                $('input[name="canva_image_list"]').val(return_array);
            }catch(e) {
                console.error('Custom Error');
                console.error(e);
            }finally {
                // $('#upload_image_preview').attr('src', '');
                $('.bs-example-modal-lg').modal('hide');
            }
        });
    };

    $(document).ready(function() {
        if (window.location.pathname.toLowerCase().includes('/trigger/')) {
            init_picmonkey_integration();
        }
    });

    // js for enabling the editing section
    $(document).on('click','.editimgicon',function(){
        var thumbnail = $(this).closest('.thumbnail')
        $(thumbnail).find('.trigger-thumbnail-text-upload').attr('readonly',false)
        $(thumbnail).find('.submit_thumbnail_name_change').css('display','block')
    })

    $(document).on('click','.submit_thumbnail_name_change',function(){

        var element = this
        var thumbnail = $(this).closest('.thumbnail')
        var img_src = $(thumbnail).find('img').attr('src')
        var new_image_name = $(thumbnail).find('.trigger-thumbnail-text-upload').val()

        // fire ajax at this point
        var data  = {}
        data['img_src'] = img_src
        data['new_image_name'] = new_image_name
        $.ajax({
            data : data,
            url : '/trigger/migrate_image/',
            success: function(result){
                console.log(result)
                // now replace the coming content with existing
                $(thumbnail).find('img').attr('src',result['url'])
                $(thumbnail).find('.trigger-thumbnail-text-upload').val(result['filename'])
                $(element).hide()
                $(thumbnail).find('.trigger-thumbnail-text-upload').attr('readonly',true)
            }
        })
    });

})();