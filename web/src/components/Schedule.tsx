import {
  Box,
  Container,
  createStyles,
  Group,
  Image,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import React from "react";
import { Tartaglia } from "../assets";

const useStyles = createStyles((theme) => ({
  label: {
    fontSize: "18px",
  },
}));
export const Schedule: React.FC<{}> = () => {
  const { classes } = useStyles();

  return (
    <Box id="schedule" py={64}>
      <Container size="md">
        <Group direction="column" position="center">
          <Title
            align="center"
            order={1}
            sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
          >
            Schedule
          </Title>

          <Tabs
            orientation="horizontal"
            defaultValue="saturday"
            style={{ width: "610px", maxWidth: "100%", height: "550px" }}
            classNames={{ tabLabel: classes.label }}
          >
            <Tabs.Tab label="Friday" value="friday">
              <Group direction="column" grow>
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
              </Group>
            </Tabs.Tab>
            <Tabs.Tab label="Saturday" value="saturday">
              <Group direction="column" grow>
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
              </Group>
            </Tabs.Tab>
            <Tabs.Tab label="Sunday" value="sunday">
              <Group direction="column" grow>
                <AgendaItem
                  title="Farewell Brunch"
                  startTime="9:00am"
                  endTime="11:00am"
                  description="Lorem ipsum dolor sit amet."
                />
              </Group>
            </Tabs.Tab>
          </Tabs>
        </Group>
      </Container>
    </Box>
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
      {imageUrl && <Image src={imageUrl} width={96} />}
    </Group>
  );
};
