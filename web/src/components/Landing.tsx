import {
  BackgroundImage,
  Container,
  createStyles,
  Flex,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Logo } from "../assets";
import { Cover } from "../assets";
import { useMantineTheme } from "@mantine/core";
import { ReactNode, useCallback, useMemo, useRef } from "react";
import { analytics } from "../utils";
import { Rsvp } from "./Rsvp";

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
    <Stack id="landing" ref={ref} className={classes.root}>
      <Header />
      <BackgroundImage className={classes.image} src={Cover} />
    </Stack>
  );
};

const Header: React.FC = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

  const Layout = useCallback(
    ({ children }: { children: ReactNode }) => {
      if (isMobile) {
        return <Stack align="center">{children}</Stack>;
      } else {
        return (
          <Group position="apart" align="flex-end">
            {children}
          </Group>
        );
      }
    },
    [isMobile]
  );
  const nav = useMemo(() => <Nav />, []);

  return (
    <header style={{ width: "100%" }}>
      <Container size="md">
        <Layout>
          <Stack align="center">
            <Image src={Logo} width={isMobile ? 150 : 200} mt="sm" />
            <Text mt="-16px" align="center" style={{ fontSize: "12px" }}>
              7.1.23
            </Text>
          </Stack>
          {nav}
        </Layout>
      </Container>
    </header>
  );
};

const Nav: React.FC = () => {
  return (
    <Flex
      direction={{ base: "column", xs: "row" }}
      sx={(theme) => ({ gap: theme.spacing.xl })}
    >
      <Group spacing="xl">
        <Link text="Schedule" elementId="schedule" />
        <Link text="Registry" elementId="registry" />
        <Link text="FAQs" elementId="faqs" />
      </Group>
      <Rsvp />
    </Flex>
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
