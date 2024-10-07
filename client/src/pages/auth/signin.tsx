import { FC } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import SigninMobile from "@/components/mobile/Signin";

interface SigninProps {}

const Signin: FC<SigninProps> = ({}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return <>{isMobile && <SigninMobile />}</>;
};

export default Signin;
