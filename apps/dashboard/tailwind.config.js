/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind를 적용할 파일 경로 지정
     '../../libs/ui-components/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

