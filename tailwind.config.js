import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            typography: {
                DEFAULT: {
                  css: {
                    maxWidth: '100%',
                    color: '#374151',
                    a: {
                      color: '#3182ce',
                      '&:hover': {
                        color: '#2c5282',
                      },
                    },
                    h1: {
                      fontWeight: '700',
                    },
                    h2: {
                      fontWeight: '600',
                    },
                    h3: {
                      fontWeight: '600',
                    },
                    code: {
                      color: '#1a202c',
                      backgroundColor: '#f7fafc',
                      paddingLeft: '0.25rem',
                      paddingRight: '0.25rem',
                      paddingTop: '0.125rem',
                      paddingBottom: '0.125rem',
                      borderRadius: '0.25rem',
                    },
                    'code::before': {
                      content: '""',
                    },
                    'code::after': {
                      content: '""',
                    },
                    pre: {
                      backgroundColor: '#1a202c',
                      color: '#e2e8f0',
                      overflowX: 'auto',
                      fontSize: '0.875em',
                      padding: '1rem',
                      borderRadius: '0.375rem',
                    },
                    'ul > li::before': {
                      backgroundColor: '#718096',
                    },
                  },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        [forms]
    ],
};
