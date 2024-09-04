"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Editor from "@monaco-editor/react";

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
  useEffect(() => {
    if (!name) return;

    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/uploadQuestion?name=${name}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch question: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Question:", data.question); // Log the entire question object
        console.log("Test Cases:", data.question.testCase);
        setQuestion(data.question);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching question:", error);
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
      console.log("Received Response:", data);

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error("No results found in the response");
      }

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
      console.error("Error running code:", error);
      setOutput("Error running code: " + error.message);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!question) return <p>Loading...</p>;

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {question.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {question.description}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Difficulty: {question.difficulty}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Algorithm: {question.algorithm}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Test Cases:
      </Typography>
      <ul>
        {question.testCase.map((testCase, idx) => (
          <li key={idx}>
            <strong>Input:</strong> {testCase.input}, <strong>Output:</strong>{" "}
            {testCase.output}
          </li>
        ))}
      </ul>

      <Typography variant="h6" gutterBottom>
        Language:
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="language-select-label">Language</InputLabel>
        <Select
          labelId="language-select-label"
          value={language}
          label="Language"
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.value} value={lang.value}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="h6" gutterBottom>
        Code Editor:
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Editor
          height="400px"
          language={language} // Use the selected language from the dropdown
          value={code} // Controlled value, bound to the state
          onChange={(value) => setCode(value || "")} // Update code when changed
        />
      </Box>

      <Button variant="contained" color="primary" onClick={runCode}>
        Run Code
      </Button>

      {output && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Output:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {output}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
