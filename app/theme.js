"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark", // Dark mode
        background: {
            default: "#1e1e1e", // Dark background color
            paper: "#2d2d2d", // Paper color
        },
        text: {
            primary: "#ffffff", // White text color
            secondary: "#b0b0b0", // Gray text for secondary content
        },
    },
    typography: {
        fontFamily: "Inter, Arial, sans-serif",
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: "#ffffff", // Ensure text is white
                },
            },
        },
    },
});

export default theme;
