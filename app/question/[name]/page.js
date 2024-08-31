'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';

export default function QuestionPage() {
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const { name } = useParams();  // Get the dynamic route parameter

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
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, [name]);

  if (error) return <p>Error: {error}</p>;
  if (!question) return <p>Loading...</p>;

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>{question.name}</Typography>
      <Typography variant="body1" gutterBottom>{question.description}</Typography>
      <Typography variant="body2" gutterBottom>Difficulty: {question.difficulty}</Typography>
      <Typography variant="h6" gutterBottom>Test Cases:</Typography>
      <ul>
        {question.testCase.map((testCase, idx) => (
          <li key={idx}>
            <strong>Input:</strong> {testCase.input}, <strong>Output:</strong> {testCase.output}
          </li>
        ))}
      </ul>
    </Box>
  );
}