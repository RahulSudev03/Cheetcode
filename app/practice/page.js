'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Typography, Button, Grid } from '@mui/material';
import ResponsiveAppBar from '../utils/ResponsiveAppBar';
import Footer from '../utils/Footer';
import ToggleDarkMode from '../utils/ToggleDarkMode';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import withAuth from '../utils/hoc/withAuth';

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedView, setSelectedView] = useState('difficulty');
  const [selectedConcept, setSelectedConcept] = useState('all');

  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

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

  const filterQuestionsByDifficulty = () => {
    if (selectedDifficulty === 'all') {
      return questions;
    }
    return questions.filter(
      (question) => question.difficulty.toLowerCase() === selectedDifficulty
    );
  };

  const filterQuestionsByConcept = () => {
    const concepts = [...new Set(questions.map((q) => q.algorithm))];
    return concepts.map((concept) => ({
      concept,
      questions: questions.filter((q) => q.algorithm === concept),
    }));
  };

  const scrollAnimationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Box sx={{ minHeight: '100vh', color: '#ffffff', backgroundColor: '#0d1117' }}>
      <ResponsiveAppBar />
      <Box sx={{ paddingTop: '16px', mt: 15, px: 2, maxWidth: '1200px', margin: 'auto' }}>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }} textAlign="center">
          <Grid item xs={12} sx={{ mb: 4 }}>
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={scrollAnimationVariants}
            >
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '28px', sm: '34px', md: '40px' },
                  color: '#c9d1d9',
                  textAlign: 'center',
                  mb: 4,
                }}
              >
                Explore Questions
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedView('difficulty');
                    setSelectedDifficulty('all');
                    setSelectedConcept('all');
                  }}
                  sx={{
                    bgcolor: selectedView === 'difficulty' ? '#1976d2' : '#3b4048',
                    color: '#ffffff',
                    ':hover': { bgcolor: '#828fa4' },
                  }}
                >
                  By Difficulty
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedView('concept');
                    setSelectedDifficulty('all');
                    setSelectedConcept('all');
                  }}
                  sx={{
                    bgcolor: selectedView === 'concept' ? '#1976d2' : '#3b4048',
                    color: '#ffffff',
                    ':hover': { bgcolor: '#828fa4' },
                  }}
                >
                  By Concept
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {selectedView === 'difficulty' ? (
            <>
              <Grid item xs={12} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 4 }}>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedDifficulty('all')}
                    sx={{
                      bgcolor: selectedDifficulty === 'all' ? '#1976d2' : '#3b4048',
                      color: '#ffffff',
                      ':hover': { bgcolor: '#828fa4' },
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedDifficulty('basic')}
                    sx={{
                      bgcolor: selectedDifficulty === 'basic' ? '#B0B0B0' : '#3b4048',
                      color: '#ffffff',
                      ':hover': { bgcolor: '#828fa4' },
                    }}
                  >
                    Basic
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedDifficulty('easy')}
                    sx={{
                      bgcolor: selectedDifficulty === 'easy' ? '#4CAF50' : '#3b4048',
                      color: '#ffffff',
                      ':hover': { bgcolor: '#828fa4' },
                    }}
                  >
                    Easy
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedDifficulty('medium')}
                    sx={{
                      bgcolor: selectedDifficulty === 'medium' ? '#FFEB3B' : '#3b4048',
                      color: '#ffffff',
                      ':hover': { bgcolor: '#828fa4' },
                    }}
                  >
                    Medium
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedDifficulty('hard')}
                    sx={{
                      bgcolor: selectedDifficulty === 'hard' ? '#F44336' : '#3b4048',
                      color: '#ffffff',
                      ':hover': { bgcolor: '#828fa4' },
                    }}
                  >
                    Hard
                  </Button>
                </Box>
              </Grid>
              {filterQuestionsByDifficulty().map((question) => (
                <Grid item xs={12} key={question._id}>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={scrollAnimationVariants}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        p: 3,
                        backgroundColor: '#161b22',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        textAlign: 'left',
                      }}
                    >
                      <Link href={`/practice/${question.name.toLowerCase().replace(/\s+/g, '-')}`} passHref>
                        <Typography
                          variant="h6"
                          component="a"
                          sx={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: '#58a6ff',
                            mb: 1,
                          }}
                        >
                          {question.name}
                        </Typography>
                      </Link>
                      <Typography variant="body1" sx={{ color: '#8b949e', mb: 1 }}>
                        {question.description}
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
                        }}
                      >
                        {question.difficulty}
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </>
          ) : (
            <>
              <Grid item xs={12} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 4 }}>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedConcept('all')}
                    sx={{
                      bgcolor: selectedConcept === 'all' ? '#1976d2' : '#3b4048',
                      color: '#ffffff',
                      ':hover': { bgcolor: '#828fa4' },
                    }}
                  >
                    All
                  </Button>
                  {filterQuestionsByConcept().map(({ concept }) => (
                    <Button
                      key={concept}
                      variant="contained"
                      onClick={() => setSelectedConcept(concept)}
                      sx={{
                        bgcolor: selectedConcept === concept ? '#1976d2' : '#3b4048',
                        color: '#ffffff',
                        ':hover': { bgcolor: '#828fa4' },
                      }}
                    >
                      {concept}
                    </Button>
                  ))}
                </Box>
              </Grid>
              {filterQuestionsByConcept().map(({ concept, questions }) => (
                selectedConcept === 'all' || selectedConcept === concept ? (
                  <Grid item xs={12} key={concept} sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        textAlign: 'center',
                        color: '#c9d1d9',
                        mb: 4,
                        fontWeight: 'bold',
                      }}
                    >
                      {concept.charAt(0).toUpperCase() + concept.slice(1).toLowerCase()} Questions
                    </Typography>
                    {questions.map((question) => (
                      <motion.div
                        key={question._id}
                        initial="hidden"
                        whileInView="visible"
                        variants={scrollAnimationVariants}
                      >
                        <Box
                          sx={{
                            mb: 2,
                            p: 3,
                            backgroundColor: '#161b22',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            textAlign: 'left',
                          }}
                        >
                          <Link href={`/question/${question.name.toLowerCase().replace(/\s+/g, '-')}`} passHref>
                            <Typography
                              variant="h6"
                              component="a"
                              sx={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                color: '#58a6ff',
                                mb: 1,
                              }}
                            >
                              {question.name}
                            </Typography>
                          </Link>
                          <Typography variant="body1" sx={{ color: '#8b949e', mb: 1 }}>
                            {question.description}
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
                            }}
                          >
                            {question.difficulty}
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Grid>
                ) : null
              ))}
            </>
          )}
        </Grid>
      </Box>
      <Footer />
      <ToggleDarkMode />
    </Box>
  );
}

export default withAuth(QuestionList);