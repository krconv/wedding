import {
  BackgroundImage,
  Container,
  createStyles,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ReactNode, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Cover, Logo } from "../assets";
import { analytics } from "../utils";
import { Rsvp } from "./Rsvp";

const useStyles = createStyles((theme) => ({
  root: {
    height: "100vh",
    "@supports (-webkit-touch-callout: none)": {
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
  const location = useLocation();
  const navigate = useNavigate();
  const rsvpModalOpened = location.pathname === "/rsvp";
  const setRsvpModalOpened = useCallback(
    (opened: boolean) => navigate(opened ? "/rsvp" : "/"),
    [navigate]
  );

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

  return (
    <>
      <header style={{ width: "100%" }}>
        <Container size="md">
          <Layout>
            <Stack align="center">
              <Image src={Logo} width={isMobile ? 150 : 200} mt="sm" />
              <Text
                mt="-16px"
                align="center"
                sx={(theme) => ({
                  fontFamily: theme.headings.fontFamily,
                  fontWeight: 500,
                  fontSize: "12px",
                })}
              >
                7.1.23
              </Text>
            </Stack>
            <Nav onOpenRsvpModal={() => setRsvpModalOpened(true)} />
          </Layout>
        </Container>
      </header>
      <Rsvp
        opened={rsvpModalOpened}
        onClose={() => setRsvpModalOpened(false)}
      />
    </>
  );
};

const Nav: React.FC<{ onOpenRsvpModal: () => void }> = ({
  onOpenRsvpModal,
}) => {
  return (
    <Flex
      direction={{ base: "column", xs: "row" }}
      sx={(theme) => ({ gap: theme.spacing.xl })}
    >
      <Group spacing="xl">
        <Link text="Schedule" elementId="schedule" />
        <Link text="FAQs" elementId="faqs" />
        <Link text="Registry" elementId="registry" />
      </Group>
      {/* <Button size="md" onClick={() => onOpenRsvpModal()}>
        RSVP
      </Button> */}
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
      sx={(theme) => ({ fontFamily: theme.headings.fontFamily })}
      weight={600}
    >
      {text}
    </Text>
  );
};
