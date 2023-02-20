import {
  createStyles,
  Divider as MtDivider,
  DividerProps,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    width: "96px",
    marginLeft: "auto",
    marginRight: "auto",
    borderTopColor: theme.colors["earth-green"][8],
  },
}));

export const Divider: React.FC<DividerProps> = (props) => {
  const { classes } = useStyles();
  return <MtDivider className={classes.root} {...props} my="64px" />;
};
