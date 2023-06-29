import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Image,
  Loader,
  Modal,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCamera } from "@tabler/icons-react";
import dayjs from "dayjs";
import { chain } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Photo } from "../api";
import { useGetPhotosQuery } from "../store/api";
import { analytics } from "../utils";
import { Divider } from "./Divider";

export const Photos: React.FC<{}> = () => {
  const ref = useRef<HTMLDivElement>(null);
  analytics.useTrackView("Photos", ref);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);
  useEffect(() => {
    if (location.pathname === "/photos") {
      ref.current?.scrollIntoView();
      navigate("/");
    }
  }, [location.pathname, navigate]);

  const photos = useGetPhotosQuery({});
  const sortedPhotos = useMemo(() => {
    const maxPhotos = 30;
    if (!photos.data) {
      return [];
    }
    return chain(photos.data.photos)
      .sortBy((photo) => dayjs(photo.uploaded_at).unix())
      .reverse()
      .take(maxPhotos)
      .value();
  }, [photos.data]);

  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <>
      <Box id="photos" ref={ref} pt={32} pb={64}>
        <Container size="md">
          <Stack>
            <Title
              align="center"
              order={1}
              mb="md"
              sx={(theme) => ({ color: theme.colors["earth-green"][6] })}
            >
              Photos
            </Title>
            <Text align="center" size="lg">
              We'll upload photos of the wedding here. Please{" "}
              <Text
                variant="link"
                component="a"
                href={photos.data?.upload_link}
              >
                share
              </Text>{" "}
              photos/videos that you take as well!
            </Text>

            {photos.data != null && (
              <Center>
                <Group>
                  <Button
                    size="lg"
                    mt="md"
                    component="a"
                    href={photos.data.upload_link}
                    target="_blank"
                    leftIcon={<IconCamera />}
                    mb="xl"
                  >
                    Add your photos
                  </Button>
                </Group>
              </Center>
            )}
          </Stack>
        </Container>
        <Container size="lg">
          <Stack>
            {photos.isLoading || photos.data == null ? (
              <Center mt="lg">
                <Loader variant="dots" />
              </Center>
            ) : (
              <>
                <Group position="center">
                  {sortedPhotos.map((photo) => (
                    <Image
                      key={photo.id}
                      src={photo.thumbnail_src}
                      width={isMobile ? "150px" : "200px"}
                      height={isMobile ? "150px" : "200px"}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelected(photo)}
                    />
                  ))}
                </Group>
                {photos.data?.photos.length > sortedPhotos.length && (
                  <Center>
                    <Button
                      size="lg"
                      mt="md"
                      component="a"
                      href={photos.data.album_link}
                      target="_blank"
                    >
                      See more
                    </Button>
                  </Center>
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>
      <Modal
        withCloseButton={false}
        opened={selected != null}
        size="xl"
        onClose={() => setSelected(null)}
      >
        <Stack>
          <Image src={selected?.original_src} />
          {selected?.caption && (
            <Text align="center" size="lg">
              {selected.caption}
            </Text>
          )}
          <Text align="center" color="gray">
            Uploaded by {selected?.uploader}{" "}
            {dayjs(selected?.uploaded_at).calendar(null, {
              sameDay: "[today at] h:mma",
              lastDay: "[yesterday at] h:mma",
              lastWeek: "[last] dddd [at] h:mma",
              sameElse: "[on] MM/DD/YYYY",
            })}
            {selected?.uploaded_at !== selected?.taken_at && (
              <>
                ; taken{" "}
                {dayjs(selected?.taken_at).calendar(null, {
                  sameDay: "[today at] h:mma",
                  lastDay: "[yesterday at] h:mma",
                  lastWeek: "[last] dddd [at] h:mma",
                  sameElse: "[on] MM/DD/YYYY",
                })}
              </>
            )}
          </Text>
        </Stack>
      </Modal>
      <Divider />
    </>
  );
};
