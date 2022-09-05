import { Group, Image, Text } from "@mantine/core";
import { GitHub, LogoSimple } from "../assets";
import { analytics } from "../utils";

export const Footer: React.FC<{}> = () => {
  return (
    <Group
      direction="column"
      sx={(theme) => ({
        backgroundColor: theme.colors["earth-green"][4],
        padding: "64px 16px 16px",
        width: "100%",
        margin: "0px 0px -32px",
      })}
      align="center"
      position="center"
    >
      <Image src={LogoSimple} width={150} />
      <Text
        mt="24px"
        size="sm"
        mb="sm"
        sx={(theme) => ({ color: theme.colors["earth-green"][7] })}
      >
        Engineered by Kodey, supervised by Maddy.
      </Text>
      <a
        href="https://github.com/krconv/wedding"
        target="_blank"
        rel="noreferrer"
        onClick={() => analytics.track("clicked github link")}
      >
        <Image width={32} src={GitHub} />
      </a>
    </Group>
  );
};
