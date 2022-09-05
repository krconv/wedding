import { Box, Container, Group, Image, Text, Title } from "@mantine/core";
import React, { useRef } from "react";
import { analytics } from "../utils";

export const Schedule: React.FC<{}> = () => {
  const ref = useRef<HTMLDivElement>(null);
  analytics.useTrackView("Schedule", ref);

  return (
    <Box id="schedule" ref={ref} pt={32} pb={64}>
      <Container size="xs">
        <Group direction="column" position="center">
          <Title
            align="center"
            order={1}
            mb="md"
            sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
          >
            Schedule
          </Title>

          {/* <Tabs
            orientation="horizontal"
            initialTab={2}
            position="center"
            style={{ width: "610px", maxWidth: "100%", height: "550px" }}
            classNames={{ tabLabel: classes.label }}
            onTabChange={(index) =>
              analytics.track("changed schedule tab", {
                tab: ["Thursday", "Friday", "Saturday", "Sunday"][index],
              })
            }
          >
            <Tabs.Tab label="Thursday" value="thursday"> */}
          <Title order={2}>Thursday, June 29th</Title>
          <Group direction="column" grow>
            <AgendaItem title="Welcome Party" startTime="TBD" date="June 29th">
              Staying onsite or nearby? Come join us for a welcome gathering!
              {/* Light refreshments will be provided, but feel free to bring a
              snack or drink to share. */}
            </AgendaItem>
            {/* <AgendaItem
                  title="Laser Tag & Go-Carts"
                  startTime="7:00pm"
                  endTime="8:30pm"
                  date="June 29th"
                >
                  Bring your competitive spirit to White Lake Speedway for laser
                  tag and Go-cart competitions!
                </AgendaItem> */}
          </Group>
          {/* </Tabs.Tab>
            <Tabs.Tab label="Friday" value="friday"> */}
          <Title order={2} mt="sm">
            Friday, June 30th
          </Title>
          <Group direction="column" grow>
            <AgendaItem
              title="Fun & Chill"
              startTime="All day"
              date="June 30th"
            >
              Enjoy a fun filled day at The Preserve or around Tamworth, NH with
              swimming, volleyball, corn hole, hiking and more.
            </AgendaItem>
            <AgendaItem
              title="Rehearsal Dinner"
              startTime="TBD"
              date="June 30th"
            />
            {/* Gusto's food truck will be offering pizza, salads and more. Stop
              by for a bite!
            </AgendaItem> */}
          </Group>
          {/* </Tabs.Tab>
            <Tabs.Tab label="Saturday" value="saturday"> */}
          <Title order={2} mt="sm">
            Saturday, July 1st
          </Title>
          <Group direction="column" grow>
            {/* <AgendaItem
                  title="Breakfast"
                  startTime="7:00am"
                  endTime="9:00am"
                  date="July 1st"
                >
                  Breakfast for the early birds.
                </AgendaItem> */}
            <AgendaItem
              title="Ceremony"
              startTime="5:00pm"
              endTime="5:30pm"
              date="July 1st"
            />
            <AgendaItem
              title="Cocktail Hour"
              startTime="5:30pm"
              endTime="6:30pm"
              date="July 1st"
            />
            <AgendaItem
              title="Reception"
              startTime="6:30pm"
              endTime="11:00pm"
              date="July 1st"
            />
            <AgendaItem title="S'mores" date="June 30th">
              Get toasty around a campfire and enjoy top-quality tips on the art
              of cooking s'mores.
            </AgendaItem>
          </Group>
          {/* </Tabs.Tab>
            <Tabs.Tab label="Sunday" value="sunday"> */}
          <Title order={2} mt="sm">
            Sunday, July 2nd
          </Title>
          <Group direction="column" grow>
            <AgendaItem title="Farewell Brunch" startTime="TBD" date="July 2nd">
              Join the new Mr and Mrs for brunch under the tent at The Preserve.
            </AgendaItem>
          </Group>
          {/* </Tabs.Tab>
          </Tabs> */}
        </Group>
      </Container>
    </Box>
  );
};

const AgendaItem: React.FC<{
  title: string;
  startTime?: string;
  endTime?: string;
  date: string;
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
        {startTime && (
          <Text>
            {startTime}
            {endTime && " - " + endTime}
          </Text>
        )}
        {children && <Text mt="sm">{children}</Text>}
      </Box>
      {imageUrl && <Image src={imageUrl} width={96} />}
    </Group>
  );
};
