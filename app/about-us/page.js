"use client"

import { Typography, Box } from "@mui/material";
import ResponsiveAppBar from '../utils/ResponsiveAppBar';
import Footer from "../utils/Footer";
import Image from "next/image";

export default function AboutUs() {
  
  return (
    <Box>
      <ResponsiveAppBar />
      <Typography>
          About Us
      </Typography>
    </Box>
    
  );
}
