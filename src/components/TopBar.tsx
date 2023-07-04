import {
  Box,
  BoxProps,
  HStack,
  Input,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { SiYoutube } from "react-icons/si";
import { SlQuestion } from "react-icons/sl";
import useUmami from "../util/hooks/useUmami";
import { useAppDispatch } from "../util/redux/hooks";
import { loaded, MediaType } from "../util/redux/slice/player";
import { BarButton, BarIconButton } from "./Bar";
import Welcome from "./Welcome";

const TopBar = ({ ...props }: BoxProps) => {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);

  const { trackEvent } = useUmami();

  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();

  const [url, setUrl] = useState("");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      const type = file.type.split("/")[0];

      trackEvent("load", { source: "file", type });

      if (type === "audio" || type === "video") {
        dispatch(
          loaded({
            title: file.name,
            url,
            type: type as MediaType,
            source: "local",
          })
        );
      }
    }
  };

  return (
    <Box color="white" position="relative" {...props}>
      <Stack
        align="center"
        justify="center"
        py={4}
        px={8}
        wrap="wrap"
        direction={["column", "row"]}
        spacing={4}
      >
        {/* always on left */}
        <BarButton onClick={() => fileRef.current?.click()}>
          Upload
          <input type="file" hidden ref={fileRef} onChange={onFileChange} />
        </BarButton>
        <Text>OR</Text>

        <HStack spacing={4} flex={1} maxW="xl" w="full">
          <Input
            placeholder="Paste a YouTube URL"
            flex={1}
            colorScheme="whiteAlpha"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <BarButton
            leftIcon={<SiYoutube />}
            onClick={() => {
              dispatch(
                loaded({
                  type: "video",
                  source: "youtube",
                  url,
                })
              );

              trackEvent("load", { source: "youtube", type: "video" });
            }}
          >
            Play
          </BarButton>
        </HStack>

        <BarIconButton
          aria-label="Help"
          icon={<SlQuestion />}
          onClick={onToggle}
        />

        <Welcome isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
      </Stack>
    </Box>
  );
};

export default TopBar;
