// @ts-nocheck

import { OjaContext } from "@/components/provider";
import FancyButton from "@/components/ui/fancy-button";
import { Order, Product } from "@/utils/types";
import {
  Flex,
  Text,
  Image,
  Stack,
  Divider,
  Input,
  Button,
  Icon,
  useDisclosure,
  Box,
  Collapse,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import {
  IoFileTrayOutline,
  IoInformationCircleOutline,
  IoPersonOutline,
  IoTicketOutline,
  IoTrashOutline,
} from "react-icons/io5";
import Script from "next/script";

const Checkout = () => {
  const [orders, setOrders] = useState<Array<Order> | null>(null);
  const [products, setProducts] = useState<Array<Product> | null>(null);
  const { user } = useContext(OjaContext);
  const toast = useToast();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchOrders = async () => {
    const url = `${process.env.NEXT_PUBLIC_OJAMI}/api/ecommerce/orders/me`;

    try {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const storeData = await response.json(); // Parse the JSON from the response
      setOrders(storeData.orders); // Update the products state with fetched data
      setProducts(storeData.products);
    } catch (error: any) {
      setError(error.message); // Update error state if there's an error
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  useEffect(() => {
    if (!orders) {
      fetchOrders();
    }
  }, [orders]);

  const calculateTotalPrice = (
    products: Product[] | null,
    orders: Order[] | null
  ) => {
    if (!products || products.length === 0 || !orders || orders.length === 0)
      return 0;
    return orders.reduce((total, order) => {
      const product = products.find((p) => p.id === order.product);
      if (!product) return total;
      return total + product.price * order.count;
    }, 0);
  };

  // Calculate the total price
  const totalPrice = calculateTotalPrice(products, orders);

  const { isOpen: isAOpen, onToggle: onAToggle } = useDisclosure();

  const handleSendMoney = async () => {
    for (const order of orders!) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_OJAMI}/api/payments/make_virtual_payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            receivingUserId: order.toUser,
            orderId: order.id,
            isInstantPurchase: false,
            amount:
              products?.find((p) => p.id === order.product)?.price! *
                order.count +
              2500 +
              products?.find((p) => p.id === order.product)?.price! * 0.05,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Payment Error",
          description: `Failed to process payment for order ${order.id}: ${data.errors[0].message}`,
          status: "error",
          duration: 5000,
          position: "top",
          containerStyle: { border: "2px solid #000", rounded: "10px" },
        });
      } else {
        toast({
          title: "Payment Successful",
          description: `Payment for order ${order.id} processed successfully`,
          status: "success",
          duration: 5000,
          position: "top",
          containerStyle: { border: "2px solid #000", rounded: "10px" },
        });
      }
    }
    // Redirect after all payments are processed
    setTimeout(() => {
      window.location.assign("/market");
    }, 3000);
  };

  const [koraData, setKoraData] = useState<any>(null);

  const completeOrder = async () => {
    for (const order of orders!) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_OJAMI}/api/payments/pay_in/success`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            orderId: order.id,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Payment Error",
          description: `Failed to process payment for order ${order.id}: ${data.errors[0].message}`,
          status: "error",
          duration: 5000,
          position: "top",
          containerStyle: { border: "2px solid #000", rounded: "10px" },
        });
      } else {
        toast({
          title: "Payment Successful",
          description: `Payment for order ${order.id} processed successfully`,
          status: "success",
          duration: 5000,
          position: "top",
          containerStyle: { border: "2px solid #000", rounded: "10px" },
        });
      }
    }
    setTimeout(() => {
      window.location.assign("/market");
    }, 700);
  };

  const handlePayWithKora = async () => {
    let data = null;
    let promise: Response | null = null;
    for (const order of orders!) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_OJAMI}/api/payments/pay_in/checkout_standard`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currency: "NGN",
            orderId: order.id,
            amount:
              products?.find((p) => p.id === order.product)?.price! *
                order.count +
              2500 +
              products?.find((p) => p.id === order.product)?.price! * 0.05,
          }),
        }
      );
      promise = response;
      data = await response.json();
    }
    setKoraData(data.data);

    if (!promise) {
      toast({
        title: "Checkout Error",
        description: `Failed to initiate payment`,
        status: "error",
        duration: 5000,
        position: "top",
        containerStyle: { border: "2px solid #000", rounded: "10px" },
      });
    } else {
      toast({
        title: "Checkout Initiated",
        description: `Payment with Kora`,
        status: "info",
        duration: 5000,
        position: "top",
        containerStyle: { border: "2px solid #000", rounded: "10px" },
      });
      setTimeout(() => {
        window.Korapay.initialize({
          key: process.env.NEXT_PUBLIC_PUB!,
          reference: data.data.reference,
          narration: "Payment for product on Ojami Marketplace",
          amount: data.data.amount,
          currency: "NGN",
          customer: {
            name: user?.firstname + " " + user?.lastname,
            email: user?.email,
          },
          onSuccess: () => completeOrder(),
          notification_url: `${process.env.NEXT_PUBLIC_OJAMI}/api/payments/korapay_webhook`,
        });
      }, 700);
    }
    // Redirect after all payments are processed
    // window.location.assign("/market");
  };

  return (
    <Flex direction="column"h="100vh" align="center">
      <Flex
        borderBottom="2px solid #000"
        w="full"
        bg="#FFF9E5"
        align="center"
        justify="center"
        px={2}
        h={{ base: "80px", lg: "100px" }}
        zIndex={15}
        pos="fixed"
      >
        <Flex align="center" maxW="1650px" w="full">
          <Flex align="center">
            <Image
              pointerEvents="none"
              src="/icons/ojami-logo.svg"
              alt="ojami logo"
              w={{ base: "40px", lg: "60px" }}
            />
            <FancyButton
              bg="/assets/buttons/oja-ellipse-orange.svg"
              w={{ base: "82px", lg: "100px" }}
              h={{ base: "120px", lg: "100px" }}
              onClick={() => window.location.assign("/market")}
              transform="rotate(-14deg)"
            >
              home
            </FancyButton>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        mt="100px"
        h="full"
        overflow="auto"
        w="full"
        direction={{ base: "column", md: "row" }}
        maxW="1650px"
        justify="space-between"
      >
        <Flex
          borderRight="2px solid #000"
          w="full"
          h={{ base: "full", md: "full" }}
          py={6}
          pl={{ base: 6, lg: 0 }}
          pr={6}
        >
          <Stack w="full">
            <Text fontSize="22px" fontWeight="600">
              Your details
            </Text>
            <Text fontWeight="500">{user?.email}</Text>
            <Divider borderColor="#000" my={5} />
            <Text fontSize="22px" fontWeight="600">
              Shipping address
            </Text>
            <Input
              value="Nigeria"
              py={6}
              border="1px solid #000"
              fontWeight="500"
              borderRadius="9px"
              pointerEvents="none"
              autoComplete="off"
              name="country"
              aria-autocomplete="none"
              data-form-type="other"
            />
            <Flex w="full" justify="space-between" gap={4} my={4}>
              <Input
                placeholder="First name"
                py={6}
                border="1px solid #000"
                fontWeight="500"
                borderRadius="9px"
              />
              <Input
                placeholder="Last name"
                py={6}
                border="1px solid #000"
                fontWeight="500"
                borderRadius="9px"
              />
            </Flex>
            <Input
              mb={4}
              placeholder="Address"
              py={6}
              border="1px solid #000"
              fontWeight="500"
              borderRadius="9px"
            />
            <Input
              placeholder="Apartment, suite, etc."
              py={6}
              border="1px solid #000"
              fontWeight="500"
              borderRadius="9px"
            />
            <Flex w="full" justify="space-between" gap={4} my={4}>
              <Input
                placeholder="City"
                py={6}
                border="1px solid #000"
                fontWeight="500"
                borderRadius="9px"
              />
              <Input
                placeholder="State"
                py={6}
                border="1px solid #000"
                fontWeight="500"
                borderRadius="9px"
              />
              <Input
                placeholder="Zip code"
                type="number"
                py={6}
                border="1px solid #000"
                fontWeight="500"
                borderRadius="9px"
              />
            </Flex>

            <Flex
              w="full"
              h="70px"
              bg="green.100"
              border="2px solid #000"
              rounded="10px"
              px={3}
              gap={2}
              align="center"
            >
              <Icon as={IoInformationCircleOutline} fontSize="24px" />
              <Stack spacing={0}>
                <Text fontSize={{ base: "12px", md: "16px" }} fontWeight="600">
                  Delivery includes a PIN confirmation
                </Text>
                <Text fontSize={{ base: "10px", md: "14px" }} fontWeight="400">
                  This helps ensure that your order is given to the right person
                </Text>
              </Stack>
            </Flex>

            {/** Shipping Method */}
            <Text mt={2} fontSize="22px" fontWeight="600">
              Payment method
            </Text>
            <Text fontWeight="500">
              All transactions are secure and encrypted
            </Text>

            <Flex w="full" gap={4} my={4}>
              <FancyButton
                w="180px"
                bg="/assets/buttons/oja-sweet-orange.svg"
                h="80px"
                onClick={onAToggle}
                fontSize={{ base: "12px", md: "16px" }}
              >
                Pay with Oja Wallet
              </FancyButton>
              <FancyButton
                w="180px"
                bg="/assets/buttons/oja-sweet-purple.svg"
                h="80px"
                onClick={handlePayWithKora}
                fontSize={{ base: "12px", md: "16px" }}
              >
                Pay with Kora
              </FancyButton>
            </Flex>
            <Collapse in={isAOpen} animateOpacity>
              <Box
                w={{ md: "400px" }}
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
                <Text mt={5} fontSize={18} fontWeight={500}>
                  Pay ₦
                  {(totalPrice + 2500 + totalPrice * 0.05).toLocaleString()}{" "}
                  from your wallet
                </Text>
                <Flex mt={5} gap={4} w="full" justify="space-between">
                  <Button
                    w="full"
                    bg="#000"
                    color="#fff"
                    _hover={{ bg: "orange.500" }}
                    _active={{ transform: "scale(0.95)" }}
                    transition="all 0.3s ease"
                    onClick={handleSendMoney}
                  >
                    Send Money
                  </Button>
                  <Button
                    w="full"
                    bg="#fff"
                    color="#000"
                    _hover={{ bg: "#f0f0f0" }}
                    _active={{ transform: "scale(0.95)" }}
                    onClick={onAToggle}
                  >
                    Cancel
                  </Button>
                </Flex>
              </Box>
            </Collapse>
          </Stack>
        </Flex>

        <Flex
          w="full"
          h="full"
          pos={{ lg: "sticky" }}
          top="0"
          p={6}
          direction="column"
        >
          <Stack
            h={{ lg: "60%" }}
            overflowY="auto"
            sx={{
              "&::-webkit-scrollbar": {
                width: "0", // Set the initial width to 0
                height: "0px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#FFDDA6",
                borderRadius: "12px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#F4B95F",
              },
              "&::-webkit-scrollbar-track": {
                background: "#FFF5E6",
              },
              "&:hover::-webkit-scrollbar": {
                width: "0px",
                height: "0px",
              },
            }}
          >
            {orders &&
              products?.map((item, index) => (
                <Flex
                  direction="column"
                  gap={3}
                  borderBottom="2px solid #000"
                  py={3}
                  px={1}
                  key={item.id}
                >
                  <Flex
                    gap={3}
                    w="full"
                    alignItems="center"
                    justify="space-between"
                  >
                    <Flex
                      cursor="pointer"
                      gap={3}
                      w="full"
                      py={3}
                      px={1}
                      key={item.id}
                      alignItems="center"
                      justify="space-between"
                    >
                      <Flex gap={2} align="center" pos="relative">
                        <Image
                          border="2px solid #000"
                          rounded="md"
                          src={item?.images[0]}
                          w="80px"
                          h="80px"
                          objectFit="cover"
                          alt={item.name}
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
                          {orders[index].count}
                        </Flex>
                        <Stack>
                          <Flex align="center" gap={2}>
                            <Image
                              src={item.storefront?.profileImageUrl!}
                              w="30px"
                              h="30px"
                              alt={item.storefront?.storename}
                              rounded="10px"
                            />
                            <Text fontSize={15} fontWeight={500}>
                              {item.storefront?.storename}
                            </Text>
                          </Flex>
                          <Text fontSize={20} fontWeight={500} w="400px">
                            {item.name}
                          </Text>
                        </Stack>
                      </Flex>
                      <Text fontSize={20} fontWeight={500}>
                        ₦{item.price?.toLocaleString()}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
          </Stack>
          <Flex w="full" justify="space-between" align="center" mt={6}>
            <Text fontSize={15} fontWeight={500}>
              Delivery
            </Text>
            <Text fontSize={15} fontWeight={500}>
              ₦2,500
            </Text>
          </Flex>
          <Flex w="full" justify="space-between" align="center" mt={6}>
            <Text fontSize={15} fontWeight={500}>
              Service Fee
            </Text>
            <Text fontSize={15} fontWeight={500}>
              ₦{(totalPrice * 0.05).toLocaleString()}
            </Text>
          </Flex>
          <Flex w="full" justify="space-between" align="center" mt={6}>
            <Text fontSize={22} fontWeight={500}>
              Total
            </Text>
            <Text fontSize={22} fontWeight={500}>
              ₦{(totalPrice + 2500 + totalPrice * 0.05).toLocaleString()}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Script src="https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js" />
    </Flex>
  );
};

export default Checkout;
