/** @type {import("prettier").Config} */
export default {
  arrowParens: "avoid",
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-svelte'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],
}
