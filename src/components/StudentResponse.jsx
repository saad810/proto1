import React, { useState } from "react";
import { Paper, Title, Text, Table, Button, Modal, Divider, Group } from "@mantine/core";
import { IconEye, IconX } from "@tabler/icons-react";

const sampleResponses = [
  {
    question: "What are the benefits of renewable energy?",
    answer: "Renewable energy reduces carbon emissions and is sustainable.",
    evaluation: "Good response with clear points.",
    grammarAnalysis: "Well-structured sentence with correct grammar."
  },
  {
    question: "Explain Newton's First Law of Motion.",
    answer: "An object remains at rest or in uniform motion unless acted upon by an external force.",
    evaluation: "Accurate and concise answer.",
    grammarAnalysis: "Grammatically correct with proper scientific terminology."
  },
  {
    question: "Describe the water cycle.",
    answer: "Water evaporates, condenses into clouds, and then precipitates.",
    evaluation: "Covers key stages but could elaborate more.",
    grammarAnalysis: "Minor grammatical issues, such as sentence fragmentation."
  }
];

export default function StudentResponse() {
  const [opened, setOpened] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);

  const handleRowClick = (response) => {
    setSelectedResponse(response);
    setOpened(true);
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} mb="md" align="center">Student Responses</Title>
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th>Question</th>
            <th>Student Answer</th>
            <th>AI Evaluation</th>
            <th>Grammar Analysis</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sampleResponses.map((response, index) => (
            <tr key={index}>
              <td>{response.question}</td>
              <td>{response.answer}</td>
              <td>{response.evaluation}</td>
              <td>{response.grammarAnalysis}</td>
              <td>
                <Button size="xs" leftIcon={<IconEye size={16} />} onClick={() => handleRowClick(response)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal opened={opened} onClose={() => setOpened(false)} title={<Title order={3}>Response Details</Title>} centered>
        {selectedResponse && (
          <div>
            <Divider mb="md" />
            <Text weight={500} size="lg" mb="xs">Question:</Text>
            <Text mb="md">{selectedResponse.question}</Text>
            <Text weight={500} size="lg" mb="xs">Student Answer:</Text>
            <Text mb="md" color="blue">{selectedResponse.answer}</Text>
            <Text weight={500} size="lg" mb="xs">AI Evaluation:</Text>
            <Text mb="md" color="green">{selectedResponse.evaluation}</Text>
            <Text weight={500} size="lg" mb="xs">Grammar Analysis:</Text>
            <Text color="red">{selectedResponse.grammarAnalysis}</Text>
            <Group position="right" mt="md">
              <Button leftIcon={<IconX size={16} />} variant="outline" onClick={() => setOpened(false)}>
                Close
              </Button>
            </Group>
          </div>
        )}
      </Modal>
    </Paper>
  );
}