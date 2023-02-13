import {
  Box,
  Button,
  Container,
  Group,
  Modal,
  Stack,
  Stepper,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useRef, useState } from "react";
import { analytics } from "../utils";
import { isDeployed } from "../utils/env";

export const Rsvp: React.FC<{}> = () => {
  const ref = useRef<HTMLDivElement>(null);
  analytics.useTrackView("RSVP", ref);

  const [active, setActive] = useState(0);

  const [modalOpened, setModalOpened] = useState<boolean>(false);

  if (isDeployed) {
    return null;
  }

  return (
    <Box id="rsvp" ref={ref} pt={32} pb={64}>
      <Container size="md">
        <Group direction="column" position="center">
          <Title
            align="center"
            order={1}
            mb="md"
            sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
          >
            RSVP
          </Title>
          <Button onClick={() => setModalOpened(true)}>Open</Button>

          <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            size="xl"
          >
            <Stepper
              active={active}
              onStepClick={setActive}
              breakpoint="sm"
              m="lg"
            >
              <Stepper.Step label="Confirm name">
                <Container size="xs">
                  <Stack>
                    <Title order={3}>Who are you?</Title>
                    <TextInput />
                  </Stack>
                </Container>
              </Stepper.Step>
              <Stepper.Step label="Enter preferences">
                <Container size="xs">
                  <Stack>
                    <Title order={3}>Who is coming?</Title>
                    <TextInput />
                  </Stack>
                </Container>
              </Stepper.Step>
              <Stepper.Step label="Completed"></Stepper.Step>
            </Stepper>
          </Modal>
        </Group>
      </Container>
    </Box>
  );
};
