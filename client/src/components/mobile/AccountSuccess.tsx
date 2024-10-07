import { FC, useState, useEffect } from "react";
import { Box, Text, Flex, Heading, keyframes } from "@chakra-ui/react";
import Image from "next/image";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";

interface AccountSuccessMobileProps {}

const AccountSuccessMobile: FC<AccountSuccessMobileProps> = () => {
  const [role, setRole] = useState<string | null>("");

  useEffect(() => {
    let role = localStorage.getItem("role");
    setRole(role);
  }, []);

  const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
  useViewportHeight();

  setTimeout(() => {
    window.location.replace("/auth/signin");
  }, 2000);

  return (
    <Box
      backgroundImage={"/images/mobile/bgs/account-success-bg.svg"}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="center"
      height="calc(var(--vh, 1vh) * 100)"
      width="100vw"
      overflowY="auto"
      overflowX={"hidden"}
    >
      <Heading
        as={"h4"}
        fontWeight={"bold"}
        fontSize={"md"}
        w={"full"}
        textAlign={"center"}
        mt={"4rem"}
      >
        Account created successfully
      </Heading>
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        p={0}
        h={"auto"}
        w={"auto"}
        mt={"1.5rem"}
      >
        <Image
          alt="Ojamii Logo"
          src="/icons/ojami-ai.svg"
          height={150}
          width={150}
          priority
        />
        <Box
          position={"relative"}
          transform={"rotate(-10deg)"}
          height={86}
          width={86}
          top={-14}
          left={10}
        >
          <Image
            src={
              role == "vendor"
                ? "/images/mobile/oja-vendor-spike.svg"
                : "/images/mobile/oja-customer-spike.svg"
            }
            fill
            alt="role"
          />
        </Box>
      </Flex>

      <Flex
        justifyContent={"center"}
        mt={"5rem"}
        animation={`${rotateAnimation} 15s linear infinite`}
      >
        <Image
          src={"/assets/flower.svg"}
          alt="flower"
          height={150}
          width={150}
        />
      </Flex>

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

export default AccountSuccessMobile;
