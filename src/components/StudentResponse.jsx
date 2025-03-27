import React, { useState, useEffect } from "react";
import {
  Paper,
  Title,
  Text,
  Table,
  Button,
  Modal,
  Divider,
  Group,
  TextInput
} from "@mantine/core";
import { IconEye, IconEdit } from "@tabler/icons-react";
import { useParams } from "react-router-dom";

const sampleResponses = [
  {
    question: "What are the benefits of renewable energy?",
    answer: "Renewable energy reduces carbon emissions and is sustainable.",
    evaluation: "Good response with clear points.",
    evaluationMarks: "10",
    grammarAnalysis: "Well-structured sentence with correct grammar.",
    grammarMarks: "10"
  },
  {
    question: "Explain Newton's First Law of Motion.",
    answer: "An object remains at rest or in uniform motion unless acted upon by an external force.",
    evaluation: "Accurate and concise answer.",
    evaluationMarks: "9",
    grammarAnalysis: "Grammatically correct with proper scientific terminology.",
    grammarMarks: "9"
  },
  {
    question: "Describe the water cycle.",
    answer: "Water evaporates, condenses into clouds, and then precipitates.",
    evaluation: "Covers key stages but could elaborate more.",
    evaluationMarks: "8",
    grammarAnalysis: "Minor grammatical issues, such as sentence fragmentation.",
    grammarMarks: "7"
  }
];

export default function StudentResponse() {
  const [responses, setResponses] = useState([]);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [editModalOpened, setEditModalOpened] = useState(false);
  // editingResponse holds the response object along with its index
  const [editingResponse, setEditingResponse] = useState(null);
  const { subject } = useParams();

  useEffect(() => {
    const storedResponses = JSON.parse(localStorage.getItem("responses")) || sampleResponses;
    setResponses(storedResponses);
  }, []);

  const openViewModal = (response) => {
    setSelectedResponse(response);
    setViewModalOpened(true);
  };

  const openEditModal = (index) => {
    setEditingResponse({ ...responses[index], index });
    setEditModalOpened(true);
  };

  const handleSaveEdit = () => {
    if (editingResponse) {
      const updatedResponses = [...responses];
      updatedResponses[editingResponse.index] = {
        ...updatedResponses[editingResponse.index],
        evaluation: editingResponse.evaluation,
        evaluationMarks: editingResponse.evaluationMarks,
        grammarAnalysis: editingResponse.grammarAnalysis,
        grammarMarks: editingResponse.grammarMarks,
      };
      setResponses(updatedResponses);
      localStorage.setItem("responses", JSON.stringify(updatedResponses));
      setEditModalOpened(false);
      setEditingResponse(null);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} mb="md" align="center">
        Student Responses {subject}
      </Title>
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th>Question</th>
            <th>Student Answer</th>
            <th>Evaluation</th>
            <th>Grammar Analysis</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response, index) => (
            <tr key={index}>
              <td>{response.question}</td>
              <td>{response.answer}</td>
              <td>{response.evaluation}</td>
              <td>{response.grammarAnalysis}</td>
              <td>
                <Group spacing="xs">
                  <Button
                    size="xs"
                    leftIcon={<IconEye size={16} />}
                    onClick={() => openViewModal(response)}
                  >
                    View
                  </Button>
                  <Button
                    size="xs"
                    leftIcon={<IconEdit size={16} />}
                    onClick={() => openEditModal(index)}
                  >
                    Edit
                  </Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* View Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title={<Title order={3}>Response Details</Title>}
        centered
      >
        {selectedResponse && (
          <div>
            <Divider mb="md" />
            <Text weight={500} size="lg" mb="xs">
              Question:
            </Text>
            <Text mb="md">{selectedResponse.question}</Text>
            <Text weight={500} size="lg" mb="xs">
              Student Answer:
            </Text>
            <Text mb="md" color="blue">
              {selectedResponse.answer}
            </Text>
            <Text weight={500} size="lg" mb="xs">
              Evaluation:
            </Text>
            <Text mb="md" color="green">
              {selectedResponse.evaluation} ({selectedResponse.evaluationMarks} marks)
            </Text>
            <Text weight={500} size="lg" mb="xs">
              Grammar Analysis:
            </Text>
            <Text mb="md" color="red">
              {selectedResponse.grammarAnalysis} ({selectedResponse.grammarMarks} marks)
            </Text>
            <Group position="right" mt="md">
              <Button variant="outline" onClick={() => setViewModalOpened(false)}>
                Close
              </Button>
            </Group>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpened}
        onClose={() => {
          setEditModalOpened(false);
          setEditingResponse(null);
        }}
        title={<Title order={3}>Edit Evaluation & Analysis</Title>}
        centered
      >
        {editingResponse && (
          <>
            <TextInput
              label="Evaluation"
              value={editingResponse.evaluation}
              onChange={(e) =>
                setEditingResponse({ ...editingResponse, evaluation: e.target.value })
              }
              mb="sm"
            />
            <TextInput
              label="Evaluation Marks"
              value={editingResponse.evaluationMarks}
              onChange={(e) =>
                setEditingResponse({ ...editingResponse, evaluationMarks: e.target.value })
              }
              mb="sm"
            />
            <TextInput
              label="Grammar Analysis"
              value={editingResponse.grammarAnalysis}
              onChange={(e) =>
                setEditingResponse({ ...editingResponse, grammarAnalysis: e.target.value })
              }
              mb="sm"
            />
            <TextInput
              label="Grammar Marks"
              value={editingResponse.grammarMarks}
              onChange={(e) =>
                setEditingResponse({ ...editingResponse, grammarMarks: e.target.value })
              }
              mb="sm"
            />
            <Group position="right" mt="md">
              <Button
                variant="outline"
                onClick={() => {
                  setEditModalOpened(false);
                  setEditingResponse(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </Group>
          </>
        )}
      </Modal>
    </Paper>
  );
}
