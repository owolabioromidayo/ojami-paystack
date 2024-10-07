import { Product } from "@/utils/types";
import { Box, Flex, Icon, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { IoPricetag, IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import NextLink from "next/link";

interface ProductItemProps {
  product: Product;
}

export const renderStars = () => {
  const randomRating = Math.floor(Math.random() * (5 - 2 + 1)) + 2
  const stars = [];
  for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(randomRating)) {
          stars.push(<Icon key={i} as={IoStar} style={{ color: '#000' }}  />);
      } else if (i === Math.ceil(randomRating)) {
          stars.push(<Icon key={i} as={IoStarHalf} style={{ color: '#000' }}  />);
      } else {
          stars.push(<Icon key={i} as={IoStarOutline} style={{ color: '#000' }}  />);
      }
  }
  return stars;
};

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const averageRating = product.ratings.reduce((acc, curr) => acc+ curr, 0)/product.ratings.length

  return (
    <NextLink
    href={{
      pathname: "/products/[id]",
      query: {
        id: product.id,
      },
    }}
    passHref
  >
    <Stack w="full" mb={5} _hover={{ "& img": { transform: "scale(1.1)" } }}>
      <Box
        w={{ base: "160px", lg: "220px"}}
        h="200px"
        overflow="hidden"
        pos="relative"
        rounded="20px"
        border="2px solid #000"
      >
        <Flex
          align="center"
          gap={1}
          h="20px"
          w="fit-content"
          top={2}
          left={2}
          px={1}
          py={3}
          rounded="md"
          fontSize={13}
          zIndex={10}
          fontWeight={500}
          bg="orange"
          pos="absolute"
          display={product.price === 12000 ? 'flex' : 'none'}
        >
          <Icon as={IoPricetag} />
          <Text>49%</Text>
        </Flex>
        <Image
          src={product.images[0] || "/assets/oja-partner-badge.png"}
          transition="0.5s ease"
          alt={product.name}
          w="full"
          h="full"
          objectFit="cover"
        />
      </Box>
      <Text fontWeight={500} noOfLines={2}>{product.name}</Text>
      <Text fontWeight={400} noOfLines={2} textOverflow="ellipsis" fontSize={15}>{product.description}</Text>
      <Flex gap={1} align="center" fontSize={13} >
        {renderStars()} 
        <Text  fontWeight={500}>
        ({Math.floor(Math.random() * (800 - 15 + 1)) + 15})
        </Text>
      </Flex>
      <Flex gap={2} align="center" display={product?.price! > 10000 && product?.price! < 15000 ? 'flex' : 'none'}>
      <Text fontWeight={600} textDecor="line-through" >₦{product.price.toLocaleString()}</Text>
      <Text fontWeight={600} color="orange.500">₦{(product.price * 0.49).toLocaleString()}</Text>
      </Flex>

      <Text fontWeight={600} display={product?.price! > 10000 && product?.price! < 15000 ? 'none' : 'flex'}>₦{product.price.toLocaleString()}</Text>
    </Stack>
    </NextLink>
  );
};
