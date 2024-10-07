import { FC } from "react";
import { Box, Text, Stack, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";
import { useRouter } from "next/navigation";

interface SelectRoleMobileProps {}

const SelectRoleMobile: FC<SelectRoleMobileProps> = () => {
  useViewportHeight();
  const router = useRouter();

  const setRole = (role: string) => {
    localStorage.setItem("role", role);
  };

  return (
    <Box
      backgroundColor={"#fff"}
      height="calc(var(--vh, 1vh) * 100)"
      width="100vw"
      overflow="auto"
    >
      <Flex justifyContent={"center"} p={0} h={"auto"} w={"auto"} mt={"4rem"}>
        <Image
          alt="Ojamii Logo"
          src="/icons/ojami-ai.svg"
          height={120}
          width={120}
          priority
        />
      </Flex>

      <Box px={"1.5rem"} mt={"2rem"}>
        <Text textAlign={"start"} fontWeight={"semibold"}>
          I want to sign up as a
        </Text>
      </Box>

      <Stack direction={"row"} px={"1.5rem"} mt={"1.5rem"}>
        <Box
          position={"relative"}
          h={"120px"}
          w={"full"}
          border={"2px solid #000000"}
          rounded={"lg"}
          backgroundImage={"/images/mobile/role-vendor.svg"}
          backgroundPosition={"center"}
          backgroundRepeat={"no-repeat"}
          backgroundSize={"cover"}
          onClick={() => {
            setRole("vendor");
            router.push("/auth/signup");
          }}
        >
          <Box
            position={"relative"}
            top={-10}
            left={-6}
            transform={"rotate(-10deg)"}
            height={86}
            width={86}
          >
            <Image
              src={"/images/mobile/oja-vendor-spike.svg"}
              fill
              alt="vendor-role"
            />
          </Box>
        </Box>

        <Box
          position={"relative"}
          h={"120px"}
          w={"full"}
          border={"2px solid #000000"}
          rounded={"lg"}
          backgroundImage={"/images/mobile/role-customer.svg"}
          backgroundPosition={"center"}
          backgroundRepeat={"no-repeat"}
          backgroundSize={"cover"}
          onClick={() => {
            setRole("customer");
            router.push("/auth/signup");
          }}
        >
          <Box
            position={"relative"}
            top={-7}
            right={-20}
            transform={"rotate(10deg)"}
            height={82}
            width={82}
          >
            <Image
              src={"/images/mobile/oja-customer-spike.svg"}
              fill
              alt="customer-role"
            />
          </Box>
        </Box>
      </Stack>

      <Flex justifyContent={"center"} mt={"2rem"}>
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

export default SelectRoleMobile;
