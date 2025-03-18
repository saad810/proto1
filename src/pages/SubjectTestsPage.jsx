import React from "react";
import { useParams } from "react-router-dom";
import { Container, Title, Text } from "@mantine/core";
import Test from "../components/Test"; // Adjust path as needed

// Example test data; replace with API calls or real data in production
const testData = {
  mathematics: [
    {
      title: "Algebra Test 1",
      questions: [
        "Q1: Solve for x: 2x + 3 = 7",
        "Q2: What is the slope of the line y = 2x + 1?",
      ],
    },
  ],
  science: [
    {
      title: "Physics Test 1",
      questions: [
        "Q1: Define velocity and acceleration.",
        "Q2: State Newton's first law of motion.",
      ],
    },
  ],
  history: [
    {
      title: "American Revolution Test",
      questions: [
        "Q1: Who was the first president of the USA?",
        "Q2: Summarize the causes of the American Revolution.",
      ],
    },
  ],
};

export default function SubjectTestsPage() {
  const { subject } = useParams();
  const normalizedSubject = subject.toLowerCase();
  const tests = testData[normalizedSubject] || [];

  return (
    <Container size="sm" style={{ padding: "20px 0" }}>
      <Title order={2} style={{ marginBottom: 20 }}>
        {subject.charAt(0).toUpperCase() + subject.slice(1)} Tests
      </Title>

      {tests.length === 0 ? (
        <Text>No tests available for this subject.</Text>
      ) : (
        tests.map((test, index) => (
          <Test key={index} test={test} subject={normalizedSubject} />
        ))
      )}
    </Container>
  );
}
