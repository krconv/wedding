import {
  Box,
  Container,
  Grid,
  Image,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRef } from "react";
import { Thumbnail1, Thumbnail2, Thumbnail3 } from "../assets";
import { analytics } from "../utils";

export const Details: React.FC<{}> = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
  const ref = useRef<HTMLDivElement>(null);
  analytics.useTrackView("Details", ref);

  return (
    <>
      <Box ref={ref} py={64}>
        <Container size="sm">
          <Stack spacing="xl">
            <Text
              align="center"
              style={{
                fontFamily: '"Aire", serif',
                fontSize: isMobile ? "64px" : "108px",
                fontWeight: isMobile ? "bold" : "normal",
                textTransform: "uppercase",
                color: theme.colors["earth-green"][6],
              }}
            >
              <Text inherit>Madelyn</Text>
              <Text inherit mt={isMobile ? "-48px" : "-64px"}>
                & Kodey
              </Text>
            </Text>
            <Text
              align="center"
              sx={(theme) => ({
                fontSize: isMobile ? "18px" : "24px",
                fontWeight: 500,
              })}
            >
              July 1st, 2023 • Tamworth, NH
            </Text>
          </Stack>
        </Container>
      </Box>
      <Container size="lg" pb={32}>
        <Grid>
          <Grid.Col xs={4}>
            <Image src={Thumbnail1} />
          </Grid.Col>
          <Grid.Col span={6} xs={4}>
            <Image src={Thumbnail2} />
          </Grid.Col>
          <Grid.Col span={6} xs={4}>
            <Image src={Thumbnail3} />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};
