import {
  Box,
  BoxProps,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useAppDispatch } from "../util/redux/hooks";
import { loaded, SavedPlayerState } from "../util/redux/slice/player";
import { BarButton } from "./Bar";

const Recents = ({
  recents,
  onClear,
  ...props
}: {
  recents: SavedPlayerState[];
  onClear: () => void;
} & BoxProps) => {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tempRecent, setTempRecent] = React.useState<SavedPlayerState>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && tempRecent) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      dispatch(
        loaded({
          ...tempRecent,
          url,
        })
      );
    }
  };

  return (
    <Box
      {...props}
      color="white"
      maxW="2xl"
      w="full"
      mx="auto"
      p={4}
      borderRadius="md"
      borderWidth={1}
      borderColor="whiteAlpha.500"
    >
      <HStack mb={4} justifyContent="space-between">
        <Heading size="sm" color="gray.400">
          Recently Played
        </Heading>
        <BarButton size="sm" onClick={onClear}>
          Clear
        </BarButton>
      </HStack>

      <Stack maxH="lg" overflowY="auto">
        {recents.length > 0 ? (
          recents.map((recent) => (
            <Box
              key={recent.url}
              p={4}
              borderRadius="md"
              borderWidth={1}
              borderColor="whiteAlpha.300"
              _hover={{ cursor: "pointer", bg: "whiteAlpha.100" }}
              onClick={() => {
                if (recent.source === "local") {
                  setTempRecent(recent);
                  fileRef.current?.click();
                } else {
                  dispatch(loaded(recent));
                }
              }}
            >
              <Text
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {recent.source === "local"
                  ? recent.title || "Local File"
                  : recent.title ?? recent.url}
              </Text>

              <Text fontSize="sm" color="gray.400">
                Last Visited: {new Date(recent.lastVisited).toLocaleString()}
              </Text>
            </Box>
          ))
        ) : (
          <Text>No recent items</Text>
        )}
      </Stack>

      <input type="file" hidden ref={fileRef} onChange={handleFileChange} />
    </Box>
  );
};

export default Recents;
