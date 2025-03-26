import TopBar from "../components/TopBar";
import NavLink from "../ui/NavLink";
import { AppShell, Card, Navbar, ScrollArea, NavLink as MantineNavLink } from "@mantine/core";
import React from "react";
import { Outlet } from "react-router-dom";
import { Book, Building, File, GraduationCap } from "lucide-react";

export default function AdminLayout() {
  const subjects = [
    { name: "History", path: "history" },
    // { name: "Physics", path: "physics" },
    // { name: "Chemistry", path: "chemistry" },
    // { name: "Biology", path: "biology" },
  ];

  return (
    <AppShell
      padding="md"
      header={<TopBar />}
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section grow component={ScrollArea}>
            {subjects.map((subject) => (
              <MantineNavLink
                key={subject.path}
                label={subject.name}
                icon={<Book size={16} />}
                defaultOpened
              >
                <NavLink
                  to={`/teacher/${subject.path}`}
                  color="pink"
                  icon={<Building size={16} />}
                >
                  Tasks
                </NavLink>
                <NavLink
                  to={`/teacher/${subject.path}/generate`}
                  color="pink"
                  icon={<Building size={16} />}
                >
                  Generate Tasks
                </NavLink>
                <NavLink
                  to={`/teacher/${subject.path}/resources`}
                  color="blue"
                  icon={<File size={16} />}
                >
                  Resources
                </NavLink>
                <NavLink
                  to={`/teacher/${subject.path}/answers`}
                  color="blue"
                  icon={<GraduationCap size={16} />}
                >
                  Student Response
                </NavLink>
              </MantineNavLink>
            ))}
          </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.gray[1] },
      })}
    >
      <Card p="xl" shadow="md" w="100%" h="100%">
        <Outlet />
      </Card>
    </AppShell>
  );
}
