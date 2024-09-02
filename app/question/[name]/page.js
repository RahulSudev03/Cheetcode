"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

export default function QuestionPage() {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('// Write your code here...');  // <-- Ensure this line is included
  const [output, setOutput] = useState('');
  const { name } = useParams(); // Get the dynamic route parameter

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
      const response = await fetch('https://api.judge0.com/submissions?wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          source_code: code,
          language_id: 63,  // For example, 63 is Python 3, you can change this based on language
        }),
      });

      const data = await response.json();
      setOutput(data.stdout || data.stderr);
    } catch (error) {
      setOutput('Error running code: ' + error.message);
    }
  };


  if (error) return <p>Error: {error}</p>;
  if (!question) return <p>Loading...</p>;
  function handleEditorChange(value, event) {
    console.log('here is the current model value:', value);
  }

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
      <Typography variant="h6" gutterBottom>Code Editor:</Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Editor
          height="400px"
          defaultLanguage="javascript"
          defaultValue="// Write your code here..."
          value={code}
          onChange={(value) => setCode(value)}
        />
      </Box>

      <Button variant="contained" color="primary" onClick={runCode}>Run Code</Button>

      {output && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>Output:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{output}</Typography>
        </Box>
      )}
    </Box>
  );
}
