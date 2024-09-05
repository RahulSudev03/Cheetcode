"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Divider,
} from "@mui/material";
import Editor from "@monaco-editor/react";

import { motion } from "framer-motion";
import ThemeProviderWrapper from "../../ThemeProviderWrapper"; // Adjust the path as needed

import withAuth from "@/app/utils/hoc/withAuth";


function QuestionPage() {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const { name } = useParams();
  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "c++" },
    { label: "Ruby", value: "ruby" },
  ];

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'basic':
        return { backgroundColor: '#B0B0B0', color: 'black' };
      case 'easy':
        return { backgroundColor: '#4CAF50', color: 'black' };
      case 'medium':
        return { backgroundColor: '#FFEB3B', color: 'black' };
      case 'hard':
        return { backgroundColor: '#F44336', color: 'black' };
      default:
        return { backgroundColor: '#000000', color: 'black' };
    }
  };

  const editorRef = useRef(null);
  const terminalRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!name) return;

    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/uploadQuestion?name=${name}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch question: ${response.statusText}`);
        }

        const data = await response.json();
        setQuestion(data.question);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchQuestion();
  }, [name]);

  const runCode = async () => {
    try {
      const response = await fetch("/api/runCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          testCases: question.testCase,
        }),
      });

      const data = await response.json();

      setOutput(
        data.results.map((result, index) => (
          <Box key={index} sx={{ marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>
              Output:
            </Typography>
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

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const editorTop = editorRef.current.getBoundingClientRect().top;
      const parentHeight = editorRef.current.parentElement.clientHeight;
      const newEditorHeight = ((e.clientY - editorTop) / parentHeight) * 100;

      if (newEditorHeight >= 20 && newEditorHeight <= 80) {
        setEditorHeight(newEditorHeight);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (error) return <p>Error: {error}</p>;
  if (!question) return <p>Loading...</p>;

  const animationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <ThemeProviderWrapper>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary", padding: 2 }}>
        <Grid container spacing={2} sx={{ height: "100vh" }}>
          {/* Left side for question and test cases */}
          <Grid
            item
            xs={12}
            md={6}
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={animationVariants}
            sx={{
              padding: 3,
              overflow: "auto",
              backgroundColor: "background.paper",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h4" gutterBottom>
              {question.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', marginTop: 2 }}>
              Description: {question.description}
            </Typography>
            <Box
              sx={{
                display: 'inline-block',
                ...getDifficultyStyle(question.difficulty),
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                marginRight: 2, // Add spacing between the tag and the algorithm
              }}
            >
              {question.difficulty}
            </Box>
            <Typography variant="body2" sx={{ mb: 4, fontWeight: 'bold', marginTop: 2 }}>
              Algorithm: {question.algorithm}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Example Test Cases:
            </Typography>
            {question.testCase.map((testCase, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 4,
                  p: 2,
                  bgcolor: "#D3D3D3",
                  color: "#000000",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Typography variant="body2" sx={{ mb: 1, color: "#000000" }}>
                  <strong>Example {idx + 1}:</strong>
                </Typography>

                <Typography variant="body2" sx={{ mb: 1, color: "#000000" }}>
                  <strong>Input:</strong> {testCase.input}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: "#000000" }}>
                  <strong>Output:</strong> {testCase.output}
                </Typography>
              </Box>
            ))}
          </Grid>

          {/* Right side for code editor and terminal */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              paddingLeft: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                overflow: "auto",
                justifyContent: "space-between",
                mb: 1,
                padding: 1,
                //bgcolor: "background.paper",
                // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <FormControl sx={{ minWidth: 100, mr: 1 }}>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{ color: "text.primary", fontSize: '0.75rem' }}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value} sx={{ fontSize: '0.75rem' }}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#4CAF50", // Green background for Run Code button
                  color: "text.primary",
                  ":hover": { bgcolor: "#45a049" }, // Darker green on hover
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: '0.75rem',
                }}
                onClick={runCode}
              >
                Run Code
              </Button>
            </Box>
            <Box
              ref={editorRef}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  flex: editorHeight,
                  position: "relative",
                  height: 0,
                }}
              >
                <Editor
                  height="100%"
                  defaultLanguage="javascript"

                  value={code}
                  onChange={(value) => setCode(value)}
                  theme="vs-dark"
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "calc(100% - 10px)",
                    left: 0,
                    right: 0,
                    height: "5px",
                    cursor: "row-resize",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                  }}
                  onMouseDown={handleMouseDown}
                />
              </Box>
              <Box
                ref={terminalRef}
                sx={{
                  flex: 30,
                  bgcolor: "#333",
                  color: "#fff",
                  p: 2,
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  overflowY: "auto", // Enable vertical scrolling
                  maxHeight: "500vh", // Optional: Limit the height of the terminal box
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", fontWeight: "bold" }}>
                  Console:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {output}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProviderWrapper>
  );
}

export default withAuth(QuestionPage);