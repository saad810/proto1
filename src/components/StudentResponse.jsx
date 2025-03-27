import React, { useState, useEffect } from "react";
import axios from "axios";
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
    question: "What event is considered the trigger for the First World War?",
    answer: "",
    evaluationMarks: 0,
    subject: "History",
    evaluation_remarks:
      "The evaluation was not conducted, resulting in a score of 0 out of 100, leaving no room for assessing strengths or identifying areas for improvement.",
    createdAt: "2025-03-27 11:21:06.507000"
  }
];

// Helper function to truncate text to a given word limit
const truncateText = (text, wordLimit) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + " ...";
};

// Helper function to format date strings
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export default function StudentResponse() {
  const [responses, setResponses] = useState([]);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [editingResponse, setEditingResponse] = useState(null);
  const { subject } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch responses from the server
        const response = await axios.get("https://saad810-lms-app-api.hf.space/evaluation/all");
        let data = response.data;
        // If a subject is provided via URL, filter responses accordingly (case-insensitive)
        if (subject) {
          data = data.filter((r) => r.subject.toLowerCase() === subject.toLowerCase());
        }
        setResponses(data);
        // Store the fetched responses in localStorage for persistence/fallback
        localStorage.setItem("responses", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching responses:", error);
        // Fallback to stored responses if available
        const storedResponses = JSON.parse(localStorage.getItem("responses")) || sampleResponses;
        setResponses(storedResponses);
      }
    };

    fetchData();
  }, [subject]);

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
      const marks = Number(editingResponse.evaluationMarks);
      if (marks > 100) {
        alert("Maximum allowed marks is 100.");
        return;
      }
      const updatedResponses = [...responses];
      updatedResponses[editingResponse.index] = {
        ...updatedResponses[editingResponse.index],
        evaluationMarks: marks,
        evaluation_remarks: editingResponse.evaluation_remarks
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
        Student Responses {subject && `(${subject})`}
      </Title>
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Subject</th>
            <th>Evaluation Marks</th>
            <th>Evaluation Remarks</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response, index) => (
            <tr key={index}>
              <td>{truncateText(response.question, 15)}</td>
              <td>{truncateText(response.answer, 15)}</td>
              <td>{response.subject}</td>
              <td>{response.evaluationMarks}</td>
              <td>{truncateText(response.evaluation_remarks,10)}</td>
              <td>{formatDate(response.createdAt)}</td>
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
              Answer:
            </Text>
            <Text mb="md">{selectedResponse.answer}</Text>
            <Text weight={500} size="lg" mb="xs">
              Subject:
            </Text>
            <Text mb="md" color="blue">
              {selectedResponse.subject}
            </Text>
            <Text weight={500} size="lg" mb="xs">
              Evaluation Marks:
            </Text>
            <Text mb="md" color="green">
              {selectedResponse.evaluationMarks}
            </Text>
            <Text weight={500} size="lg" mb="xs">
              Evaluation Remarks:
            </Text>
            <Text mb="md" color="red">
              {selectedResponse.evaluation_remarks}
            </Text>
            <Text weight={500} size="lg" mb="xs">
              Created At:
            </Text>
            <Text mb="md">{formatDate(selectedResponse.createdAt)}</Text>
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
        title={<Title order={3}>Edit Evaluation</Title>}
        centered
      >
        {editingResponse && (
          <>
            <TextInput
              label="Evaluation Marks"
              type="number"
              value={editingResponse.evaluationMarks}
              onChange={(e) =>
                setEditingResponse({
                  ...editingResponse,
                  evaluationMarks: e.target.value
                })
              }
              mb="sm"
            />
            <TextInput
              label="Evaluation Remarks"
              value={editingResponse.evaluation_remarks}
              onChange={(e) =>
                setEditingResponse({
                  ...editingResponse,
                  evaluation_remarks: e.target.value
                })
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
