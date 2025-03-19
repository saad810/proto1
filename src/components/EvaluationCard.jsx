import React from "react";
import { Card, Text, List } from "@mantine/core";

const EvaluationCard = ({ evaluationData }) => {
    if (!evaluationData) return null;

    return (
        <Card withBorder shadow="sm" p="md" radius="sm" style={{ marginTop: "20px" }}>
            <Text weight={700} size="lg" mb="md">
                Answer Evaluation
            </Text>
            <Text size="sm">
                <strong>Status:</strong> {evaluationData.is_correct ? "Correct" : "Incorrect"}
            </Text>
            <Text size="sm">
                <strong>Score:</strong> {evaluationData.score.toFixed(2)}
            </Text>

            {evaluationData.incorrect_facts && evaluationData.incorrect_facts.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                    <Text weight={600} size="sm" mb="xs">
                        Incorrect Facts:
                    </Text>
                    <List spacing="sm" size="sm" withPadding>
                        {evaluationData.incorrect_facts.map((fact, index) => (
                            <List.Item key={index}>
                                <Text size="sm">
                                    <strong>Statement:</strong> {fact.statement}
                                </Text>
                                <Text size="xs" color="dimmed">
                                    <strong>Explanation:</strong> {fact.explanation}
                                </Text>
                            </List.Item>
                        ))}
                    </List>
                </div>
            )}
        </Card>
    );
};

export default EvaluationCard;
