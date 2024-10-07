import { FC, useEffect, useState } from "react";
import type { ReactElement } from "react";
import {
  Box,
  Stack,
  Avatar,
  Text,
  Flex,
  Image,
  Icon,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
  useToast,
  Input,
} from "@chakra-ui/react";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";
import VendorLayout from "@/components/mobile/layout/VendorLayout";
import type { NextPageWithLayout } from "../_app";
import { IoStarSharp, IoExit, IoStorefrontOutline } from "react-icons/io5";
import { GrCircleInformation } from "react-icons/gr";
import { useOjaContext } from "@/components/provider";
import { useRouter } from "next/navigation";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiCoupon3Fill } from "react-icons/ri";
import axios from "axios";
import FancyButton from "@/components/ui/fancy-button";

const Store: NextPageWithLayout<{}> = () => {
  useViewportHeight();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen, onClose: onDrawerClose } = useDisclosure();
  const { user } = useOjaContext();
  const baseUrl = process.env.NEXT_PUBLIC_OJAMI;
  const [voucherCode, setVoucherCode] = useState<string>()
  const storeData = user?.storefronts;
  const [isSubmittingVoucher, setSubmittingVoucher] = useState(false)

  const [currentStoreIndex, setCurrentStoreIndex] = useState<number>(0);
  const [currentStoreData, setCurrentStoreData] = useState(
    () => storeData?.[currentStoreIndex]
  );

  const averageRating =
    currentStoreData?.ratings.length! > 0
      ? (
          currentStoreData?.ratings?.reduce(
            (acc: any, curr) => parseInt(acc) + Number(curr),
            0
          )! / currentStoreData?.ratings?.length!
        ).toFixed(1)
      : "0.0";

  useEffect(() => {
    const storedIndex = localStorage.getItem("currentStoreIndex");
    if (storedIndex) {
      const index = Number(storedIndex);
      setCurrentStoreIndex(index);
      setCurrentStoreData(storeData?.[index]);
    } else {
      setCurrentStoreData(storeData?.[0]);
    }
  }, [storeData]);

  useEffect(() => {
    localStorage.setItem(
      "currentStoreIndex",
      JSON.stringify(currentStoreIndex)
    );
    setCurrentStoreData(storeData?.[currentStoreIndex]);
  }, [currentStoreIndex, storeData]);

  const setStoreIndex = (index: number) => {
    setCurrentStoreIndex(index);
  };

  
  const handleRedeemVoucher = async() => {
    setSubmittingVoucher(true)
    try{
      const response = await axios.post(
        `${baseUrl}/api/payments/vouchers/redeem`,
        {voucherId: voucherCode},
        {withCredentials: true}
      );
      if(response.status === 200){
        toast({
          title: `Voucher Redeemed🤑🤑`,
          description:
            "You have successfully redeemed this voucher",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
          variant: "subtle",
        });
        setTimeout(() => {
          onDrawerClose()
        }, 2000)
      } else {
        toast({
          title: `Error`,
          description: "An error occurred while trying to redeem this voucher",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
          variant: "subtle",
        });
      }
    } catch(err: any) {
      console.log(err)
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
      setSubmittingVoucher(false)
    }
  }


  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/users/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast({
          title: `Goodbye ${user?.firstname}😔`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
          variant: "subtle",
        });
        setTimeout(() => {
          window.location.replace("/auth/signin");
        }, 2000);
      } else {
        toast({
          title: "Error",
          description:
            "An error occurred while logging you out, please try again after a while",
          status: "error",
          duration: 1000,
          isClosable: true,
          position: "top",
          variant: "subtle",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: `${error?.response?.data?.errors[0]?.message}`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });
    }
  };

  if (!storeData || storeData.length === 0) {
    return (
      <Flex
        height="calc(var(--vh, 1vh) * 100 - 60px)"
        pt={"1rem"}
        flexDir={"column"}
      >
        <Flex
          backgroundColor="#FFF4E6"
          p="1rem"
          border="2px solid #B80000"
          rounded="lg"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          gap={3}
          maxW="90%"
          mx="auto"
        >
          <Flex alignItems="center" gap={2}>
            <Icon as={GrCircleInformation} color="#B80000" boxSize={5} />
            <Text fontSize="sm" fontWeight="500">
              Storefront Required
            </Text>
          </Flex>
          <Text fontSize="xs" color="#333333">
            To access this page and manage your products, please register your
            business. This will enable you to upload and view your products
            effectively.
          </Text>
          <Button
            size="sm"
            backgroundColor="#000000"
            color="#ffffff"
            w="100%"
            maxW="200px"
            py="0.75rem"
            mt={2}
            _focus={{ backgroundColor: "#00000070" }}
            onClick={() => router.push("/vendor/register-business")}
          >
            Register Business
          </Button>
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Box
        height="calc(var(--vh, 1vh) * 100 - 60px)"
        w="100vw"
        overflowY={"auto"}
        px={"0.5rem"}
        pt={"0.5rem"}
      >
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={"1rem"}
        >
          <Flex alignItems={"center"}>
            <Popover isOpen={isOpen} onClose={onClose}>
              <PopoverTrigger>
                <Flex
                  onClick={onToggle}
                  alignItems="center"
                  gap={2}
                  border="1px solid #2BADE5"
                  p="0.5rem"
                  bg="white"
                  _hover={{ bg: "#F0F4F8", borderColor: "#2BADE5" }}
                  _active={{ bg: "#E2E8F0", borderColor: "#2BADE5" }}
                  transition="background-color 0.2s, border-color 0.2s"
                  cursor="pointer"
                  shadow={'md'}
                  w="full"
                  justifyContent="space-between"
                  rounded="full"
                >
                  <Icon as={IoStorefrontOutline} color="#2BADE5" boxSize={4} />
                  <Text
                    maxW="120px"
                    fontWeight="500"
                    isTruncated
                    fontSize="xs"
                    color="#333"
                  >
                    Current Store
                  </Text>
                  <Icon as={RiArrowDownSLine} color="#333" boxSize={4} />
                </Flex>
              </PopoverTrigger>
              <PopoverContent
                w="250px"
                mx="0.5rem"
                mt={2}
                border={"2px solid #000000"}
                backgroundColor="#FFFFFF"
              >
                <PopoverCloseButton />
                <PopoverHeader fontWeight={"semibold"} fontSize={"sm"}>
                  Select a Store
                </PopoverHeader>
                <PopoverBody>
                  <Stack>
                    {storeData?.map((store, index) => (
                      <Flex
                        key={index}
                        p={"0.3rem"}
                        gap={2}
                        alignItems={"center"}
                        border={"2px solid #000000"}
                        rounded={"10px"}
                        backgroundColor={"#FFF9E5"}
                        _active={{ bg: "#E2E8F0", borderColor: "#2BADE5" }}
                        onClick={() => {
                          setStoreIndex(index);
                          onClose();
                        }}
                      >
                        <Avatar
                          size={"sm"}
                          src={store.profileImageUrl}
                          border={"2px solid #000000"}
                          name={store.storename}
                        />
                        <Text fontSize={"xs"} fontWeight={"500"}>
                          {store.storename}
                        </Text>
                      </Flex>
                    ))}
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>

          <Popover>
            <PopoverTrigger>
              <Flex backgroundColor={"gray.200"} p={"0.3rem"} rounded={"full"}>
                <Avatar size={"xs"} src="/images/mobile/profile-avatar.svg" />
              </Flex>
            </PopoverTrigger>
            <PopoverContent
              maxW={"250px"}
              mx="0.5rem"
              _focus={{ outline: "none" }}
            >
              <PopoverBody>
                <Stack>
                  <Flex
                    onClick={handleLogout}
                    bg={"gray.100"}
                    rounded={"md"}
                    px={"1rem"}
                    py={"0.5rem"}
                    alignItems={"center"}
                    gap={2}
                  >
                    <Icon as={IoExit} boxSize={4} color={"red"} />
                    <Text fontWeight={"500"} fontSize={"sm"}>
                      Logout
                    </Text>
                  </Flex>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>

        <Stack
          border={"2px solid #000000"}
          rounded={"xl"}
          p={"1rem"}
          alignItems={"center"}
          lineHeight={"1"}
          backgroundColor={"#FFF9E5"}
          gap={2}
        >
          <Flex position={"relative"}>
            <Avatar
              src={currentStoreData?.profileImageUrl}
              size={"lg"}
              border={"2px solid #000000"}
            />
            <Flex position={"absolute"} left={"10"}>
              <Image
                src="/images/mobile/store-profile-image-tag.svg"
                alt="store-tag"
                height={"18px"}
                w={"19px"}
              />
            </Flex>
          </Flex>

          <Text fontWeight={"semibold"} fontSize={"xl"} textAlign={"center"}>
            {currentStoreData?.storename}
          </Text>
          <Flex alignItems={"center"} gap={1}>
            <Icon as={IoStarSharp} />
            <Text fontSize={"xs"} fontWeight={"500"}>
              {averageRating} ({currentStoreData?.ratings.length}k)
            </Text>
          </Flex>
          <Text fontSize={"xs"} textAlign={"center"}>
            {currentStoreData?.description}
          </Text>
        </Stack>

        <Box w={"full"}>
          <Button
            backgroundColor={"#000000"}
            rounded={"md"}
            mt={"1rem"}
            leftIcon={<RiCoupon3Fill color={"#EF8421"} size={16} />}
            w={"full"}
            fontSize={"xs"}
            fontWeight={"semibold"}
            color={"#ffffff"}
            onClick={onOpen}
          >
            Redeem Voucher
          </Button>

          <Drawer
            placement={"bottom"}
            onClose={onDrawerClose}
            isOpen={isDrawerOpen}
          >
            <DrawerOverlay />
            <DrawerContent
              height={"50%"}
              roundedTop={"xl"}
              backgroundColor={"#FFF4E6"}
            >
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                py={"0.3rem"}
                onClick={onDrawerClose}
              >
                <Box
                  w={"80px"}
                  bg={"gray.400"}
                  height={"5px"}
                  rounded={"full"}
                ></Box>
              </Flex>
              <DrawerHeader borderBottomWidth="1px" px={"0.8rem"} py={"0.5rem"}>
                <Flex alignItems={"center"} gap={1}>
                  <Icon as={RiCoupon3Fill} boxSize={5} color={"#EF8421"} />
                  <Text
                    fontSize={"sm"}
                    fontWeight={"semibold"}
                    color={"gray.800"}
                  >
                    Redeem Voucher
                  </Text>
                </Flex>
              </DrawerHeader>
              <DrawerBody px={"0.8rem"}>
                <Box>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Voucher Code
                  </Text>
                  <Input
                    size="sm"
                    type="text"
                    border={"2px solid #000000"}
                    rounded={"lg"}
                    height={"50px"}
                    background={"#ECECEC"}
                    _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
                    fontSize={"sm"}
                    focusBorderColor="#EF8421"
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                </Box>

                <Flex justifyContent={"center"}>
                  <FancyButton
                    bg="/assets/buttons/oja-sweet-purple.svg"
                    mt={"1.5rem"}
                    w={200}
                    h={62}
                    onClick={handleRedeemVoucher}
                    isLoading={isSubmittingVoucher}
                    isDisabled={isSubmittingVoucher}
                  >
                    <Text
                      maxW="150px"
                      whiteSpace="normal"
                      textAlign="center"
                      fontSize="sm"
                    >
                      Redeem Voucher
                    </Text>
                  </FancyButton>
                </Flex>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      </Box>
    );
  }
};

Store.getLayout = function getLayout(page: ReactElement) {
  return <VendorLayout>{page}</VendorLayout>;
};

export default Store;
