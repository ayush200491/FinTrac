import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

:root,
:root.light-mode {
  --color-grey-0: #ffffff;
  --color-grey-50: #f4f7f7;
  --color-grey-100: #e8eeed;
  --color-grey-200: #d7e0de;
  --color-grey-300: #c0ccca;
  --color-grey-400: #8c9a97;
  --color-grey-500: #677571;
  --color-grey-600: #44524e;
  --color-grey-700: #2d3a37;
  --color-grey-800: #1e2a28;
  --color-grey-900: #141d1b;

  --color-blue-100: #d9f0ff;
  --color-blue-700: #16689a;
  --color-green-100: #d5f5e5;
  --color-green-500: #1fa06a;
  --color-green-700: #0c7a4b;
  --color-yellow-100: #fff2cb;
  --color-yellow-700: #9c6a00;
  --color-silver-100: #ecf1f0;
  --color-silver-700: #32403d;
  --color-indigo-100: #d7ebff;
  --color-indigo-700: #1f5f9e;

  --color-red-100: #ffdede;
  --color-red-500: #d13a3f;
  --color-red-700: #a72a33;
  --color-red-800: #7f1d29;

  --color-brand-50: #ecf8f6;
  --color-brand-100: #d5f3ed;
  --color-brand-200: #b6e8de;
  --color-brand-500: #1d9e8f;
  --color-brand-600: #117f73;
  --color-brand-700: #0e665d;
  --color-brand-800: #0c5049;
  --color-brand-900: #0a3f3a;

  --border-radius-tiny: 4px;
  --border-radius-sm: 10px;
  --border-radius-md: 14px;
  --border-radius-lg: 20px;

  --backdrop-color: rgba(10, 63, 58, 0.22);
  --shadow-sm: 0 8px 22px rgba(10, 45, 42, 0.08);
  --shadow-md: 0 18px 42px rgba(10, 45, 42, 0.16);
  --shadow-lg: 0 28px 64px rgba(10, 45, 42, 0.22);

  --image-grayscale: 0;
  --image-opacity: 100%;
}

:root.dark-mode {
  --color-grey-0: #152033;
  --color-grey-50: #0f1726;
  --color-grey-100: #1b2a3f;
  --color-grey-200: #243750;
  --color-grey-300: #36506f;
  --color-grey-400: #7f95af;
  --color-grey-500: #a1b3c8;
  --color-grey-600: #c3d0df;
  --color-grey-700: #dbe5ef;
  --color-grey-800: #edf3f8;
  --color-grey-900: #f8fbff;

  --color-blue-100: #163754;
  --color-blue-700: #c7e4ff;
  --color-green-100: #173f34;
  --color-green-500: #4bd99a;
  --color-green-700: #c8f5e1;
  --color-yellow-100: #4a3a15;
  --color-yellow-700: #ffe7a8;
  --color-silver-100: #243750;
  --color-silver-700: #e0e8f2;
  --color-indigo-100: #1b3457;
  --color-indigo-700: #c3ddff;

  --color-red-100: #4f242d;
  --color-red-500: #f67d86;
  --color-red-700: #ffc0c6;
  --color-red-800: #ffd7db;

  --color-brand-50: #113b3d;
  --color-brand-100: #175154;
  --color-brand-200: #1f686b;
  --color-brand-500: #53d0c2;
  --color-brand-600: #74e3d5;
  --color-brand-700: #9af0e4;
  --color-brand-800: #bff8ef;
  --color-brand-900: #ddfffa;

  --backdrop-color: rgba(0, 0, 0, 0.5);
  --shadow-sm: 0 10px 28px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 22px 48px rgba(0, 0, 0, 0.42);
  --shadow-lg: 0 36px 76px rgba(0, 0, 0, 0.5);

  --image-grayscale: 12%;
  --image-opacity: 94%;
}

:root.dark-mode body {
  background:
    radial-gradient(circle at 14% 12%, rgba(83, 208, 194, 0.12), transparent 32%),
    radial-gradient(circle at 83% 0%, rgba(126, 175, 230, 0.12), transparent 34%),
    linear-gradient(145deg, var(--color-grey-50), var(--color-grey-0));
}

:root.dark-mode body::before {
  background-image:
    linear-gradient(rgba(116, 227, 213, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(116, 227, 213, 0.03) 1px, transparent 1px);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
}

html {
  font-size: 62.5%;
  background-color: var(--color-grey-50);
}

body {
  font-family: "Manrope", "Segoe UI", sans-serif;
  color: var(--color-grey-700);
  background:
    radial-gradient(circle at 14% 12%, rgba(17, 127, 115, 0.12), transparent 28%),
    radial-gradient(circle at 83% 0%, rgba(22, 104, 154, 0.12), transparent 32%),
    linear-gradient(145deg, var(--color-grey-50), var(--color-grey-0));
  transition: color 0.3s, background-color 0.3s;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
  position: relative;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(rgba(17, 127, 115, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17, 127, 115, 0.04) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(circle at center, black 44%, transparent 86%);
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-500);
  outline-offset: 2px;
}

button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}
`;

export default GlobalStyles;
