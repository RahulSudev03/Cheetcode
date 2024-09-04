import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles"; // Import useTheme for theme access

export default function Footer() {
  const theme = useTheme(); // Access the current theme

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? '#001143' : '#000b2a', // Match the navbar background colors
        color: theme.palette.mode === "dark" ? theme.palette.grey[200] : theme.palette.grey[100], // Adjust text color accordingly
        p: 6,
      }}
      component="footer"
    >
      <Container maxWidth="sm" mt={4}>
        <Typography variant="body2" color="inherit" align="center"> {/* Use 'inherit' to match text color */}
          {"Copyright © "}
          <Link color="inherit" href="https://cheetcode.dev/">
            cheetcode.dev
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </Box>
  );
}
