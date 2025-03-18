import React, { useState, useEffect } from "react";
import { Paper, Title, Text, Textarea, Button, Group, ActionIcon } from "@mantine/core";
// import { IconClock, IconPlay } from "@tabler/icons-react";
import { CirclePlay, Clock } from 'lucide-react'
export default function Test({ test }) {
    const { title, questions } = test;
    const [answer, setAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [started, setStarted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async () => {
        setSubmitted(true);
        setEvaluation(`AI Evaluation: Your answer is well-structured.`);
    };

    return (
        <Paper radius="md" mb="xl" p="xl" withBorder>
            {!started ? (
                <Group position="apart" mb="md">
                    <Text size="lg">Number of Questions: {questions.length}</Text>
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
                    <Title order={3} mb="md">{title}</Title>
                    <Text size="lg" mb="md">{questions[0]}</Text>
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
                                <Button variant="light">Request Grammar Analysis</Button>
                            </Group>
                        </>
                    )}
                </>
            )}
        </Paper>
    );
}
