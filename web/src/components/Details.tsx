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
                fontFamily: '"Ms Madi", cursive',
                fontSize: isMobile ? "48px" : "72px",
              }}
            >
              Maddy & Kodey
            </Text>
            <Text
              align="center"
              sx={(theme) => ({
                fontSize: isMobile ? "18px" : "24px",
                fontFamily: theme.headings.fontFamily,
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
