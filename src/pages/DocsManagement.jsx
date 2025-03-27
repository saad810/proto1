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
  Badge,
  Pagination
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useParams } from "react-router-dom";

export default function DocsManagement() {
  const [files, setFiles] = useState([]); // Existing files from DB
  const [uploadedFiles, setUploadedFiles] = useState([]); // New uploads
  const [sortBy, setSortBy] = useState("time");
  const [modalOpened, setModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const { subject } = useParams();
  const [loadFiles, setLoadFiles] = useState(false);
  const addButtonRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of files per page

  async function fetchFiles() {
    try {
      setLoadFiles(true);
      const response = await axios.get("https://saad810-lms-api-1.hf.space/resources");
      setFiles(response?.data?.resources);
      setCurrentPage(1); // Reset to first page when new files are fetched
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setLoadFiles(false);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (!modalOpened && addButtonRef.current) {
      addButtonRef.current.focus();
    }
  }, [modalOpened]);

  const handleDrop = (acceptedFiles) => {
    if (uploadedFiles.length + acceptedFiles.length > 5) return;
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)}KB`,
      time: dayjs().format("HH:mm A"),
      file,
      type: file.type,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const confirmUpload = async () => {
    setLoading(true);
    const subject = "history";
    const formData = new FormData();
    uploadedFiles.forEach(fileObj => {
      formData.append("files", fileObj.file);
      formData.append("subject", subject);
    });
    try {
      await axios.post("https://saad810-lms-api-1.hf.space/resources/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploadedFiles([]);
      setModalOpened(false);
      fetchFiles();
      toast.success("Files uploaded successfully!");
    } catch (error) {
      toast.error("Upload failed!");
    } finally {
      setLoading(false);
      setUploadedFiles([]);
    }
  };

  const deleteFile = async (fileId, indexInPage) => {
    // Calculate the global index based on currentPage and pageSize
    const globalIndex = (currentPage - 1) * pageSize + indexInPage;
    try {
      await axios.delete(`https://saad810-lms-api-1.hf.space/resources/delete?id=${files[globalIndex]._id}`);
      // Remove file from files array
      setFiles(files.filter((_, i) => i !== globalIndex));
      toast.success("File deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete file!");
    }
  };

  // Determine files to display on the current page
  const displayedFiles = files.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Paper shadow="xl" radius="lg" p="xl" className="w-full h-screen flex flex-col bg-white border border-gray-200">
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
            accept={["application/pdf"]}
            multiple
            className="border-2 border-dashed border-gray-400 p-6 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            <Center>
              <Stack align="center" spacing="xs">
                <Upload size={40} className="text-blue-500" />
                <Text align="center" weight={600} size="md">
                  Drag files here or click to upload
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
            {displayedFiles.map((file, index) => (
              <Card key={index} shadow="sm" p="md" radius="md" withBorder>
                <Group position="apart">
                  <Group spacing="md">
                    <FileText size={28} className="text-blue-500" />
                    <Stack spacing={2}>
                      <Text weight={700} size="md">{file.filename}</Text>
                    </Stack>
                  </Group>
                  <Menu shadow="md" width={180} withinPortal position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                        <MoreVertical size={20} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<Eye size={16} />} onClick={() => window.open(file.fileurl, '_blank')}>View</Menu.Item>
                      <Menu.Item leftSection={<Download size={16} />}>Download</Menu.Item>
                      <Menu.Item color="red" leftSection={<Trash size={16} />} onClick={() => deleteFile(file._id, index)}>Delete</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Card>
            ))}
          </Stack>
          {/* Pagination controls */}
          <Center mt="md">
            <Pagination
              page={currentPage}
              onChange={setCurrentPage}
              total={Math.ceil(files.length / pageSize)}
            />
          </Center>
        </Stack>
      )}
    </Paper>
  );
}
