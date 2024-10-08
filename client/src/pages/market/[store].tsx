"use client";

import { MarketLayout } from "@/components/market/layout";
import { ProductItem } from "@/components/utils/product";
import { Cart, Product, Storefront, User, VirtualWallet } from "@/utils/types";

import {
  Avatar,
  Flex,
  Text,
  IconButton,
  Stack,
  Image,
  Icon,
  Select,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Radio,
  RadioGroup,
  Input,
  SimpleGrid
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { IoChevronDown, IoStarSharp } from "react-icons/io5";
import { TbInfoTriangle } from "react-icons/tb";

const StorePage = () => {
  const [store, setStore] = useState<Storefront | null>(null);
  const [products, setProducts] = useState<Array<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const storename =
    typeof router.query.store === "string"
      ? router.query.store.toString().replaceAll("_", " ")
      : "";

  const fetchStoreData = async () => {
    if (!storename) return;
    const url = `${process.env.NEXT_PUBLIC_OJAMI}/api/ecommerce/storefronts/str/${storename}`;

    try {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const storeData = await response.json(); // Parse the JSON from the response
      setStore(storeData.storefront); // Update the cart state with fetched data
    } catch (error: any) {
      setError(error.message); // Update error state if there's an error
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  useEffect(() => {
    if (!store) {
      fetchStoreData();
    }
  }, [store, storename]);

  // const averageRating =
  //   store?.ratings.length! > 0
  //     ? (
  //         store?.ratings?.reduce(
  //           (acc: any, curr) => parseInt(acc) + Number(curr),
  //           0
  //         )! / store?.ratings?.length!
  //       ).toFixed(1)
  //     : "0.0";

  const averageRating = 4.5;

  const [value, setValue] = React.useState("");
  const [price, setPrice] = React.useState<Array<number>>([0, 100]);

  const [onSale, setOnSale] = React.useState(false);
  const [inStock, setInStock] = React.useState(false);


  return (
    <MarketLayout>
      <Flex
        color="black"
        mt={10}
        bg="white"
        border="2px solid #000"
        p={6}
        rounded="10px"
        h="300px"
        w="full"
        direction="column"
        align="center"
      >
        <Stack pos="relative">
          <Image
            src="/assets/oja-partner-badge.png"
            w="25px"
            pos="absolute"
            zIndex={1}
            right={2}
            top={2}
            alt="oja partner badge"
          />
          <Avatar
            src={store?.profileImageUrl}
            name={store?.storename}
            size="2xl"
            border="2px solid #000"
          />
        </Stack>
        <Text mt={3} fontSize={24} fontWeight={600}>
          {store?.storename}
        </Text>
        <Flex align="center" gap={1}>
          <Icon as={IoStarSharp} />
          <Text fontSize={14} color="#000" fontWeight={500}>
            {averageRating} ({store?.ratings.length}k)
          </Text>
        </Flex>
        <Text>{store?.description}</Text>
      </Flex>
      <Stack mt={10}>
        <Text fontWeight={500} fontSize={20}>
          Products
        </Text>
        <Flex align="center" gap={4}>
          <Popover>
            {({ isOpen, onClose }) => (
              <>
                <PopoverTrigger>
                  <Button
                    border="2px solid #000"
                    bg={isOpen || value.length > 1 ? "orange" : "white"}
                    _hover={{
                      bg: isOpen || value.length > 1 ? "orange" : "gray.300",
                    }}
                    rounded="9px"
                    rightIcon={<IoChevronDown />}
                  >
                    Sort by
                  </Button>
                </PopoverTrigger>
                <PopoverContent rounded="15px" p={3}>
                  <PopoverBody p={3}>
                    <RadioGroup
                      onChange={setValue}
                      value={value}
                      colorScheme="orange"
                    >
                      <Stack spacing={4} fontWeight={500}>
                        <Radio value="trending">Best Selling</Radio>
                        <Radio value="newest">Newest</Radio>
                        <Radio value="cheap">Price: Low - High</Radio>
                        <Radio value="expensive">Price: High - Low</Radio>
                      </Stack>
                    </RadioGroup>
                    <Flex
                      w="full"
                      mt={7}
                      justify="space-between"
                      align="center"
                      gap={2}
                    >
                      <Button w="full" rounded="9px">
                        Reset
                      </Button>
                      <Button
                        w="full"
                        rounded="9px"
                        bg="black"
                        color="white"
                        onClick={onClose}
                        _hover={{ bg: "gray.700" }}
                      >
                        Done
                      </Button>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </>
            )}
          </Popover>
          <Button
            border="2px solid #000"
            bg={onSale ? "orange" : "white"}
            _hover={{ bg: onSale ? "orange" : "gray.300" }}
            rounded="9px"
            onClick={() => setOnSale(!onSale)}
          >
            On sale
          </Button>
          <Popover>
            {({ isOpen, onClose }) => (
              <>
                <PopoverTrigger>
                  <Button
                    border="2px solid #000"
                    bg={price[0] > 0 || price[1] < 100 ? "orange" : "white"}
                    _hover={{
                      bg: price[0] > 0 || price[1] < 100 ? "orange" : "gray.300",
                    }}
                    rounded="9px"
                    rightIcon={<IoChevronDown />}
                  >
                    Price
                  </Button>
                </PopoverTrigger>
                <PopoverContent rounded="15px" p={3}>
                  <PopoverBody p={3}>
                    <RangeSlider
                      aria-label={["min", "max"]}
                      onChangeEnd={(val) => setPrice(val)}
                      defaultValue={price}
                      colorScheme="orange"
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} />
                      <RangeSliderThumb index={1} />
                    </RangeSlider>
                    <Flex
                      w="full"
                      mt={7}
                      justify="space-between"
                      align="center"
                      gap={2}
                    >
                      <Input value={price[0]} />
                      {" - "}
                      <Input value={price[1]} />

                    </Flex>

                    <Flex
                      w="full"
                      mt={7}
                      justify="space-between"
                      align="center"
                      gap={2}
                    >
                      <Button w="full" rounded="9px">
                        Reset
                      </Button>
                      <Button
                        w="full"
                        rounded="9px"
                        bg="black"
                        color="white"
                        onClick={onClose}
                        _hover={{ bg: "gray.700" }}
                      >
                        Done
                      </Button>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </>
            )}
          </Popover>
          <Button
            border="2px solid #000"
            bg={inStock ? "orange" : "white"}
            _hover={{ bg: inStock ? "orange" : "gray.300" }}
            rounded="9px"
            onClick={() => setInStock(!inStock)}
          >
            In stock
          </Button>
        </Flex>
        {store?.products?.length! < 1 ? (
          <Flex gap={2} align="center">
            <Icon as={TbInfoTriangle} />
            <Text>This store has no products yet</Text>
          </Flex>
        ) : (
          <SimpleGrid minChildWidth={{ base: "150px", lg: '210px' }} spacing='5px' mt={5}>
            {store?.products?.map((item) => (
              <ProductItem product={item} key={item.id} />
            ))}
          </SimpleGrid>

        )}


      </Stack>
    </MarketLayout>
  );
};

export default StorePage;
