"use client";

import {
  Box,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  keyframes,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import FancyButton from "../ui/fancy-button";
import { SignInModal } from "../utils/signin-modal";
import {
  IoCamera,
  IoFileTrayOutline,
  IoPerson,
  IoPersonOutline,
  IoSearch,
  IoSparkles,
  IoSparklesOutline,
  IoTicket,
  IoTicketOutline,
} from "react-icons/io5";
import { OjaContext } from "../provider";
import { useRouter } from "next/router";
import { CartDrawer } from "../utils/cart-drawer";
import { Loader } from "../utils/loader";
import { AnimatePresence, motion } from "framer-motion";
import { OjaAssistant } from "../utils/assistant";

interface MarketLayoutProps {
  children: React.ReactNode;
}

export const MarketLayout: React.FC<MarketLayoutProps> = ({ children }) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { isOpen: isMOpen, onToggle } = useDisclosure();
  const { isOpen: isAOpen, onToggle: onAToggle } = useDisclosure();
  const {
    onOpen: onCartOpen,
    isOpen: isCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const {
    isOpen: isChatOpen,
    onOpen: onChatOpen,
    onClose: onChatClose,
  } = useDisclosure();

  const { user, loading } = useContext(OjaContext);
  const router = useRouter();

  const tools = [
    {
      label: "AI Chat",
    },
    {
      label: "AI Search",
    },
    {
      label: "Explore",
    },
    {
      label: "AR Store",
    },
  ];

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
          gap={20}
          minH="100vh"
          align="center"
          bg="#FFF9E5"
          w="full"
        >
          <Flex
            w="full"
            justify="center"
            direction="row"
            px={{ lg: 10 }}
            zIndex={15}
            bg="#FFF9E5"
            h={{ base: "80px", lg: "135px" }}
            pos="fixed"
          >
            <Flex
              maxW="1650px"
              w="full"
              bg="#FFF9E5"
              justify="space-between"
              p={2}
              align="center"
              h={{ base: "80px", lg: "135px" }}
              zIndex={15}
              pos="fixed"
            >
              <Flex align="center">
                <Image
                  pointerEvents="none"
                  src="/icons/ojami-logo.svg"
                  alt="ojami logo"
                  w={{ base: "40px", lg: "80px" }}
                />
                <FancyButton
                  bg="/assets/buttons/oja-ellipse-orange.svg"
                  w={{ base: "82px", lg: "120px" }}
                  h={{ base: "120px", lg: "100px" }}
                  onClick={() => window.location.assign("/market")}
                  transform="rotate(-14deg)"
                >
                  home
                </FancyButton>
              </Flex>

              <Flex
                display={{ base: "none", lg: "flex" }}
                direction="column"
                h="full"
                align="center"
                mt={8}
                pos="relative"
              >
                <Flex align="center" gap={1}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" py={"34px"}>
                      <Icon as={IoSearch} />
                    </InputLeftElement>
                    <Input
                      w="460px"
                      border="2px solid #000"
                      rounded="12px"
                      py={8}
                      focusBorderColor="#EF8421"
                    />
                  </InputGroup>
                  <IconButton
                    // onClick={() => onToggle()}
                    colorScheme="orange"
                    _hover={{ bg: "orange.100" }}
                    variant="ghost"
                    icon={<IoCamera />}
                    fontSize={32}
                    aria-label="image search"
                    py={8}
                    px={6}
                  />
                  <IconButton
                    onClick={() => onChatOpen()}
                    _hover={{ bg: "orange.100" }}
                    colorScheme="orange"
                    variant="ghost"
                    icon={<IoSparkles />}
                    fontSize={30}
                    aria-label="shop assistant"
                    py={8}
                    px={6}
                  />
                </Flex>
                <Collapse in={isMOpen} animateOpacity>
                  <Box
                    w="630px"
                    zIndex={10}
                    pos="absolute"
                    left={0}
                    p="20px"
                    mt="4"
                    bg="white"
                    border="2px solid #000"
                    rounded="10px"
                  >
                    <Text color="black" mb={2} fontWeight={600}>
                      Quick Tools
                    </Text>
                    <Flex gap={2} align="center">
                      {tools.map((item) => (
                        <Box
                          key={item.label}
                          bg="orange"
                          w="115px"
                          h="80px"
                          rounded="12px"
                          border="2px solid #000"
                          alignContent="center"
                          textAlign="center"
                          fontWeight={600}
                          cursor="pointer"
                          transition="0.5s ease"
                          _hover={{ transform: "scale(1.05)" }}
                          _active={{ transform: "scale(0.95)" }}
                        >
                          {item.label}
                        </Box>
                      ))}
                    </Flex>

                    <Flex
                      align="center"
                      gap={2}
                      mt={10}
                      mb={2}
                      fontWeight={600}
                    >
                      <Icon as={IoSparklesOutline} />
                      <Text>Suggested searches</Text>
                    </Flex>
                    <Flex
                      align="center"
                      gap={2}
                      p={2}
                      _hover={{ bg: "#f0f0f0" }}
                      rounded="lg"
                      cursor="pointer"
                    >
                      <Icon
                        as={IoSearch}
                        fontSize={36}
                        p={2}
                        border="1px solid #e2e2e2"
                        rounded="4"
                      />
                      <Text>PlayStation 5 Pro</Text>
                    </Flex>
                  </Box>
                </Collapse>
              </Flex>

              <Flex gap={4} align="center">
                <FancyButton
                  display={{ base: "none", md: "flex" }}
                  bg="/assets/buttons/small-flower.svg"
                  w={{ base: "70px", lg: "100px" }}
                  h={{ base: "120px", lg: "100px" }}
                  onClick={!user ? onOpen : onCartOpen}
                >
                  my cart
                </FancyButton>
                <FancyButton
                  display={{ base: "none", md: "flex" }}
                  bg="/assets/buttons/oja-ellipse-orange.svg"
                  w={{ base: "82px", lg: "120px" }}
                  h={{ base: "120px", lg: "100px" }}
                  onClick={onAToggle}
                >
                  account
                </FancyButton>
                <Collapse in={isAOpen} animateOpacity>
                  <Box
                    w="400px"
                    zIndex={10}
                    pos="absolute"
                    right={0}
                    top={28}
                    p="20px"
                    mt="4"
                    bg="white"
                    border="2px solid #000"
                    rounded="10px"
                  >
                    <Box
                      w="full"
                      p={5}
                      h="170px"
                      bgImg="/assets/oja-wallet-bg.png"
                      alignContent="center"
                      bgRepeat="no-repeat"
                      bgSize="cover"
                      bgPos="bottom"
                      rounded="10px"
                      border="2px solid #000"
                    >
                      <Text fontWeight={600} fontSize={34}>
                        NGN {user?.virtualWallet?.balance?.toLocaleString()}
                      </Text>
                    </Box>
                    <Flex gap={2} mt={2} align="center" p={2}>
                      <Icon
                        as={IoPersonOutline}
                        fontSize={36}
                        p={2}
                        border="1px solid #e2e2e2"
                        rounded="4"
                      />
                      <Text fontWeight={600}>
                        Hello, {user?.firstname!} {user?.lastname!} 👋
                      </Text>
                    </Flex>

                    <Flex
                      align="center"
                      gap={2}
                      p={2}
                      _hover={{ bg: "#f0f0f0" }}
                      rounded="lg"
                      cursor="pointer"
                      onClick={() => router.push("/customer/collectibles")}
                    >
                      <Icon
                        as={IoTicketOutline}
                        fontSize={36}
                        p={2}
                        border="1px solid #e2e2e2"
                        rounded="4"
                      />
                      <Text fontWeight={500}>Collectibles</Text>
                    </Flex>
                    <Flex
                      align="center"
                      gap={2}
                      p={2}
                      _hover={{ bg: "#f0f0f0" }}
                      rounded="lg"
                      cursor="pointer"
                      onClick={() => router.push("/customer/my-orders")}
                    >
                      <Icon
                        as={IoFileTrayOutline}
                        fontSize={36}
                        p={2}
                        border="1px solid #e2e2e2"
                        rounded="4"
                      />
                      <Text fontWeight={500}>Orders</Text>
                    </Flex>
                  </Box>
                </Collapse>
                <IconButton
                display={{ base: "flex", lg: "none" }}
                  onClick={() => onChatOpen()}
                  _hover={{ bg: "orange.100" }}
                  colorScheme="orange"
                  variant="ghost"
                  icon={<IoSparkles />}
                  fontSize={30}
                  aria-label="shop assistant"
                  py={8}
                  px={6}
                />
              </Flex>

              {user && <CartDrawer isOpen={isCartOpen} onClose={onCartClose} />}

              <SignInModal isOpen={isOpen} onClose={onClose} />
            </Flex>
          </Flex>

          <Flex
            px={"2"}
            zIndex={15}
            pos="fixed"
            bottom={2}
            w="full"
            display={{ base: "flex", md: "none" }}
            align="center"
          >
            <Flex
              w="full"
              rounded="9px"
              bg="#FFF9E5"
              border="2px solid #000"
              justify="space-between"
              p={2}
              align="center"
              h={{ base: "80px", lg: "135px" }}
              gap={1}
            >
              <FancyButton
                bg="/assets/buttons/oja-sweet-orange.svg"
                w={{ base: "160px", lg: "100px" }}
                h={{ base: "150px", lg: "100px" }}
                onClick={!user ? onOpen : onCartOpen}
              >
                my cart
              </FancyButton>
              <Drawer>
                <DrawerTrigger asChild>
                  <FancyButton
                    bg="/assets/buttons/oja-sweet-orange.svg"
                    w={{ base: "160px", lg: "120px" }}
                    h={{ base: "120px", lg: "100px" }}
                  >
                    account
                  </FancyButton>
                </DrawerTrigger>
                <DrawerContent className="bg-white">
                  <div className="mx-auto w-full p-2">
                    <Box
                      w="full"
                      p="20px"
                      mt="4"
                      bg="white"
                      border="2px solid #000"
                      rounded="10px"
                    >
                      <Box
                        w="full"
                        p={5}
                        h="170px"
                        bgImg="/assets/oja-wallet-bg.png"
                        alignContent="center"
                        bgRepeat="no-repeat"
                        bgSize="cover"
                        bgPos="bottom"
                        rounded="10px"
                        border="2px solid #000"
                      >
                        <Text fontWeight={600} fontSize={34}>
                          NGN {user?.virtualWallet?.balance?.toLocaleString()}
                        </Text>
                      </Box>
                      <Flex gap={2} mt={2} align="center" p={2}>
                        <Icon
                          as={IoPersonOutline}
                          fontSize={36}
                          p={2}
                          border="1px solid #e2e2e2"
                          rounded="4"
                        />
                        <Text fontWeight={600}>
                          Hello, {user?.firstname!} {user?.lastname!} 👋
                        </Text>
                      </Flex>

                      <Flex
                        align="center"
                        gap={2}
                        p={2}
                        _hover={{ bg: "#f0f0f0" }}
                        rounded="lg"
                        cursor="pointer"
                        onClick={() => router.push("/customer/collectibles")}
                      >
                        <Icon
                          as={IoTicketOutline}
                          fontSize={36}
                          p={2}
                          border="1px solid #e2e2e2"
                          rounded="4"
                        />
                        <Text fontWeight={500}>Collectibles</Text>
                      </Flex>
                      <Flex
                        align="center"
                        gap={2}
                        p={2}
                        _hover={{ bg: "#f0f0f0" }}
                        rounded="lg"
                        cursor="pointer"
                        onClick={() => router.push("/customer/my-orders")}
                      >
                        <Icon
                          as={IoFileTrayOutline}
                          fontSize={36}
                          p={2}
                          border="1px solid #e2e2e2"
                          rounded="4"
                        />
                        <Text fontWeight={500}>Orders</Text>
                      </Flex>
                    </Box>
                  </div>
                </DrawerContent>
              </Drawer>
            </Flex>
          </Flex>

          <Flex
            px={4}
            mt={{ base: "100px", md: "180px" }}
            maxW="1650px"
            w="full"
            direction="column"
            pos="relative"
          >
            {children}
          </Flex>

          <Flex
            w="full"
            bg="#FFF9E5"
            pt="14"
            bottom={0}
            pos="relative"
            direction="column"
            // justify="center"
            align="center"
            zIndex={1}
          >
            <Image
              pointerEvents="none"
              src="/assets/star.svg"
              w={{ base: "150px", md: "300px" }}
              alt="star"
              pos="absolute"
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
              alt="footer"
            />
            <Flex bg="#EF8421" w="full" h="40px" zIndex={2} mt={-10} />
          </Flex>
        </Flex>
        <OjaAssistant isOpen={isChatOpen} onClose={onChatClose} />
      </motion.div>
    </AnimatePresence>
  );
};
