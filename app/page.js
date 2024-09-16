"use client";

import * as React from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import ResponsiveAppBar from "./utils/ResponsiveAppBar";
import Footer from "./utils/Footer";
import ToggleDarkMode from "./utils/ToggleDarkMode";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import getStripe from "./utils/getStripe";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

export default function Main() {
  const router = useRouter();

  const handleSubmit = async () => {
    const token = Cookies.get("token");
    console.log("Token from cookies:", token);
    if (!token) {
      router.push("/signin");
      return;
    }
    console.log(token);
    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;

    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        origin: window.location.origin,
      },
      body: JSON.stringify({ email }),
    });

    const checkoutSessionJson = await checkoutSession.json();
    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const controls = useAnimation();
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (headerInView) {
      controls.start("visible");
    }
  }, [headerInView, controls]);

  const scrollAnimationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 300 },
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", color: "#ffffff" }}>
      <ResponsiveAppBar />
      <Box
        sx={{
          paddingTop: "16px",
          mt: 15,
          px: 2,
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 2 }}
          textAlign="center"
        >
          {/* Header Section */}
          <Grid
            item
            xs={12}
            sx={{
              mb: 4,
              backgroundImage:
                "url('https://littlevisuals.co/images/moon.jpg?nf_resize=smartcrop&w=500&h=375')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "40px 20px",
              textAlign: "center",
              backgroundColor: "#161b22",
            }}
            ref={headerRef}
          >
            <motion.div
              initial="hidden"
              animate={controls}
              variants={scrollAnimationVariants}
            >
              <Typography
                sx={{
                  fontSize: { xs: "24px", sm: "32px", md: "40px" },
                  color: "#c9d1d9",
                }}
              >
                Coming Soon...
              </Typography>
              <Typography
                fontWeight="bold"
                sx={{
                  mt: 10,
                  fontSize: { xs: "24px", sm: "32px", md: "40px" },
                  color: "#c9d1d9",
                }}
              >
                Welcome to CheetCode
              </Typography>
              <Typography
                fontWeight="bold"
                sx={{
                  mt: 1,
                  fontSize: { xs: "18px", sm: "24px", md: "30px" },
                  color: "#8b949e",
                }}
              >
                Start exploring
              </Typography>
              <Typography
                sx={{
                  mt: 2,
                  mb: 4,
                  mx: { xs: "20px", sm: "40px", md: "80px" },
                  fontSize: { xs: "14px", sm: "18px", md: "22px" },
                  color: "#8b949e",
                }}
              >
                A beginner-friendly platform for STEM interview preparation,
                offering tailored practice and real-time AI feedback, a
                versatile code editor, support for multiple languages,
                personalized guidance to excel in technical interviews.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  mt: 1,
                  width: "100%",
                  mb: 8,
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#3b4048",
                    color: "#ffffff",
                    ":hover": { bgcolor: "#828fa4" },
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                    border: "none",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                    px: { xs: 3, sm: 4, md: 5 },
                    py: { xs: 1, sm: 1.5, md: 2 },
                    width: { xs: "140px", sm: "160px", md: "180px" },
                    height: { xs: "40px", sm: "50px", md: "60px" },
                    borderRadius: "6px",
                  }}
                >
                  Mock Interview
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#3b4048",
                    color: "#ffffff",
                    ":hover": { bgcolor: "#828fa4" },
                    fontSize: { xs: "14px", sm: "16px", md: "18px" },
                    border: "none",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                    px: { xs: 3, sm: 4, md: 5 },
                    py: { xs: 1, sm: 1.5, md: 2 },
                    width: { xs: "140px", sm: "160px", md: "180px" },
                    height: { xs: "40px", sm: "50px", md: "60px" },
                    borderRadius: "6px",
                  }}
                >
                  Practice
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Features Section */}
          <Grid
            container
            sx={{ mt: 10, mb: 15, px: { xs: 2, sm: 4, md: 8 } }}
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Typography
                marginBottom="25px"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "28px", sm: "34px", md: "40px" },
                  color: "#58a6ff",
                  textAlign: "center",
                }}
              >
                Features
              </Typography>
            </Grid>

            {/* Feature Items */}
            <Grid container spacing={4} justifyContent="center">
              {/* AI Assistance Feature */}
              <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={featureVariants}
                >
                  <Box
                    sx={{
                      p: 4,
                      backgroundColor: "#1e1e1e",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      maxWidth: "350px",
                      mx: "auto",
                    }}
                  >
                    {/* <img src="your-icon-url-here" alt="AI Assistance Icon" style={{ width: '70px', height: '70px', marginBottom: '15px' }} /> */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "18px", sm: "20px", md: "22px" },
                        color: "#98c379",
                        marginBottom: "15px",
                      }}
                    >
                      AI Assistance
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", sm: "16px", md: "18px" },
                        color: "#abb2bf",
                        lineHeight: 1.5,
                      }}
                    >
                      Real-Time Feedback: AI provides instant feedback on code,
                      identifying errors and suggesting improvements.
                      <br />
                      <br />
                      Guided Problem Solving: AI helps users understand which
                      data structures and algorithms to use.
                      <br />
                      <br />
                      Customized Problem Sets: AI generates personalized problem
                      lists based on user strengths, weaknesses, and progress.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              {/* User Progress Tracking Feature */}
              <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={featureVariants}
                >
                  <Box
                    sx={{
                      p: 4,
                      backgroundColor: "#1e1e1e",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      maxWidth: "350px",
                      mx: "auto",
                    }}
                  >
                    {/* <img src="your-icon-url-here" alt="User Progress Tracking Icon" style={{ width: '70px', height: '70px', marginBottom: '15px' }} /> */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "18px", sm: "20px", md: "22px" },
                        color: "#98c379",
                        marginBottom: "15px",
                      }}
                    >
                      User Progress Tracking
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", sm: "16px", md: "18px" },
                        color: "#abb2bf",
                        lineHeight: 1.5,
                      }}
                    >
                      Performance Analytics: Detailed analytics showing user
                      progress, strengths, and areas for improvement.
                      <br />
                      <br />
                      Personalized Recommendations: Tailored suggestions for
                      practice problems and study material.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>

              {/* Practice Feature */}
              <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={featureVariants}
                >
                  <Box
                    sx={{
                      p: 4,
                      backgroundColor: "#1e1e1e",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      maxWidth: "350px",
                      mx: "auto",
                    }}
                  >
                    {/* <img src="your-icon-url-here" alt="Practice Icon" style={{ width: '70px', height: '70px', marginBottom: '15px' }} /> */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "18px", sm: "20px", md: "22px" },
                        color: "#98c379",
                        marginBottom: "15px",
                      }}
                    >
                      Practice
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", sm: "16px", md: "18px" },
                        color: "#abb2bf",
                        lineHeight: 1.5,
                      }}
                    >
                      Real-World Scenarios: Practice problems based on real
                      interview questions and challenges.
                      <br />
                      <br />
                      Code Editor Support: A versatile code editor with syntax
                      highlighting, autocompletion, and debugging tools.
                      <br />
                      <br />
                      Multi-Language Support: Practice coding in various
                      languages including Python, JavaScript, and C++.
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4"> Pricing </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: "2px solid grey", borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                {" "}
                Pro
              </Typography>
              <Typography variant="h6" gutterBottom>
                {" "}
                $10/month
              </Typography>
              <Typography>
                Access to all problems and unlimited random AI Mock Interviews
              </Typography>
              <Button
                variant={"contained"}
                color={"primary"}
                sx={{ mt: 2 }}
                onClick={handleSubmit}
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: "2px solid grey", borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                {" "}
                Basic
              </Typography>
              <Typography variant="h6" gutterBottom>
                {" "}
                Free
              </Typography>
              <Typography>
                Access to all of our problems and 1 random AI Mock Interview
              </Typography>

              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Basic
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
      <ToggleDarkMode />
    </Box>
  );
}
