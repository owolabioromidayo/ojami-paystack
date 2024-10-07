import { FC } from "react";
import { Box, Text, Stack } from "@chakra-ui/react";
import Image from "next/image";
import FancyButton from "@/components/ui/fancy-button";
import Link from "next/link";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";

interface OnboardingMobileProps {}

const OnboardingMobile: FC<OnboardingMobileProps> = () => {
  useViewportHeight();

  return (
    <Box
      backgroundImage="/images/mobile/bgs/onboardbg.svg"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="center"
      minH="calc(var(--vh, 1vh) * 100)"
      width="100vw"
      overflowY="auto"
      pt={"10rem"}
    >
      <Stack direction="column" alignItems="center" w="full" gap={0}>
        <Image
          alt="Ojamii Logo"
          src="/icons/ojami-ai.svg"
          height={120}
          width={120}
          priority
        />
        <Stack mt="2rem" textAlign="center">
          <Text fontWeight="600" fontSize="md">
            A new shopping experience
          </Text>
          <Text fontWeight="600" fontSize="md">
            Simplified for your business
          </Text>
        </Stack>
      </Stack>

      <Stack alignItems="center" mt="3rem" spacing={4}>
        <FancyButton bg="/assets/buttons/oja-cloud-orange.svg" w={200} h={70}>
          <Text
            maxW="150px"
            whiteSpace="normal"
            textAlign="center"
            fontSize="sm"
          >
            <Link href={"/auth/signup"}>Sign Up</Link>
          </Text>
        </FancyButton>
      </Stack>

      <Box display="flex" justifyContent="center" mt="2rem">
        <Text fontSize="sm">
          Already have an account?{" "}
          <Link href="/auth/signin" style={{ fontWeight: "bold" }}>
            Sign in
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default OnboardingMobile;
