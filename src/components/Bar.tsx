import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Collapse,
  forwardRef,
  IconButton,
  IconButtonProps,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useAppSelector } from "../util/redux/hooks";

const Bar = forwardRef<BoxProps, "div">((props, ref) => {
  const controls = useAppSelector((state) => state.player.controls);

  return (
    <Collapse in={controls}>
      <Box bg="blackAlpha.900" color="white" ref={ref} {...props} />
    </Collapse>
  );
});

export const BarIconButton = ({
  active,
  ...props
}: {
  active?: boolean;
} & IconButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Tooltip label={props["aria-label"]} isOpen={isOpen}>
      <IconButton
        size={{ base: "sm", md: "md" }}
        color="white"
        colorScheme="whiteAlpha"
        variant={active ? "solid" : "ghost"}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        {...props}
      />
    </Tooltip>
  );
};

export const BarButton = ({
  active,
  ...props
}: {
  active?: boolean;
} & ButtonProps) => {
  return (
    <Button
      color="white"
      colorScheme="whiteAlpha"
      variant={active ? "solid" : "ghost"}
      borderWidth={1}
      borderColor="whiteAlpha.300"
      {...props}
    />
  );
};

export default Bar;
