import {
  Box,
  Center,
  Container,
  createStyles,
  Group,
  Image,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Icons } from "../assets";

const useStyles = createStyles(
  (theme, { isMobile }: { isMobile: boolean }) => ({
    root: {
      backgroundColor: theme.colors["midnight-blue"][5],
      padding: 96,
    },
    icon: {
      height: "64px",
      width: "64px",
      margin: "16px",
      marginBottom: isMobile ? "0px" : undefined
    },
    description: {
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
      "& h2,h3": {
        color: theme.white,
      },
    },
  })
);

export const Details: React.FC<{}> = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const { classes } = useStyles({ isMobile });

  return (
    <Box className={classes.root}>
      <Container size="sm">
        <Group direction="column" position="center" spacing="xl" grow>
          <Group
            direction={isMobile ? "column" : "row"}
            align="center"
            position="center"
          >
            <Center>
              <Image className={classes.icon} src={Icons.CalendarIcon} />
            </Center>
            <Group className={classes.description} direction="column">
              <Title order={2} align="center">
                July 1st, 2023
              </Title>
            </Group>
          </Group>
          <Group
            direction={isMobile ? "column" : "row"}
            align="center"
            position="center"
          >
            <Image className={classes.icon} src={Icons.MapIcon} />
            <Group className={classes.description} direction="column">
              <Title order={2} align="center">
                The Preserve at Chocorua
              </Title>
              <Title order={3} align="center">
                Tamworth, NH
              </Title>
            </Group>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};
