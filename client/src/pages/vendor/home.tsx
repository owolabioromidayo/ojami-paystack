import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import {
  Box,
  Stack,
  Flex,
  Text,
  Grid,
  GridItem,
  Heading,
  Avatar,
  Badge,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  Input, 
  InputGroup,
  InputLeftAddon,
  useToast,
} from "@chakra-ui/react";
import VendorLayout from "@/components/mobile/layout/VendorLayout";
import type { NextPageWithLayout } from "../_app";
import Image from "next/image";
import { useOjaContext } from "@/components/provider";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import FancyButton from "@/components/ui/fancy-button";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Product } from "@/utils/types";
import { Order } from "@/utils/types";
import axios from "axios";

export interface vendorOrders {
  products: Product[];
  orders: Order[];
}

const VendorHome: NextPageWithLayout<{}> = () => {
  const { user } = useOjaContext();
  const router = useRouter();
  const toast = useToast();
  const baseUrl = process.env.NEXT_PUBLIC_OJAMI
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentDate = format(new Date(), "MMMM yyyy");
  const [destination, setDestination] = useState({
    type: "",
    currency: "NGN",
    amount: 0,
    bank_account: {
      bank: "",
      account:"",
    },
    customer: {
      email: "",
    }
  })

  const [vendorOrders, setVendorOrders] = useState<vendorOrders>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const orders = vendorOrders?.orders?.map((order, index) => {
    const product = vendorOrders.products[index] || {};
    return {
      ...order,
      ...product,
    };
  });

  const quickLinks = [
    {
      image: "/images/mobile/vendorHome/create-link.svg",
      title: "Create Payment Link",
    },
    {
      image: "/images/mobile/vendorHome/qrcode.svg",
      title: "Generate QR Code",
    },
    {
      image: "/images/mobile/vendorHome/add-products.svg",
      title: "Add Products",
    },
    {
      image: "/images/mobile/vendorHome/discounts.svg",
      title: "Discounts",
    },
    {
      image: "/images/mobile/vendorHome/refunds.svg",
      title: "Refunds",
    },
    {
      image: "/images/mobile/vendorHome/request-payout.svg",
      title: "Request Payout",
    },
  ];

  const handlePayout = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/payments/payout`,
        {destination},
        {withCredentials: true}
      );
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: `Success`,
          description: "Your payout request was successful, you should receive your funds shortly.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
          variant: "subtle",
        });
        setTimeout(() => {
          onClose()
        }, 2000)
        window.location.reload()
      } else {
        toast({
          title: `Error`,
          description: "An error occurred while making this request, please wait a while before trying again.",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
          variant: "subtle",
        });
      }
    } catch (err: any) {
      console.log("error", err);
      toast({
        title: `Error`,
        description: `${err?.response?.data?.errors?.[0]?.message}`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const getVendorOrders = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/ecommerce/orders/vendor`,
          { withCredentials: true }
        );
        if(response.status === 200) {
          setVendorOrders(response.data)
        } else {
          console.error("Failed to fetch vendor orders");
        }
      } catch (err: any) {
        console.log("error", err);
      }
    };
    getVendorOrders()
  }, [user, baseUrl])

  return (
    <Box
      p={"0.2rem"}
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "scrollbar-width": "none",
        "-webkit-overflow-scrolling": "touch",
      }}
    >
      <Stack>
        <Box
          backgroundColor={"#EF8421"}
          w={"full"}
          border={"2px solid #000000"}
          rounded={"2xl"}
          pl={"1.5rem"}
        >
          <Flex justifyContent={"space-between"}>
            <Stack lineHeight={"1"}>
              <Text
                fontSize={"xl"}
                color={"#000000"}
                fontWeight={"500"}
                pt={"2rem"}
              >
                Welcome to ọjà mi,
              </Text>
              <Text fontSize={"xl"} color={"#000000"} fontWeight={"500"}>
                {user?.firstname}
              </Text>
            </Stack>
            <Image
              alt="gear"
              src={"/images/mobile/green-gear.svg"}
              width={100}
              height={100}
            />
          </Flex>

          <Flex flexDir={"column"} lineHeight={"1"} gap={2} pb={"1.5rem"}>
            <Text fontSize={"xs"} fontWeight={"semibold"}>
              Revenue • {currentDate}
            </Text>
            <Text fontWeight={"semibold"} fontSize={"sm"}>
              {user?.virtualWallet.currency}{" "}
              <span style={{ fontSize: "30px", fontWeight: "600" }}>
                {user?.virtualWallet.balance.toLocaleString()}
              </span>
            </Text>
          </Flex>
        </Box>

        {/* `Quick Links` */}
        <Box>
          <Grid
            templateColumns="repeat(3, 1fr)"
            rounded={"2xl"}
            border={"2px solid #000000"}
          >
            <GridItem w="100%" bg="#ffffff" rounded={"2xl"}>
              <Stack
                alignItems={"center"}
                alignContent={"center"}
                justifyItems={"center"}
                justifyContent={"center"}
                p={"0.5rem"}
                border="1px solid #000000"
                borderTop={"0px"}
                borderLeft={"0px"}
                h={"full"}
              >
                <Image
                  src={quickLinks[0].image}
                  width={36}
                  height={50}
                  alt={quickLinks[0].title}
                  style={{ objectPosition: "center" }}
                />
                <Text
                  fontSize={"2xs"}
                  fontWeight={"semibold"}
                  textAlign={"center"}
                >
                  {quickLinks[0].title}
                </Text>
              </Stack>
            </GridItem>
            <GridItem w="100%" bg="#ffffff">
              <Stack
                alignItems={"center"}
                alignContent={"center"}
                justifyItems={"center"}
                justifyContent={"center"}
                p={"0.5rem"}
                border="1px solid #000000"
                borderTop={"0px"}
                h={"full"}
              >
                <Image
                  src={quickLinks[1].image}
                  width={36}
                  height={50}
                  alt={quickLinks[1].title}
                  style={{ objectPosition: "center" }}
                />
                <Text
                  fontSize={"2xs"}
                  fontWeight={"semibold"}
                  textAlign={"center"}
                >
                  {quickLinks[1].title}
                </Text>
              </Stack>
            </GridItem>
            <GridItem w="100%" bg="#ffffff" rounded={"2xl"}>
              <Stack
                alignItems={"center"}
                alignContent={"center"}
                justifyItems={"center"}
                justifyContent={"center"}
                p={"0.5rem"}
                border="1px solid #000000"
                borderTop={"0px"}
                borderRight={"0px"}
                h={"full"}
                onClick={() => router.push("/vendor/add-product")}
              >
                <Image
                  src={quickLinks[2].image}
                  width={36}
                  height={50}
                  alt={quickLinks[2].title}
                  style={{ objectPosition: "center" }}
                />
                <Text
                  fontSize={"2xs"}
                  fontWeight={"semibold"}
                  textAlign={"center"}
                >
                  {quickLinks[2].title}
                </Text>
              </Stack>
            </GridItem>
            <GridItem w="100%" bg="#ffffff" rounded={"2xl"}>
              <Stack
                alignItems={"center"}
                alignContent={"center"}
                justifyItems={"center"}
                justifyContent={"center"}
                p={"0.5rem"}
                border="1px solid #000000"
                borderBottom={"0px"}
                borderLeft={"0px"}
                h={"full"}
              >
                <Image
                  src={quickLinks[3].image}
                  width={36}
                  height={50}
                  alt={quickLinks[3].title}
                  style={{ objectPosition: "center" }}
                />
                <Text
                  fontSize={"2xs"}
                  fontWeight={"semibold"}
                  textAlign={"center"}
                >
                  {quickLinks[3].title}
                </Text>
              </Stack>
            </GridItem>
            <GridItem w="100%" bg="#ffffff">
              <Stack
                alignItems={"center"}
                alignContent={"center"}
                justifyItems={"center"}
                justifyContent={"center"}
                p={"0.5rem"}
                border="1px solid #000000"
                borderBottom={"0px"}
                h={"full"}
              >
                <Image
                  src={quickLinks[4].image}
                  width={36}
                  height={50}
                  alt={quickLinks[4].title}
                  style={{ objectPosition: "center" }}
                />
                <Text
                  fontSize={"2xs"}
                  fontWeight={"semibold"}
                  textAlign={"center"}
                >
                  {quickLinks[4].title}
                </Text>
              </Stack>
            </GridItem>
            <GridItem
              w="100%"
              bg="#ffffff"
              borderBottom={"0px"}
              rounded={"2xl"}
              onClick={onOpen}
            >
              <Stack
                alignItems={"center"}
                alignContent={"center"}
                justifyItems={"center"}
                justifyContent={"center"}
                p={"0.5rem"}
                border="1px solid #000000"
                borderBottom={"0px"}
                borderRight={"0px"}
                h={"full"}
              >
                <Image
                  src={quickLinks[5].image}
                  width={36}
                  height={50}
                  alt={quickLinks[5].title}
                  style={{ objectPosition: "center" }}
                />
                <Text
                  fontSize={"2xs"}
                  fontWeight={"semibold"}
                  textAlign={"center"}
                >
                  {quickLinks[5].title}
                </Text>
              </Stack>
            </GridItem>
          </Grid>
        </Box>

        {/* Order history */}
        <Box mt={"1rem"} px={"0.5rem"}>
          <Heading as={"h2"} fontSize={"xs"} fontWeight={"semibold"}>
            Order History
          </Heading>

          <Stack mt={"1rem"}>
            {orders?.map((item, index) => (
              <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                key={index}
                bg={'gray.200'}
                p={'0.5rem'}
                rounded={'lg'}
                border={'2px solid #000000'}
              >
                <Flex gap={2} alignItems={'center'}>
                  <Avatar
                    src={item.images[0]}
                    border={"2px solid #000000"}
                    name={item.name}
                    size={'sm'}
                  />
                  <Stack gap={0}>
                    <Flex gap={2} alignItems={"center"}>
                      <Text
                        fontWeight={"bold"}
                        fontSize={"xs"}
                        maxW={"100px"}
                        isTruncated
                      >
                        {item.storefront.storename}
                      </Text>
                      <Badge
                        fontSize={"3xs"}
                        py={"0.1rem"}
                        px={"0.3rem"}
                        rounded={"2xl"}
                        border={"2px solid #000000"}
                        h={"fit-content"}
                        backgroundColor={
                          item.status == "completed"
                            ? "#00E440"
                            : item.status == "failed"
                              ? "#FF0000"
                              : item.status ==
                                  "processing"
                                ? "#5B99C2"
                                : item.status ==
                                    "pending"
                                  ? "#FFC100"
                                  : "#000000"
                        }
                        textTransform={"none"}
                      >
                        {item.status}
                      </Badge>
                    </Flex>
                    <Stack gap={0} lineHeight={"1"} mt={"0.2rem"}>
                      <Text fontSize={"2xs"} isTruncated maxW={"130px"}>
                        {item.count}x {item.name}
                      </Text>
                    </Stack>
                  </Stack>
                </Flex>

                <Text
                  color={
                    item.status == "failed"
                      ? "#FF0000"
                      : "#299517"
                  }
                  fontWeight={"semibold"}
                  fontSize={"xs"}
                >
                  {item.status == "failed"
                    ? `- NGN${item.price.toLocaleString()}`
                    : `+ NGN${item.price.toLocaleString()}`}
                </Text>
              </Flex>
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* Request Payout Drawer */}
      <Drawer
        placement={"bottom"}
        onClose={onClose}
        isOpen={isOpen}
        isFullHeight
      >
        <DrawerOverlay />
        <DrawerContent roundedTop={"xl"}>
          <DrawerBody px={"0.8rem"}>
          <Flex py={"0.5rem"} onClick={onClose}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              rounded={"full"}
              backgroundColor={"gray.200"}
              p={"0.3rem"}
            >
              <Icon as={MdOutlineKeyboardArrowLeft} boxSize={4} />
            </Box>
          </Flex>
            <Flex alignItems={"center"} gap={1} flexDir={"column"} mb={'1rem'}>
              <Text fontSize={"xl"} fontWeight={"normal"}>
                Payout from your wallet to your bank
              </Text>
              <Text fontSize={"xs"} fontWeight={"normal"} color={'gray.600'}>
                A payout is the transfer of funds from your virtual wallet to
                your bank account
              </Text>
            </Flex>
            <Stack>
              <Box mt={"0.5rem"}>
                <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                  Destination Account Type
                </Text>
                <Menu matchWidth>
                  <MenuButton
                    as={Flex}
                    alignItems={"center"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    _placeholder={{ color: "#B9B9B9" }}
                    rounded={"lg"}
                    fontSize={"sm"}
                    border={"2px solid #000000"}
                    w={"full"}
                    textAlign={"start"}
                    px={"0.8rem"}
                    _active={{ borderColor: "#2BADE5" }}
                  >
                    {!destination.type
                      ? "Select destination account type"
                      : destination.type}
                  </MenuButton>

                  <MenuList minWidth="240px">
                    <MenuOptionGroup
                      defaultValue="asc"
                      title="Destination Type"
                      type="radio"
                      value={destination.type}
                      onChange={(value: any) => {
                        setDestination((prevData) => ({
                          ...prevData,
                          type: value,
                        }));
                      }}
                    >
                      <MenuItemOption value="bank_account">
                        Bank Account
                      </MenuItemOption>
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
              </Box>

              <Box mt={"0.5rem"}>
                <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                  Amount
                </Text>
                <InputGroup rounded={"lg"} height={"50px"}>
                  <InputLeftAddon
                    background={"#FBFBFB"}
                    height={"50px"}
                    border={"2px solid #000000"}
                    borderRightWidth={"0px"}
                  >
                    ₦
                  </InputLeftAddon>
                  <Input
                    type={"number"}
                    size="sm"
                    height={"50px"}
                    borderLeftWidth="0px"
                    border={"2px solid #000000"}
                    borderRightRadius="lg"
                    placeholder="Enter amount"
                    fontSize={"sm"}
                    background={"#FBFBFB"}
                    focusBorderColor="#2BADE5"
                    _focus={{
                      backgroundColor: "#ffffff",
                      borderWidth: "1px",
                    }}
                    _placeholder={{ color: "#B9B9B9" }}
                    onChange={(e) =>
                      setDestination((prevData) => ({
                        ...prevData,
                        amount: Number(e.target.value),
                      }))
                    }
                  />
                </InputGroup>
              </Box>

              <Box mt={"0.5rem"}>
                <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                  Bank Name
                </Text>
                <Input
                  type={"text"}
                  size="sm"
                  placeholder="Access Bank"
                  fontSize={"sm"}
                  border={"2px solid #000000"}
                  rounded={"lg"}
                  height={"50px"}
                  background={"#FBFBFB"}
                  focusBorderColor="#2BADE5"
                  _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
                  _placeholder={{ color: "#B9B9B9" }}
                  onChange={(e) =>
                    setDestination((prevDestination) => ({
                      ...prevDestination,
                      bank_account: {
                        ...prevDestination.bank_account,
                        bank: e.target.value,
                      },
                    }))
                  }
                />
              </Box>

              <Box mt={"0.5rem"}>
                <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                  Recipient account number
                </Text>
                <Input
                  type="string"
                  size="sm"
                  placeholder="2112288337"
                  fontSize={"sm"}
                  border={"2px solid #000000"}
                  rounded={"lg"}
                  height={"50px"}
                  background={"#FBFBFB"}
                  focusBorderColor="#2BADE5"
                  _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
                  _placeholder={{ color: "#B9B9B9" }}
                  onChange={(e) =>
                    setDestination((prevDestination) => ({
                      ...prevDestination,
                      bank_account: {
                        ...prevDestination.bank_account,
                        account: e.target.value,
                      },
                    }))
                  }
                />
              </Box>

              <Box mt={"0.5rem"}>
                <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                  Email Address
                </Text>
                <Input
                  type={"email"}
                  size="sm"
                  placeholder="example@gmail.com"
                  fontSize={"sm"}
                  border={"2px solid #000000"}
                  rounded={"lg"}
                  height={"50px"}
                  background={"#FBFBFB"}
                  focusBorderColor="#2BADE5"
                  _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
                  _placeholder={{ color: "#B9B9B9" }}
                  onChange={(e) =>
                    setDestination((prevDestination) => ({
                      ...prevDestination,
                      customer: {
                        ...prevDestination.customer,
                        email: e.target.value,
                      },
                    }))
                  }
                />
              </Box>
            </Stack>

            <Flex justifyContent={"center"}>
              <FancyButton
                bg="/assets/buttons/oja-sweet-purple.svg"
                mt={"1.5rem"}
                w={200}
                h={62}
                onClick={handlePayout}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                <Text
                  maxW="150px"
                  whiteSpace="normal"
                  textAlign="center"
                  fontSize="sm"
                >
                  Request Payout
                </Text>
              </FancyButton>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

VendorHome.getLayout = function getLayout(page: ReactElement) {
  return <VendorLayout>{page}</VendorLayout>;
};

export default VendorHome;
