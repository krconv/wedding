import {
  Box,
  Container,
  createStyles,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import Calendar from "dayjs/plugin/calendar";

import { useMemo, useRef } from "react";
import { analytics } from "../utils";
import { Divider } from "./Divider";

const useStyles = createStyles(
  (theme, { isMobile }: { isMobile: boolean }) => ({
    root: {},
  })
);

export const Updates: React.FC<{}> = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
  const { classes } = useStyles({ isMobile });
  const ref = useRef<HTMLDivElement>(null);
  analytics.useTrackView("Updates", ref);

  const postedAt = useMemo(() => {
    dayjs.extend(Calendar);
    return dayjs("2023-02-13").calendar(null, {
      sameDay: "[Today]",
      nextDay: "[Tomorrow]",
      lastDay: "[Yesterday]",
      lastWeek: "[Last] dddd",
      sameElse: "MMMM D",
    });
  }, []);

  return (
    <>
      <Box id="updates" ref={ref} className={classes.root} py={64}>
        <Container size="sm">
          <Stack>
            <Title order={3} align="center"></Title>
            <Text align="center" size="lg">
              We're working on invitations and lodging information now, and will
              send them out as soon they are ready!
            </Text>
            <Text align="center" size="sm" style={{ fontStyle: "italic" }}>
              {" "}
              - Maddy & Kodey, {postedAt}
            </Text>
          </Stack>
        </Container>
      </Box>
      <Divider />
    </>
  );
};
