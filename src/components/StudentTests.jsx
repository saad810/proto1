import React from "react";
import { Card, Text, Grid, Container, Title } from "@mantine/core";
import { IconBook } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const subjects = [
  { title: "Mathematics", resources: 10, students: 30 },
  { title: "Science", resources: 8, students: 25 },
  { title: "History", resources: 5, students: 20 },
];

export default function StudentTests() {
  const navigate = useNavigate();

  const handleCardClick = (subjectTitle) => {
    // Navigate to a page that shows the text-based tests for this subject
    navigate(`/student/${subjectTitle.toLowerCase()}`);
  };

  return (
    <Container size="lg" style={{ padding: "10px 0" }}>
      <Title order={2} style={{ marginBottom: 30 }}>
        Tests
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
                background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
              }}
              onClick={() => handleCardClick(subject.title)}
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
    </Container>
  );
}
