import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import React from "react";
import {
    Link,
} from "react-router-dom";

export default function NavLink({ color, icon, children, to }) {
    const isActive = false;
    return (
        <UnstyledButton
            component={Link}
            to={to}
            sx={(theme) => ({
                display: "block",
                width: "100%",
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.black,
                backgroundColor: isActive ? theme.colors[color][1] : null,
                "&:hover": {
                    backgroundColor: isActive ? theme.colors[color][2] : theme.colors.gray[0],
                },
            })}
        >
            <Group>
                <ThemeIcon color={color} variant={isActive ? "filled" : "light"}>
                    {icon}
                </ThemeIcon>

                <Text size="sm">{children}</Text>
            </Group>
        </UnstyledButton>
    );
}
