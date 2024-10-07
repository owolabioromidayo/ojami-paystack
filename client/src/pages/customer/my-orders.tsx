import { MarketLayout } from "@/components/market/layout";
import { OjaContext } from "@/components/provider";
import { TrackOrder } from "@/components/utils/track-order";
import { Order, Product } from "@/utils/types";
import { Flex, useToast, Text, Image, Stack, Badge, useDisclosure } from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState<Array<Order> | null>(null);
  const [products, setProducts] = useState<Array<Product> | null>(null);
  const { user } = useContext(OjaContext);
  const toast = useToast();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();  
  const [order, setOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const fetchOrders = async () => {
    const url = `${process.env.NEXT_PUBLIC_OJAMI}/api/ecommerce/orders/me/history`;

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
  return (
    <MarketLayout>
      <Flex direction="column" gap={4} w="full">
        <Text fontSize={24} fontWeight={600}>My Orders</Text>
        {orders &&
          products?.map((item, index) => (
            <Flex
              direction="column"
              gap={3}
              borderBottom="2px solid #000"
              py={3}
              px={1}
              key={item.id}
              w="full"
            >
              <Flex
                gap={3}
                w="full"
                alignItems="center"
                justify="space-between"
                onClick={() => {
                  setOrder(orders[index]);
                  setProduct(products[index]);
                  onOpen();
                }}
              >
                <Flex
                  direction={{ base: "column", md: "row" }}
                  cursor="pointer"
                  gap={3}
                  w="full"
                  py={3}
                  px={1}
                  key={item.id}
                  align={{ base: "start", md: "center"}} 
                  justify="space-between"
                >
                  <Flex gap={2} align={{ base: "start", md: "center"}} pos="relative">
                    <Image
                      border="2px solid #000"
                      rounded="md"
                      src={item?.images[0]}
                      w={{ base: "50px", md: "80px" }}
                      h={{ base: "50px", md: "80px" }}
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
                        <Badge
                          colorScheme={
                            orders[index].status === "pending" 
                              ? "yellow" : orders[index].status === "processing"
                              ? "blue"
                              : orders[index].status === "completed"
                                ? "green"
                                : "red"
                          }
                          border="2px solid #000"
                          rounded="md"
                        >
                          {orders[index].status}
                        </Badge>
                      </Flex>
                      <Text fontSize={{ md: 20}} fontWeight={500} w="400px">
                        {item.name}
                      </Text>
                    </Stack>
                  </Flex>
                  <Text fontSize={20} fontWeight={500}>
                    ₦{(item.price * orders[index].count).toLocaleString()}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          ))}
      </Flex>
      <TrackOrder isOpen={isOpen} onClose={onClose} order={order!} product={product!} />
    </MarketLayout>
  );
};

export default MyOrders;
