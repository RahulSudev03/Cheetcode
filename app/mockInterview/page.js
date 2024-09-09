"use client";
import { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Select, Grid, MenuItem, FormControl, TextField, InputAdornment, IconButton, AppBar, Toolbar } from "@mui/material";
import Editor from "@monaco-editor/react";
import ThemeProviderWrapper from "../ThemeProviderWrapper";
import withAuth from "../utils/hoc/withAuth";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Importing the send/arrow icon
import ResponsiveAppBar from "../utils/ResponsiveAppBar";
import Divider from '@mui/material/Divider';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

function MockInterviewPage() {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour in seconds
  const [language, setLanguage] = useState("javascript"); // Default language
  const [userMessage, setUserMessage] = useState("");
  const editorRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(60);

  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "c++" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchRandomQuestion = async () => {
      try {
        const response = await fetch("/api/mockInterview/randomQuestion");
        if (!response.ok) throw new Error(`Failed to fetch random question: ${response.statusText}`);
        const data = await response.json();
        if (data.success) {
          setQuestion(data.question);

          const formattedTestCases = data.question.testCase.map((testCase, index) => {
            return `// Test Case ${index + 1}:\n// Input: ${testCase.input}\n// Output: ${testCase.output}\n`;
          }).join("\n");

          const questionComment = `// Question: ${data.question.name}\n// Description: ${data.question.description}\n\n`;
          setCode(`${questionComment}${formattedTestCases}\n// Write your code here...`);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRandomQuestion();
  }, []);

  const fetchAiFeedback = async () => {
    try {
      const response = await fetch("/api/mockInterview/aiFeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          questionDescription: question.description,
          testCases: question.testCase,
          language,
          userMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAiFeedback(data.feedback);
      } else {
        setAiFeedback("Error generating feedback: " + data.error);
      }
    } catch (error) {
      setAiFeedback("Error fetching AI feedback.");
    }
    setUserMessage("");
  };

  const runCode = async () => {
    try {
      const response = await fetch("/api/runCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, testCases: question.testCase }),
      });

      const data = await response.json();
      if (!data.results || !Array.isArray(data.results)) throw new Error("No results found in the response");

      setOutput(
        data.results.map((result, index) => (
          <Box key={index} sx={{ marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>Output:</Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              <strong>Input:</strong> {result.input}
              <br />
              <strong>Expected:</strong> {result.expectedOutput}
              <br />
              <strong>Actual:</strong> {result.actualOutput}
              <br />
              {result.passed ? "Passed" : "Failed"}
            </Typography>
          </Box>
        ))
      );
    } catch (error) {
      setOutput("Error running code: " + error.message);
    }
  };

  return (
    <ThemeProviderWrapper>
      <ResponsiveAppBar />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#0d1117",
          color: "text.primary",
          padding: 2,
          overflow: 'hidden', // Hide scrollbar by default
          '&:hover': {
            overflow: 'auto', // Show scrollbar on hover
          },
          '&::-webkit-scrollbar': {
            width: '8px', // Width of the scrollbar
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888', // Color of the scrollbar thumb
            borderRadius: '8px', // Rounded corners of the scrollbar thumb
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555', // Color when hovering over the scrollbar thumb
          },
        }}
      >
        <Grid container spacing={2} sx={{ height: "100vh" }}>
          {/* Left side - Code Editor with Console */}
          <Grid item xs={12} md={7} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>

            {/* Language selection and run button */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, padding: 1, borderRadius: "8px" }}>
              <FormControl sx={{ minWidth: 80, mr: 1 }}>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{
                    color: "text.primary",
                    fontSize: "0.6rem",
                    padding: "4px",
                    '& .MuiSelect-select': { padding: "4px" }
                  }}
                >
                  {languages.map((lang) => (
                    <MenuItem
                      key={lang.value}
                      value={lang.value}
                      sx={{ fontSize: "0.6rem" }}
                    >
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#4CAF50",
                  color: "text.primary",
                  ":hover": { bgcolor: "#45a049" },
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "0.6rem"
                }}
                onClick={runCode}
              >
                Run Code
              </Button>
            </Box>


            {/* Code Editor */}
            <Box ref={editorRef} sx={{ flex: editorHeight, borderRadius: "8px", overflow: "hidden", height: "100%" }}>
              <Editor height="100%" defaultLanguage="javascript" value={code} onChange={(value) => setCode(value)} theme="vs-dark" />
            </Box>

            {/* Console Output */}
            <Box sx={{ flex: 30, bgcolor: "black", color: "#fff", p: 2, borderRadius: "8px", overflowY: "auto", maxHeight: "40vh" }}>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", fontWeight: "bold" }}>Console:</Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{output}</Typography>
            </Box>
          </Grid>


          <Divider orientation="vertical" variant="middle" flexItem="true" />

          {/* Right side - AI Feedback */}

          <Grid item xs={12} md={4.5} sx={{ display: "flex", flexDirection: "column", paddingLeft: 2, height: "100vh", bgcolor: "#0d1117", color: "#fff", mt: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Time Left:{" "}
              <Box component="span" sx={{ display: "inline-block", padding: "8px 16px", backgroundColor: "#D3D3D3", color: "black", borderRadius: "8px", fontWeight: "bold", fontSize: "1rem" }}>
                {new Date(timeLeft * 1000).toISOString().substr(11, 8)}
              </Box>
            </Typography>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'hidden',
                my: 2,
                '&:hover': {
                  overflowY: 'auto', // Show scrollbar on hover
                },
                '&::-webkit-scrollbar': {
                  width: '8px', // Width of the scrollbar
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888', // Color of the scrollbar thumb
                  borderRadius: '8px', // Rounded corners of the scrollbar thumb
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#555', // Color when hovering over the scrollbar thumb
                }
              }}
            >
              {/* AI Feedback Heading */}
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'text.primary' }}>
                AI Feedback:
              </Typography>

              {/* AI Feedback Content */}
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", color: 'text.primary' }}>
                {aiFeedback}
              </Typography>
            </Box>


            <TextField
              label="Message to AI"
              variant="outlined"
              multiline
              minRows={1}
              maxRows={5}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={fetchAiFeedback} // Action for sending the message
                      edge="end"
                      sx={{
                        color: '#000', // Icon color
                        bgcolor: '#fff', // Background color of the icon
                        borderRadius: '50%', // Makes the background round
                        p: 0.5, // Padding around the icon
                        '&:hover': {
                          bgcolor: '#e0e0e0', // Light gray background on hover
                        },
                        mr: 1,
                        // Space to the right of the icon
                      }}
                    >
                      <ArrowUpwardIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: "#001f3f", // Dark blue background
                borderRadius: "16px", // Rounded corners
                color: "text.primary",
                mb: 2, // Margin at the bottom
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)', // Border color
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)', // Border color on hover
                  },
                },
                '& .MuiInputBase-input': {
                  color: "#fff", // Text color
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </ThemeProviderWrapper>
  );
}

export default withAuth(MockInterviewPage);
