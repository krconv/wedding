import { Box, createStyles, Group, Text, Title } from "@mantine/core";
import { useMemo } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    position: "fixed",
    right: "16px",
    bottom: "24px",
    padding: "8px",
    backgroundColor: theme.white,
    border: `1px solid ${theme.black}`,
    borderRadius: "8px",
  },
}));

export const CountDown: React.FC = () => {
  const { classes } = useStyles();
  const daysUntil = useMemo(
    () =>
      Math.ceil(Math.abs(new Date(2023, 6, 1).getTime() - Date.now()) / 8.64e7),
    []
  );
  return (
    <Box className={classes.root}>
      <Group direction="column" spacing={0} position="center">
        <Title order={2}>{daysUntil}</Title>
        <Text>days to go</Text>
      </Group>
    </Box>
  );
};
