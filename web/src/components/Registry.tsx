import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Image,
  Loader,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
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
        <Group direction="column" position="center">
          <Title
            align="center"
            order={1}
            mb="md"
            sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
          >
            Registry
          </Title>

          {registry.isLoading || !registry.data ? (
            <Loader variant="dots" style={{ minHeight: "100px" }} />
          ) : (
            <SimpleGrid
              cols={4}
              spacing="lg"
              breakpoints={[
                { maxWidth: 750, cols: 3, spacing: "md" },
                { maxWidth: 555, cols: 2, spacing: "sm" },
                { maxWidth: 300, cols: 1, spacing: "sm" },
              ]}
            >
              {registry.data?.items.slice(0, 8).map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </SimpleGrid>
          )}

          <Center>
            <Button
              variant="light"
              size="lg"
              mt="md"
              radius="sm"
              component="a"
              href="https://www.zola.com/registry/maddyandkodey"
              target="_blank"
              onClick={() => analytics.track("opened zola registry")}
              styles={(theme) => ({
                root: {
                  flexGrow: "0 !important" as any,
                  backgroundColor: theme.colors["midnight-blue"][1],
                  color: theme.colors["midnight-blue"][8],
                  "&:hover": {
                    backgroundColor: theme.colors["midnight-blue"][2],
                  },
                  fontWeight: 400,
                },
              })}
            >
              See more
            </Button>
          </Center>
        </Group>
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

        <Group
          direction="column"
          spacing={0}
          align="apart"
          p="sm"
          style={{ flexGrow: 1 }}
          grow
        >
          <Box>
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
            variant="light"
            fullWidth
            mt="md"
            radius="sm"
            component="a"
            href={item.buy_link}
            target="_blank"
            onClick={() =>
              analytics.track("opened registry item", { item: item.title })
            }
            styles={(theme) => ({
              root: {
                flexGrow: "0 !important" as any,
                backgroundColor: theme.colors["midnight-blue"][1],
                color: theme.colors["midnight-blue"][8],
                "&:hover": {
                  backgroundColor: theme.colors["midnight-blue"][2],
                },
                fontWeight: 400,
              },
            })}
          >
            More info
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
};
