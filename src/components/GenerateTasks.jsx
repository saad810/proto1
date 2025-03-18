import React, { useState } from "react";
import {
  Card,
  Text,
  Grid,
  Button,
  Select,
  TextInput,
  Checkbox,
  ScrollArea,
  Title,
  Container,
  Box,
  Transition,
  LoadingOverlay
} from "@mantine/core";
import { IconBook, IconArrowLeft, IconCheck } from "@tabler/icons-react";

const subjects = [
  { title: "Mathematics", resources: 10, students: 30 },
  { title: "Science", resources: 8, students: 25 },
  { title: "History", resources: 5, students: 20 },
];

const books = ["Book A", "Book B", "Book C"];
const sampleQuestions = [
  "What is 2 + 2?",
  "Explain Newton's first law.",
  "Who was the first president of the USA?",
];

export default function GenerateTasks() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [topic, setTopic] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuestions = () => {
    // Simulate a loading state for a smoother UX
    setLoading(true);
    setTimeout(() => {
      setGeneratedQuestions(sampleQuestions);
      setLoading(false);
    }, 800);
  };

  const handleAssignQuestions = () => {
    alert(`Assigned ${selectedQuestions.length} questions to all students.`);
  };

  return (
    <Container size="lg" style={{ padding: "20px 0" }}>
      {!selectedSubject ? (
        <>
          <Title order={2} style={{ marginBottom: 30 }}>
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
                    transition: "transform 150ms ease",
                    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)"
                  }}
                  onClick={() => setSelectedSubject(subject)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Grid justify="space-between" align="center">
                    <Grid.Col span={10}>
                      <Text weight={500} size="lg">
                        {subject.title}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={2} style={{ textAlign: "right" }}>
                      <IconBook size={20} />
                    </Grid.Col>
                  </Grid>
                  <Text size="sm" color="dimmed">
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
            style={{ marginBottom: 20 }}
          >
            Back
          </Button>
          <Title order={3} style={{ marginBottom: 20 }}>
            Generate Tasks for {selectedSubject.title}
          </Title>
          <Select
            data={books}
            label="Select a Book"
            placeholder="Choose a book"
            value={selectedBook}
            onChange={setSelectedBook}
            style={{ marginBottom: 20 }}
          />
          <TextInput
            label="Enter Topic"
            placeholder="Topic name"
            value={topic}
            onChange={(e) => setTopic(e.currentTarget.value)}
            style={{ marginBottom: 20 }}
          />
          <Button onClick={handleGenerateQuestions} style={{ marginBottom: 20 }} fullWidth>
            Generate Questions
          </Button>

          <Box style={{ position: "relative" }}>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            <Transition
              mounted={generatedQuestions.length > 0}
              transition="fade"
              duration={400}
            >
              {(styles) => (
                <div style={styles}>
                  <Title order={4} style={{ marginBottom: 15 }}>
                    Select Questions:
                  </Title>
                  <ScrollArea style={{ height: 200, marginBottom: 20 }}>
                    {generatedQuestions.map((question, index) => (
                      <Checkbox
                        key={index}
                        label={question}
                        mb="sm"
                        onChange={(event) => {
                          if (event.currentTarget.checked) {
                            setSelectedQuestions((prev) => [...prev, question]);
                          } else {
                            setSelectedQuestions((prev) =>
                              prev.filter((q) => q !== question)
                            );
                          }
                        }}
                      />
                    ))}
                  </ScrollArea>
                  <Button
                    onClick={handleAssignQuestions}
                    leftIcon={<IconCheck size={16} />}
                    fullWidth
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
