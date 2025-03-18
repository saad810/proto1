import React, { useState, useEffect } from "react";
import { Paper, Title, Text, Textarea, Button, Group } from "@mantine/core";
import { CirclePlay, Clock } from "lucide-react";

export default function Test({ test, subject }) {
  // Guard: Ensure test.questions exists
  console.log(test,subject);
  if (!test) {
    return <Text color="red">Test data is incomplete.</Text>;
  }

  // Use test.title if available; otherwise derive from subject.
  const derivedTitle = test.title || `${subject.charAt(0).toUpperCase() + subject.slice(1)} Test`;
  const { questions } = test;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    setSubmitted(true);
    // Simulated AI evaluation response
    setEvaluation("AI Evaluation: Your answer is well-structured.");
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswer("");
      setSubmitted(false);
      setEvaluation(null);
    } else {
      alert("Test completed!");
    }
  };

  return (
    <Paper radius="md" mb="xl" p="xl" withBorder>
      {!started ? (
        <Group position="apart" mb="md">
          <Text size="lg">Number of Questions: {questions?.length}</Text>
          <Group>
            <Clock size={20} />
            <Text>{currentTime}</Text>
          </Group>
          <Button leftIcon={<CirclePlay size={20} />} onClick={() => setStarted(true)}>
            Start Test
          </Button>
        </Group>
      ) : (
        <>
          <Title order={3} mb="md">{derivedTitle}</Title>
          <Text size="lg" mb="md">{questions[currentQuestionIndex]}</Text>
          {!submitted ? (
            <>
              <Textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                mb="md"
                autosize
                minRows={3}
              />
              <Group position="right">
                <Button onClick={handleSubmit} variant="light">
                  Submit Answer
                </Button>
              </Group>
            </>
          ) : (
            <>
              <Text weight={500} mb="md">Your Answer:</Text>
              <Text mb="md">{answer}</Text>
              <Text weight={500} mb="md">{evaluation}</Text>
              <Group position="right">
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={handleNextQuestion} variant="light">
                    Next Question
                  </Button>
                ) : (
                  <Button disabled variant="light">
                    Test Completed
                  </Button>
                )}
              </Group>
            </>
          )}
        </>
      )}
    </Paper>
  );
}
