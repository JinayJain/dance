import {
  Box,
  keyframes,
  chakra,
  HStack,
  shouldForwardProp,
  StackProps,
  VStack,
  Text,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { SlControlPause, SlControlPlay } from "react-icons/sl";
import { useAppSelector } from "../util/redux/hooks";

const numbers = Array.from({ length: 5 }, (_, i) => i + 1);

const animation = keyframes`
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.2);
  }
  100% {
    transform: scaleY(1);
  }
`;

const AudioIndicator = (props: StackProps) => {
  const playing = useAppSelector((state) => state.player.playing);

  return (
    <VStack {...props} color="white" p={8} spacing={4} pointerEvents="none">
      {/* play/pause icon */}

      <Box w={8} h={8}>
        {playing ? (
          <motion.div
            key="play"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SlControlPlay size={32} />
          </motion.div>
        ) : (
          <motion.div
            key="pause"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SlControlPause size={32} />
          </motion.div>
        )}
      </Box>

      <Text>{playing ? "Playing" : "Paused"}</Text>
    </VStack>
  );
};

export default AudioIndicator;
