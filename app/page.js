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
  Paper,
  Divider,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

export default function QuestionPage() {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript"); // Default language
  const { name } = useParams();
  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "c++" },
    { label: "Ruby", value: "ruby" },
  ];

  const editorRef = useRef(null);
  const terminalRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(60); // Initial percentage height for the editor
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#161b22", color: "#c9d1d9", padding: 2 }}>
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
            backgroundColor: "#1e1e1e",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h4" gutterBottom>
            {question.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {question.description}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: "#8b949e" }}>
            Difficulty: {question.difficulty}
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: "#8b949e" }}>
            Algorithm: {question.algorithm}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Example Test Cases:
          </Typography>
          {question.testCase.map((testCase, idx) => (
            <Box key={idx} sx={{ mb: 4 }}>
              <Typography variant="body2">
                <strong>Example {idx + 1}:</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Input:</strong> {testCase.input}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
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
              justifyContent: "space-between",
              mb: 2,
              padding: 2,
              bgcolor: "#1e1e1e",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <FormControl sx={{ minWidth: 120, mr: 2 }}>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                sx={{ color: "#c9d1d9" }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#3b4048",
                color: "#ffffff",
                ":hover": { bgcolor: "#828fa4" },
                borderRadius: "6px",
                padding: "10px 20px",
                fontSize: "16px",
              }}
              onClick={runCode}
            >
              Run Code
            </Button>
          </Box>

          {/* Code Editor and Terminal with Horizontal Slider */}
          <Box ref={editorRef} sx={{ flexBasis: `${editorHeight}%`, flexGrow: 1 }}>
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
            />
          </Box>

          <Divider
            sx={{
              cursor: "row-resize",
              height: "10px",
              bgcolor: "divider",
              backgroundColor: "#3b4048",
            }}
            onMouseDown={handleMouseDown}
          />

          <Box
            ref={terminalRef}
            sx={{
              flexGrow: 1,
              flexBasis: `${100 - editorHeight}%`,
              overflowY: "auto",
              bgcolor: "#1e1e1e",
              color: "#c9d1d9",
              p: 2,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Terminal:
            </Typography>
            {output}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

