import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import {
  Box,
  Heading,
  Flex,
  Text,
  Grid,
  GridItem,
  BoxProps,
} from "@chakra-ui/react";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";
import VendorLayout from "@/components/mobile/layout/VendorLayout";
import type { NextPageWithLayout } from "../_app";
import Image from "next/image";
import FancyButton from "@/components/ui/fancy-button";
import axios from "axios";
import { useOjaContext } from "@/components/provider";
import { Product as ProductType } from "@/utils/types";

interface ProductItemProps extends BoxProps {
  product: ProductType;
  category: string;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  category,
  ...props
}) => {
  return (
    <Box position={"relative"}>
      <Box
        {...props}
        border={"2px solid #000000"}
        rounded={"2xl"}
        display={"flex"}
        flexDir={"column"}
        maxH={"150px"}
        overflow={"hidden"}
      >
        <Box w={"full"} h={"100px"} position="relative">
          <Image
            alt={product.name}
            src={product.images[0]}
            style={{ objectFit: "cover" }}
            fill
            sizes="(max-width: 180px)"
          />
        </Box>

        <Box
          borderTop={"2px solid #000000"}
          p={1.5}
          w={"full"}
          wordBreak="break-word"
          whiteSpace="normal"
          bg={"#ffffff"}
        >
          <Text
            fontSize={category == "remaining" ? "0.5rem" : "2xs"}
            textAlign={"start"}
            fontWeight={"500"}
            noOfLines={2}
          >
            {product.name}
          </Text>

          <Text
            fontSize={"xs"}
            fontWeight={"bold"}
            display={category == "hot" ? "none" : "flex"}
          >
            NGN {product.price?.toLocaleString()}
          </Text>
        </Box>
      </Box>
      <FancyButton
        position={"absolute"}
        bg="/images/mobile/blue-ellipse.svg"
        transform={"rotate(20deg)"}
        height={8}
        width={20}
        top={-1}
        right={-4}
        zIndex={2}
        display={category == "hot" ? "none" : "flex"}
      >
        <Text whiteSpace="normal" textAlign="center" fontSize="3xs">
          {product.quantity} remaining
        </Text>
      </FancyButton>
    </Box>
  );
};

const Products: NextPageWithLayout<{}> = () => {
  useViewportHeight();
  const baseUrl = process.env.NEXT_PUBLIC_OJAMI;
  const { user } = useOjaContext();
  const [currentStoreIndex, setCurrentStoreIndex] = useState<number>(0);
  const [currentStoreData, setCurrentStoreData] = useState(
    () => user?.storefronts?.[currentStoreIndex]
  );
  const [products, setProducts] = useState<ProductType[]>([]);
  const hotProducts = products;

  useEffect(() => {
    const storedIndex = localStorage.getItem("currentStoreIndex");
    if (storedIndex) {
      const index = Number(storedIndex);
      setCurrentStoreIndex(index);
      setCurrentStoreData(user?.storefronts?.[index]);
    } else {
      setCurrentStoreData(user?.storefronts?.[0]);
    }
  }, [user]);

  useEffect(() => {
    const getStoreProducts = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/ecommerce/storefronts/${currentStoreData?.id}/products`
        );
        if (response.status == 200) {
          setProducts(response.data.products);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getStoreProducts();
  }, [user, currentStoreIndex]);

  return (
    <Box
      height="calc(var(--vh, 1vh) * 100 - 60px)"
      w="100vw"
      backgroundImage={"/images/mobile/bgs/products-bg.svg"}
      backgroundPosition={"center"}
      backgroundSize={"cover"}
      backgroundRepeat={"no-repeat"}
      overflow={"auto"}
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "scrollbar-width": "none",
        "-webkit-overflow-scrolling": "touch",
      }}
    >
      <Heading
        as={"h1"}
        size={"lg"}
        fontWeight={"semibold"}
        pt={"3rem"}
        px="0.8rem"
      >
        My products
      </Heading>

      {/* Hot products */}
      <Box w={"full"} overflowX={"scroll"}>
        <Heading
          as={"h2"}
          fontSize={"xs"}
          fontWeight={"semibold"}
          color={"#B0B0B0"}
          mt={"1rem"}
          px={"0.8rem"}
        >
          🔥 Hot Products from your store
        </Heading>

        {products?.length <= 5 ? (
          <>
            <Flex
              bg="gray.100"
              flexDir="column"
              p="1.5rem"
              textAlign="center"
              rounded="lg"
              m="1rem"
              border="2px dashed #888"
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontSize="md"
                fontWeight="bold"
                color="gray.700"
                mb="0.5rem"
              >
                No Trending Products Yet
              </Text>
              <Text fontSize="sm" color="gray.600">
                Once your products start gaining attention, you'll see them
                highlighted here.
              </Text>
            </Flex>
          </>
        ) : (
          <>
            <Flex
              overflowX="auto"
              whiteSpace="nowrap"
              gap={2}
              px={"0.8rem"}
              mt={"1rem"}
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                "scrollbar-width": "none",
                "-webkit-overflow-scrolling": "touch",
              }}
            >
              {hotProducts?.map((product, index) => (
                <ProductItem
                  key={index}
                  product={product}
                  minW="180px"
                  category="hot"
                />
              ))}
            </Flex>
          </>
        )}
      </Box>

      {/* Remaining stock */}
      <Box w={"full"} mt={"0.5rem"} pb={"1rem"}>
        <Heading
          as={"h2"}
          fontSize={"xs"}
          fontWeight={"semibold"}
          color={"#B0B0B0"}
          px={"0.8rem"}
        >
          Remaining stock
        </Heading>

        {products?.length == 0 ? (
          <>
            <Flex
              bg="gray.100"
              flexDir="column"
              p="1.5rem"
              textAlign="center"
              rounded="lg"
              m="1rem"
              border="2px dashed #888"
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontSize="md"
                fontWeight="bold"
                color="gray.700"
                mb="0.5rem"
              >
                No Products Available
              </Text>
              <Text fontSize="sm" color="gray.600">
                Once you add products to your store, they will appear here.
              </Text>
            </Flex>
          </>
        ) : (
          <>
            <Grid
              templateColumns={products.length === 1 ? "1fr" : "repeat(2, 1fr)"}
              gap={2}
              px={"0.8rem"}
              mt={"0.5rem"}
            >
              {products?.map((product, index) => (
                <GridItem w="100%" bg="#ffffff" rounded={"2xl"} key={index}>
                  <ProductItem product={product} category="remaining"/>
                </GridItem>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

Products.getLayout = function getLayout(page: ReactElement) {
  return <VendorLayout>{page}</VendorLayout>;
};

export default Products;
