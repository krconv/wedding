import {
  Box,
  Container,
  createStyles,
  Group,
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
    return dayjs("2023-01-10").calendar(null, {
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
          <Group direction="column" position="center" grow>
            <Title order={3} align="center"></Title>
            <Text align="center" size="lg">
              <Text component="span" inherit style={{ fontWeight: 500 }}>
                Welcome to our website!
              </Text>{" "}
              We'll continue to add information about our big day, including
              more details about the venue and things to do.
            </Text>
            <Text align="center" size="sm" style={{ fontStyle: "italic" }}>
              {" "}
              - Maddy & Kodey, {postedAt}
            </Text>
          </Group>
        </Container>
      </Box>
      <Divider />
    </>
  );
};
