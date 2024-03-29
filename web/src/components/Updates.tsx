import { Box, Container, Stack, Text, Title, Transition } from "@mantine/core";
import dayjs from "dayjs";

import { useRef } from "react";
import { useGetUpdateMessageQuery } from "../store/api";
import { analytics } from "../utils";
import { Markdown } from "./Markdown";

const growY = {
  in: { maxHeight: "500px" },
  out: { maxHeight: "0px" },
  common: { overflow: "hidden" },
  transitionProperty: "max-height",
};

export const Updates: React.FC<{}> = () => {
  const ref = useRef<HTMLDivElement>(null);
  analytics.useTrackView("Updates", ref);

  const updateMessage = useGetUpdateMessageQuery({});

  return (
    <Transition
      mounted={updateMessage.isSuccess && updateMessage.data?.message !== null}
      transition={growY}
    >
      {(styles) => (
        <Box id="updates" ref={ref} py={64} style={styles}>
          <Container size="sm">
            <Stack
              sx={(theme) => ({
                backgroundColor: theme.colors["earth-green"][0],
                borderRadius: "8px",
              })}
              px="md"
              pb="md"
            >
              <Title order={3} align="center"></Title>
              <Markdown align="center" size="lg">
                {updateMessage.data?.message ?? ""}
              </Markdown>
              <Text align="center" size="sm" style={{ fontStyle: "italic" }}>
                {" "}
                - Maddy & Kodey
                {updateMessage.data?.posted_at
                  ? ", " +
                    dayjs(updateMessage.data?.posted_at).calendar(null, {
                      sameDay: "[Today]",
                      nextDay: "[Tomorrow]",
                      lastDay: "[Yesterday]",
                      lastWeek: "[Last] dddd",
                      sameElse: "MMMM Do",
                    })
                  : ""}
              </Text>
            </Stack>
          </Container>
        </Box>
      )}
    </Transition>
  );
};
