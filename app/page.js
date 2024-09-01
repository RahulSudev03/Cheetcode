"use client";

import * as React from 'react';
import { Typography, Box, Grid, Button } from "@mui/material";
import ResponsiveAppBar from "./utils/ResponsiveAppBar";
import Footer from './utils/Footer';
import ToggleDarkMode from './utils/ToggleDarkMode';

export default function Main() {
  return (
    <Box sx={{ minHeight: '100vh', color: '#ffffff' }}>
      <ResponsiveAppBar />
      <Box sx={{ paddingTop: '16px', mt: 15, px: 2, maxWidth: "1200px", margin: "auto" }}>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }} textAlign="center">
        
          {/* Header Section */}
          <Grid item xs={12} sx={{ mb: 1, backgroundImage: "url('https://littlevisuals.co/images/moon.jpg?nf_resize=smartcrop&w=500&h=375')", backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
            <Typography
              fontWeight="bold"
              textAlign="center"
              sx={{ mt: 10, fontSize: { xs: "20px", sm: "28px", md: "34px" }, fontFamily: 'monospace', color: '#61dafb' }}
            >
              Welcome to CheetCode
            </Typography>
            <Typography
              fontWeight="bold"
              textAlign="center"
              sx={{ mt: 1, fontSize: { xs: "16px", sm: "22px", md: "28px" }, fontFamily: 'monospace', color: '#61dafb' }}
            >
              Start exploring
            </Typography>
            <Typography
              textAlign="center"
              sx={{ mt: 2, mb: 4, mx: { xs: "20px", sm: "40px", md: "80px" }, fontSize: { xs: "12px", sm: "18px", md: "22px" }, fontFamily: 'monospace', color: '#abb2bf' }}
            >
              A beginner-friendly platform for STEM interview preparation, offering tailored practice and real-time AI feedback, a 
              versatile code editor, support for multiple languages, personalized guidance to excel in technical interviews.
            </Typography>
            <Box 
              sx={{
                display: 'flex',
                justifyContent: 'center', 
                alignItems: 'center',
                gap: 6, 
                mt: 1,
                width: '100%',
                mb: 8,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#3b4048', 
                  color: '#ffffff', 
                  ':hover': { bgcolor: '#4f545c' },
                  fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  border: '1px solid #61dafb',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                  px: { xs: 3, sm: 4, md: 5 },
                  py: { xs: 1, sm: 1.5, md: 2 },
                  width: { xs: "120px", sm: "140px", md: "160px" },
                  height: { xs: "40px", sm: "50px", md: "60px" },
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
                  fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  border: '1px solid #61dafb',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                  px: { xs: 3, sm: 4, md: 5 },
                  py: { xs: 1, sm: 1.5, md: 2 },
                  width: { xs: "120px", sm: "140px", md: "160px" },
                  height: { xs: "40px", sm: "50px", md: "60px" }, 
                  fontFamily: 'monospace'
                }}
              >
                Practice
              </Button>
            </Box>
          </Grid>
          
          {/* Features Section */}
          <Grid container sx={{ mt: 10, mb: 15, px: { xs: 2, sm: 4, md: 8 } }} justifyContent="center">
            <Grid item xs={12}>
              <Typography marginBottom='25px' fontWeight='bold' sx={{ fontSize: { xs: "24px", sm: "30px", md: "36px" }, color: '#e06c75', fontFamily: 'monospace', textAlign: 'center' }}>
                Features
              </Typography>
            </Grid>

            {/* Feature Item */}
            <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '1200px', mx: 'auto' }}>
              {/* AI Assistance Feature */}
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box sx={{ p: 4, border: '1px solid #61dafb', borderRadius: '12px', backgroundColor: '#1e1e1e', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '350px', mx: 'auto' }}>
                  {/* <img src="your-icon-url-here" alt="AI Assistance Icon" style={{ width: '70px', height: '70px', marginBottom: '15px' }} /> */}
                  <Typography variant='h6' sx={{ fontWeight: 'bold', fontSize: { xs: "18px", sm: "20px", md: "22px" }, color: '#98c379', fontFamily: 'monospace', marginBottom: '15px' }}>AI Assistance</Typography>
                  <Typography sx={{ fontSize: { xs: "14px", sm: "16px", md: "18px" }, color: '#abb2bf', fontFamily: 'monospace', lineHeight: 1.5 }}>
                    Real-Time Feedback: AI provides instant feedback on code, identifying errors and suggesting improvements.
                    <br /><br />Guided Problem Solving: AI helps users understand which data structures and algorithms to use.
                    <br /><br />Customized Problem Sets: AI generates personalized problem lists based on user strengths, weaknesses, and progress.
                  </Typography>
                </Box>
              </Grid>

              {/* User Progress Tracking Feature */}
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box sx={{ p: 4, border: '1px solid #61dafb', borderRadius: '12px', backgroundColor: '#1e1e1e', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '350px', mx: 'auto' }}>
                  {/* <img src="your-icon-url-here" alt="User Progress Tracking Icon" style={{ width: '70px', height: '70px', marginBottom: '15px' }} /> */}
                  <Typography variant='h6' sx={{ fontWeight: 'bold', fontSize: { xs: "18px", sm: "20px", md: "22px" }, color: '#98c379', fontFamily: 'monospace', marginBottom: '15px' }}>User Progress Tracking</Typography>
                  <Typography sx={{ fontSize: { xs: "14px", sm: "16px", md: "18px" }, color: '#abb2bf', fontFamily: 'monospace', lineHeight: 1.5 }}>
                    Performance Analytics: Detailed analytics showing user progress, strengths, and areas for improvement.
                    <br /><br />Personalized Recommendations: Tailored suggestions for practice problems and study material.
                  </Typography>
                </Box>
              </Grid>

              {/* Practice Feature */}
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box sx={{ p: 4, border: '1px solid #61dafb', borderRadius: '12px', backgroundColor: '#1e1e1e', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxWidth: '350px', mx: 'auto' }}>
                  {/* <img src="your-icon-url-here" alt="Practice Icon" style={{ width: '70px', height: '70px', marginBottom: '15px' }} /> */}
                  <Typography variant='h6' sx={{ fontWeight: 'bold', fontSize: { xs: "18px", sm: "20px", md: "22px" }, color: '#98c379', fontFamily: 'monospace', marginBottom: '15px' }}>Practice</Typography>
                  <Typography sx={{ fontSize: { xs: "14px", sm: "16px", md: "18px" }, color: '#abb2bf', fontFamily: 'monospace', lineHeight: 1.5 }}>
                    Real-World Scenarios: Practice problems based on real interview questions and challenges.
                    <br /><br />Code Editor Support: A versatile code editor with syntax highlighting, autocompletion, and debugging tools.
                    <br /><br />Multi-Language Support: Practice coding in various languages including Python, JavaScript, and C++.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Footer />
      <ToggleDarkMode />
    </Box>
  );
}
