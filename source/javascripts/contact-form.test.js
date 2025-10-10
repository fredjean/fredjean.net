import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContactFormHandler } from './contact-form.js';

describe('ContactFormHandler', () => {
  let form;
  let fetchMock;

  beforeEach(() => {
    // Create a mock form
    document.body.innerHTML = `
      <form id="contact">
        <input type="text" name="name" value="John Doe" />
        <input type="email" name="email" value="john@example.com" />
        <input type="tel" name="phone" value="555-1234" />
        <textarea name="message">Test message</textarea>
        <button type="submit">Submit</button>
      </form>
    `;
    
    form = document.querySelector('#contact');

    // Mock fetch
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  describe('constructor', () => {
    it('should initialize with a form selector', () => {
      const handler = new ContactFormHandler('#contact');
      expect(handler.form).toBe(form);
    });

    it('should initialize with a form element', () => {
      const handler = new ContactFormHandler(form);
      expect(handler.form).toBe(form);
    });

    it('should throw error if form not found', () => {
      expect(() => new ContactFormHandler('#nonexistent')).toThrow('Form not found');
    });

    it('should set default options', () => {
      const handler = new ContactFormHandler('#contact');
      expect(handler.options.submitUrl).toBe('/rest/contact');
      expect(handler.options.loadingText).toBe('Sending...');
    });

    it('should allow custom options', () => {
      const handler = new ContactFormHandler('#contact', {
        submitUrl: '/custom/url',
        loadingText: 'Processing...'
      });
      expect(handler.options.submitUrl).toBe('/custom/url');
      expect(handler.options.loadingText).toBe('Processing...');
    });
  });

  describe('getFormData', () => {
    it('should collect form data correctly', () => {
      const handler = new ContactFormHandler('#contact');
      const data = handler.getFormData();
      
      expect(data).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        message: 'Test message'
      });
    });
  });

  describe('handleSubmit', () => {
    it('should prevent default form submission', async () => {
      const handler = new ContactFormHandler('#contact');
      const event = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'Success!' })
      });

      await handler.handleSubmit(event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should disable submit button during submission', async () => {
      const handler = new ContactFormHandler('#contact');
      const button = form.querySelector('button[type="submit"]');
      
      let resolvePromise;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      fetchMock.mockReturnValue(promise);

      const submitPromise = handler.handleSubmit(new Event('submit'));
      
      // Button should be disabled during submission
      expect(button.disabled).toBe(true);
      expect(button.textContent).toBe('Sending...');

      // Resolve the fetch
      resolvePromise({
        ok: true,
        json: async () => ({ success: true, message: 'Success!' })
      });

      await submitPromise;

      // Button should be re-enabled after submission
      expect(button.disabled).toBe(false);
      expect(button.textContent).toBe('Submit');
    });

    it('should submit form data as JSON', async () => {
      const handler = new ContactFormHandler('#contact');
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'Success!' })
      });

      await handler.handleSubmit(new Event('submit'));
      
      expect(fetchMock).toHaveBeenCalledWith('/rest/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-1234',
          message: 'Test message'
        })
      });
    });
  });

  describe('handleSuccess', () => {
    it('should show success message and reset form', async () => {
      const handler = new ContactFormHandler('#contact');
      const resetSpy = vi.spyOn(form, 'reset');
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'Email sent successfully!' })
      });

      await handler.handleSubmit(new Event('submit'));
      
      const successMessage = form.querySelector('.form-message.success');
      expect(successMessage).toBeTruthy();
      expect(successMessage.textContent).toBe('Email sent successfully!');
      
      // Form reset should have been called
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should handle unexpected response format', async () => {
      const handler = new ContactFormHandler('#contact');
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ unexpected: 'response' })
      });

      await handler.handleSubmit(new Event('submit'));
      
      const errorMessage = form.querySelector('.form-message.error');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toContain('Unexpected response');
    });
  });

  describe('handleError', () => {
    it('should show error message on API failure', async () => {
      const handler = new ContactFormHandler('#contact');
      
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error occurred' })
      });

      await handler.handleSubmit(new Event('submit'));
      
      const errorMessage = form.querySelector('.form-message.error');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toBe('Server error occurred');
    });

    it('should highlight field with validation error', async () => {
      const handler = new ContactFormHandler('#contact');
      
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ 
          error: 'Invalid email address',
          field: 'email'
        })
      });

      await handler.handleSubmit(new Event('submit'));
      
      const emailField = form.querySelector('[name="email"]');
      expect(emailField.classList.contains('field-error')).toBe(true);
    });

    it('should show generic error on network failure', async () => {
      const handler = new ContactFormHandler('#contact');
      
      fetchMock.mockRejectedValue(new Error('Network error'));

      await handler.handleSubmit(new Event('submit'));
      
      const errorMessage = form.querySelector('.form-message.error');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toBe('Network error');
    });
  });

  describe('clearMessages', () => {
    it('should remove existing messages', () => {
      const handler = new ContactFormHandler('#contact');
      
      // Add some messages
      handler.showMessage('Test message', 'success');
      handler.showMessage('Another message', 'error');
      
      expect(form.querySelectorAll('.form-message').length).toBe(2);
      
      handler.clearMessages();
      
      expect(form.querySelectorAll('.form-message').length).toBe(0);
    });

    it('should clear field error highlights', () => {
      const handler = new ContactFormHandler('#contact');
      const emailField = form.querySelector('[name="email"]');
      
      emailField.classList.add('field-error');
      expect(emailField.classList.contains('field-error')).toBe(true);
      
      handler.clearMessages();
      
      expect(emailField.classList.contains('field-error')).toBe(false);
    });
  });

  describe('event listener attachment', () => {
    it('should attach submit event listener on init', () => {
      const handler = new ContactFormHandler('#contact');
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, message: 'Success!' })
      });

      // Trigger form submission
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      
      // Fetch should have been called
      expect(fetchMock).toHaveBeenCalled();
    });
  });
});
