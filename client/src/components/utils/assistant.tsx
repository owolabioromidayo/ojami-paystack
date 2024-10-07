import { Cart, CartItem } from "@/utils/types";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Text,
  Image,
  Icon,
  Flex,
  useToast,
  Stack,
  useDisclosure,
  Box,
  Input,
  VStack,
  Link,
} from "@chakra-ui/react";
import { Player } from "@lottiefiles/react-lottie-player";

import React, { useContext, useEffect, useState, useRef } from "react";
import { OjaContext } from "../provider";
import FancyButton from "../ui/fancy-button";
import { IoSparkles, IoTrashOutline } from "react-icons/io5";
import axios from "axios";
import { motion } from "framer-motion";
import LottieWrapper from "./lottie-wrapper";

interface OjaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  user: string;
  text: string;
}

export const OjaAssistant: React.FC<OjaAssistantProps> = ({
  isOpen,
  onClose,
}) => {
  const btnRef = React.useRef(null);
  const { user, products } = useContext(OjaContext);
  const toast = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [state, setState] = useState("start");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { user: user?.firstname!, text: inputValue };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_OJAMI}/api/ai/chat`,
          {
            conversation: [...messages, userMessage],
            metadata: { state },
          }
        );

        // Update state based on the response
        if (response.data.metadata.state) {
          setState(response.data.metadata.state);
        }
        const botResponse = response.data.text;
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "Oja AI", text: botResponse },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent
        borderLeft="2px solid #000"
        bgImg="/assets/oja-cart-bg.svg"
        bgSize="cover"
        bgPos="top"
        bgRepeat="no-repeat"
      >
        <DrawerCloseButton />
        <DrawerHeader>
            <Flex gap={2} align="center">
                <Icon as={IoSparkles} />
                <Text>Oja Assistant</Text>
            </Flex>
        </DrawerHeader>

        <DrawerBody>
          <Box pos="relative" h="full">
            {messages.length > 0 ? (
              <VStack
                p={4}
                spacing={4}
                align="stretch"
                border="2px solid #000"
                borderRadius="lg"
                bg="white"
                maxHeight="calc(100vh - 250px)"
                overflowY="auto"
              >
                <Stack spacing={2}>
                  {messages.map((msg, index) => (
                    <Box
                      bg={msg.user === user?.firstname! ? "orange.500" : "orange.100"}
                      key={index}
                      py={2}
                      px={4}
                      w="fit-content"
                      border="2px solid #000"
                      borderRadius={msg.user === user?.firstname! ? "20px 20px 0 20px" : "20px 20px 20px 0"}
                      alignSelf={msg.user === user?.firstname! ? "flex-end" : "flex-start"}
                    >
                      <Text
                        fontWeight="800"
                        color="orange.800"
                        borderRadius="lg"
                      >
                        {msg.user}
                      </Text>
                        <Text>
                          {msg.text.split(' ').map((word, index) => 
                            word.startsWith('https://') ? 
                              <Link key={index} href={word} isExternal color="blue.500" textDecoration="underline">
                                {word}
                              </Link> : 
                              word + ' '
                          )}
                        </Text>
                    </Box>
                  ))}
                  { isLoading && (
                        <Text fontSize="32">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                          >
                            •
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                          >
                            •
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut", delay: 0.4 }}
                          >
                            •
                          </motion.span>
                        </Text>
                  )}
                  <div ref={messagesEndRef} />
                </Stack>
              </VStack>
            ): (
              <LottieWrapper
                autoplay
                loop
                src="/assets/chat.json"
                style={{width: "300px", height: "500px"}}
              />
            )}
            <VStack pos="absolute" bottom="0" w="full">
                <Input
                  bg="white"
                  border="2px solid #000"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="What can we do for you today?"
                  size="lg"
                  py={8}
                  rounded="12px"
                  focusBorderColor="#EF8421"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      sendMessage();
                    }
                  }}
                  isDisabled={isLoading}
                />
                <FancyButton
                  bg="/assets/buttons/oja-cloud-orange.svg"
                  w="full"
                  h="80px"
                  onClick={sendMessage}
                  isDisabled={isLoading}
                >
                  {isLoading ? "Thinking..." : "Send"}
                </FancyButton>
            </VStack>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
