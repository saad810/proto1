import { Center, Loader as CoreLoader, Stack, Text } from "@mantine/core";

export default function Loader({ text }) {
  return (
    <Center w="100%" h="100%" py={100}>
      <Stack justify="center" align="center">
        <CoreLoader />
        {text && <Text align="center">{text}</Text>}
      </Stack>
    </Center>
  );
}
