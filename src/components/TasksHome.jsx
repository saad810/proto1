// src/pages/TasksDashboard.jsx

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Text,
  Title,
  Group,
  Box,
  LoadingOverlay,
  Stack,
  ActionIcon,
  Menu,
  Modal,
  Textarea,
  Button,
  Divider
} from "@mantine/core";
import { FileText, MoreVertical, Pencil, Trash, Eye } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function TasksHome() {
  const { subject } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // For update modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedQuestions, setUpdatedQuestions] = useState([]);

  // For delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // For view modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewTask, setViewTask] = useState(null);

  // Ref to store last focused element before opening a modal
  const lastFocusedElementRef = useRef(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://saad810-lms-api-1.hf.space/teacher-tasks");
      setTasks(res.data.tasks);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [subject]);

  // Open update modal and initialize with current questions
  const openUpdateModal = (task) => {
    lastFocusedElementRef.current = document.activeElement;
    setSelectedTask(task);
    setUpdatedQuestions(task.questions || []);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedTask(null);
    setUpdatedQuestions([]);
  };

  // Open delete modal
  const openDeleteModal = (task) => {
    lastFocusedElementRef.current = document.activeElement;
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedTask(null);
  };

  // Open view modal to see task details including all questions and books
  const openViewModal = (task) => {
    lastFocusedElementRef.current = document.activeElement;
    setViewTask(task);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setViewTask(null);
  };

  // Restore focus to the last focused element after any modal is closed
  useEffect(() => {
    if (!updateModalOpen && !deleteModalOpen && !viewModalOpen && lastFocusedElementRef.current) {
      lastFocusedElementRef.current.focus();
    }
  }, [updateModalOpen, deleteModalOpen, viewModalOpen]);

  // Handler for saving updated questions
  const handleSaveUpdate = async () => {
    try {
      await axios.patch(`https://saad810-lms-api-1.hf.space/teacher-tasks/${selectedTask._id}`, {
        questions: updatedQuestions
      });
      toast.success("Task updated successfully");
      fetchTasks();
      closeUpdateModal();
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  // Handler for delete confirmation
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://saad810-lms-api-1.hf.space/teacher-tasks/delete?id=${selectedTask._id}`);
      toast.success("Task deleted successfully");
      fetchTasks();
      closeDeleteModal();
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Title order={2} mb="md">
        {subject} - Dashboard
      </Title>
      {tasks.length === 0 && !loading && (
        <Text>No tasks found for this subject.</Text>
      )}
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          handleUpdate={() => openUpdateModal(task)}
          handleDelete={() => openDeleteModal(task)}
          handleView={() => openViewModal(task)}
        />
      ))}

      {/* Update Modal */}
      <Modal
        opened={updateModalOpen}
        onClose={closeUpdateModal}
        title="Update Task Questions"
        size="lg"
        centered
        withCloseButton
        overlayProps={{ opacity: 0.55, blur: 3 }}
        styles={(theme) => ({
          modal: { borderRadius: theme.radius.lg, backgroundColor: theme.colors.gray[0] },
          title: { fontWeight: 700, fontSize: theme.fontSizes.xl },
        })}
      >
        {updatedQuestions.length > 0 ? (
          <Stack spacing="md">
            {updatedQuestions.map((question, index) => (
              <Textarea
                key={index}
                label={`Question ${index + 1}`}
                value={question.question}
                autosize
                minRows={2}
                onChange={(event) => {
                  const newQuestions = [...updatedQuestions];
                  newQuestions[index] = {
                    ...newQuestions[index],
                    question: event.target.value
                  };
                  setUpdatedQuestions(newQuestions);
                }}
              />
            ))}
            <Group position="right">
              <Button onClick={handleSaveUpdate} variant="filled">
                Save Changes
              </Button>
            </Group>
          </Stack>
        ) : (
          <Text>No questions available for update.</Text>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        centered
        withCloseButton
        overlayProps={{ opacity: 0.55, blur: 3 }}
        styles={(theme) => ({
          modal: { borderRadius: theme.radius.lg },
          title: { fontWeight: 700, fontSize: theme.fontSizes.xl },
        })}
      >
        <Text mb="md">
          Are you sure you want to delete the task "{selectedTask?.task_name}"?
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>

      {/* View Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={closeViewModal}
        title="Task Details"
        size="lg"
        centered
        withCloseButton
        overlayProps={{ opacity: 0.6, blur: 4 }}
        styles={(theme) => ({
          modal: {
            borderRadius: theme.radius.lg,
            backgroundColor: theme.white,
            boxShadow: theme.shadows.md,
            padding: theme.spacing.lg,
          },
          title: {
            fontWeight: 500,
            fontSize: theme.fontSizes.xl,
            marginBottom: theme.spacing.md,
          },
          close: {
            color: theme.colors.gray[6],
            '&:hover': { color: theme.colors.red[5] },
          },
        })}
      >
        {viewTask ? (
          <Stack spacing="md">
            <Text size="md">
              <strong>Name:</strong> {viewTask.task_name}
            </Text>
            <Text>
              <strong>Books:</strong> {Array.isArray(viewTask.books) ? viewTask.books.join(", ") : viewTask.books}
            </Text>
            <Divider my="sm" />
            <Title order={4}>Questions</Title>
            {viewTask.questions && viewTask.questions.length > 0 ? (
              viewTask.questions.map((q, index) => (
                <Card
                  key={index}
                  shadow="sm"
                  padding="sm"
                  radius="md"
                  withBorder
                  style={{ marginBottom: 10 }}
                >
                  <Text weight={600}>Q{index + 1}:</Text>
                  <Text>{q.question}</Text>
                </Card>
              ))
            ) : (
              <Text color="dimmed">No questions available.</Text>
            )}
          </Stack>
        ) : null}
      </Modal>
    </Box>
  );
}

function TaskCard({ task, handleUpdate, handleDelete, handleView }) {
  return (
    <Card shadow="sm" p="md" radius="md" withBorder mb="md">
      <Group position="apart">
        <Group spacing="md" onClick={handleView}>
          <FileText size={28} className="text-blue-500" />
          <Stack spacing={2}>
            <Text weight={700} size="md">
              {task.task_name}
            </Text>
            <Text color="dimmed" size="sm">
              Questions: {task.questions?.length || 0}
            </Text>
          </Stack>
        </Group>
        <Menu shadow="md" width={180} withinPortal position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
              <MoreVertical size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<Eye size={16} />}>View</Menu.Item>
            <Menu.Item leftSection={<Pencil size={16} />} onClick={handleUpdate}>
              Update
            </Menu.Item>
            <Menu.Item color="red" leftSection={<Trash size={16} />} onClick={handleDelete}>
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  );
}
