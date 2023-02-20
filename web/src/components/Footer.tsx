import { Image, Stack, Text } from "@mantine/core";
import { GitHub, LogoSimple } from "../assets";
import { analytics } from "../utils";

export const Footer: React.FC<{}> = () => {
  return (
    <Stack
      sx={(theme) => ({
        backgroundColor: theme.colors["earth-green"][4],
        padding: "48px 16px",
        width: "100%",
      })}
      align="center"
    >
      <Image src={LogoSimple} width={150} />
      <Text
        size="sm"
        mb="xl"
        align="center"
        sx={(theme) => ({ color: theme.colors["earth-green"][7] })}
      >
        Engineered by Kodey, supervised by Maddy. Photography by{" "}
        <Text
          inherit
          variant="link"
          component="a"
          href="https://kelseyconverse.com"
          target="_blank"
        >
          Kelsey Converse
        </Text>
        .
      </Text>
      <a
        href="https://github.com/krconv/wedding"
        target="_blank"
        rel="noreferrer"
        onClick={() => analytics.track("clicked github link")}
      >
        <Image width={32} src={GitHub} />
      </a>
    </Stack>
  );
};
