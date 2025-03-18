import React, { useState } from "react";
import {
  Card,
  Text,
  Grid,
  Button,
  Select,
  NumberInput,
  Group,
  Checkbox,
  ScrollArea,
  Title,
  Container,
  Box,
  Transition,
  LoadingOverlay,
} from "@mantine/core";
import { IconBook, IconArrowLeft, IconCheck } from "@tabler/icons-react";
import toast from "react-hot-toast";
import axios from "axios";

const books = ["Beginning of World War 1"];
const subjects = [{ title: "History", resources: books.length, students: 20 }];

export default function GenerateTasks() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [numQuestions, setNumQuestions] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/generate/questions", {
        book: selectedBook,
        subject: "history",
        num_questions: numQuestions,
      });

      if (!response.data?.questions || response.data.questions.length === 0) {
        throw new Error("No questions received from API");
      }

      toast.success("Questions generated successfully");
      setTimeout(() => {
        setGeneratedQuestions(response.data.questions);
        setLoading(false);
      }, 800);

      localStorage.removeItem("tasks");
      const tasks = {
        book: selectedBook,
        subject: "history",
        num_questions: numQuestions,
        questions: response.data.questions,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      toast.error("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignQuestions = () => {
    toast.success(`Assigned ${selectedQuestions.length} questions to students.`);
  };

  return (
    <Container size="lg" style={{ padding: "20px 0" }}>
      {!selectedSubject ? (
        <>
          <Title order={2} weight={700} mb="lg">
            Select a Subject
          </Title>
          <Grid gutter="xl">
            {subjects.map((subject) => (
              <Grid.Col xs={12} sm={6} md={4} key={subject.title}>
                <Card
                  shadow="md"
                  padding="lg"
                  style={{
                    cursor: "pointer",
                    transition: "transform 150ms ease, box-shadow 150ms ease",
                    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                  }}
                  onClick={() => setSelectedSubject(subject)}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <Group position="apart">
                    <Text weight={700} size="lg">
                      {subject.title}
                    </Text>
                    <IconBook size={24} />
                  </Group>
                  <Text size="sm" color="dimmed" mt="xs">
                    Resources: {subject.resources}
                  </Text>
                  <Text size="sm" color="dimmed">
                    Students: {subject.students}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </>
      ) : (
        <Box>
          <Button
            variant="subtle"
            leftIcon={<IconArrowLeft size={16} />}
            onClick={() => {
              setSelectedSubject(null);
              setGeneratedQuestions([]);
              setSelectedQuestions([]);
            }}
            mb="lg"
          >
            Back
          </Button>
          <Title order={3} weight={700} mb="md">
            Generate Tasks for {selectedSubject.title}
          </Title>
          <Group mb="md" spacing="md">
            <Select
              data={books}
              label="Select a Book"
              placeholder="Choose a book"
              value={selectedBook}
              onChange={(value) => setSelectedBook(value)}
            />
            <NumberInput
              label="Enter Number of Questions"
              placeholder="Number of questions"
              value={numQuestions}
              onChange={(value) => setNumQuestions(value)}
            />
          </Group>
          <Button
            onClick={handleGenerateQuestions}
            fullWidth
            variant="filled"
            style={{ backgroundColor: "#007bff" }}
            mb="md"
          >
            {loading ? "Generating Questions..." : "Generate Questions"}
          </Button>

          <Box style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            <Transition mounted={generatedQuestions.length > 0} transition="fade" duration={400}>
              {(styles) => (
                <div style={styles}>
                  <Title order={4} weight={700} mb="md">
                    Select Questions:
                  </Title>
                  <ScrollArea style={{ height: "max-content", marginBottom: 20 }}>
                    {generatedQuestions.map((question, index) => (
                      <Checkbox
                        key={index}
                        label={question}
                        mb="sm"
                        onChange={(event) => {
                          if (event.currentTarget.checked) {
                            setSelectedQuestions((prev) => [...prev, question]);
                          } else {
                            setSelectedQuestions((prev) => prev.filter((q) => q !== question));
                          }
                        }}
                      />
                    ))}
                  </ScrollArea>
                  <Button
                    onClick={handleAssignQuestions}
                    leftIcon={<IconCheck size={16} />}
                    fullWidth
                    variant="filled"
                    style={{ backgroundColor: "#28a745" }}
                  >
                    Assign to All Students
                  </Button>
                </div>
              )}
            </Transition>
          </Box>
        </Box>
      )}
    </Container>
  );
}
