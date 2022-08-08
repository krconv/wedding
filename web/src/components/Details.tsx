import {
  Box,
  Container,
  createStyles,
  Grid,
  Group,
  Image,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Thumbnail1, Thumbnail2, Thumbnail3 } from "../assets";

const useStyles = createStyles(
  (theme, { isMobile }: { isMobile: boolean }) => ({
    root: {},
  })
);

export const Details: React.FC<{}> = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
  const { classes } = useStyles({ isMobile });

  return (
    <>
      <Box className={classes.root} py={64}>
        <Container size="sm">
          <Group direction="column" position="center" spacing="xl" grow>
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
              style={{ fontSize: isMobile ? "18px" : "24px" }}
            >
              July 1st, 2023 • Tamworth, NH
            </Text>
          </Group>
        </Container>
      </Box>
      <Container size="md">
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
