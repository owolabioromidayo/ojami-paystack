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
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import React, { useContext, useEffect, useState, useRef } from "react";
import { OjaContext } from "../provider";
import FancyButton from "../ui/fancy-button";
import { IoSparkles, IoTrashOutline } from "react-icons/io5";
import axios from "axios";
import { motion } from "framer-motion";
import LottieWrapper from "./lottie-wrapper";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface OjaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  user: string;
  text: string;
}

interface Recommendation {
  displayUrl: string;
  description: string;
  prices: string | number;
  name: string;
}

export const OjaAssistant: React.FC<OjaAssistantProps> = ({
  isOpen,
  onClose,
}) => {
  const btnRef = React.useRef(null);
  const { user, products } = useContext(OjaContext);
  const toast = useToast();
  const [metadata, setMetadata] = useState<any>({ state: "start", mode: "casual" });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [state, setState] = useState("start");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const phoneImages = [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  ];

  const laptopImages = [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  ];

  const accessoryImages = [
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608156639585-b3a7a6e98d05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  ];

  // Check if the item name contains any of the keywords
  const categories = [phoneImages, laptopImages, accessoryImages];


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
            metadata: metadata,
          }
        );

        // console.log(response.data.metadata.recommendations);
        setMetadata(response.data.metadata);

        // Update state based on the response
        if (response.data.metadata.state) {
          setState(response.data.metadata.state);
        }
        const botResponse = response.data.text;
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "Oja AI", text: botResponse },
        ]);

        // Parse and set recommendations
        if (response.data.metadata.recommendations) {
          const parsedRecommendations = response.data.metadata.recommendations.map(
            (rec: string) => JSON.parse(rec)
          );
          setRecommendations(parsedRecommendations);
        }
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
                  {isLoading && (
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
                {recommendations.length > 0 && (
                  <Carousel
                    autoPlay={false}
                    interval={5000}
                    renderArrowPrev={(onClickHandler, hasPrev, label) =>
                      hasPrev && (
                        <Button
                          onClick={onClickHandler}
                          title={label}
                          position="absolute"
                          left={0}
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={2}
                          bg="orange.500"
                          color="white"
                          _hover={{ bg: "orange.600" }}
                        >
                          <Icon as={ChevronLeftIcon} w={6} h={6} />
                        </Button>
                      )
                    }
                    renderArrowNext={(onClickHandler, hasNext, label) =>
                      hasNext && (
                        <Button
                          onClick={onClickHandler}
                          title={label}
                          position="absolute"
                          right={0}
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={2}
                          bg="orange.500"
                          color="white"
                          _hover={{ bg: "orange.600" }}
                        >
                          <Icon as={ChevronRightIcon} w={6} h={6} />
                        </Button>
                      )
                    }
                  >
                    {recommendations.map((rec, index) => {
                      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                      const imageUrl = randomCategory[Math.floor(Math.random() * randomCategory.length)];
                      return (
                        <div key={index}>
                          <Image src={imageUrl} alt={rec.name} />
                          <Text fontWeight="bold">{rec.name}</Text>
                          <Text>{rec.description}</Text>
                          <Text fontWeight="bold">Price: {rec.prices ? `₦${rec.prices}` : 'N/A'}</Text>
                        </div>
                      );
                    })}
                  </Carousel>
                )}
              </VStack>
            ) : (
              <LottieWrapper
                autoplay
                loop
                src="/assets/chat.json"
                style={{ width: "300px", height: "500px" }}
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
