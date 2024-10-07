import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";
import VendorLayout from "@/components/mobile/layout/VendorLayout";
import type { NextPageWithLayout } from "../_app";
import axios from "axios";
import { vendorOrders } from "./home";
import { useOjaContext } from "@/components/provider";

const Orders: NextPageWithLayout<{}> = () => {
  useViewportHeight();
  const baseUrl = process.env.NEXT_PUBLIC_OJAMI;
  const { user } = useOjaContext();
  const [vendorOrders, setVendorOrders] = useState<vendorOrders>();
  const tabs = ["new", "delivering", "completed", "cancelled"];
  
  const orders = vendorOrders?.orders?.map((order, index) => {
    const product = vendorOrders.products[index] || {}; 
    return {
      ...order,
      ...product,
    };
  });

  const newOrders = orders?.filter(order => order.status == 'pending')
  const deliveringOrders = orders?.filter(order => order.status == 'processing')
  const completedOrders = orders?.filter(order => order.status == 'completed')
  const cancelledOrders = orders?.filter(order => order.status == 'failed')

  useEffect(() => {
    const getVendorOrders = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/ecommerce/orders/vendor`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setVendorOrders(response.data);
        } else {
          console.error("Failed to fetch vendor orders");
        }
      } catch (err: any) {
        console.log("error", err);
      }
    };
    getVendorOrders();
  }, [user, baseUrl]);

  return (
    <Box
      height="calc(var(--vh, 1vh) * 100 - 60px)"
      w="100vw"
      backgroundImage={"/images/mobile/bgs/orders-bg.svg"}
      backgroundPosition={"center"}
      backgroundSize={"cover"}
      backgroundRepeat={"no-repeat"}
      px={"0.8rem"}
      overflowY={"auto"}
    >
      <Heading as={"h1"} size={"lg"} fontWeight={"semibold"} pt={"3rem"}>
        Orders Received
      </Heading>

      <Box mt={"0.5rem"} pb={"0.5rem"}>
        <Tabs position="relative" variant="unstyled">
          <TabList w={"fit-content"}>
            {tabs.map((tab, index) => (
              <Tab
                fontWeight={"semibold"}
                key={index}
                _selected={{ color: "#EF8421" }}
                fontSize={"2xs"}
                color={"#B0B0B0"}
              >
                {tab}
              </Tab>
            ))}
          </TabList>
          <TabIndicator
            mt="-5px"
            height="2px"
            bg="#EF8421"
            borderRadius="1px"
            color={"#EF8421"}
          />
          <TabPanels>
            <TabPanel p={0}>
              {newOrders?.length == 0 ? (
                <>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    mt={"2rem"}
                    flexDir={"column"}
                  >
                    <Image
                      width={120}
                      h={"auto"}
                      alt="empty-cart"
                      src="/images/mobile/illustrations/empty-cart.png"
                    />
                  </Flex>
                  <Text
                    mt={"0.5rem"}
                    textAlign={"center"}
                    color={"gray.500"}
                    fontSize={"sm"}
                    fontWeight={"500"}
                  >
                    No orders yet. Promote your products to start selling!
                  </Text>
                </>
              ) : (
                <>
                  <Box
                    border="2px solid #000000"
                    rounded="2xl"
                    overflowX="hidden"
                    mt={"1rem"}
                  >
                    <Table
                      variant="unstyled"
                      size={"xs"}
                      w={"full"}
                      maxH={"65vh"}
                    >
                      <Thead backgroundColor={"#D9D9D9"} fontSize={"2xs"}>
                        <Tr>
                          <Th px={2} py={2} textTransform={"none"}>
                            id
                          </Th>
                          <Th textTransform={"none"}>item</Th>
                          <Th textTransform={"none"}>quantity</Th>
                          <Th textTransform={"none"}>price</Th>
                          <Th textTransform={"none"}>actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {newOrders?.map((item, index) => (
                          <Tr
                            fontSize={"2xs"}
                            fontWeight={"semibold"}
                            key={index}
                            border={"2px solid #000000"}
                            borderLeft={"0px"}
                            borderRight={"0px"}
                            borderBlockEnd={"0px"}
                          >
                            <Td py={4} px={2}>
                              #{item.id}
                            </Td>
                            <Td pr={"1rem"} isTruncated maxW={"70px"}>
                              {item.name}
                            </Td>
                            <Td>{item.quantity}</Td>
                            <Td>{item.price}</Td>
                            <Td>see details</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </>
              )}
            </TabPanel>
            <TabPanel p={0}>
              {deliveringOrders?.length == 0 ? (
                <>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    mt={"2rem"}
                    flexDir={"column"}
                  >
                    <Image
                      width={120}
                      h={"auto"}
                      alt="empty-cart"
                      src="/images/mobile/illustrations/empty-cart.png"
                    />
                  </Flex>
                  <Text
                    mt={"0.5rem"}
                    textAlign={"center"}
                    color={"gray.500"}
                    fontSize={"sm"}
                    fontWeight={"500"}
                  >
                    No Orders are being delivered currently
                  </Text>
                </>
              ) : (
                <>
                  <Box
                    border="2px solid #000000"
                    rounded="2xl"
                    overflowX="hidden"
                    mt={"1rem"}
                  >
                    <Table
                      variant="unstyled"
                      size={"xs"}
                      w={"full"}
                      maxH={"65vh"}
                    >
                      <Thead backgroundColor={"#D9D9D9"} fontSize={"2xs"}>
                        <Tr>
                          <Th px={2} py={2} textTransform={"none"}>
                            id
                          </Th>
                          <Th textTransform={"none"}>item</Th>
                          <Th textTransform={"none"}>quantity</Th>
                          <Th textTransform={"none"}>price</Th>
                          <Th textTransform={"none"}>actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {deliveringOrders?.map((item, index) => (
                          <Tr
                            fontSize={"2xs"}
                            fontWeight={"semibold"}
                            key={index}
                            border={"2px solid #000000"}
                            borderLeft={"0px"}
                            borderRight={"0px"}
                            borderBlockEnd={"0px"}
                          >
                            <Td py={4} px={2}>
                              #{item.id}
                            </Td>
                            <Td pr={"1rem"} isTruncated maxW={"70px"}>
                              {item.name}
                            </Td>
                            <Td>{item.quantity}</Td>
                            <Td>{item.price}</Td>
                            <Td>see details</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </>
              )}
            </TabPanel>
            <TabPanel p={0}>
              {completedOrders?.length == 0 ? (
                <>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    mt={"2rem"}
                    flexDir={"column"}
                  >
                    <Image
                      width={120}
                      h={"auto"}
                      alt="empty-cart"
                      src="/images/mobile/illustrations/empty-cart.png"
                    />
                  </Flex>
                  <Text
                    mt={"0.5rem"}
                    textAlign={"center"}
                    color={"gray.500"}
                    fontSize={"sm"}
                    fontWeight={"500"}
                  >
                    No Completed Orders Yet
                  </Text>
                </>
              ) : (
                <>
                  <Box
                    border="2px solid #000000"
                    rounded="2xl"
                    overflowX="hidden"
                    mt={"1rem"}
                  >
                    <Table
                      variant="unstyled"
                      size={"xs"}
                      w={"full"}
                      maxH={"65vh"}
                    >
                      <Thead backgroundColor={"#D9D9D9"} fontSize={"2xs"}>
                        <Tr>
                          <Th px={2} py={2} textTransform={"none"}>
                            id
                          </Th>
                          <Th textTransform={"none"}>item</Th>
                          <Th textTransform={"none"}>quantity</Th>
                          <Th textTransform={"none"}>price</Th>
                          <Th textTransform={"none"}>actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {completedOrders?.map((item, index) => (
                          <Tr
                            fontSize={"2xs"}
                            fontWeight={"semibold"}
                            key={index}
                            border={"2px solid #000000"}
                            borderLeft={"0px"}
                            borderRight={"0px"}
                            borderBlockEnd={"0px"}
                          >
                            <Td py={4} px={2}>
                              #{item.id}
                            </Td>
                            <Td pr={"1rem"} isTruncated maxW={"70px"}>
                              {item.name}
                            </Td>
                            <Td>{item.quantity}</Td>
                            <Td>{item.price}</Td>
                            <Td>see details</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </>
              )}
            </TabPanel>
            <TabPanel p={0}>
              {cancelledOrders?.length == 0 ? (
                <>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"center"}
                    mt={"2rem"}
                    flexDir={"column"}
                  >
                    <Image
                      width={120}
                      h={"auto"}
                      alt="empty-cart"
                      src="/images/mobile/illustrations/empty-cart.png"
                    />
                  </Flex>
                  <Text
                    mt={"0.5rem"}
                    textAlign={"center"}
                    color={"gray.500"}
                    fontSize={"sm"}
                    fontWeight={"500"}
                  >
                    No Cancelled Orders Yet
                  </Text>
                </>
              ) : (
                <>
                  <Box
                    border="2px solid #000000"
                    rounded="2xl"
                    overflowX="hidden"
                    mt={"1rem"}
                  >
                    <Table
                      variant="unstyled"
                      size={"xs"}
                      w={"full"}
                      maxH={"65vh"}
                    >
                      <Thead backgroundColor={"#D9D9D9"} fontSize={"2xs"}>
                        <Tr>
                          <Th px={2} py={2} textTransform={"none"}>
                            id
                          </Th>
                          <Th textTransform={"none"}>item</Th>
                          <Th textTransform={"none"}>quantity</Th>
                          <Th textTransform={"none"}>price</Th>
                          <Th textTransform={"none"}>actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {cancelledOrders?.map((item, index) => (
                          <Tr
                            fontSize={"2xs"}
                            fontWeight={"semibold"}
                            key={index}
                            border={"2px solid #000000"}
                            borderLeft={"0px"}
                            borderRight={"0px"}
                            borderBlockEnd={"0px"}
                          >
                            <Td py={4} px={2}>
                              #{item.id}
                            </Td>
                            <Td pr={"1rem"} isTruncated maxW={"70px"}>
                              {item.name}
                            </Td>
                            <Td>{item.quantity}</Td>
                            <Td>{item.price}</Td>
                            <Td>see details</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

Orders.getLayout = function getLayout(page: ReactElement) {
  return <VendorLayout>{page}</VendorLayout>;
};

export default Orders;
