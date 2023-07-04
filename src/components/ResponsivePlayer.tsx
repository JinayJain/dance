import { Box, Flex, FlexProps } from "@chakra-ui/react";
import React, { ForwardedRef, forwardRef } from "react";
import ReactPlayer from "react-player";
import { BaseReactPlayerProps } from "react-player/base";

export type PlayerProps = {
  containerProps?: FlexProps;
  playerRef?: ForwardedRef<ReactPlayer>;
  playerProps?: BaseReactPlayerProps;
};

const ResponsivePlayer = ({
  playerRef,
  containerProps,
  playerProps,
}: PlayerProps) => {
  return (
    <Flex
      sx={{
        writingMode: "vertical-lr",
        width: "100%",
        height: "100%",
      }}
      {...containerProps}
    >
      <Box position="relative" flex="1">
        <ReactPlayer
          ref={playerRef}
          width="100%"
          height="100%"
          style={{
            writingMode: "horizontal-tb",
            position: "absolute",
            pointerEvents: "none",
            top: 0,
            left: 0,
          }}
          {...playerProps}
        />
      </Box>
    </Flex>
  );
};

export default ResponsivePlayer;
