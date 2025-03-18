import React from 'react';
import { useLocation } from 'react-router-dom';
import { Group, Header, Text } from '@mantine/core';
import Logo from '../assets/logo'; // Ensure this path is correct

export default function TopBar() {
  const location = useLocation();

  // Derive mode based on the pathname.
  // Adjust the logic as needed if your routes are different.
  const mode = location.pathname.includes('teacher') ? 'Teacher Mode' : 'Student Mode';

  return (
    <Header height={70} p="md">
      <Group position="apart" sx={{ height: "100%" }} px={20}>
        <Logo />
        {/* Simply display the current mode */}
        <Text size="md" weight={500}>{mode}</Text>
      </Group>
    </Header>
  );
}
