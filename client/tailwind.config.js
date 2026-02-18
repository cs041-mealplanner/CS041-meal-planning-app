/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // canonical (Figma)
                primary: "#6B8E75",
                primaryDark: "#404F41",
                muted: "#6C7A6F",

                // backgrounds
                secondarybg: "#E6D8C3",  // page background
                mainbg: "#EFE5D6",       // hero / light panel bg
                subtle: "#F1F6ED",       // subtle panels
                headerbg: "#F5F5F0",     // header/footer base
                card: "#FFFFFF",
            },
            boxShadow: {
                nav: "0px 8px 18px rgba(15,25,15,0.08)",
            },
        },
    },
    plugins: [],
};
