import {
  AspectRatio,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { range } from "lodash";
import React, { useRef } from "react";
import { RegistryItem } from "../api";
import { useGetRegistryQuery } from "../store/api";
import { analytics } from "../utils";

export const Registry: React.FC<{}> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const registry = useGetRegistryQuery({}, { pollingInterval: 1000 * 60 * 5 });
  analytics.useTrackView("Registry", ref);

  return (
    <Box id="registry" ref={ref} pt={32} pb={64}>
      <Container size="md">
        <Stack align="center">
          <Title
            align="center"
            order={1}
            mb="md"
            sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
          >
            Registry
          </Title>

          <SimpleGrid
            cols={4}
            spacing="lg"
            breakpoints={[
              { maxWidth: 750, cols: 3, spacing: "md" },
              { maxWidth: 555, cols: 2, spacing: "sm" },
              { maxWidth: 300, cols: 1, spacing: "sm" },
            ]}
          >
            {registry.data == null
              ? range(0, 8).map((index) => (
                  <AspectRatio
                    key={index}
                    ratio={215 / 360}
                    sx={{ width: "215px" }}
                  >
                    <Skeleton height="100%" width="100%" radius={0} visible />
                  </AspectRatio>
                ))
              : registry.data?.items
                  .filter((item) => item.completion_percentage < 100)
                  .slice(0, 8)
                  .map((item) => <Item key={item.id} item={item} />)}
          </SimpleGrid>

          <Center>
            <Button
              size="lg"
              mt="md"
              component="a"
              href="https://www.zola.com/registry/maddyandkodey"
              target="_blank"
              onClick={() => analytics.track("opened zola registry")}
              styles={(theme) => ({
                root: {
                  flexGrow: "0 !important" as any,
                },
              })}
            >
              See more
            </Button>
          </Center>
        </Stack>
      </Container>
    </Box>
  );
};

const Item: React.FC<{ item: RegistryItem }> = ({ item }) => {
  return (
    <Card p="sm" radius={0} withBorder style={{ display: "grid" }}>
      <Card.Section
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Image src={item.image_link} alt={item.title} />

        <Stack spacing={0} p="sm" sx={{ flexGrow: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Title order={4}>{item.title.split(",")[0]}</Title>
            <Group spacing="xs" align="baseline" position="apart" noWrap>
              <Text weight={400}>{item.brand}</Text>
              {item.price ? (
                <Text>${item.price.toFixed(2)}</Text>
              ) : (
                <Text>
                  <em>any</em>
                </Text>
              )}
            </Group>
          </Box>
          <Button
            fullWidth
            mt="md"
            component="a"
            href={item.buy_link}
            target="_blank"
            onClick={() =>
              analytics.track("opened registry item", { item: item.title })
            }
            styles={(theme) => ({
              root: {
                flexGrow: "0 !important" as any,
              },
            })}
          >
            More info
          </Button>
        </Stack>
      </Card.Section>
    </Card>
  );
};
