"use client"

import { Typography, Box } from "@mui/material";
import ResponsiveAppBar from '../utils/ResponsiveAppBar';
import Image from "next/image";

export default function Home() {
  
  return (
    <Box>
      <ResponsiveAppBar />
      <Typography>
          Homepage
      </Typography>
    </Box>
    
  );
}
