import { getDefaultZIndex, Image, Stack, Text } from "@mantine/core";
import { Bridge } from "../assets";

export const Footer: React.FC<{}> = () => {
  return (
    <Stack
      sx={(theme) => ({
        backgroundColor: theme.colors["earth-green"][4],
        padding: "24px 16px",
        width: "100%",
        position: "relative",
        zIndex: getDefaultZIndex("max")
      })}
      align="center"
    >
      <Image src={Bridge} width={192} />
      <Text
        size="sm"
        mb="xl"
        align="center"
        sx={(theme) => ({ color: theme.colors["earth-green"][7] })}
      >
        Engineered by Kodey, supervised by Maddy.
        <br />
        Photography by{" "}
        <Text
          inherit
          variant="link"
          component="a"
          href="https://kelseyconverse.com"
          target="_blank"
        >
          Kelsey Converse
        </Text>
        . Artwork by Tina Farmer.
      </Text>
    </Stack>
  );
};
