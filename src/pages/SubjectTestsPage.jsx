import React, { useState, useEffect } from "react";
import { Container, Card, Text, Button, Textarea, Group } from "@mantine/core";
import toast from "react-hot-toast";
import TextHighlighter from "../components/TextHighlighter";
import axios from "axios";
import EvaluationCard from "../components/EvaluationCard";
import { parse } from "postcss";

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
      const response = await axios.post("https://saad810-lms-app-api.hf.space/answer/analyze", {
        "question": testData.question,
        "user_answer": answer,
        "subject": "history"
      });
      console.log(response.data);
      setEvaluation(response?.data);
      console.log("Evaluation: 111", evaluation);
      setLoading(false);
      var success = false
      if (response.data) {
        success = postEvaluation();
      }
      if (success) {
        toast.success("Evaluation posted successfully!");
      } else {
        toast.error("Error posting evaluation [00]");
      }
    } catch (error) {
      console.error("Error fetching questions:", error.message);
    } finally {
      setLoading(false);
    }

    localStorage.setItem("testAnswer", answer);
    setSubmitted(true);
  };

  function extractAllErrors(grammarResult) {
    let errors = [];
    if (grammarResult.results && Array.isArray(grammarResult.results)) {
      grammarResult.results.forEach(result => {
        if (result.errors && Array.isArray(result.errors)) {
          errors = errors.concat(result.errors);
        }
      });
    }
    return errors;
  }

  const handleGrammar = async () => {
    if (!answer.trim()) {
      toast.error("No answer submitted.");
      return;
    }
    try {
      setLoadingGrammer(true);
      const response = await axios.post("https://saad810-lms-app-api.hf.space/grammar/check", {
        text: answer,
      });
      console.log(response.data);
      setGrammarResult(response.data);
      setGrammarChecked(true);
      // var success = false
      // if (response.data) {
      //   success = postGrammarRemarks();

      // }
      // if (success) {
      //   toast.success("Grammar remarks posted successfully!");
      // }
    } catch (error) {
      console.error(error);
      toast.error("Error checking grammar.");
    } finally {
      setLoadingGrammer(false);
    }
  };



  // evaluation
  const postEvaluation = async () => {
    try {
      // Build evaluation text from the incorrect_facts array, if available.
      let evaluationText = "Not Evaluated";
      if (
        evaluation &&
        Array.isArray(evaluation.incorrect_facts) &&
        evaluation.incorrect_facts.length > 0
      ) {
        evaluationText = evaluation.incorrect_facts
          .map((fact, index) => `${index + 1}. ${fact.statement}: ${fact.explanation}`)
          .join("\n");
      }

      // Safely compute the score
      let score = 0;
      if (evaluation && typeof evaluation.score === "number") {
        // Example: multiply by 100 and round to nearest integer
        score = Math.round(evaluation.score * 100);
      }

      console.log("Score:", score);
      console.log("Evaluation object:", evaluation);

      // Prepare the payload
      const payload = {
        question: testData.question,
        answer: answer,
        evaluation: evaluationText,   // The server expects "evaluation"
        evaluationMarks: score,       // The server expects "evaluationMarks"
        grammarAnalysis: "none",          // The server expects "grammarAnalysis"
        grammarMarks: 0,              // The server expects "grammarMarks"
        subject: testData.subject || "",
      };

      console.log("Payload being sent:", payload);

      // Post the evaluation
      const response = await axios.post("https://saad810-lms-app-api.hf.space/evaluation", payload);

      console.log("Evaluation server response:", response.data);
      if (response.data) {
        toast.success("Evaluation posted successfully!");

      }

      // If the server returned something, store it in localStorage and return true
      if (response.data) {
        localStorage.setItem("evaluation", JSON.stringify(response.data));
        return true;
      }

      // If there's no response data, treat it as a failure
      return false;

    } catch (error) {
      console.error("Error posting evaluation:", error);
      toast.error("Error posting evaluation");
      // Return false to indicate failure
      return false;
    }
  };
  function getEvaluationId() {
    // Retrieve the JSON string from localStorage
    const evaluationData = localStorage.getItem("evaluation");

    if (!evaluationData) {
      console.warn("No evaluation found in localStorage.");
      return null;
    }

    try {
      // Parse the JSON string into an object
      const parsedEvaluation = JSON.parse(evaluationData);

      // Return the id property (if it exists)
      return parsedEvaluation.id;
    } catch (error) {
      console.error("Error parsing evaluation data from localStorage:", error);
      return null;
    }
  }

  // Example usage:
  // const evaluationId = getEvaluationId();
  // console.log("Evaluation ID:", evaluationId);


  const postGrammarRemarks = async () => {
    // http://127.0.0.1:5000/evaluation/grammar/312312
    const id = getEvaluationId();
    const errors = extractAllErrors(grammarResult);
    try {
      const response = await axios.put(`https://saad810-lms-app-api.hf.space/evaluation/grammar/${id}`, {
        grammarAnalysis: errors,
      })
      console.log("Grammar remarks posted successfully!", response.data);
      if (response.data) {
        return true;
      }

    } catch (error) {
      console.error("Error posting grammar remarks:", error);
      toast.error("Error posting grammar remarks");
      // Return false to indicate failure
      return false
    }
  }

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
              <Button onClick={handleGrammar} variant="filled"
               disabled={grammarChecked}
               >
                {loadingGrammer ? "Checking..." : "Check Grammar"}
              </Button>
            </Group>
            {grammarChecked && grammarResult && <TextHighlighter data={grammarResult} />}
          </>
        )}
      </Card>
    </Container>
  );
}
