import { FC } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import RegisterBusinessMobile from "@/components/mobile/RegisterBusiness";

interface RegisterBusinessProps {}

const RegisterBusiness: FC<RegisterBusinessProps> = ({}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return <>{isMobile && <RegisterBusinessMobile />}</>;
};

export default RegisterBusiness;
