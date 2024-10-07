import { FC } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import SignupMobile from "@/components/mobile/Signup";

interface SignupProps {}

const Signup: FC<SignupProps> = ({}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return <>{isMobile && <SignupMobile />}</>;
};

export default Signup;
