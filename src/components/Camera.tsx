import { Box, BoxProps, Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, RefObject } from "react";

const Camera = ({
  container,
  ...props
}: {
  container: RefObject<HTMLElement>;
} & BoxProps) => {
  const [stream, setStream] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(stream);
    };
    getStream();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return (
    <Box
      as={motion.div}
      {...props}
      initial={{
        top: 0,
        left: 0,
      }}
      animate={{
        top: 0,
        left: 0,
        position: "absolute",
        cursor: "grab",
      }}
      drag
      whileDrag={{
        scale: 1.05,
        cursor: "grabbing",
      }}
      shadow="lg"
      dragConstraints={container}
      dragMomentum={false}
    >
      {!stream && (
        <Spinner
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      )}

      <Box rounded="md" overflow="hidden">
        <video style={{ transform: "scaleX(-1)" }} ref={videoRef} autoPlay />
      </Box>
    </Box>
  );
};

export default Camera;
