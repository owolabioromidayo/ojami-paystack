import { Flex, Image, keyframes, useDisclosure } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import FancyButton from "../ui/fancy-button";
import { SignInModal } from "../utils/signin-modal";
import { OjaContext } from "../provider";
import { CartDrawer } from "../utils/cart-drawer";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "../utils/loader";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onCartOpen,
    isOpen: isCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const { user } = useContext(OjaContext);

  const rotateAnimation = keyframes`
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
`;

const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  setTimeout(() => {
    setIsLoading(false);
    }, 2000);
  }, []);
  return (
    <AnimatePresence>
      <AnimatePresence>{isLoading && <Loader />}</AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
      <Flex
      direction="column"
      pos="relative"
      px={{ lg: 10 }}
      gap={20}
      h="100vh"
      align="center"
      bg="#FFF9E5"
    >
      <Flex
        maxW="1650px"
        w="full"
        bg="none"
        justify="space-between"
        p={2}
        align="center"
        h="135px"
        pos="sticky"
      >
        <Flex align="center">
          <Image
            pointerEvents="none"
            src="/icons/ojami-logo.svg"
            alt="ojami logo"
            w={{ base: "50px", md: "80px" }}
          />
          <Image
            pointerEvents="none"
            src="/assets/oja-kora.svg"
            alt="oja kora"
            w={{ base: "50px", md: "120px" }}
            transform="rotate(-15deg)"
          />
        </Flex>
        <FancyButton
          bg="/assets/buttons/small-flower.svg"
          w={{ base: "70px", md: "100px" }}
          h={{ base: "120px", md: "200px" }}
          onClick={!user ? onOpen : onCartOpen}
        >
          my cart
        </FancyButton>
        {user && <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />}
        <SignInModal isOpen={isOpen} onClose={onClose} />
      </Flex>
      {children}
      <Flex
        w="full"
        mt="6300px"
        bg="#FFF9E5"
        pt="14"
        pos="absolute"
        direction="column"
        // justify="center"
        align="center"
        zIndex={1}
      >
        <Image
          pointerEvents="none"
          src="/assets/star.svg"
          alt="star"
          pos="absolute"
          w={{ base: "150px", md: "300px" }}
          right={-14}
          top={-14}
          animation={`${rotateAnimation} 40s linear infinite`}
        />
        <Image
          pointerEvents="none"
          src="/icons/oja-foot.png"
          w={{ base: "250px", md: "500px" }}

          alt="footer"
        />
        <Image
          pointerEvents="none"
          src="/assets/dividers/oja-orange.svg"
          w="full"
          mt={20}
          alt=""
        />
        <Flex bg="#EF8421" w="full" h="40px" zIndex={2} mt={-10} />
      </Flex>
    </Flex>
      </motion.div>
    </AnimatePresence>
  );
};
