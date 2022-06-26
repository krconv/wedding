import { Group, Image } from "@mantine/core";
import { LogoSimple } from "../assets";

export const Footer: React.FC<{}> = () => {
  return (
    <Group
      sx={(theme) => ({
        backgroundColor: theme.colors["earth-green"][4],
        padding: "64px 16px",
        width: "100%",
      })}
      align="center"
      position="center"
    >
      <Image src={LogoSimple} width={150} />
    </Group>
  );
};
