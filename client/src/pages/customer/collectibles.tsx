import { MarketLayout } from "@/components/market/layout";
import { OjaContext } from "@/components/provider";
import FancyButton from "@/components/ui/fancy-button";
import ConfettiExplosion, { ConfettiProps } from "@/components/utils/Confetti";
import { CreateVoucher } from "@/components/utils/create-voucher";
import { Product, Voucher } from "@/utils/types";
import {
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Wrap,
  WrapItem,
  Button,
  Stack,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import { useContext, useEffect, useState, useRef } from "react";

const Collectibles = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [vouchers, setVouchers] = useState<Array<Voucher> | null>(null);
  const [redeem, setRedeem] = useState<Voucher | null>(null);
  const {
    isOpen: isOpenReveal,
    onOpen: onOpenReveal,
    onClose: onCloseReveal,
  } = useDisclosure();
  const cancelRef = useRef(null);
  const { activeStep, setActiveStep } = useSteps({
    index: 2,
    count: 2,
  });

  const { user } = useContext(OjaContext);
  const toast = useToast();
  const [pop, setPop] = useState(false);
  const mediumProps: ConfettiProps = {
    force: 0.8,
    duration: 3500,
    particleCount: 400,
    width: 1800,
    colors: ["#041E43", "#1471BF", "#5BB4DC", "#FC027B", "#66D805"],
  };
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchvouchers = async () => {
    const url = `${process.env.NEXT_PUBLIC_OJAMI}/api/payments/vouchers/me`;

    try {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const voucherData = await response.json(); // Parse the JSON from the response
      setVouchers(voucherData.vouchers); // Update the products state with fetched data
      console.log(voucherData);
    } catch (error: any) {
      setError(error.message); // Update error state if there's an error
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  useEffect(() => {
    if (!vouchers) {
      fetchvouchers();
    }
  }, [vouchers]);
  useEffect(() => {
    if(pop) {
      setTimeout(() => {
        setPop(false);
      }, 3000);
    }
  }, [pop]);
  return (
    <MarketLayout>
      <Flex direction="column" gap={4} w="full" align="center">
      {pop && <ConfettiExplosion {...mediumProps} />}
        <Text fontSize={24} fontWeight={600} textAlign="left" w="full">
          Oja Collectibles
        </Text>
        <Flex align="center" h="300px" justify="space-between" gap={4} w="full">
          <Flex
            w="25%"
            h="full"
            border="2px solid #000"
            rounded="10px"
            p={2}
            bgImg="/assets/oja-discount.png"
            bgSize="cover"
            bgPos="center"
          ></Flex>
          <Flex
            w="50%"
            h="full"
            border="2px solid #000"
            rounded="10px"
            p={2}
            bgImg="/assets/oja-vector-store.png"
            bgSize="cover"
          ></Flex>
          <Flex
            w="25%"
            h="full"
            border="2px solid #000"
            rounded="10px"
            p={2}
            bgImg="/assets/oja-play.gif"
            bgSize="cover"
            bgPos="center"
          ></Flex>
        </Flex>
        <Flex direction="column" gap={4} w="full" align={{ base: "center", md: "start" }} >
          <Tabs variant="unstyled" colorScheme="orange" borderColor="black">
            <Flex w="full" direction={{ base: "column", md: "row" }} justify="space-between" align="center">
              <TabList w="full" h="40px" gap={3}>
                <Tab
                  fontWeight={600}
                  fontSize={18}
                  _selected={{
                    color: "black",
                    bg: "blue.300",
                    border: "2px solid #000",
                    rounded: "10px",
                  }}
                >
                  Vouchers
                </Tab>
                <Tab
                  fontWeight={600}
                  fontSize={18}
                  _selected={{
                    color: "black",
                    bg: "gray.300",
                    border: "2px solid #000",
                    rounded: "10px",
                  }}
                >
                  Promo Codes
                </Tab>
              </TabList>
              <FancyButton
                bg="/assets/buttons/oja-cloud-green.svg"
                w="220px"
                h="80px"
                onClick={onOpen}
              >
                Create Collectible
              </FancyButton>
              <CreateVoucher isOpen={isOpen} onClose={onClose} />
            </Flex>
            <TabPanels>
              <TabPanel px={0}>
                {vouchers && vouchers.length === 0 ? (
                  <Text>You don't have not created any vouchers</Text>
                ) : (
                  <Wrap mt={2} align="center" spacing={10}>
                    {vouchers?.map((voucher) => (
                      <WrapItem key={voucher.id}>
                        <Flex
                          _hover={{ transform: "rotate(0deg) scale(1.05)" }}
                          _active={{
                            transform: "rotate(0deg) scale(0.9)",
                            cursor: "grabbing",
                          }}
                          transition="all 0.3s ease"
                          cursor="grab"
                          w={{ md: "360px"}}
                          overflow="hidden"
                          h="200px"
                          pos="relative"
                          p={4}
                          bgImg={
                            voucher.currency === "USD"
                              ? "/assets/vouchers/oja-voucher-orange.svg"
                              : voucher.currency === "NGN"
                                ? "/assets/vouchers/oja-voucher-green.svg"
                                : "/assets/vouchers/oja-voucher-purple.svg"
                          }
                          bgSize="contain"
                          bgRepeat="no-repeat"
                          transform="rotate(-5deg)"
                          onMouseDown={(event) => {
                            const timer = setTimeout(() => {
                              setRedeem(voucher);
                              onOpenReveal();
                              setPop(true);
                            }, 2000);
                            (event.currentTarget as HTMLElement).dataset.timer =
                              timer.toString();
                          }}
                          onTouchStart={(event) => {
                            const timer = setTimeout(() => {
                              setRedeem(voucher);
                              onOpenReveal();
                              setPop(true);
                            }, 2000);
                            (event.currentTarget as HTMLElement).dataset.timer =
                              timer.toString();
                          }}
                          onMouseUp={(event: React.MouseEvent<HTMLElement>) => {
                            if (event.currentTarget.dataset.timer) {
                              clearTimeout(
                                parseInt(event.currentTarget.dataset.timer)
                              );
                              delete event.currentTarget.dataset.timer;
                            }
                          }}
                          onTouchEnd={(event: React.TouchEvent<HTMLElement>) => {
                            if (event.currentTarget.dataset.timer) {
                              clearTimeout(
                                parseInt(event.currentTarget.dataset.timer)
                              );
                              delete event.currentTarget.dataset.timer;
                            }
                          }}
                          onMouseLeave={(event) => {
                            if (event.currentTarget.dataset.timer) {
                              clearTimeout(
                                parseInt(event.currentTarget.dataset.timer)
                              );
                              delete event.currentTarget.dataset.timer;
                            }
                          }}
                          onTouchCancel={(event) => {
                            if (event.currentTarget.dataset.timer) {
                              clearTimeout(
                                parseInt(event.currentTarget.dataset.timer)
                              );
                              delete event.currentTarget.dataset.timer;
                            }
                          }}
                        >
                          <Stack spacing={2} w="full">
                            <Text fontWeight={600} fontSize={12}>
                              Voucher {voucher.id}
                            </Text>
                            <Text fontSize={{ md: 18}} fontWeight={600}>
                              {voucher.currency}
                            </Text>
                            <Text fontSize={{ base: 24, md: 32}} mt={-4} fontWeight={600}>
                              {voucher.amount.toLocaleString()}
                            </Text>
                          </Stack>
                          <Text
                            w="full"
                            ml={-3}
                            mt={2}
                            fontSize={{ base: 24, md: 32}}
                            fontWeight={600}
                          >
                            HOLD TO REVEAL
                          </Text>
                        </Flex>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}
              </TabPanel>
              <TabPanel px={0}>
                <Text>There are no promo codes available now</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onCloseReveal}
          isOpen={isOpenReveal}
          isCentered
          size="xl"
        >
          <AlertDialogOverlay />

          <AlertDialogContent
            border="2px solid #000"
            rounded="10px"
            h="320px"
            pb={10}
          >
            <AlertDialogHeader>How to redeem a voucher</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Stepper
                orientation="vertical"
                size="xs"
                index={activeStep}
                gap="0"
                h="full"
              >
                <Step>
                  <StepIndicator bg="white">
                    <StepStatus complete={<StepIcon />} />
                  </StepIndicator>
                  <Stack>
                    <StepTitle>
                      <Text fontSize={18} mt={-2}>
                        Copy the voucher code to your clipboard
                      </Text>
                    </StepTitle>
                    <StepDescription>
                      <Flex
                        as="button"
                        fontSize={24}
                        fontWeight={600}
                        w="full"
                        p={2}
                        textAlign="center"
                        align="center"
                        justify="center"
                        border="2px solid #000"
                        rounded="md"
                        bg="gray.100"
                        _hover={{ bg: "gray.200" }}
                        onClick={() => {
                          if (redeem?.voucherId) {
                            navigator.clipboard.writeText(redeem.voucherId);
                            toast({
                              title: "Copied to clipboard",
                              status: "success",
                              duration: 2000,
                              isClosable: true,
                              position: "top",
                              containerStyle: {
                                border: "2px solid #000",
                                rounded: "md",
                              },
                            });
                          }
                        }}
                      >
                        {redeem?.voucherId || "No voucher selected"}
                      </Flex>
                    </StepDescription>
                  </Stack>

                  <StepSeparator />
                </Step>
                <Step>
                  <StepIndicator bg="white">
                    <StepStatus complete={<StepIcon />} />
                  </StepIndicator>
                  <Stack>
                    <StepTitle>
                      <Text fontSize={18} mt={-2}>
                        Send it to the vendor
                      </Text>
                    </StepTitle>
                    <StepDescription>
                      You can send the voucher code to the vendor using any
                      other messaging app. You will get notification when the
                      vendor redeems the voucher.
                    </StepDescription>
                  </Stack>

                  <StepSeparator />
                </Step>
              </Stepper>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialog>
      </Flex>
    </MarketLayout>
  );
};

export default Collectibles;
