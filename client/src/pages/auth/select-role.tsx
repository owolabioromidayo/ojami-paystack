import { FC } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import SelectRoleMobile from "@/components/mobile/SelectRole";

interface OnboardingProps {}

const Onboarding: FC<OnboardingProps> = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return <>{isMobile && <SelectRoleMobile />}</>;
};

export default Onboarding;
