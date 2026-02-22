import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

function createThemeStore() {
    // Determine initial state safely (hydration)
    const { subscribe, set, update } = writable<Theme>('system');

    if (browser) {
        const storedTheme = localStorage.getItem('saku_theme') as Theme | null;
        if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
            set(storedTheme);
        }

        // Subscribe to changes and apply them to the DOM and localStorage
        subscribe((current) => {
            if (current === 'system') {
                localStorage.removeItem('saku_theme');
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } else {
                localStorage.setItem('saku_theme', current);
                if (current === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        });

        // Listen for system theme changes if set to system
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('saku_theme') === null) {
                if (e.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        });
    }

    return {
        subscribe,
        setTheme: (t: Theme) => set(t),
        toggleTheme: () => update(current => {
            if (current === 'light') return 'dark';
            if (current === 'dark') return 'light';
            
            // if system, switch to the opposite of current system preference
            if (browser && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'light';
            }
            return 'dark';
        })
    };
}

export const theme = createThemeStore();
