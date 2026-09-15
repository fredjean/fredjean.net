import { describe, it, expect, beforeEach, vi } from 'vitest';

function mockSystemTheme(dark) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: dark,
    addEventListener: vi.fn(),
  });
}

async function loadThemeScript() {
  vi.resetModules();
  await import('./theme.js');
  return window.ThemeToggle;
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.body.innerHTML = '<nav><button type="button" class="theme-toggle" hidden>Dark</button></nav>';
    delete window.DISQUS;
  });

  it('follows the system preference when nothing is saved', async () => {
    mockSystemTheme(true);
    const theme = await loadThemeScript();

    expect(theme.currentTheme()).toBe('dark');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('reveals the toggle and labels it with the other theme', async () => {
    mockSystemTheme(false);
    await loadThemeScript();
    const button = document.querySelector('.theme-toggle');

    expect(button.hidden).toBe(false);
    expect(button.textContent).toBe('Dark');
    expect(button.getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('saves a choice that differs from the system preference', async () => {
    mockSystemTheme(false);
    await loadThemeScript();
    document.querySelector('.theme-toggle').click();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.querySelector('.theme-toggle').textContent).toBe('Light');
  });

  it('clears the saved choice when toggling back to the system preference', async () => {
    mockSystemTheme(false);
    const theme = await loadThemeScript();
    theme.toggleTheme();
    theme.toggleTheme();

    expect(theme.currentTheme()).toBe('light');
    expect(localStorage.getItem('theme')).toBeNull();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('respects a saved choice over the system preference', async () => {
    mockSystemTheme(true);
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
    const theme = await loadThemeScript();

    expect(theme.currentTheme()).toBe('light');
    expect(document.querySelector('.theme-toggle').textContent).toBe('Dark');
  });

  it('reloads Disqus so comments pick up the new colors', async () => {
    mockSystemTheme(false);
    window.DISQUS = { reset: vi.fn() };
    const theme = await loadThemeScript();
    theme.toggleTheme();

    expect(window.DISQUS.reset).toHaveBeenCalledWith({ reload: true });
  });
});
