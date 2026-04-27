/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6B8E75",
                primaryDark: "#404F41",
                muted: "#6C7A6F",
                secondarybg: "#E6D8C3",
                mainbg: "#EFE5D6",
                subtle: "#F1F6ED",
                headerbg: "#F5F5F0",
                card: "#FFFFFF",
            },
            boxShadow: {
                nav: "0px 8px 18px rgba(15,25,15,0.08)",
            },
        },
    },
    plugins: [],
};
