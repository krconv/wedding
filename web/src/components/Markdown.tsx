import { Text } from "@mantine/core";
import ReactMarkdown from "react-markdown";

export interface MarkdownProps {
  children: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: React.CSSProperties["textAlign"];
}

export const Markdown: React.FC<MarkdownProps> = ({
  children,
  size,
  align,
}) => {
  return (
    <ReactMarkdown
      components={{
        a: (props: any) => (
          <Text
            inherit
            variant="link"
            component="a"
            href={props.href}
            underline
          >
            {props.children}
          </Text>
        ),
        p: (props: any) => (
          <Text size={size} align={align}>
            {props.children}
          </Text>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
