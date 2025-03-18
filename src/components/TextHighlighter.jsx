import React from "react";
import { diffWords } from "diff";
import { Card, Text, Group, Box } from "@mantine/core";

const HighlightedText = ({ original, corrected }) => {
  const diff = diffWords(original, corrected);

  return (
    <Text size="sm" style={{ margin: 0, display: "inline-block" }}>
      {diff.map((part, index) => (
        <span
          key={index}
          style={{
            backgroundColor: part.added ? "chartreuse" : part.removed ? "tomato" : "transparent",
          }}
        >
          {part.value}
        </span>
      ))}
    </Text>
  );
};

const Legend = () => (
  <Group spacing="md" mb="sm">
    <Group spacing="xs">
      <Box sx={{ backgroundColor: "chartreuse", width: 15, height: 15, borderRadius: 3 }} />
      <Text size="sm">Corrected</Text>
    </Group>
    <Group spacing="xs">
      <Box sx={{ backgroundColor: "tomato", width: 15, height: 15, borderRadius: 3 }} />
      <Text size="sm">Incorrect</Text>
    </Group>
  </Group>
);

const TextHighlighter = ({ data }) => {
  return (
    <Card withBorder shadow="sm" p="md" radius="sm" style={{ marginTop: "20px" }}>
      <Legend />
      {data.results.map((item, index) => (
        <HighlightedText key={index} original={item.sentence} corrected={item.corrected_sentence} />
      ))}
    </Card>
  );
};

export default TextHighlighter;
