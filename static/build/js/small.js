$(document).on('focus', ".datepicker_t", function () {
    console.log($(this).val())
    if ($)
        $(this).datetimepicker({
            format: "YYYY-MM-DD HH:mm",
        });
});
