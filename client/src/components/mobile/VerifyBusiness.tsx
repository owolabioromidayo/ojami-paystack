import { FC } from "react";
import { Flex, Text, Box, Heading, Input } from "@chakra-ui/react";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";
import FancyButton from "@/components/ui/fancy-button";
import Link from "next/link";

interface VerifyBusinessMobileProps {}

const VerifyBusinessMobile: FC<VerifyBusinessMobileProps> = ({}) => {
  useViewportHeight();
  return (
    <Box h="calc(var(--vh, 1vh) * 100)" w={"100vw"} backgroundColor={"#00E440"}>
      <Box backgroundColor={"#00E440"} h="calc(var(--vh, 1vh) * 7)"></Box>
      <Box
        h="calc(var(--vh, 1vh) * 93)"
        w={"100vw"}
        background={"#ffffff"}
        bottom={0}
        roundedTop={"2xl"}
        borderTop={"2px solid #000000"}
        overflowY={"auto"}
        px={"1.5rem"}
        scrollBehavior={"smooth"}
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "scrollbar-width": "none",
          "-webkit-overflow-scrolling": "touch",
        }}
        pb={"3rem"}
      >
        <Heading as={"h1"} size={"lg"} mt={"1.5rem"}>
          Verify Business
        </Heading>

        <Box mt={"1.5rem"}>
          <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
            Enter RC Number
          </Text>
          <Input
            type={"email"}
            size="sm"
            placeholder="0 0 0 0 0 0 1 1"
            fontSize={"sm"}
            border={"2px solid #000000"}
            rounded={"lg"}
            height={"50px"}
            background={"#FBFBFB"}
            focusBorderColor="#2BADE5"
            _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
            _placeholder={{ color: "#B9B9B9" }}
          />
        </Box>

        <Flex
          flexDir={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          position={"absolute"}
          bottom={0}
          left={0}
          right={0}
          mb={"5rem"}
          gap={2}
        >
          <FancyButton
            bg="/assets/buttons/oja-sweet-blue.svg"
            mt={"1.5rem"}
            w={200}
            h={62}
          >
            <Text
              maxW="150px"
              whiteSpace="normal"
              textAlign="center"
              fontSize="sm"
            >
              <Link href={"/auth/add-product"}>continue</Link>
            </Text>
          </FancyButton>

          <Link href={"#"} style={{ fontWeight: "600", fontSize: "13px" }}>
            Maybe later
          </Link>
        </Flex>
      </Box>
    </Box>
  );
};

export default VerifyBusinessMobile;
