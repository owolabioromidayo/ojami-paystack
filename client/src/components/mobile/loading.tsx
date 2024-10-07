import { FC } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import Image from "next/image";

interface loadingProps {}

const Loading: FC<loadingProps> = ({}) => {
  return (
    <Box
      backgroundImage={"/images/mobile/bgs/splash-screen-bg.svg"}
      backgroundRepeat={"no-repeat"}
      backgroundSize={"cover"}
      backgroundPosition={"center"}
      h={"100vh"}
      w={"100vw"}
    >
      <Flex
        gap={1}
        justifyContent={"center"}
        position={"absolute"}
        bottom={0}
        left={0}
        right={0}
        alignItems={"center"}
        mb={"1rem"}
      >
        <Text fontSize={"sm"} fontWeight={"500"}>
          Powered by{" "}
        </Text>
        <Image
          src={"/images/mobile/logo/kora-logo.svg"}
          alt="kora-logo"
          height={40}
          width={40}
          style={{ objectFit: "contain", objectPosition: "center" }}
        />
      </Flex>
    </Box>
  );
};

export default Loading;
