'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';

export default function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/uploadQuestion');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>Question List</Typography>
      {questions.map((question) => (
        <Box key={question._id} sx={{ marginBottom: 2, padding: 2, border: '1px solid #ddd' }}>
          <Link href={`/question/${question.name.toLowerCase().replace(/\s+/g, '-')}`}>
            <Typography variant="h6" component="a" sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
              {question.name}
            </Typography>
          </Link>
          <Typography variant="body1">{question.description}</Typography>
          <Typography variant="body2">Difficulty: {question.difficulty}</Typography>
        </Box>
      ))}
    </Box>
  );
}