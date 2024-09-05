"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import withAuth from "../utils/hoc/withAuth";

function MockInterviewPage() {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour in seconds
  const [language, setLanguage] = useState("javascript"); // Default language
  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "c++" },
    { label: "Ruby", value: "ruby" },
  ];
  const router = useRouter();

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchRandomQuestion = async () => {
      try {
        const response = await fetch("/api/mockInterview/randomQuestion");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch random question: ${response.statusText}`
          );
        }

        const data = await response.json();
        if (data.success) {
          setQuestion(data.question);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRandomQuestion();
  }, []);

  // Helper function to format time in HH:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const fetchAiFeedback = async () => {
    console.log("Question Description: ", question.description);
    console.log("Test Cases: ", question.testCase);
    console.log("Code: ", code);
  
    try {
      const response = await fetch("/api/mockInterview/aiFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          questionDescription: question.description,
          testCases: question.testCase,
          language,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        setAiFeedback(data.feedback);
      } else {
        setAiFeedback("Error generating feedback: " + data.error);
      }
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
      setAiFeedback("Error fetching AI feedback.");
    }
  };
  

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

      {/* Timer */}
      <Typography variant="h6" gutterBottom>
        Time Left: {formatTime(timeLeft)}
      </Typography>


      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={runCode}
          disabled={timeLeft === 0}
        >
          Run Code
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={fetchAiFeedback}
          sx={{ marginLeft: 2 }}
        >
          Get AI Feedback
        </Button>
      </Box>
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
      {aiFeedback && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            AI Feedback:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {aiFeedback}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default withAuth(MockInterviewPage);