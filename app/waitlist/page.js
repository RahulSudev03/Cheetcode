"use client";

import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import ResponsiveAppBar from '../utils/ResponsiveAppBar';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
  
    if (!captchaToken) {
      setMessage('Please complete the CAPTCHA.');
      return;
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, captchaToken }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(data.message);
        setEmail(''); // Clear the form
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
      console.error(error);
    }
  };

  return (
    <Box>
      <ResponsiveAppBar />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Join Our Waitlist
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Join Waitlist
            </Button>
          </form>
          {message && (
            <Typography
              variant="body1"
              color="success.main"
              sx={{ mt: 2 }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}