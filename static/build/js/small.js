$(document).on('focus', ".datepicker_t", function () {
    console.log($(this).val())
    if ($)
        $(this).datetimepicker({
            format: "YYYY-MM-DD HH:mm",
        });
});

$("#add_assignments").on('click', function () {
    var currentAssignmentLength = $(".homework_assignment .assign_cl").length
    currentAssignmentLength++;
    var template = "<tr class='assign_cl'>";
    template += "<td>";
    template += "<label>Assignment " + currentAssignmentLength + " Deadline</label><br>"
    template += '<input type="datetime-local" name="' + currentAssignmentLength + '___homework_deadline" class="form-control" required>'
    template += '</td>'
    template += '<td>'
    template += '<label>Grading Deadline</label><br>'
    template += '<input type="datetime-local" name="' + currentAssignmentLength + '___grade_deadline" class="form-control" required>'
    template += '</td>'
    template += '<td>'
    template += '<input type="hidden" name="' + currentAssignmentLength + '___constraints"  value="random" required>'
    template += '</td>'
    //template += '<td>'
    //template += '<label>Grouping Constraints</label><br>'
    //template += '<select name="' + currentAssignmentLength + '___constraints">'
    //template += '<option value="random"> Random Group </option>'
    //        template += '<option value="similar_schedule"> Group Similar Schedule </option>'
    //        template += '<option value="similar_commitment_level"> Group Similar Commitment Level </option>'
    //        template += '<option value="similar_skills"> Group Similar Skills </option>'
    //        template += '<option value="different_skills"> Group different Skills </option>'
    //template += '</select>'
    //template += '</td>'
    template += '<td>'
    template += '<label>Student Per Group </label><br>'
    template += '<input type="number" min="1" value="3" name="' + currentAssignmentLength + '___no_of_group"  class="form-control" required>'
    template += '</td>'
    template += '<td>'
    template += '<label>No. of Grader</label><br>'
    template += '<input type="number" min="1" value="3" name="' + currentAssignmentLength + '___no_of_grader" class="form-control" required>'
    template += '</td>'
    template += '</tr>'
    // grade_rubric
    template += '<tr>'
    template += '<td colspan="5">'
    template += '<label>Grading Rubric</label><br>'
    template += '<textarea name="' + currentAssignmentLength + '___grade_rubric"  class="form-control" required> </textarea>'
    template += '</td>'
    template += '</tr>'

    $(".homework_assignment").append(template)
})

$(".appeal_cancel").on('click', function () {
    var group = $(this).data('group_id')
    var a = $(this).siblings('.appeal_submit')
    alert("Please wait for a moment...")
    $.ajax({
        url: '/students/reject_appeal/' + group,
        success: function (result) {
            console.log(result)
            window.location.reload()
        }
    })
})

$(document).ready(function () {
    var first = false
    $(".list-unstyled li").each(function () {
        a = $(this).children('a')
        selected = $(a).hasClass('selected');
        if (selected) {
            if (!first) {
                // this is the first element
                first = $(this)
                let link = $(a).attr("href")
                $(link).show()
                return true
            }
            // hide this element
            var linkid = $(a).attr("href")
            console.log(linkid)
            $(a).children('span').css('background', 'gray')
            $(linkid).hide()
        }

    })
    var tab = getUrlParameter('tab');
    if (tab){
        console.log("CLick the div")
        $("."+tab).click();
    }
})
$(".timeline").on('click', function () {
    $(".timeline").each(function () {
        var linkid = $(this).attr("href");
        $(this).children('span').css('background', 'gray');
        $(linkid).hide();
    })
    $(this).children('span').css('background','#38c73a')
    var linkid = $(this).attr("href");
    $(linkid).show()

})
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.hash.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


// $.ajax({
//     url : '/instructor/check_homework_deadline/'
// })
//
// $.ajax({
//     url : '/instructor/check_grading_deadline/'
// })