import TopBar from "../components/TopBar";
import { Icon } from "../ui/Icon";
import NavLink from "../ui/NavLink";
import { AppShell, Card, Navbar, ScrollArea } from "@mantine/core";
import React from "react";
import {  Outlet } from "react-router-dom";
import { LayoutDashboard, TestTubes } from 'lucide-react';



export default function StudentLayout() {

  return (
    <AppShell
      padding="md"
      header={<TopBar />}
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section grow component={ScrollArea}>
            <NavLink 
              to="/student" 
              color="blue" 
              icon={<Icon name="Dashboard" />}
            >
              Dashboard
            </NavLink>
            
          </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.gray[1] },
      })}
    >
      <Card p="md" shadow="md" w="100%" h="100%">
        <Outlet />
      </Card>
    </AppShell>
  );
}
