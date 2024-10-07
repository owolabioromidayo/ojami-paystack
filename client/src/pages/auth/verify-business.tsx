import { FC } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import VerifyBusinessMobile from "@/components/mobile/VerifyBusiness";

interface VerifyBusinessProps {}

const VerifyBusiness: FC<VerifyBusinessProps> = ({}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return <>{isMobile && <VerifyBusinessMobile />}</>;
};

export default VerifyBusiness;
