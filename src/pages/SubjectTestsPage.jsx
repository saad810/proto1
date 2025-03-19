import React, { useState, useEffect } from "react";
import { Container, Card, Text, Button, Textarea, Group } from "@mantine/core";
import toast from "react-hot-toast";
import TextHighlighter from "../components/TextHighlighter";
import axios from "axios";
import EvaluationCard from "../components/EvaluationCard";

const mockTest = {
  book: "Beginning of World War 1",
  subject: "History",
  question: "What event is considered the trigger for the First World War?",
  created_at: "2025-03-18T12:25:07.372Z",
};

export default function SubjectTestsPage() {
  const [testData, setTestData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [grammarChecked, setGrammarChecked] = useState(false);
  const [grammarResult, setGrammarResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingGrammer, setLoadingGrammer] = useState(false);
  const [evaluation, setEvaluation] = useState(null);



  useEffect(() => {
    const storedTest = localStorage.getItem("testData");
    if (storedTest) {
      setTestData(JSON.parse(storedTest));
    } else {
      setTestData(mockTest);
      localStorage.setItem("testData", JSON.stringify(mockTest));
    }

    const storedAnswer = localStorage.getItem("testAnswer");
    if (storedAnswer) {
      setAnswer("");
      setSubmitted(false);
      setEvaluation(null);
      localStorage.removeItem("testAnswer");
    }
  }, []);

  if (!testData) return <div>Loading...</div>;
  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer before submitting.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/answer/analyze", {
        "question": testData.question,
        "user_answer": answer,
        "subject": "history"
      });
      console.log(response.data);
      setEvaluation(response.data);
    setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error.message);
    } finally {
      setLoading(false);
    }

    localStorage.setItem("testAnswer", answer);
    setSubmitted(true);
  };

  const handleGrammar = async () => {
    if (!answer.trim()) {
      toast.error("No answer submitted.");
      return;
    }
    try {
      setLoadingGrammer(true);
      const response = await axios.post("http://127.0.0.1:5000/grammar/check", {
        text: answer,
      });
      console.log(response.data);
      setGrammarResult(response.data);
      setGrammarChecked(true);
    } catch (error) {
      console.error(error.message);
      toast.error("Error checking grammar.");
    } finally {
      setLoadingGrammer(false);
    }
  };

  return (
    <Container fluid style={{ padding: "20px" }}>
      <Card shadow="sm" padding="lg" style={{ width: "100%" }}>
        <Text weight={700} size="xl">
          {testData.subject}
        </Text>
        <Text size="sm" color="dimmed" mb="md">
          {testData.book}
        </Text>
        {!submitted ? (
          <>
            <Text weight={600} size="sm" mb="md">
              Question
            </Text>
            <Text size="sm" mb="md">
              {testData.question}
            </Text>
            <Textarea
              placeholder="Your answer"
              value={answer}
              onChange={(event) => setAnswer(event.currentTarget.value)}
              autosize
              minRows={5}
            />
            <Group position="right" mt="md">
              <Button onClick={handleSubmit} variant="light">
                {loading ? "Checking..." : "Submit Answer"}
              </Button>
            </Group>
          </>
        ) : (
          <>
            <Text weight={600} size="sm" mb="md">
              Test Results
            </Text>
            <Text size="sm" mb="md">
              Your Answer:
            </Text>
            <Text size="sm" color="dimmed" mb="md">
              {answer || "No answer submitted."}
            </Text>
            <EvaluationCard evaluationData={evaluation} />
            <Group position="right" mt="md">
              <Button onClick={handleGrammar} variant="filled" disabled={grammarChecked}>
                {setLoadingGrammer ? "Checking..." : "Check Grammar"}
              </Button>
            </Group>
            {grammarChecked && grammarResult && <TextHighlighter data={grammarResult} />}
          </>
        )}
      </Card>
    </Container>
  );
}
