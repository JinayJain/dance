import {
  Button,
  Modal,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Heading,
  Kbd,
} from "@chakra-ui/react";
import { useEffect } from "react";

const ShortcutHint = ({
  shortcut,
  description,
}: {
  shortcut: string;
  description: string;
}) => (
  <Text>
    <Kbd>{shortcut}</Kbd> - {description}
  </Text>
);

function Welcome({
  isOpen,
  onClose,
  onOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}) {
  useEffect(() => {
    if (localStorage.getItem("welcome") !== "true") {
      onOpen();
    }
  }, [onOpen]);

  const onCloseAndRemember = () => {
    localStorage.setItem("welcome", "true");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseAndRemember}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            This tool helps you learn dance in a fraction of the time. You can
            mirror the video, slow it down, and add markers to help you learn
            the choreography. With support for YouTube, Soundcloud, file
            uploads, and more, you can learn from anywhere.
          </Text>

          <Heading size="sm" mt={4} mb={2}>
            Shortcuts
          </Heading>

          <ShortcutHint shortcut="Space" description="Play/Pause" />
          <ShortcutHint shortcut="←" description="Rewind 5 seconds" />
          <ShortcutHint shortcut="→" description="Fast forward 5 seconds" />
          <ShortcutHint shortcut="↑" description="Increase playback speed" />
          <ShortcutHint shortcut="↓" description="Decrease playback speed" />
          <ShortcutHint shortcut="R" description="Mirror" />
          <ShortcutHint shortcut="S" description="See yourself" />
          <ShortcutHint shortcut="M" description="Open Markers" />
          <ShortcutHint shortcut="C" description="Open Controls" />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onCloseAndRemember}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Welcome;
