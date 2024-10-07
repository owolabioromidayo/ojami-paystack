import { generateRandomDate } from "@/utils/stochastic";
import { Order, Product, TransactionStatus } from "@/utils/types";
import {
  ModalCloseButton,
  Box,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  ModalBody,
  Stack,
  Image,
  Flex,
  ModalFooter,
  Progress,
  Button,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogFooter
} from "@chakra-ui/react";
import FancyButton from "../ui/fancy-button";
import { useRef } from "react";
import React from "react";

interface TrackOrderProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  product: Product;
}

export const TrackOrder = ({ isOpen, onClose, order, product }: TrackOrderProps) => {
    const toast = useToast()
    const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)
    const cancelOrder = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_OJAMI}/api/ecommerce/orders/${order.id}/cancel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        })
        if (response.ok) {
            toast({
                title: "Order Cancelled",
                description: "Your order has been cancelled",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
                containerStyle: {
                    border: "2px solid #000",
                    rounded: "10px"
                }
            })
        }else {
            toast({
                title: "Error",
                description: "Failed to cancel order",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
                containerStyle: {
                    border: "2px solid #000",
                    rounded: "10px"
                }
            })
        }
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Track your Order</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack border="2px solid" p={3} rounded="md">
          <Flex mb={-1} align="center" justify="space-between">
            <Text fontSize={20} fontWeight={500}>Order Status</Text>
            <Text fontSize={20} fontWeight={500} color={order?.status === "pending" ? "yellow.500" : order?.status === "processing" ? "orange.500" : order?.status === "completed" ? "green.500" : "red.500"}>{order?.status}</Text>
          </Flex>
          {order?.status !== TransactionStatus.CANCELLED && (
            <>
          <Progress  size='md' colorScheme="orange" rounded="full" border="2px solid #000" isIndeterminate />
          <Text fontSize={15} fontWeight={500} mt={2}>Estimated Delivery Time: {generateRandomDate().description}</Text>

          <Text mt={3} p={3} bg="orange.100" rounded="md" border="2px dashed" >The store is handling the delivery, so you'll give the delivery agent the tracking number when they arrive.</Text>
            </>
          )}
          </Stack>
          <Stack mt={10}>
            <Text fontSize={20} fontWeight={500}>Your Order</Text>
            {order &&
          order?.product && (
            <Flex
              direction="column"
              gap={3}
              py={3}
              px={1}
              w="full"
            >
              <Flex
                gap={3}
                w="full"
                alignItems="center"
                justify="space-between"
              >
                <Flex
                  direction={{ base: "column", md: "row" }}
                  cursor="pointer"
                  gap={3}
                  w="full"
                  py={3}
                  px={1}
                  key={product?.id}
                  align={{ base: "start", md: "center"}} 
                  justify="space-between"
                >
                  <Flex gap={2} align={{ base: "start", md: "center"}} pos="relative">
                    <Image
                      border="2px solid #000"
                      rounded="md"
                      src={product?.images[0]}
                      w={{ base: "50px", md: "80px" }}
                      h={{ base: "50px", md: "80px" }}
                      objectFit="cover"
                      alt={product?.name}
                    />
                    <Flex
                      pos="absolute"
                      top="-2"
                      left="-2"
                      p={3}
                      w="20px"
                      h="20px"
                      bg="#000"
                      rounded="full"
                      align="center"
                      justify="center"
                      fontSize="20px"
                      fontWeight="600"
                      color="#fff"
                    >
                      {order?.count}
                    </Flex>
                    <Stack>
                      <Flex align="center" gap={2}>
                        <Image
                          src={product?.storefront?.profileImageUrl!}
                          w="30px"
                          h="30px"
                          alt={product?.storefront?.storename}
                          rounded="10px"
                        />
                        <Text fontSize={15} fontWeight={500}>
                          {product?.storefront?.storename}
                        </Text>
                      </Flex>
                      <Text fontSize={{ md: 20}} fontWeight={500} w="400px">
                        {product?.name}
                      </Text>
                    </Stack>
                  </Flex>
                  <Text fontSize={20} fontWeight={500}>
                    ₦{(product?.price * order?.count).toLocaleString()}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          )}
          </Stack>
        </ModalBody>
        <ModalFooter display={order?.status === TransactionStatus.CANCELLED ? "none" : "flex"}>
            <Button onClick={onCancelOpen}  border="2px solid #000" rounded="md" bg="#fff" color="#000" _hover={{ bg: "red.500", color: "#000"}}>Cancel Order</Button>
        </ModalFooter>
      </ModalContent>
      <AlertDialog
        isOpen={isCancelOpen}
        onClose={onCancelClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>Cancel Order</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to cancel this order? You will have to pay a fee of ₦1000 to cancel the order.</AlertDialogBody>
            <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onCancelClose}>Go back</Button>
                <Button colorScheme="red" onClick={cancelOrder} ml={3}>Yes, cancel order</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </Modal>
  );
};
