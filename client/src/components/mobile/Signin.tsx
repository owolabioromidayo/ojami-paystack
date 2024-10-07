import { FC, useState } from "react";
import {
  Box,
  Text,
  Input,
  Stack,
  Flex,
  keyframes,
  useToast,
} from "@chakra-ui/react";
import FancyButton from "@/components/ui/fancy-button";
import Image from "next/image";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";
import axios from "axios";

interface SigninMobileProps {}

const SigninMobile: FC<SigninMobileProps> = ({}) => {
  const baseUrl = process.env.NEXT_PUBLIC_OJAMI;
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useViewportHeight();
  const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

  const handleSignin = async () => {
    setIsSubmitting(true);
    const formData = { phoneOrEmail: email.trim(), password: password.trim() };
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/users/login`,
        formData,
        { withCredentials: true }
      );
      const user = response.data.user;
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: `Welcome back ${user.firstname}😎`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
          variant: "subtle",
        });
        setTimeout(() => {
          window.location.assign("/vendor/home");
        }, 2000);
      } else {
        toast({
          title: `Error`,
          description:
            "An error occurred while signing you in, please wait a bit and try again",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
          variant: "subtle",
        });
      }
    } catch (error: any) {
      console.log("error", error);
      toast({
        title: `Error`,
        description: `${error?.response?.data?.errors[0]?.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Box
      backgroundImage={"/images/mobile/bgs/sign-in-bg.svg"}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="center"
      height="calc(var(--vh, 1vh) * 100)"
      w="100vw"
      overflow="auto"
      pt={"6rem"}
      px={"1.5rem"}
    >
      <Flex justifyContent={"space-between"}>
        <Text fontSize={"2xl"} fontWeight={"semibold"} mt={"0.5rem"}>
          Sign in
        </Text>
        <Box
          animation={`${rotateAnimation} 15s linear infinite`}
          display="inline-block"
        >
          <Image
            src="/images/mobile/green-spinner.svg"
            alt="vector"
            width={80}
            height={80}
          />
        </Box>
      </Flex>

      <Stack direction={"column"} mt={"1rem"} spacing={5}>
        <Box>
          <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
            Email Address
          </Text>
          <Input
            size="sm"
            type="text"
            border={"2px solid #000000"}
            rounded={"lg"}
            height={"50px"}
            background={"#ECECEC"}
            _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
            fontSize={"sm"}
            focusBorderColor="#EF8421"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>

        <Box>
          <Text mb="6px" fontWeight={"semibold"} fontSize={"sm"}>
            Password
          </Text>
          <Input
            size="sm"
            type="password"
            border={"2px solid #000000"}
            rounded={"lg"}
            height={"50px"}
            background={"#ECECEC"}
            _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
            fontSize={"sm"}
            focusBorderColor="#EF8421"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
      </Stack>

      <Flex justifyContent={"center"} mt={"2rem"}>
        <FancyButton
          bg="/assets/buttons/oja-cloud-orange.svg"
          w={250}
          h={70}
          onClick={handleSignin}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          <Text
            maxW="150px"
            whiteSpace="normal"
            textAlign="center"
            fontSize="sm"
          >
            Sign in
          </Text>
        </FancyButton>
      </Flex>
    </Box>
  );
};

export default SigninMobile;
