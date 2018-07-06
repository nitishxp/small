$(document).on('focus', ".datepicker_t", function () {
    console.log($(this).val())
    if ($)
        $(this).datetimepicker({
            format: "YYYY-MM-DD HH:mm",
        });
});

$("#add_assignments").on('click', function () {
    var currentAssignmentLength = $(".homework_assignment tr").length
    currentAssignmentLength++;
    var template = "<tr>";
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
    template += '<label>Number of Group </label><br>'
    template += '<input type="number" min="1" value="3" name="' + currentAssignmentLength + '___no_of_group"  class="form-control" required>'
    template += '</td>'
    template += '<td>'
    template += '<label>Number of Grader</label><br>'
    template += '<input type="number" min="1" value="3" name="' + currentAssignmentLength + '___no_of_grader" class="form-control" required>'
    template += '</td>'
    template += '</tr>'

    $(".homework_assignment").append(template)
})

$(".appeal_cancel").on('click', function () {
    var group = $(this).data('group_id')
    var a = $(this).siblings('.appeal_submit')
    $.ajax({
        url: '/students/reject_appeal/' + group,
        success: function (result) {
            console.log(result)
            window.location.reload()
        }
    })
})