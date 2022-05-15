import {
  BackgroundImage,
  Container,
  createStyles,
  Group,
  Image,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Logo } from "../assets";
import { TreeFarm } from "../assets";
import { useMantineTheme } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    minHeight: "100vh",
    [`@supports (-webkit-touch-callout: none)`]: {
      minHeight: ["100vh", "fill-available"],
    },
  },
  image: {
    flexGrow: 1,
  },
}));

export const Landing: React.FC = () => {
  const { classes } = useStyles();
  return (
    <Group id="landing" className={classes.root} direction="column">
      <Header />
      <BackgroundImage
        className={classes.image}
        src={TreeFarm}
      ></BackgroundImage>
    </Group>
  );
};

const Header: React.FC = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  return (
    <header style={{ width: "100%" }}>
      <Container size="md">
        <Group
          position="apart"
          align={isMobile ? "center" : "flex-end"}
          direction={isMobile ? "column" : "row"}
        >
          <Image src={Logo} width={isMobile ? 150 : 200} mt="sm" />
          <Nav />
        </Group>
      </Container>
    </header>
  );
};

const Nav: React.FC = () => {
  return (
    <Group spacing="xl">
      <Link text="Schedule" />
      <Link text="RSVP" />
      <Link text="FAQs" />
    </Group>
  );
};

const Link: React.FC<{ text: string; elementId?: string }> = ({ text }) => {
  return (
    <Text
      variant="link"
      component="a"
      size="lg"
      href="#"
      color="earth-green"
      weight={500}
    >
      {text}
    </Text>
  );
};
