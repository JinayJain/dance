import { Box, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "../util/redux/hooks";

const StatusIndicator = ({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) => (
  <AnimatePresence>
    {active && (
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        fontSize={{ base: "md", md: "lg" }}
        textShadow="0 0 8px black"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        maxW="xl"
      >
        {children}
      </Box>
    )}
  </AnimatePresence>
);

const Status = () => {
  const mirrored = useAppSelector((state) => state.player.mirrored);
  const speed = useAppSelector((state) => state.player.speed);
  const title = useAppSelector((state) => state.player.media?.title);

  return (
    <Box color="white" p={8}>
      <StatusIndicator active={!!title}>{title}</StatusIndicator>
      <StatusIndicator active={mirrored}>MIRRORED</StatusIndicator>
      <StatusIndicator active={speed !== 1}>{speed}x</StatusIndicator>
    </Box>
  );
};

export default Status;
