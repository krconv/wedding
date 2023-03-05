import {
  Box,
  Button,
  CloseButton,
  Container,
  Divider,
  Flex,
  Group,
  Loader,
  Modal,
  Progress,
  Radio,
  Select,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Transition,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import dayjs from "dayjs";
import clamp from "lodash/clamp";
import sortBy from "lodash/sortBy";
import startCase from "lodash/startCase";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GuestGroup } from "../api";
import {
  useGetGuestGroupQuery,
  useSearchForGuestGroupQuery,
  useUpdateGuestGroupMutation,
} from "../store/api";
import { analytics } from "../utils";

export const Rsvp: React.FC<{ opened: boolean; onClose: () => void }> = ({
  opened,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  analytics.useTrackView("RSVP", ref);

  const [groupUuid, setGroupUuid] = useState<string | null>(null);
  const [step, setStep] = useState<
    "find-name" | "enter-rsvps" | "confirmation" | "review"
  >("find-name");

  useEffect(() => {
    if (!groupUuid && !opened) {
      setStep("find-name");
    }
  }, [groupUuid, opened]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        withCloseButton={false}
        closeOnClickOutside
        fullScreen
        styles={{
          modal: {
            padding: "0px",
          },
          body: {
            minHeight: "-webkit-fill-available",
            height: "1px",
          },
        }}
        exitTransitionDuration={200}
      >
        <Container
          ref={ref}
          size="xs"
          sx={{ minHeight: "100%", height: "1px" }}
        >
          <FindNameStep
            onChange={({ groupUuid }) => setGroupUuid(groupUuid)}
            setStep={setStep}
            onClose={onClose}
            active={step === "find-name"}
          />
          <EnterRsvpsStep
            groupGuid={groupUuid}
            setStep={setStep}
            onClose={onClose}
            active={step === "enter-rsvps"}
          />
          <ConfirmationStep
            groupGuid={groupUuid}
            setStep={setStep}
            onClose={onClose}
            active={step === "confirmation"}
          />
          <ReviewStep
            groupUuid={groupUuid}
            setStep={setStep}
            onClose={onClose}
            active={step === "review"}
          />
        </Container>
      </Modal>
    </>
  );
};

const SelectItemWithDescription = forwardRef<
  HTMLDivElement,
  { label: string; description: string }
>(({ label, description, ...others }, ref) => (
  <div ref={ref} {...others}>
    <Text>{label}</Text>
    {description && (
      <Text size="sm" opacity={0.65}>
        {description}
      </Text>
    )}
  </div>
));

const FindNameStep: React.FC<{
  onChange: ({ groupUuid }: { groupUuid: string | null }) => void;
  setStep: (step: "find-name" | "enter-rsvps" | "review") => void;
  onClose: () => void;
  active: boolean;
}> = ({ onChange, setStep, onClose, active }) => {
  const form = useForm({
    initialValues: {
      query: "",
      groupUuid: "",
    },

    validate: (values) => ({
      groupUuid: !values.groupUuid ? "Please find your name." : null,
    }),
  });

  const [debouncedQuery] = useDebouncedValue(form.values.query, 200);
  const groups = useSearchForGuestGroupQuery(
    { q: debouncedQuery },
    { skip: !debouncedQuery }
  );
  const group = useGetGuestGroupQuery(
    { uuid: form.values.groupUuid! },
    { skip: !form.values.groupUuid }
  );

  useEffect(
    function clearSelectedValue() {
      if (!form.values.query) {
        form.setValues({ groupUuid: "" });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.values.query]
  );

  useEffect(
    function triggerOnChange() {
      if (form.values.groupUuid) {
        onChange({ groupUuid: form.values.groupUuid || null });
      }
    },
    [onChange, form.values.groupUuid]
  );

  return (
    <Step active={active}>
      {(styles) => (
        <form
          onSubmit={form.onSubmit((values) => {
            const guest = groups.data
              ?.find((group) => group.uuid === values.groupUuid)
              ?.guests.find((guest) => guest.searched_for);
            if (guest) {
              analytics.identify({
                id: guest.uuid,
                firstName: guest.first_name,
                lastName: guest.last_name,
              });
            }
            setStep("enter-rsvps");
          })}
          style={styles}
        >
          <Stack h="100%">
            <EventBackAndCloseHeader onClose={onClose} />
            <Space style={{ flexGrow: 1 }} />
            <Title order={2}>Find your name</Title>
            <Select
              data={[
                ...(groups.data?.map((group) => ({
                  value: group.uuid,
                  label: group.guests
                    .filter((guest) => guest.searched_for)
                    .map((guest) =>
                      `${guest.first_name} ${guest.last_name ?? ""}`.trim()
                    )[0],
                  description: (() => {
                    const names = sortBy(group.guests, (guest) => {
                      if (guest.searched_for) {
                        return -1;
                      } else if (guest.role === "primary") {
                        return 0;
                      } else if (guest.role === "partner") {
                        return 1;
                      } else {
                        return 2;
                      }
                    })
                      .map((guest) => guest.first_name)
                      .filter((name) => name != null);
                    if (names.length === 1) {
                      return null;
                    } else {
                      const last = names.splice(-1)[0];
                      return names.join(", ") + " and " + last;
                    }
                  })(),
                })) ?? []),
              ]}
              itemComponent={SelectItemWithDescription}
              searchable
              searchValue={form.values.query}
              onSearchChange={(value) => form.setFieldValue("query", value)}
              {...form.getInputProps("groupUuid")}
              icon={null}
              size="lg"
              filter={() => true}
            />
            <Space style={{ flexGrow: 2 }} />
            <Button
              type="submit"
              disabled={!form.isValid}
              loading={group.isLoading}
              size="lg"
              mb="md"
            >
              Continue
            </Button>
          </Stack>
        </form>
      )}
    </Step>
  );
};

const EnterRsvpsStep: React.FC<{
  groupGuid: string | null;
  setStep: (
    step: "find-name" | "enter-rsvps" | "confirmation" | "review"
  ) => void;
  onClose: () => void;
  active: boolean;
}> = ({ groupGuid, setStep, onClose, active }) => {
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const [updateGuestGroupMutation] = useUpdateGuestGroupMutation();
  const group = useGetGuestGroupQuery(
    { uuid: groupGuid! },
    { skip: !groupGuid }
  );

  const [isSubmitting, setSubmitting] = useState(false);
  const form = useForm({
    initialValues: {
      guests: [] as GuestGroup["guests"],
      plusOnes: [] as GuestGroup["guests"],
      answers: [] as GuestGroup["answers"],
    },

    validate: {
      guests: {
        first_name: (value) => (!value ? true : null),
        last_name: (value) => (!value ? true : null),

        invitations: {
          rsvp: (value, values: any, path) => {
            const invitation =
              values.guests[parseInt(path.split(".")[1])].invitations[
                parseInt(path.split(".")[3])
              ];
            if (invitation.event_id !== activeEvent?.id) {
              return null;
            }
            return value === "no_response" && activeEvent?.collect_rsvps
              ? "Please select a response."
              : null;
          },
          meal_choice_id: (value, values: any, path) => {
            const invitation =
              values.guests[parseInt(path.split(".")[1])].invitations[
                parseInt(path.split(".")[3])
              ];
            if (invitation.event_id !== activeEvent?.id) {
              return null;
            }
            return !value &&
              invitation.rsvp === "attending" &&
              activeEvent?.collect_rsvps &&
              activeEvent?.meal_options.length > 0
              ? "Please select a meal."
              : null;
          },
        },
      },
    },
  });
  const activeEvent = useMemo(
    () => group.data?.events[activeEventIndex] ?? null,
    [group.data?.events, activeEventIndex]
  );
  const isLodging = useMemo(
    () => activeEvent?.name.startsWith("Lodging"),
    [activeEvent?.name]
  );
  const isLastEvent = activeEventIndex === (group.data?.events.length ?? 1) - 1;

  const navigate = useCallback(
    (direction: "next" | "previous") => {
      if (direction === "next") {
        if (form.validate().hasErrors) {
          return;
        }
      } else if (direction === "previous") {
        if (activeEventIndex === 0) {
          setStep("find-name");
        }
      }
      setActiveEventIndex(
        clamp(
          activeEventIndex + (direction === "next" ? 1 : -1),
          0,
          (group.data?.events.length ?? 1) - 1
        )
      );
      form.clearErrors();
    },
    [activeEventIndex, form, group?.data?.events.length, setStep]
  );

  useEffect(
    function updateInitialValuesOnLoad() {
      if (group.data) {
        const isInactivePlusOne = (guest: GuestGroup["guests"][0]) => {
          return (
            guest.first_name === null &&
            guest.last_name === null &&
            guest.invitations.every(
              (invitation) => invitation.rsvp !== "attending"
            ) &&
            guest.role === "partner"
          );
        };
        form.reset();
        const existingAnswers = group.data.answers;
        form.setValues({
          guests: group.data.guests.filter(
            (guest) => !isInactivePlusOne(guest)
          ),
          plusOnes: group.data.guests.filter((guest) =>
            isInactivePlusOne(guest)
          ),
          answers: group.data.events
            .filter((event) => event.collect_rsvps)
            .flatMap((event) => event.questions)
            .map(
              (question) =>
                existingAnswers.find(
                  (answer) => answer.question_id === question.id
                ) ?? { question_id: question.id, answer: "" }
            ),
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [group.data]
  );

  const addPlusOne = useCallback(() => {
    if (form.values.plusOnes.length > 0) {
      let plusOne = form.values.plusOnes[0];
      plusOne = {
        ...plusOne,
        invitations: plusOne.invitations.map((invitation) => {
          const isPreviouslyRespondedEvent =
            (group.data?.events.findIndex(
              (event) => event.id === invitation.event_id
            ) ?? 0) < activeEventIndex;
          const doesEventNeedRsvp =
            group.data?.events.find((event) => event.id === invitation.event_id)
              ?.collect_rsvps ?? false;
          if (isPreviouslyRespondedEvent && doesEventNeedRsvp) {
            return { ...invitation, rsvp: "declined" };
          } else {
            return { ...invitation, rsvp: "no_response" };
          }
        }),
      };
      form.removeListItem("plusOnes", 0);
      form.insertListItem("guests", plusOne);
    }
  }, [form, group.data?.events, activeEventIndex]);

  useEffect(
    function navigateAwayIfMissingGroup() {
      if (!groupGuid) {
        setStep("find-name");
      }
    },
    [groupGuid, setStep]
  );

  useEffect(
    function resetActiveEventOnInactive() {
      if (!active) {
        setActiveEventIndex(0);
      }
    },
    [active]
  );

  return (
    <Step active={active}>
      {(styles) => (
        <form
          onSubmit={form.onSubmit(async (values) => {
            if (!isLastEvent) {
              navigate("next");
            } else {
              setSubmitting(true);
              await updateGuestGroupMutation({
                data: { id: group.data?.id!, ...values },
              }).unwrap();
              setSubmitting(false);
              setStep("confirmation");
            }
          })}
          style={styles}
        >
          <EventProgressBar
            value={(activeEventIndex / (group.data?.events.length || 1)) * 100}
          />
          <EventBackAndCloseHeader
            onBack={() => navigate("previous")}
            onClose={onClose}
          />
          <Stack sx={{ minHeight: "100%" }} pt={34}>
            <Text>
              Event {activeEventIndex + 1} of {group.data?.events.length ?? 1}
            </Text>
            <Title order={2}>
              {isLodging && activeEvent?.name.includes("Cottage")
                ? "Lodging - On-site Cottage"
                : activeEvent?.name}
            </Title>
            <Text>
              {dayjs(activeEvent?.starts_at).format(
                "dddd, MMMM Do [at] h:mm a"
              ) +
                (activeEvent?.ends_at
                  ? dayjs(activeEvent?.ends_at).format(" [to] h:mm a")
                  : "")}
            </Text>
            {activeEvent?.note &&
              activeEvent?.note
                .split("\n")
                .filter((line) => line)
                .map((line) => <Text>{line}</Text>)}
            {activeEvent?.attire && <Text>{activeEvent?.attire} </Text>}
            {activeEvent?.collect_rsvps ? (
              <>
                {form.values.guests.map((guest, guestIndex, guests) => {
                  const isPlusOne = guest.role === "partner";
                  const invitationIndex = guest.invitations.findIndex(
                    (invitation) => invitation.event_id === activeEvent.id
                  );
                  return (
                    <Stack key={guest.id} spacing={0} py="sm">
                      {(group.data?.guests[guestIndex].first_name &&
                        group.data?.guests[guestIndex].last_name) ||
                      !isPlusOne ? (
                        <Title order={3}>
                          {guest.first_name && guest.last_name
                            ? `${guest.first_name} ${guest.last_name}`
                            : "Guest"}
                        </Title>
                      ) : (
                        <Group noWrap>
                          <TextInput
                            label="First name"
                            {...form.getInputProps(
                              `guests.${guestIndex}.first_name`
                            )}
                            value={
                              form.values.guests[guestIndex].first_name ?? ""
                            }
                          />
                          <TextInput
                            label="Last name"
                            {...form.getInputProps(
                              `guests.${guestIndex}.last_name`
                            )}
                            value={
                              form.values.guests[guestIndex].last_name ?? ""
                            }
                          />
                        </Group>
                      )}
                      <Stack>
                        <Flex justify="end">
                          <Radio.Group
                            styles={(theme) => ({
                              root: {
                                "@media (max-width: 200px)": {
                                  margin: "none",
                                },
                              },
                              error: {
                                marginTop: "8px",
                              },
                            })}
                            {...form.getInputProps(
                              `guests.${guestIndex}.invitations.${invitationIndex}.rsvp`
                            )}
                          >
                            <Radio value="attending" label="Will Attend" />
                            <Radio value="declined" label="Will Not Attend" />
                          </Radio.Group>
                        </Flex>
                        {form.values.guests[guestIndex].invitations[
                          invitationIndex
                        ].rsvp === "attending" && (
                          <>
                            {activeEvent.meal_options.length > 0 ? (
                              <Select
                                label="Meal choice"
                                data={activeEvent.meal_options.map(
                                  (meal_option) => ({
                                    label: startCase(meal_option.name),
                                    value: meal_option.id,
                                  })
                                )}
                                {...form.getInputProps(
                                  `guests.${guestIndex}.invitations.${invitationIndex}.meal_choice_id`
                                )}
                              />
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </Stack>
                      <Divider mt="md" />
                    </Stack>
                  );
                })}
                {form.values.plusOnes.length > 0 && (
                  <Button onClick={addPlusOne} variant="outline" size="sm">
                    Add Plus One
                  </Button>
                )}
                {activeEvent.questions.length > 0 && (
                  <Stack
                    p="md"
                    mt="md"
                    sx={(theme) => ({
                      backgroundColor: theme.colors["midnight-blue"][0],
                      borderRadius: "8px",
                    })}
                  >
                    <Title order={4}>We would also like to know...</Title>
                    {activeEvent.questions.map((question) => (
                      <Textarea
                        key={question.id}
                        label={question.question + " (optional)"}
                        {...form.getInputProps(
                          `answers.${form.values.answers.findIndex(
                            (answer) => answer.question_id === question.id
                          )}.answer`
                        )}
                      />
                    ))}
                  </Stack>
                )}
              </>
            ) : (
              <Text mt="lg">RSVPs are not needed for this event.</Text>
            )}

            <Space style={{ flexGrow: 2 }} />
            <Button
              type="submit"
              loading={isSubmitting}
              size="lg"
              disabled={!form.isValid}
              mb="md"
            >
              {isLastEvent ? "Submit" : "Next event"}
            </Button>
          </Stack>
        </form>
      )}
    </Step>
  );
};

const ConfirmationStep: React.FC<{
  groupGuid: string | null;
  setStep: (step: "find-name" | "enter-rsvps" | "review") => void;
  onClose: () => void;
  active: boolean;
}> = ({ groupGuid, setStep, onClose, active }) => {
  const group = useGetGuestGroupQuery(
    { uuid: groupGuid! },
    { skip: !groupGuid }
  );

  const navigate = useCallback(
    (direction: "next" | "previous") => {
      if (direction === "next") {
        onClose();
        setStep("find-name");
      } else if (direction === "previous") {
        setStep("enter-rsvps");
      }
    },
    [setStep, onClose]
  );

  useEffect(
    function navigateAwayIfMissingGroup() {
      if (!groupGuid) {
        setStep("find-name");
      }
    },
    [groupGuid, setStep]
  );

  return (
    <Step active={active}>
      {(styles) => (
        <Box style={styles}>
          <EventProgressBar value={100} />
          <Stack sx={{ minHeight: "100%", height: "1px" }}>
            <EventBackAndCloseHeader
              onBack={() => navigate("previous")}
              onClose={onClose}
            />
            <Space style={{ flexGrow: 1 }} />
            {group.isFetching ? (
              <Loader variant="dots" />
            ) : (
              <>
                <Title order={2}>Thank you!</Title>
                {group.data?.guests.some((guest) =>
                  guest.invitations.some(
                    (invitation) => invitation.rsvp === "attending"
                  )
                ) ? (
                  <>
                    <Text>
                      We're so glad you can make it, and we can't wait to see
                      you!
                    </Text>
                    <Text>
                      Check out the website for the latest information and let
                      us if you have any questions.
                    </Text>
                  </>
                ) : (
                  <Text>
                    We're sorry you can't make it! Please let us know if
                    anything changes.
                  </Text>
                )}
              </>
            )}
            <Space style={{ flexGrow: 2 }} />
            <Button size="lg" mb="md" onClick={() => navigate("next")}>
              Close
            </Button>
          </Stack>
        </Box>
      )}
    </Step>
  );
};

const ReviewStep: React.FC<{
  groupUuid: string | null;
  setStep: (step: "find-name" | "enter-rsvps" | "review") => void;
  onClose: () => void;
  active: boolean;
}> = ({ groupUuid, setStep, onClose, active }) => {
  const group = useGetGuestGroupQuery(
    { uuid: groupUuid! },
    { skip: !groupUuid }
  );

  return (
    <Step active={active}>
      {(styles) => (
        <Stack style={styles}>
          <EventBackAndCloseHeader onClose={onClose} />
          <Title order={1}>Your RSVP Responses</Title>
          {group.data?.events.map((event) => (
            <Stack>
              <Title order={2}>{event.name}</Title>
              <Text>
                {dayjs(event.starts_at).format("dddd, MMMM Do [at] h:mm a") +
                  (event.ends_at
                    ? dayjs(event?.ends_at).format(" [to] h:mm a")
                    : "")}
              </Text>
              {event.note && <Text>{event.note} </Text>}
              {event.attire && <Text>{event.attire} </Text>}
              {event.collect_rsvps ? (
                <>
                  {group.data?.guests.map((guest, guestIndex, guests) => (
                    <Stack key={guest.id} spacing={0} py="sm">
                      <Title order={3}>
                        {guest.first_name && guest.last_name
                          ? `${guest.first_name} ${guest.last_name}`
                          : "Guest"}
                      </Title>
                      {guest.invitations
                        .filter(
                          (invitation) => invitation.event_id === event.id
                        )
                        .map((invitation) => (
                          <React.Fragment key={invitation.id}>
                            <Text size="lg" align="right">
                              {invitation.rsvp === "attending"
                                ? "Will attend"
                                : invitation.rsvp === "declined"
                                ? "Will not attend"
                                : "No response"}
                            </Text>
                            {invitation.meal_choice_id != null &&
                              invitation.rsvp === "attending" &&
                              event.meal_options
                                .filter(
                                  (meal_option) =>
                                    meal_option.id === invitation.meal_choice_id
                                )
                                .map((meal_choice) => (
                                  <Text key={meal_choice.id} align="right">
                                    Meal choice: {startCase(meal_choice.name)}
                                  </Text>
                                ))}
                          </React.Fragment>
                        ))}
                    </Stack>
                  ))}
                </>
              ) : (
                <>
                  <Text align="center">RSVPs not needed.</Text>
                </>
              )}
              <Divider mb="md" />
            </Stack>
          ))}
          <Button
            onClick={() => setStep("enter-rsvps")}
            sx={{ flexShrink: 0 }}
            size="lg"
            mb="md"
          >
            Edit responses
          </Button>
        </Stack>
      )}
    </Step>
  );
};

const Step: React.FC<{
  active: boolean;
  children: (styles: React.CSSProperties) => React.ReactElement<any, any>;
}> = ({ active, children }) => {
  return (
    <Transition
      mounted={active}
      transition="fade"
      duration={200}
      timingFunction="ease"
    >
      {(styles) => children({ ...styles, minHeight: "100%", height: "1px" })}
    </Transition>
  );
};

const EventProgressBar: React.FC<{ value: number }> = ({ value }) => {
  return (
    <Progress
      value={value}
      size="md"
      radius={0}
      sx={{ position: "absolute", top: 0, right: 0, left: 0 }}
      styles={{ root: { backgroundColor: "transparent" } }}
    />
  );
};

const EventBackAndCloseHeader: React.FC<{
  onClose: () => void;
  onBack?: () => void;
}> = ({ onClose, onBack }) => {
  return (
    <Group
      position="apart"
      sx={{
        position: "absolute",
        top: "24px",
        right: "20px",
        left: "20px",
      }}
    >
      {onBack ? (
        <Button
          variant="white"
          onClick={() => onBack()}
          sx={{
            fontWeight: 400,
          }}
          compact
          leftIcon={<IconArrowNarrowLeft size={16} />}
        >
          Back
        </Button>
      ) : (
        <Space />
      )}
      <CloseButton onClick={() => onClose()} />
    </Group>
  );
};
