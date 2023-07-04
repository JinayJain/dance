import { ButtonProps, HStack, StackProps } from "@chakra-ui/react";
import React from "react";

const ButtonBlock = ({
  children,
  spacing = 1,
  ...props
}: { children: React.ReactNode } & ButtonProps &
  Pick<StackProps, "spacing">) => {
  const childrenWithProps = React.Children.map(children, (child, idx) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement, {
        borderLeftRadius: idx === 0 ? "md" : 0,
        borderRightRadius:
          idx === React.Children.count(children) - 1 ? "md" : 0,
        ...props,
      });
    }
    return child;
  });

  return <HStack spacing={spacing}>{childrenWithProps}</HStack>;
};

export default ButtonBlock;
