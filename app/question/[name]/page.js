'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Select, MenuItem, IconButton } from '@mui/material';

export default function UploadQuestion() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/uploadQuestion', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

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

  const handleTestCaseChange = (index, key, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][key] = value;
    setTestCases(newTestCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/uploadQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          difficulty,
          testCase: testCases,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error: ${response.status} - ${text}`);
      }

      const data = await response.json();
      console.log(data);

      setName('');
      setDescription('');
      setDifficulty('');
      setTestCases([{ input: '', output: '' }]);
      fetchQuestions();

    } catch (error) {
      console.error('Failed to submit question:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Box>
        {questions.map((question) => (
          <Box key={question._id} sx={{ marginBottom: 2, padding: 2, border: '1px solid #ddd' }}>
            <Link href={`/question/${question.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <Typography variant="h6" component="a" sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
                {question.name}
              </Typography>
            </Link>
            <Typography variant="body1">{question.description}</Typography>
            <Typography variant="body2">Difficulty: {question.difficulty}</Typography>
            <Typography variant="body2">Test Cases:</Typography>
            <ul>
              {question.testCase.map((testCase, idx) => (
                <li key={idx}>
                  <strong>Input:</strong> {testCase.input}, <strong>Output:</strong> {testCase.output}
                </li>
              ))}
            </ul>
          </Box>
        ))}
      </Box>
    </Box>
  );
}


