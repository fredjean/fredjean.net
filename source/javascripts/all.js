/**
 * Contact Form Handler
 * Modern vanilla JavaScript implementation with proper error handling
 * Wrapped in IIFE to avoid global scope pollution
 */

(function() {
  'use strict';

  class ContactFormHandler {
    constructor(formSelector, options = {}) {
      this.form = typeof formSelector === 'string' 
        ? document.querySelector(formSelector) 
        : formSelector;
      
      if (!this.form) {
        throw new Error(`Form not found: ${formSelector}`);
      }

      this.options = {
        submitUrl: options.submitUrl || '/rest/contact',
        loadingText: options.loadingText || 'Sending...',
        ...options
      };

      this.submitButton = null;
      this.originalButtonText = '';
      
      this.init();
    }

    init() {
      this.submitButton = this.form.querySelector('button[type="submit"]');
      if (this.submitButton) {
        this.originalButtonText = this.submitButton.textContent;
      }

      // Use addEventListener instead of form.onsubmit to ensure proper event handling
      this.form.addEventListener('submit', (event) => this.handleSubmit(event));
    }

    async handleSubmit(event) {
      // Prevent the default form submission
      event.preventDefault();
      event.stopPropagation();

      // Disable button and show loading state
      this.setLoadingState(true);

      // Remove any existing messages
      this.clearMessages();

      try {
        // Collect form data
        const formData = this.getFormData();

        // Submit to API
        const response = await this.submitForm(formData);

        // Handle success
        this.handleSuccess(response);
      } catch (error) {
        // Handle error
        this.handleError(error);
      } finally {
        // Re-enable button
        this.setLoadingState(false);
      }
    }

    getFormData() {
      const formData = new FormData(this.form);
      const data = {};
      
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      return data;
    }

    async submitForm(data) {
      const response = await fetch(this.options.submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          data: result
        };
      }

      return result;
    }

    handleSuccess(response) {
      if (response.success && response.message) {
        // Clear form
        this.form.reset();

        // Show success message
        this.showMessage(response.message, 'success');
      } else {
        this.showMessage('Unexpected response from server. Please try again.', 'error');
      }
    }

    handleError(error) {
      let errorMessage = 'An error occurred. Please try again later.';
      let errorField = null;

      if (error.data) {
        if (error.data.error) {
          errorMessage = error.data.error;
          errorField = error.data.field;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.showMessage(errorMessage, 'error');

      // Highlight the problematic field if specified
      if (errorField) {
        this.highlightField(errorField);
      }
    }

    setLoadingState(loading) {
      if (this.submitButton) {
        this.submitButton.disabled = loading;
        this.submitButton.textContent = loading 
          ? this.options.loadingText 
          : this.originalButtonText;
      }
    }

    clearMessages() {
      const messages = this.form.querySelectorAll('.form-message');
      messages.forEach(msg => msg.remove());

      const errorFields = this.form.querySelectorAll('.field-error');
      errorFields.forEach(field => field.classList.remove('field-error'));
    }

    showMessage(message, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `form-message ${type}`;
      messageDiv.textContent = message;

      // Insert at the beginning of the form
      this.form.insertBefore(messageDiv, this.form.firstChild);
    }

    highlightField(fieldName) {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.classList.add('field-error');
      }
    }
  }

  // Auto-initialize when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeContactForm);
    } else {
      // DOM is already ready
      initializeContactForm();
    }
  }

  function initializeContactForm() {
    const contactForm = document.querySelector('#contact');
    if (contactForm) {
      new ContactFormHandler('#contact');
    }
  }
})();
