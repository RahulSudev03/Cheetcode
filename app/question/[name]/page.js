"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Editor from "@monaco-editor/react";

export default function QuestionPage() {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('// Write your code here...');  
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');  // Default language
  const { name } = useParams(); 
  const languages = [
      { label: 'JavaScript', value: 'javascript' },
      { label: 'Python', value: 'python' },
      { label: 'Java', value: 'java' },
      { label: 'C++', value: 'c++' },
      { label: 'Ruby', value: 'ruby' },
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
      const response = await fetch('/api/runCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput('Error running code: ' + error.message);
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

      <Typography variant="h6" gutterBottom>Language:</Typography>
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

      <Typography variant="h6" gutterBottom>Code Editor:</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Editor
          height="400px"
          defaultLanguage={language}
          defaultValue="// Write your code here..."
          value={code}
          onChange={(value) => setCode(value)}
        />
      </Box>

      <Button variant="contained" color="primary" onClick={runCode}>Run Code</Button>

      {output && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Output:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{output}</Typography>
        </Box>
      )}
    </Box>
  );
}
