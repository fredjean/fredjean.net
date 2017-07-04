//= require_tree .

$("#contact").submit(function(event) {
    event.preventDefault();
    var form = $(this);
    $.ajax({
        url: "/rest/contact",
        type: "POST",
        dataType: "json",
        data: form.serializeArray().reduce(function(a, x) { a[x.name] = x.value; return a;}, {}),
        success: function (response) {
            if (response.errorMessage) {
                this.error(response.errorMessage);
                return;
            }

            alert(response.successMsg);
        },
        error: function(msg) {
            this.error(msg)
        }
    })
});