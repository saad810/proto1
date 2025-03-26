import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { Plus, FileText, MoreVertical, Trash, Eye, Upload, Download } from "lucide-react";
import {
  Card,
  Paper,
  Button,
  Group,
  Stack,
  Text,
  Menu,
  ActionIcon,
  Divider,
  Modal,
  Title,
  Center,
  Box,
  List,
  Loader,
  Badge
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useParams } from "react-router-dom";

export default function DocsManagement() {
  const [files, setFiles] = useState([]); // Existing files from DB
  const [uploadedFiles, setUploadedFiles] = useState([]); // New uploads
  const [sortBy, setSortBy] = useState("time");
  const [modalOpened, setModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { subject } = useParams();
  const [loadFiles, setLoadFiles] = useState(false);

  // Ref for the "Add Resources" button to restore focus when needed
  const addButtonRef = useRef(null);

  async function fetchFiles() {
    try {
      setLoadFiles(true);
      const response = await axios.get("https://saad810-lms-api-1.hf.space/resources/");
      console.log(response?.data?.resources);
      setFiles(response?.data?.resources);
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setLoadFiles(false);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  // When modal closes, restore focus to the Add Resources button to avoid focus issues
  useEffect(() => {
    if (!modalOpened && addButtonRef.current) {
      addButtonRef.current.focus();
    }
  }, [modalOpened]);

  // Handle file drop
  const handleDrop = (acceptedFiles) => {
    if (uploadedFiles.length + acceptedFiles.length > 5) return;
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)}KB`,
      time: dayjs().format("HH:mm A"),
      file, // Keep the actual file for API upload
      type: file.type,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    toast.success("Files added successfully!");
  };

  // Upload files to API
  const confirmUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    uploadedFiles.forEach(fileObj => {
      formData.append("files", fileObj.file);
      formData.append("subject", subject);
    });
    try {
      const response = await axios.post("https://saad810-lms-api-1.hf.space/resources/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log(response);
      setUploadedFiles([]);
      setModalOpened(false);
      fetchFiles();
      toast.success("Files uploaded successfully!");
    } catch (error) {
      toast.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // Delete file
  const deleteFile = async (fileId, index) => {
    try {
      await axios.delete(`https://saad810-lms-api-1.hf.space/resources/delete?id=${fileId}`);
      setFiles(files.filter((_, i) => i !== index));
      toast.success("File deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete file!");
    }
  };

  // Open file viewer
  const openFileViewer = (file) => {
    setSelectedFile(file);
    setViewModalOpened(true);
  };

  return (
    <Paper shadow="xl" radius="lg" p="xl" className="w-full h-screen flex flex-col bg-white border border-gray-200">
      {/* Upload Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Title order={3}>Upload Resources</Title>}
        centered
        size="lg"
        radius="md"
        padding="lg"
      >
        <Stack spacing="md">
          <Dropzone
            onDrop={handleDrop}
            disabled={loading}
            maxSize={5 * 1024 ** 2}
            accept={[
              "application/pdf",
              "text/plain",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ]}
            multiple
            className="border-2 border-dashed border-gray-400 p-6 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            <Center>
              <Stack align="center" spacing="xs">
                <Upload size={40} className="text-blue-500" />
                <Text align="center" weight={600} size="md">
                  Drag files here or click to upload
                </Text>
                <Text size="sm" color="dimmed">
                  (Max: 5 files | Allowed: PDF, TXT, DOCX)
                </Text>
              </Stack>
            </Center>
          </Dropzone>
          {uploadedFiles.length > 0 && (
            <Box className="bg-gray-100 p-4 rounded-md">
              <Text weight={600}>Files to be uploaded:</Text>
              <List size="sm">
                {uploadedFiles.map((file, index) => (
                  <List.Item key={index}>
                    {file.name} ({file.size}) <Badge color="blue">New</Badge>
                  </List.Item>
                ))}
              </List>
            </Box>
          )}
          <Button onClick={confirmUpload} disabled={uploadedFiles.length === 0 || loading} fullWidth mt="md" size="md" radius="md" color="blue">
            {loading ? <Loader size="sm" /> : "Confirm Upload"}
          </Button>
        </Stack>
      </Modal>

      {/* View Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title={<Title order={3}>View File</Title>}
        centered
        size="lg"
        radius="md"
        padding="lg"
      >
        {selectedFile && (
          <>
            <iframe src={selectedFile.fileurl} width="100%" height="500px" style={{ border: "none" }} />
            <Button leftSection={<Download size={16} />} variant="outline" fullWidth mt="md">
              Download
            </Button>
          </>
        )}
      </Modal>

      {/* File List UI */}
      {files.length === 0 ? (
        <Center className="h-full w-full">
          <Stack align="center" spacing="md" className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <Text weight={700} size="xl" className="text-gray-900">
              No Resources Available
            </Text>
            <Button onClick={() => setModalOpened(true)} size="md" leftSection={<Plus size={20} />} color="pink" radius="md">
              Upload Resources
            </Button>
          </Stack>
        </Center>
      ) : (
        <Stack spacing="md">
          <Group position="apart" mb="sm">
            <Button ref={addButtonRef} onClick={() => setModalOpened(true)} size="md" leftSection={<Plus size={20} />} radius="md">
              Add Resources
            </Button>
          </Group>
          <Divider />
          <Stack>
            {files.map((file, index) => (
              <Card key={index} shadow="sm" p="md" radius="md" withBorder>
                <Group position="apart">
                  <Group spacing="md">
                    <FileText size={28} className="text-blue-500" />
                    <Stack spacing={2}>
                      <Text weight={700} size="md">
                        {file.filename}
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
                      <Menu.Item leftSection={<Eye size={16} />} onClick={() => openFileViewer(file)}>
                        View
                      </Menu.Item>
                      <Menu.Item leftSection={<Download size={16} />}>Download</Menu.Item>
                      <Menu.Item color="red" leftSection={<Trash size={16} />} onClick={() => deleteFile(file._id, index)}>
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card>
            ))}
          </Stack>
        </Stack>
      )}
    </Paper>
  );
}
