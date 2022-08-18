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
    <Box id="schedule" pt={32} pb={64}>
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
            initialTab={2}
            position="center"
            style={{ width: "610px", maxWidth: "100%", height: "550px" }}
            classNames={{ tabLabel: classes.label }}
          >
            <Tabs.Tab label="Thursday" value="thursday">
              <Group direction="column" grow>
                <AgendaItem title="Welcome Cocktails" startTime="5:00pm">
                  Staying onsite or nearby? Come join us for a welcome
                  gathering! Light refreshments will be provided, but feel free
                  to bring a snack/drink to share.
                </AgendaItem>
                <AgendaItem
                  title="Laser Tag & Go-Carts"
                  startTime="7:00pm"
                  endTime="8:30pm"
                >
                  Bring your competitive spirit to White Lake Speedway for laser
                  tag and Go-cart competitions!
                </AgendaItem>
              </Group>
            </Tabs.Tab>
            <Tabs.Tab label="Friday" value="friday">
              <Group direction="column" grow>
                <AgendaItem title="Fun & Chill" startTime="All day">
                  Enjoy a fun filled day at The Preserve. Activities will
                  include swimming, volleyball, corn hole and more.
                </AgendaItem>
                <AgendaItem
                  title="Rehearsal Dinner"
                  startTime="5:00pm"
                  endTime="8:00pm"
                >
                  Gusto's food truck will be offering pizza, salads and more at
                  The Preserve from 5-8pm. Stop by for a bite!
                </AgendaItem>
                <AgendaItem
                  title="S'mores"
                  startTime="8:00pm"
                  endTime="10:00pm"
                >
                  Get toasty around a campfire and enjoy top-quality tips on the
                  art of cooking s'mores.
                </AgendaItem>
              </Group>
            </Tabs.Tab>
            <Tabs.Tab label="Saturday" value="saturday">
              <Group direction="column" grow>
                <AgendaItem
                  title="Breakfast"
                  startTime="7:00am"
                  endTime="9:00am"
                >
                  Breakfast for the early birds.
                </AgendaItem>
                <AgendaItem
                  title="Ceremony"
                  startTime="5:00pm"
                  endTime="5:30pm"
                />
                <AgendaItem
                  title="Cocktail Hour"
                  startTime="5:30pm"
                  endTime="6:30pm"
                />
                <AgendaItem
                  title="Reception"
                  startTime="6:30pm"
                  endTime="11:00pm"
                />
              </Group>
            </Tabs.Tab>
            <Tabs.Tab label="Sunday" value="sunday">
              <Group direction="column" grow>
                <AgendaItem
                  title="Farewell Brunch"
                  startTime="9:00am"
                  endTime="11:00am"
                >
                  Join the new Mr and Mrs for brunch under the tent at The
                  Preserve.
                </AgendaItem>
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
  children?: string;
  imageUrl?: string;
}> = ({ title, startTime, endTime, children, imageUrl }) => {
  return (
    <Group
      sx={(theme) => ({
        borderLeft: `4px solid ${theme.colors["midnight-blue"][5]}`,
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
        {children && <Text mt="sm">{children}</Text>}
      </Box>
      {imageUrl && <Image src={imageUrl} width={96} />}
    </Group>
  );
};
