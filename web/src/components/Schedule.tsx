import {
  Box,
  Container,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import { range } from "lodash";
import groupBy from "lodash/groupBy";
import React, { useMemo, useRef } from "react";
import { Event } from "../api";
import { useGetScheduleQuery } from "../store/api";
import { analytics } from "../utils";
import { Divider } from "./Divider";

export const Schedule: React.FC<{}> = () => {
  const ref = useRef<HTMLDivElement>(null);
  analytics.useTrackView("Schedule", ref);

  const events = useGetScheduleQuery({});

  const eventsByDay = useMemo(() => {
    return Object.entries(
      groupBy(events.data, (event) =>
        dayjs(event.starts_at).format("YYYY-MM-DD")
      )
    )
      .sort((l, r) => dayjs(l[0]).diff(dayjs(r[0]), "days"))
      .map(
        ([date, events]) =>
          [
            date,
            events.sort((l, r) =>
              dayjs(l.starts_at).diff(dayjs(r.starts_at), "minutes")
            ),
          ] as [string, Event[]]
      );
  }, [events]);

  return (
    <>
      <Box id="schedule" ref={ref} pt={32} pb={64}>
        <Container size="xs">
          <Stack>
            <Title
              align="center"
              order={1}
              mb="md"
              sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
            >
              Schedule
            </Title>

            {!events.isSuccess
              ? range(0, 4).map((day) => (
                  <React.Fragment key={day}>
                    <Skeleton height="42px" visible mt="sm" />
                    <Stack>
                      {range(0, 2).map((event) => (
                        <Skeleton key={event} height="100px" visible />
                      ))}
                    </Stack>
                  </React.Fragment>
                ))
              : eventsByDay.map(([date, events]) => (
                  <React.Fragment key={date}>
                    <Title order={2} mt="sm" key={date} align="center">
                      {dayjs(date).format("dddd, MMMM Do")}
                    </Title>
                    <Stack>
                      {events.map((event) => (
                        <AgendaItem key={event.id} event={event} />
                      ))}
                    </Stack>
                  </React.Fragment>
                ))}
          </Stack>
        </Container>
      </Box>
      <Divider />
    </>
  );
};

const AgendaItem: React.FC<{
  event: Event;
}> = ({ event }) => {
  return (
    <Group
      sx={(theme) => ({
        borderLeft: `4px solid ${theme.colors["midnight-blue"][5]}`,
        backgroundColor: theme.white,
        padding: "8px 8px 8px 16px",
      })}
      align="flex-start"
      spacing={16}
      noWrap
    >
      <Box>
        <Title
          order={3}
          sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
        >
          {event.name}
        </Title>
        {event.starts_at && (
          <Text>
            {dayjs(event.starts_at).format("h:mm a")}
            {event.ends_at && " - " + dayjs(event.ends_at).format("h:mm a")}
          </Text>
        )}
        {event.note && <Text size="sm">{event.note}</Text>}
      </Box>
    </Group>
  );
};
