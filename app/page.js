"use client";

import * as React from 'react';
import { Typography, Box, Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import ResponsiveAppBar from "./utils/ResponsiveAppBar";
import Footer from './utils/Footer';
import ToggleDarkMode from './utils/ToggleDarkMode';

export default function Main() {
  return (
    <Box sx={{ bgcolor: '#282c34', minHeight: '100vh', color: '#ffffff' }}>
      <ResponsiveAppBar />
      <Box sx={{ mt: 8, px: 2, maxWidth: "1200px", margin: "auto" }}>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }} textAlign="center">
          <Grid item xs={12} spacing={15} sx={{ mb: 8 }}>
            <Typography
              fontWeight="bold"
              textAlign="center"
              sx={{ mt: 10, fontSize: { xs: "24px", sm: "32px", md: "40px", fontFamily: 'monospace' }, color: '#61dafb' }}
            >
              Welcome to CheetCode,
            </Typography>
            <Typography
              fontWeight="bold"
              textAlign="center"
              sx={{ mt: 1, fontSize: { xs: "24px", sm: "32px", md: "40px", fontFamily: 'monospace' }, color: '#61dafb' }}
            >
              Start exploring
            </Typography>
            <Typography
              textAlign="center"
              sx={{ mt: 2, mx: "50px", fontSize: { xs: "11px", sm: "16px", md: "25px", fontFamily: 'monospace' }, color: '#abb2bf' }}
            >
              An affordable, beginner-friendly platform for STEM interview preparation, offering tailored practice and real-time AI feedback.
              Access free easy problems or subscribe for more advanced challenges. Enhance your skills with a versatile code editor, support
              for multiple languages, and personalized guidance to excel in technical interviews.
            </Typography>
            <Box 
              sx={{
                display: 'flex',
                justifyContent: 'center', 
                gap: 2, 
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#3b4048', 
                  color: '#ffffff', 
                  ':hover': { bgcolor: '#4f545c' },
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  border: '1px solid #61dafb',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 1, sm: 1.5, md: 2 },
                  width: { xs: "80px", sm: "100px", md: "120px" },
                  height: { xs: "35px", sm: "45px", md: "55px" },
                  fontFamily: 'monospace'
                }}
              >
                Mock Interview
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#3b4048', 
                  color: '#ffffff', 
                  ':hover': { bgcolor: '#4f545c' },
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  border: '1px solid #61dafb',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 1, sm: 1.5, md: 2 },
                  width: { xs: "80px", sm: "100px", md: "120px" },
                  height: { xs: "35px", sm: "45px", md: "55px" }, 
                  fontFamily: 'monospace'
                }}
              >
                Practice
              </Button>
            </Box>
          </Grid>
          
          <Grid container xs={12}>
            <Grid xs={12}>
              <Typography marginBottom='10px' fontWeight='bold' sx={{ fontSize: { xs: "20px", sm: "24px", md: "28px" }, color: '#e06c75', fontFamily: 'monospace' }}> Features: </Typography>
            </Grid>
            <Grid xs={4} md={4}>
              <Typography variant='h6' sx={{ fontWeight:'bold', fontSize: { xs: "13px", sm: "17px", md: "21px"}, color: '#98c379', fontFamily: 'monospace' }}>AI Assistance: </Typography>
              <Typography sx={{ fontSize: { xs: "9px", sm: "13px", md: "17px"}, color: '#abb2bf', fontFamily: 'monospace' }}>
                Real-Time Feedback: AI provides instant feedback on code, identifying errors and suggesting improvements.
                <br /><br />Guided Problem Solving: AI helps users understand which data structures and algorithms to use.
                <br /><br />Customized Problem Sets: AI generates personalized problem lists based on user strengths, weaknesses, and progress.
              </Typography>
            </Grid>
            <Grid xs={4} md={4}>
              <Typography variant='h6' sx={{ fontWeight:'bold', fontSize: { xs: "13px", sm: "17px", md: "21px"}, color: '#98c379', fontFamily: 'monospace' }}>User Progress Tracking: </Typography>
              <Typography sx={{ fontSize: { xs: "9px", sm: "13px", md: "17px"}, color: '#abb2bf', fontFamily: 'monospace' }}>
                Performance Analytics: Detailed analytics showing user progress, strengths, and areas for improvement.
                <br /><br />Personalized Recommendations: Tailored suggestions for practice problems and study material. 
              </Typography>
            </Grid>
            <Grid xs={4} md={4}>
              <Typography variant='h6' sx={{ fontWeight:'bold', fontSize: { xs: "13px", sm: "17px", md: "21px"}, color: '#98c379' }}>Practice: </Typography>
              <Typography sx={{ fontSize: { xs: "9px", sm: "13px", md: "17px"}, color: '#abb2bf', fontFamily: 'monospace' }}>
                Versatile coding environment: Users can freely solve problems at their own pace
                <br /><br />Support for multiple programming languages and an integrated code editor featuring syntax highlighting and debugging tools
                <br /> <br />Real-time code compilation and execution allowing for instant feedback, making it easier to learn and improve.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
    
  );
}
