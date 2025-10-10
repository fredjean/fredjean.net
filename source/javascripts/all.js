//= require_tree .

$("#contact").submit(function (event) {
    event.preventDefault();
    var form = $(this);
    var submitButton = form.find('button[type="submit"]');
    var originalButtonText = submitButton.text();
    
    // Disable submit button and show loading state
    submitButton.prop('disabled', true).text('Sending...');
    
    // Remove any existing error/success messages
    form.find('.form-message').remove();
    form.find('.field-error').removeClass('field-error');
    
    $.ajax({
        url: "/rest/contact",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(form.serializeArray().reduce(function(a, x) { 
            a[x.name] = x.value; 
            return a;
        }, {})),
        success: function (response) {
            // New Lambda returns {message, success} on success
            if (response.success && response.message) {
                // Clear form on success
                form[0].reset();
                
                // Show success message
                form.prepend(
                    '<div class="form-message success">' +
                    response.message +
                    '</div>'
                );
            } else {
                // Unexpected response format
                showError('Unexpected response from server. Please try again.');
            }
        },
        error: function(xhr, status, error) {
            var errorMessage = 'An error occurred. Please try again later.';
            var errorField = null;
            
            // Try to parse error response
            if (xhr.responseJSON) {
                // New Lambda returns {error, field} on validation errors
                if (xhr.responseJSON.error) {
                    errorMessage = xhr.responseJSON.error;
                    errorField = xhr.responseJSON.field;
                }
            }
            
            showError(errorMessage, errorField);
        },
        complete: function() {
            // Re-enable submit button
            submitButton.prop('disabled', false).text(originalButtonText);
        }
    });
    
    function showError(message, field) {
        // Show error message
        form.prepend(
            '<div class="form-message error">' +
            message +
            '</div>'
        );
        
        // Highlight the problematic field if specified
        if (field) {
            form.find('[name="' + field + '"]').addClass('field-error');
        }
    }
});
