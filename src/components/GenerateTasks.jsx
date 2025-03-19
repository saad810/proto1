import React, { useState } from "react";
import {
    Card,
    Text,
    Grid,
    Button,
    Select,
    NumberInput,
    Group,
    ScrollArea,
    Title,
    Container,
    Box,
    LoadingOverlay,
    Badge,
    List,
} from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const books = ["Beginning of World War 1"];
const subjects = [{ title: "History", resources: books.length, students: 20 }];
const questionTypes = ["mcqs", "true_false", "text_based", "fill_in_the_blank"];

export default function GenerateTasks() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [numQuestions, setNumQuestions] = useState(5);
    const [questionType, setQuestionType] = useState("text_based");
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Separate handler for Book selection
    const selectBook = (value) => {
        setSelectedBook(value);
    };

    // Separate handler for Question Type selection
    const selectType = (value) => {
        setQuestionType(value);
    };

    // Separate handler for Number of Questions change
    const handleNumQuestionsChange = (value) => {
        setNumQuestions(value);
    };

    const handleGenerateQuestions = async () => {
        try {
            setLoading(true);
            alert(
                `Generating ${numQuestions} ${questionType} questions for ${selectedBook} in ${selectedSubject.title}`
            )
            const response = await axios.post("https://saad810-lms-api.hf.space/generate/questions", {
                book: "Beginning of World war 1",
                subject: "history",
                num_questions: numQuestions,
                type: questionType,
            });
            if (!response.data?.questions || response.data.questions.length === 0) {
                throw new Error("No questions received from API");
            }
            toast.success("Questions generated successfully");
            setGeneratedQuestions(response.data.questions);
            localStorage.setItem("tasks", JSON.stringify(response.data.questions));
        } catch (error) {
            toast.error("Failed to generate questions");
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestionSelection = (question) => {
        setSelectedQuestions((prev) => {
            if (prev.includes(question)) {
                return prev.filter((q) => q !== question);
            }
            return [...prev, question];
        });
    };

    // Render question content based on type
    const renderQuestionContent = (question) => {
        switch (question.type) {
            case "mcq":
                return (
                    <List spacing="xs" size="sm" mb="sm">
                        {question.options?.map((option, i) => (
                            <List.Item key={i}>
                                <Text
                                    size="sm"
                                    weight={option === question.answer ? 700 : 400}
                                    color={option === question.answer ? "green" : "dimmed"}
                                >
                                    {option}
                                </Text>
                            </List.Item>
                        ))}
                    </List>
                );
            case "true_false":
                return (
                    <Group spacing="xs" mb="sm">
                        {["True", "False"].map((option, i) => (
                            <Badge
                                key={i}
                                color={option === question.answer ? "green" : "gray"}
                                variant="light"
                            >
                                {option}
                            </Badge>
                        ))}
                    </Group>
                );
            case "fill_in_the_blank":
                return (
                    <Box mb="sm">
                        <Text size="sm" color="dimmed">
                            {question.question}
                        </Text>
                        <Text size="sm" weight={700} color="green">
                            Answer: {question.answer}
                        </Text>
                    </Box>
                );
            case "text_based":
            default:
                return (
                    <Text size="sm" color="dimmed" mb="sm">
                        {question.question}
                    </Text>
                );
        }
    };

    return (
        <Container size="lg" style={{ padding: "20px 0" }}>
            {!selectedSubject ? (
                <>
                    <Title order={2} mb="lg">
                        Select a Subject
                    </Title>
                    <Grid>
                        {subjects.map((subject) => (
                            <Grid.Col xs={12} sm={6} md={4} key={subject.title}>
                                <Card
                                    shadow="md"
                                    padding="lg"
                                    style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
                                    onClick={() => setSelectedSubject(subject)}
                                    withBorder
                                >
                                    <Text weight={700} size="lg">
                                        {subject.title}
                                    </Text>
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
                        onClick={() => setSelectedSubject(null)}
                        variant="light"
                        style={{ marginBottom: 20 }}
                    >
                        <ArrowLeft size={20} style={{ marginRight: 10 }} />
                        Back
                    </Button>
                    <Title order={3} mb="md">
                        Generate Tasks for {selectedSubject.title}
                    </Title>
                    <Group mb="md">
                        <Select
                            data={books}
                            label="Select a Book"
                            placeholder="Choose a book"
                            value={selectedBook}
                            onChange={selectBook}
                        />
                        <NumberInput
                            label="Enter Number of Questions"
                            placeholder="Number of questions"
                            value={numQuestions}
                            onChange={handleNumQuestionsChange}
                        />
                        <Select
                            data={questionTypes}
                            label="Select Question Type"
                            placeholder="Choose question type"
                            value={questionType}
                            onChange={selectType}
                        />
                    </Group>
                    <Button
                        onClick={handleGenerateQuestions}
                        fullWidth
                        variant="filled"
                        mt="md"
                    >
                        {loading ? "Generating Questions..." : "Generate Questions"}
                    </Button>
                    <Box style={{ position: "relative", marginTop: 20 }}>
                        <LoadingOverlay visible={loading} overlayBlur={2} />
                        <ScrollArea style={{ height: "max-content", width: "100%" }}>
                            <Grid gutter="md">
                                {generatedQuestions.map((question, index) => (
                                    <Grid.Col span={6} key={index}>
                                        <Card
                                            shadow="sm"
                                            padding="md"
                                            withBorder
                                            radius="md"
                                            style={{
                                                cursor: "pointer",
                                                border: selectedQuestions.includes(question)
                                                    ? "2px solid #4caf50"
                                                    : "1px solid lightgray",
                                                transition: "border 0.2s ease, transform 0.2s ease",
                                            }}
                                            onClick={() => toggleQuestionSelection(question)}
                                            sx={{
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                                },
                                            }}
                                        >
                                            <Group position="apart" mb="xs">
                                                <Text weight={700} size="md">
                                                    {question.question}
                                                </Text>
                                                <Badge color="blue" variant="light">
                                                    {question.type.toUpperCase()}
                                                </Badge>
                                            </Group>
                                            {renderQuestionContent(question)}
                                        </Card>
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </ScrollArea>
                        {generatedQuestions.length > 0 && (
                            <Button
                                onClick={() =>
                                    toast.success(
                                        `Assigned ${selectedQuestions.length} questions to students.`
                                    )
                                }
                                fullWidth
                                mt="md"
                                disabled={selectedQuestions.length === 0}

                            >
                                Assign to All Students
                            </Button>
                        )}
                    </Box>
                </Box>
            )}
        </Container>
    );
}
