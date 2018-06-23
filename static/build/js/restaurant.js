$('#restaurant_tags').tokenfield()

$(".tokenfield").each(function () {
    $(this).tokenfield()
})

$(".tokenfield").on('tokenfield:createtoken', function (e) {
    // here need to write the code for removing the duplicate entry
    var existingTokens = $(this).tokenfield('getTokens');
    // check if this element is in table
    $.each(existingTokens, function (index, token) {
        if (token.value === e.attrs.value)
            e.preventDefault();
    });
})

// for option values
$(".tokenoption").on('tokenfield:createdtoken', function (e) {
    // console.log(e)
    var tr = $(this).closest('tr')
    oval = $(tr).find('[type="text"]').val()
    if (!oval) {
        alert('Enter Value')
        $(e.relatedTarget).remove()
    }
    createTable()
})

function createTable(){
    alert('sd')
}
// StoreRestaurantMenuCard.objects.filter(variants__cointains=[{'vid':'001'}])