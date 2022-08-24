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
import { Cover } from "../assets";
import { useMantineTheme } from "@mantine/core";
import { useRef } from "react";
import { analytics } from "../utils";

const useStyles = createStyles((theme) => ({
  root: {
    height: "100vh",
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
  const ref = useRef<HTMLDivElement>(null);
  analytics.useTrackView("Landing", ref);

  return (
    <Group id="landing" ref={ref} className={classes.root} direction="column">
      <Header />
      <BackgroundImage className={classes.image} src={Cover} />
    </Group>
  );
};

const Header: React.FC = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

  return (
    <header style={{ width: "100%" }}>
      <Container size="md">
        <Group
          position="apart"
          align={isMobile ? "center" : "flex-end"}
          direction={isMobile ? "column" : "row"}
        >
          <Group direction="column" align="center">
            <Image src={Logo} width={isMobile ? 150 : 200} mt="sm" />
            <Text mt="-16px" align="center" style={{ fontSize: "12px" }}>
              7.1.23
            </Text>
          </Group>
          <Nav />
        </Group>
      </Container>
    </header>
  );
};

const Nav: React.FC = () => {
  return (
    <Group spacing="xl">
      <Link text="Schedule" elementId="schedule" />
      {/* <Link text="RSVP" /> */}
      {/* <Link text="FAQs" /> */}
    </Group>
  );
};

const Link: React.FC<{ text: string; elementId: string }> = ({
  text,
  elementId,
}) => {
  return (
    <Text
      variant="link"
      component="a"
      size="lg"
      href="#"
      onClick={(event: any) => {
        event.preventDefault();
        analytics.track("clicked navigation link", { link: text });
        document
          .getElementById(elementId)
          ?.scrollIntoView({ behavior: "smooth" });
      }}
      color="earth-green"
      weight={300}
    >
      {text}
    </Text>
  );
};
