import React from 'react';
import { Container, Button, Group, Title, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    if (role === 'teacher') {
      navigate('/teacher'); // Update with your teacher route
    } else if (role === 'student') {
      navigate('/student'); // Update with your student route
    }
  };

  return (
    <Container style={{ marginTop: '50px', textAlign: 'center' }}>
      <Title order={2}>Welcome!</Title>
      <Text size="lg" mt="md">
        Please select your area:
      </Text>
      <Group position="center" mt="xl">
        <Button onClick={() => handleNavigation('teacher')}>Teacher</Button>
        <Button onClick={() => handleNavigation('student')}>Student</Button>
      </Group>
    </Container>
  );
}
