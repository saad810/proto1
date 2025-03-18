import TopBar from "../components/TopBar";
import { Icon } from "../ui/Icon";
import NavLink from "../ui/NavLink";
import { AppShell, Card, Navbar, ScrollArea } from "@mantine/core";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {

  return (
    <AppShell
      padding="md"
      header={<TopBar />}
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section grow component={ScrollArea}>
            <NavLink 
              to="/teacher" 
              color="pink" 
              icon={<Icon name="Institution" />}
            >
              Generate Tasks
            </NavLink>
            <NavLink 
              to="/teacher/answers" 
              color="blue" 
              icon={<Icon name="Teachers" />}
            >
              Student Response
            </NavLink>
           
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
