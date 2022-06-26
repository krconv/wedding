import {
  Box,
  Container,
  Group,
  Image,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import { Icons, Tartaglia } from "../assets";

export const Schedule: React.FC<{}> = () => {
  return (
    <Box id="schedule" sx={{ padding: "96px 0px" }}>
      <Container size="md">
        <Group direction="column" position="center" spacing={72} grow>
          <Title
            align="center"
            order={1}
            sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
          >
            Schedule
          </Title>
          <DailyAgenda day="Friday" icon={Icons.Friday}>
            <AgendaItem
              title="Lake Time"
              startTime="12:00pm"
              endTime="5:00pm"
              description="Hang out on the late as people arrive."
            />
            <AgendaItem
              title="Welcome Dinner"
              startTime="5:00pm"
              endTime="7:00pm"
              description="Brick-oven pizza service by a local business. Everyone is invited!"
              imageUrl={Tartaglia}
            />
            <AgendaItem
              title="S'mores and games"
              startTime="8:00pm"
              endTime="10:00pm"
              description="Get toasty around a campfire, and bring your competitive spirit."
            />
          </DailyAgenda>
          <DailyAgenda day="Saturday" icon={Icons.Saturday}>
            <AgendaItem
              title="Breakfast"
              startTime="7:00am"
              endTime="9:00am"
              description="Breakfast for the early birds."
            />
            <AgendaItem
              title="Ceremony"
              startTime="5:00pm"
              endTime="5:30pm"
              description="Lorem ipsum dolor sit amet."
            />
            <AgendaItem
              title="Cocktail Hour"
              startTime="5:30pm"
              endTime="6:30pm"
              description="Lorem ipsum dolor sit amet."
            />
            <AgendaItem
              title="Reception"
              startTime="7:00pm"
              endTime="10:00pm"
              description="Lorem ipsum dolor sit amet."
            />
          </DailyAgenda>
          <DailyAgenda day="Sunday" icon={Icons.Sunday}>
            <AgendaItem
              title="Farewell Brunch"
              startTime="9:00am"
              endTime="11:00am"
              description="Lorem ipsum dolor sit amet."
            />
          </DailyAgenda>
        </Group>
      </Container>
    </Box>
  );
};

const DailyAgenda: React.FC<{
  day: string;
  icon: string;
  children: React.ReactNode;
}> = ({ day, icon, children }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  return (
    <Group
      spacing={isMobile ? 36 : 128}
      direction={isMobile ? "column" : "row"}
      position="center"
    >
      <Group direction="column" position="center" sx={{ width: "128px" }}>
        <Image
          height={64}
          width={64}
          src={icon}
          sx={(theme) => ({ color: theme.colors["earth-green"][5] })}
        />
        <Title
          order={2}
          sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
        >
          {day}
        </Title>
      </Group>
      <Group
        direction="column"
        sx={(theme) => ({
          backgroundColor: theme.colors["earth-green"][2],
          padding: "24px 16px",
          width: isMobile ? "100%" : "496px",
        })}
        spacing={16}
        grow
      >
        {children}
      </Group>
    </Group>
  );
};

const AgendaItem: React.FC<{
  title: string;
  startTime: string;
  endTime?: string;
  description: string;
  imageUrl?: string;
}> = ({ title, startTime, endTime, description, imageUrl }) => {
  return (
    <Group
      sx={(theme) => ({
        borderLeft: `4px solid ${theme.colors["earth-green"][5]}`,
        backgroundColor: theme.white,
        padding: "8px 8px 8px 16px",
      })}
      direction="row"
      align="flex-start"
      spacing={16}
      noWrap
    >
      <Box>
        <Title
          order={3}
          sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
        >
          {title}
        </Title>
        <Text>
          {startTime}
          {endTime && " - " + endTime}
        </Text>
        <Text mt="sm">{description}</Text>
      </Box>
      {imageUrl && (
          <Image src={imageUrl}  width={96} />
      )}
    </Group>
  );
};
