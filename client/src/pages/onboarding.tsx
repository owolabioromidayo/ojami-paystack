import { FC } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import OnboardingMobile from "@/components/mobile/Onboarding";

interface OnboardingProps {}

const Onboarding: FC<OnboardingProps> = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return <>{isMobile && <OnboardingMobile />}</>;
};

export default Onboarding;
