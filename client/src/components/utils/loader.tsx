import { Flex, Image, keyframes } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const Loader = () => {
  const rotateAnimation = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
    `;

  const pulseAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
    `;

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2 }}
    exit={{ opacity: 0 }}
  >
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      position="fixed"
      top="0"
      left="0"
      zIndex="1000"
    >
      <Image
        w="250px"
        src="/icons/ojami-logo.svg"
        alt="loader"
        animation={`${pulseAnimation} 1.5s ease-in-out infinite`}
      />

      <Image
        pointerEvents="none"
        src="/assets/star.svg"
        w={{ base: "150px", md: "350px" }}
        alt="star"
        pos="absolute"
        right={-14}
        top={-14}
        animation={`${rotateAnimation} 40s linear infinite`}
      />
    </Flex>
    </motion.div>
  );
};
