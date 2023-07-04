import {
  Box,
  BoxProps,
  Button,
  Divider,
  Flex,
  Heading,
  HeadingProps,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Link,
  Center,
  Image,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { BsFileEarmarkMusicFill, BsYoutube } from "react-icons/bs";
import { FiVideo } from "react-icons/fi";
import { SiSoundcloud } from "react-icons/si";
import { Link as RouterLink } from "react-router-dom";

const FeatureCard = ({ children, ...props }: BoxProps) => {
  return (
    <Box {...props} p={8} rounded="lg" bg="gray.800" border="1px solid #fff1">
      {children}
    </Box>
  );
};

const FeatureCardTitle = ({
  comingSoon,
  children,
  ...props
}: HeadingProps & {
  comingSoon?: boolean;
}) => {
  return (
    <HStack wrap="wrap" mb={4}>
      <Heading
        as="h3"
        flex={1}
        size="lg"
        fontWeight="bold"
        color="white"
        {...props}
      >
        {children}
      </Heading>
      {comingSoon && (
        <Tag ml={"auto"} colorScheme="whiteAlpha" size="sm">
          COMING SOON
        </Tag>
      )}
    </HStack>
  );
};

const FeatureCardText = ({ children, ...props }: BoxProps) => {
  return (
    <Text color="gray.400" lineHeight={1.5} {...props}>
      {children}
    </Text>
  );
};

const Features = () => {
  return (
    <Box w="full" maxW="1200px" mx="auto">
      <Heading size="md">Features</Heading>
      <Divider borderColor="gray.700" my={4} />

      <SimpleGrid minChildWidth="300px" spacing={8} p={4}>
        <FeatureCard>
          <FeatureCardTitle>Slow it down</FeatureCardTitle>

          <FeatureCardText>
            Learn the precise movements of your favorite dances by slowing down
            the video. Perfect for fast paced dances and complex choreo.
          </FeatureCardText>
        </FeatureCard>

        <FeatureCard>
          <FeatureCardTitle>Mirror</FeatureCardTitle>

          <FeatureCardText>
            Left is left and right is right. Mirror any video so you never have
            to worry about which side you&apos;re on.
          </FeatureCardText>
        </FeatureCard>

        <FeatureCard>
          <FeatureCardTitle>See yourself</FeatureCardTitle>

          <FeatureCardText>
            Compare your movements to the original video to see how you&apos;re
            doing.
          </FeatureCardText>
        </FeatureCard>

        <FeatureCard>
          <FeatureCardTitle>Mark sections</FeatureCardTitle>
          <FeatureCardText>
            Practice a dance in sections by marking the start and end of each
            section.
          </FeatureCardText>
        </FeatureCard>

        <FeatureCard>
          <FeatureCardTitle>Loop</FeatureCardTitle>

          <FeatureCardText>
            Loop sections of the video to practice the same section over and
            over again.
          </FeatureCardText>
        </FeatureCard>

        <FeatureCard>
          <FeatureCardTitle comingSoon>Share</FeatureCardTitle>

          <FeatureCardText>
            Share your practice videos with friends and teachers to get
            feedback, all in one place. It&apos;s like Google Docs for dance
            practice.
          </FeatureCardText>
        </FeatureCard>
      </SimpleGrid>
    </Box>
  );
};

const Home = () => {
  const animation = useAnimation();

  useEffect(() => {
    const animate = async () => {
      await animation.set({
        opacity: 0,
        y: 16,
      });

      await animation.start((i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.25,
          duration: 0.3,
          ease: "easeOut",
        },
      }));
    };

    animate();
  }, [animation]);

  return (
    <Box
      as="main"
      bg="gray.900"
      color="white"
      minH="100vh"
      pb={16}
      pt={4}
      px={4}
    >
      <Stack mx="auto" spacing={12} align="center" minH="90vh" px={8} py={16}>
        <Flex maxW="1200px" flexDir="column">
          <Heading
            as={motion.h1}
            opacity={0}
            size="2xl"
            animate={animation}
            mb={4}
            custom={1}
          >
            The ultimate dance practice tool
          </Heading>
          <Text
            as={motion.p}
            opacity={0}
            fontSize="lg"
            animate={animation}
            mb={8}
            custom={2}
            color="gray.400"
          >
            Learn dance from any source by slowing it down, mirroring, marking
            sections, and more. No more searching for mirrored or slowed down
            versions of your favorite dance videos. Just choose a song and
            practice, free for everyone.
          </Text>

          <Center as={motion.div} animate={animation} opacity={0} custom={5}>
            <Box textAlign="center">
              <Link as={RouterLink} to="/app">
                <Button
                  as="a"
                  colorScheme="blue"
                  size="lg"
                  isDisabled={status === "loading"}
                  mb={2}
                >
                  Launch Player
                </Button>
              </Link>

              <Text fontSize="sm" color="gray">
                It&apos;s free!
              </Text>
            </Box>
          </Center>
        </Flex>
        <Box
          as={motion.div}
          opacity={0}
          animate={animation}
          custom={4}
          boxShadow="0 0 64px rgba(255, 255, 255, 0.2)"
          rounded="lg"
          overflow="hidden"
          maxW="1400px"
        >
          <Image src="/demo.png" alt="demo" />
        </Box>

        <Text
          color="gray.500"
          fontSize="xl"
          opacity={0}
          as={motion.div}
          animate={animation}
          custom={4}
        >
          <Text as="span" fontSize="sm" verticalAlign="middle" mr={4}>
            SUPPORTS
          </Text>
          <Icon as={BsYoutube} boxSize={8} mx={2} verticalAlign="middle" />
          <Icon as={SiSoundcloud} boxSize={8} mx={2} verticalAlign="middle" />
          <Icon as={FiVideo} boxSize={8} mx={2} verticalAlign="middle" />
          <Icon
            as={BsFileEarmarkMusicFill}
            boxSize={8}
            mx={2}
            verticalAlign="middle"
          />

          <Text as="span" fontSize="sm" verticalAlign="middle">
            and more
          </Text>
        </Text>
      </Stack>

      <Features />

      <Text textAlign="center" color="gray.500" mt={8}>
        Created by{" "}
        <Link href="https://jinay.dev/" isExternal color="gray.300">
          Jinay Jain (hi@jinay.dev)
        </Link>
      </Text>
    </Box>
  );
};

export default Home;
