import {
  Accordion,
  Box,
  Container,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { range } from "lodash";
import React, { useRef } from "react";
import { useGetFaqsQuery } from "../store/api";
import { analytics } from "../utils";
import { Divider } from "./Divider";

export const Faqs: React.FC<{}> = () => {
  const ref = useRef<HTMLDivElement>(null);
  analytics.useTrackView("FAQs", ref);

  const faqs = useGetFaqsQuery({});

  if (faqs.error || faqs.data?.length === 0) {
    return null;
  }

  return (
    <>
      <Box id="faqs" ref={ref} pt={32} pb={64}>
        <Container size="xs">
          <Stack>
            <Title
              align="center"
              order={1}
              mb="md"
              sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
            >
              FAQs
            </Title>

            <Accordion multiple {...(!faqs.isSuccess ? { value: [] } : {})}>
              {!faqs.isSuccess
                ? range(0, 5).map((index) => (
                    <Accordion.Item key={index} value={index.toString()}>
                      <Accordion.Control>
                        <Skeleton visible height={24} />
                      </Accordion.Control>
                    </Accordion.Item>
                  ))
                : faqs.data?.map((faq) => (
                    <Accordion.Item key={faq.question} value={faq.question}>
                      <Accordion.Control>
                        <Title order={3}>{faq.question}</Title>
                      </Accordion.Control>
                      <Accordion.Panel>
                        {faq.answer.split("\n").map((line, index) => (
                          <Text key={index}>{line}</Text>
                        ))}
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
            </Accordion>
          </Stack>
        </Container>
      </Box>
      <Divider />
    </>
  );
};
