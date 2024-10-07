// @ts-nocheck

import {
  Flex,
  Image,
  Text,
  Avatar,
  Stack,
  Icon,
  FlexProps,
} from "@chakra-ui/react";
import React from "react";
import FancyButton from "../ui/fancy-button";
import { IoStarSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import NextLink from "next/link"
import { Storefront } from "@/utils/types";

interface StoreCardProps extends FlexProps {
  image: string;
  avatar: string;
  store: string;
  ratings: Array<number>;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  image,
  avatar,
  store,
  ratings,
  ...props
}) => {
  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((acc, curr) => parseInt(acc) + Number(curr), 0) /
          ratings.length
        ).toFixed(1)
      : "0.0";
  const router = useRouter();
  return (
    <Flex pos="relative" h="350px" w={{ base: "full", md: "360px"}} pb={20} {...props}>
      <Flex
        direction="column"
        overflow="hidden"
        border="2px solid #000000"
        h="320px"
        w={{ base: "full", md: "360px"}}
        _hover={{
          "& img": { transform: "scale(1.1)" },
          "& .contain": {
            bottom: 2,
            width: "340px",
            borderRadius: "10px",
            color: "#EF8421",
            fontWeight: 600,
            border: "2px solid #000",
          },
        }}
        rounded="20px"
        pos="relative"
        align="center"
        cursor="pointer"
      >
        <Image
          src={image}
          alt={store}
          objectFit="cover"
          objectPosition="top"
          h="320px"
          w={{ base: "full", md: "360px"}}
          zIndex={0}
          transition="0.5s ease"
          pos="relative"
        />
        <Flex
          className="contain"
          bg="white"
          pos="absolute"
          bottom={0}
          w="full"
          borderTop="2px solid #000"
          transition="0.5s ease"
          direction="row"
          p={4}
          gap={1}
        >
          <Avatar src={avatar} border="2px solid #000" />
          <Stack spacing={-1}>
            <Text fontSize={18} fontWeight={600}>
              {store}
            </Text>
            <Flex align="center" gap={1}>
              <Icon as={IoStarSharp} />
              <Text fontSize={14} color="#000" fontWeight={500}>
                {averageRating} ({ratings.length}k)
              </Text>
            </Flex>
          </Stack>
        </Flex>
      </Flex>
      <NextLink
        href={{
          pathname: "/market/[store]",
          query: {
            store: store.replaceAll(" ", "_"),
          },
        }}
        passHref
      >
      <FancyButton
        pos="absolute"
        bottom={{ base: 0, lg: 2 }}
        right={{base: "-80px", md: "-120px"}}
        transform={{ lg: "rotate(-15deg)"}}
        bg="/assets/buttons/oja-sweet-blue.svg"
        w="350px"
        h="70px"
      >
        shop now
      </FancyButton>

      </NextLink>
    </Flex>
  );
};


// Mini Store Card

interface MiniProps{
  storefront: Storefront
}

export const MiniStoreCard: React.FC<MiniProps> = ({
  storefront,
  ...props
}) => {
  const router = useRouter();
  if(!storefront){
    return(<>Loading...</>)
  }
  const { ratings, storename, bannerImageUrl, profileImageUrl } = storefront!;
  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((acc, curr) => parseInt(acc) + Number(curr), 0) /
          ratings.length
        ).toFixed(1)
      : "0.0";
  return (
    <Flex pos="relative" h="250px" w={{ base: "full", md: "full"}} pb={20} {...props}>
      <Flex
        direction="column"
        overflow="hidden"
        border="2px solid #000000"
        h="220px"
        w={{ base: "full", md: "full"}}
        _hover={{
          "& img": { transform: "scale(1.1)" },
          "& .contain": {
            bottom: 2,
            width: "430px",
            borderRadius: "10px",
            color: "#EF8421",
            fontWeight: 600,
            border: "2px solid #000",
          },
        }}
        rounded="20px"
        pos="relative"
        align="center"
        cursor="pointer"
      >
        <Image
          src={bannerImageUrl}
          alt={storename}
          objectFit="cover"
          objectPosition="top"
          h="200px"
          w={{ base: "full", md: "450px"}}
          zIndex={0}
          transition="0.5s ease"
          pos="relative"
        />
        <Flex
          className="contain"
          bg="white"
          pos="absolute"
          bottom={0}
          w="full"
          borderTop="2px solid #000"
          transition="0.5s ease"
          direction="row"
          p={4}
          gap={1}
        >
          <Avatar src={profileImageUrl} border="2px solid #000" />
          <Stack spacing={-1}>
            <Text fontSize={18} fontWeight={600}>
              {storename}
            </Text>
            <Flex align="center" gap={1}>
              <Icon as={IoStarSharp} />
              <Text fontSize={14} color="#000" fontWeight={500}>
                {averageRating} ({ratings.length}k)
              </Text>
            </Flex>
          </Stack>
        </Flex>
      </Flex>
      <NextLink
        href={{
          pathname: "/market/[store]",
          query: {
            store: storename.replaceAll(" ", "_"),
          },
        }}
        passHref
      >
      <FancyButton
        pos="absolute"
        bottom={{ base: 0, lg: 2 }}
        right={{base: "-80px", md: "-120px"}}
        transform={{ lg: "rotate(-15deg)"}}
        bg="/assets/buttons/oja-cloud-blue.svg"
        w="350px"
        h="70px"
      >
        check store
      </FancyButton>

      </NextLink>
    </Flex>
  );
};
