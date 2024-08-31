'use client'

import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Select, MenuItem, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function UploadQuestion() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions from the backend
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
        setQuestions(data.data); // Set the fetched questions to state
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []); // Empty dependency array means this effect runs once on component mount

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

      // Clear form fields and fetch updated questions list
      setName('');
      setDescription('');
      setDifficulty('');
      setTestCases([{ input: '', output: '' }]);
      fetchQuestions(); // Fetch the updated list of questions

    } catch (error) {
      console.error('Failed to submit question:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Upload Question
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Question Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Question Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Select
          fullWidth
          margin="normal"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          displayEmpty
          required
        >
          <MenuItem value="">
            <em>Select Difficulty</em>
          </MenuItem>
          <MenuItem value="easy">Basic</MenuItem>
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
        {testCases.map((testCase, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
            <TextField
              label="Test Case Input"
              value={testCase.input}
              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
              required
            />
            <TextField
              label="Test Case Output"
              value={testCase.output}
              onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
              required
            />
          </Box>
        ))}
        <IconButton onClick={() => setTestCases([...testCases, { input: '', output: '' }])} color="primary">
          <AddCircleIcon />
        </IconButton>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Submit Question
        </Button>
      </form>

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Uploaded Questions
      </Typography>
      <Box>
        {questions.map((question) => (
          <Box key={question._id} sx={{ marginBottom: 2, padding: 2, border: '1px solid #ddd' }}>
            <Typography variant="h6">{question.name}</Typography>
            <Typography variant="body1">{question.description}</Typography>
            <Typography variant="body2">Difficulty: {question.difficulty}</Typography>
            <Typography variant="body2">Test Cases:</Typography>
            <ul>
              {question.testCase.map((testCase, idx) => (
                <li key={idx}>
                  <strong>Input:</strong> {testCase.input}, <strong>Output:</strong> {testCase.output}<br /> <strong>Explanation: </strong> {testCase.explanation}
                </li>
              ))}
            </ul>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
