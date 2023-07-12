import {
  BackgroundImage,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Group,
  ImageProps,
  Loader,
  Image as MtImage,
  Stack,
  Text,
  Title,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import { IconCamera, IconLink } from "@tabler/icons-react";
import dayjs from "dayjs";
import { chain } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    if (!photos.data) {
      return [];
    }
    return chain(photos.data.community_photos)
      .sortBy((photo) => dayjs(photo.uploaded_at).unix())
      .reverse()
      .value();
  }, [photos.data]);

  const photographerPhotos = useRotatingPhotos({
    photos: photos.data?.photographer_photos ?? null,
    size: 3,
  });
  const communityPhotos = useRotatingPhotos({
    photos: sortedPhotos,
    size: 12,
  });

  const size = useElementSize();

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
                href={photos.data?.community_upload_link}
              >
                share
              </Text>{" "}
              photos/videos that you take as well!
            </Text>
            {(photos.isLoading || photos.data == null) && (
              <Center mt="lg">
                <Loader variant="dots" />
              </Center>
            )}
          </Stack>
        </Container>
        {photographerPhotos.isLoading || (
          <Container size="lg" mt="md">
            <Stack>
              <Center>
                <Stack spacing={4}>
                  <Badge size="xl">
                    <Text size="lg">Professional Captures</Text>
                  </Badge>
                  <Text align="center" italic>
                    More to come in September
                  </Text>
                </Stack>
              </Center>
              <Group ref={size.ref} position="center" noWrap>
                {photographerPhotos
                  .photos!.slice(0, isMobile ? 2 : 3)
                  .map((photo, i) => (
                    <a
                      key={i}
                      href={photo.external_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TransitionedImage
                        src={photo?.thumbnail_src!}
                        width={
                          isMobile ? size.width / 2 - 8 : size.width / 3 - 11
                        }
                        height={
                          isMobile ? size.width / 2 - 8 : size.width / 3 - 11
                        }
                      />
                    </a>
                  ))}
              </Group>
            </Stack>
          </Container>
        )}
        {communityPhotos.isLoading || (
          <Container size="lg" mt="xl">
            <Stack>
              <Center>
                <Badge size="xl">
                  <Text size="lg">Shared Memories</Text>
                </Badge>
              </Center>
              <Group position="center">
                {communityPhotos.photos!.map((photo, i) => (
                  <a
                    key={i}
                    href={photo.external_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TransitionedImage
                      src={photo.thumbnail_src!}
                      width={
                        isMobile ? size.width / 3 - 11 : size.width / 4 - 12
                      }
                      height={
                        isMobile ? size.width / 3 - 11 : size.width / 4 - 12
                      }
                    />
                  </a>
                ))}
              </Group>
              <Center mt="md">
                <Group position="center">
                  <Button
                    size="lg"
                    component="a"
                    href={photos.data!.community_upload_link}
                    target="_blank"
                    leftIcon={<IconCamera />}
                  >
                    Add your photos
                  </Button>
                  <Button
                    size="lg"
                    component="a"
                    href={photos.data!.community_album_link}
                    leftIcon={<IconLink />}
                    target="_blank"
                  >
                    See more
                  </Button>
                </Group>
              </Center>
            </Stack>
          </Container>
        )}
      </Box>
      <Divider />
    </>
  );
};

function useRotatingPhotos<T extends { id: string; thumbnail_src: string }>({
  photos,
  size,
}: {
  photos: T[] | null;
  size: number;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [baseIndex, setBaseIndex] = useState(-1);
  const [randomRange, setRandomRange] = useState(-1);
  const [selectedPhotos, setSelectedPhotos] = useState<T[] | null>(null);
  const lastUpdatedSlots = useRef<number[]>([]);

  const pickRandomPhoto = useCallback(
    ({
      photos,
      blocklist,
      baseIndex,
      randomRange,
    }: {
      photos: T[];
      blocklist: T[];
      baseIndex: number;
      randomRange: number;
    }) => {
      let pickedPhoto: T;
      let isAllowed = () => !blocklist.some(({ id }) => id === pickedPhoto.id);

      do {
        const randomOffset = Math.floor(Math.random() * randomRange);
        pickedPhoto = photos[(baseIndex + randomOffset) % photos.length];
      } while (!isAllowed());
      return pickedPhoto;
    },
    []
  );

  const pickRandomSlot = useCallback(() => {
    let pickedSlot: number;

    do {
      pickedSlot = Math.floor(Math.random() * size);
    } while (lastUpdatedSlots.current.includes(pickedSlot));

    lastUpdatedSlots.current.push(pickedSlot);
    if (lastUpdatedSlots.current.length > size / 2) {
      lastUpdatedSlots.current.shift();
    }
    return pickedSlot;
  }, [size]);

  useEffect(
    function initialize() {
      if (!isInitialized && (photos?.length ?? 0) > 0) {
        setIsInitialized(true);
        const baseIndex = Math.floor(Math.random() * photos?.length!);
        setBaseIndex(baseIndex);
        const randomRange = Math.max(photos?.length! / 4, size * 2);
        setRandomRange(randomRange);
        setTimeout(() => {
          setSelectedPhotos(() => {
            let selectedPhotos: T[] = [];
            for (let i = 0; i < size; i++) {
              selectedPhotos.push(
                pickRandomPhoto({
                  photos: photos!,
                  blocklist: selectedPhotos,
                  baseIndex: (baseIndex + i) % photos!.length,
                  randomRange,
                })
              );
            }
            return selectedPhotos;
          });
        }, 1);
      }
    },
    [isInitialized, size, photos, pickRandomPhoto]
  );

  const updateRandomPhotoSlot = useCallback(() => {
    if (!isInitialized) {
      return;
    }
    setSelectedPhotos((selectedPhotos) => {
      const slotToUpdate = pickRandomSlot();
      const newPhoto = pickRandomPhoto({
        photos: photos!,
        blocklist: selectedPhotos!,
        baseIndex: (baseIndex + slotToUpdate) % photos!.length,
        randomRange,
      });
      return selectedPhotos!.map((photo, i) => {
        if (i === slotToUpdate) {
          return newPhoto;
        }
        return photo;
      });
    });
    setBaseIndex((baseIndex + 1) % photos!.length);
  }, [
    isInitialized,
    photos,
    baseIndex,
    randomRange,
    pickRandomPhoto,
    pickRandomSlot,
  ]);

  useEffect(
    function tick() {
      if (!isInitialized) {
        return;
      }
      const timeout = setInterval(updateRandomPhotoSlot, 15000 / size);
      return () => clearInterval(timeout);
    },
    [size, isInitialized, updateRandomPhotoSlot]
  );

  return {
    photos: selectedPhotos,
    isLoading: !isInitialized || selectedPhotos == null,
  };
}

const TransitionedImage = ({
  src,
  width,
  height,
  style,
  onClick,
}: {
  src: string;
  width: ImageProps["width"];
  height: ImageProps["height"];
  style?: ImageProps["style"];
  onClick?: ImageProps["onClick"];
}) => {
  const transitionDuration = 1500;
  const [transitioning, setTransitioning] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const loadingSrc = useRef<string | null>(null);
  const [nextSrc, setNextSrc] = useState<string | null>(null);

  const onImageLoad = useCallback(
    (src: string) => {
      if (loadingSrc.current === src) {
        setNextSrc(src);
        setTransitioning(true);
      }
    },
    [loadingSrc]
  );

  useEffect(
    function loadNextImage() {
      if (loadingSrc.current === src || !src) {
        return;
      }
      loadingSrc.current = src;
      const img = new Image();
      img.src = src;
      img.onload = () => onImageLoad(src);
    },
    [src, onImageLoad, loadingSrc]
  );

  useEffect(
    function clearNextImageAfterFade() {
      if (!nextSrc) {
        return;
      }
      const timeout = setTimeout(() => {
        setCurrentSrc(nextSrc);
        setNextSrc(null);
        setTransitioning(false);
      }, transitionDuration);
      return () => clearTimeout(timeout);
    },
    [currentSrc, nextSrc]
  );

  return (
    <BackgroundImage
      src={currentSrc ?? ""}
      style={{ width: width + "px", height: height + "px", ...(style ?? {}) }}
      onClick={onClick}
    >
      <Transition
        mounted={transitioning}
        duration={transitionDuration}
        transition="fade"
      >
        {(styles) => (
          <MtImage
            src={nextSrc ?? loadingSrc.current}
            width={width}
            height={height}
            style={styles}
          />
        )}
      </Transition>
    </BackgroundImage>
  );
};
