import { Group, Image, Text } from "@mantine/core";
import { LogoSimple } from "../assets";

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
        sx={(theme) => ({ color: theme.colors["earth-green"][7] })}
      >
        Engineered by Kodey, supervised by Maddy.
      </Text>
    </Group>
  );
};
