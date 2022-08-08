import { createStyles } from "@mantine/core";
import { Divider as MtDivider } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    width: "96px",
    marginLeft: "auto",
    marginRight: "auto",
    borderTopColor: theme.colors["earth-green"][8],
  },
}));
export const Divider = () => {
  const { classes } = useStyles();
  return <MtDivider className={classes.root} my="64px" />;
};
