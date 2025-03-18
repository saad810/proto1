import React, { useState, useEffect } from 'react';
import { Container, Card, Text, Button, Textarea, Group } from '@mantine/core';
import toast from 'react-hot-toast';
import TextHighlighter from '../components/TextHighlighter';
import axios from 'axios';

const mockTest = {
  book: "Beginning of World War 1",
  subject: "history",
  question: "What event is considered the trigger for the First World War?",
  created_at: "2025-03-18T12:25:07.372Z"
};

export default function SubjectTestsPage() {
  const [testData, setTestData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [grammarChecked, setGrammarChecked] = useState(false);
  const [grammarResult, setGrammarResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load test data from localStorage if available, otherwise use mockTest
    const storedTest = localStorage.getItem('testData');
    if (storedTest) {
      setTestData(JSON.parse(storedTest));
    } else {
      setTestData(mockTest);
      localStorage.setItem('testData', JSON.stringify(mockTest));
    }

    // Load previously submitted answer (if any)
    const storedAnswer = localStorage.getItem('testAnswer');
    if (storedAnswer) {
      setAnswer(storedAnswer);
      setSubmitted(true);
    }
  }, []);

  if (!testData) return <div>Loading...</div>;

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer before submitting.');
      return;
    }
    localStorage.setItem('testAnswer', answer);
    setSubmitted(true);
  };

  const handleGrammar = async () => {
    if (!answer.trim()) {
      toast.error('No answer submitted.');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/grammar/check", {
        text: answer,
      });
      console.log(response.data);
      setGrammarResult(response.data);
      setGrammarChecked(true);
    } catch (error) {
      console.error(error.message);
      toast.error('Error checking grammar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid mt="xl" style={{ padding: '20px' }}>
      <Card shadow="sm" padding="lg" style={{ width: '100%' }}>
        <Text weight={700} size="xl">
          {testData.subject}
        </Text>
        <Text size="sm" color="dimmed" mb="md">
          {testData.book}
        </Text>
        {!submitted ? (
          <>
            <Text weight={600} mb="md">Question</Text>
            <Text mb="md">{testData.question}</Text>
            <Textarea
              placeholder="Your answer"
              value={answer}
              onChange={(event) => setAnswer(event.currentTarget.value)}
              autosize
              minRows={5}
            />
            <Group position="right" mt="md">
              <Button onClick={handleSubmit} variant="light">
                Submit
              </Button>
            </Group>
          </>
        ) : (
          <>
            <Text weight={600} mb="md">Test Results</Text>
            <Text mb="md">Your Answer:</Text>
            <Text color="dimmed" mb="md">
              {answer || "No answer submitted."}
            </Text>
            <Group position="right" mt="md">
              <Button
                onClick={handleGrammar}
                variant="filled"
                disabled={loading || grammarChecked}
              >
                {loading ? 'Checking...' : 'Check Grammar'}
              </Button>
            </Group>
            {grammarChecked && grammarResult && (
              <TextHighlighter data={grammarResult} />
            )}
          </>
        )}
      </Card>
    </Container>
  );
}
