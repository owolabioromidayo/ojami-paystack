import { FC } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import AccountSuccessMobile from "@/components/mobile/AccountSuccess";

interface AccountSuccessProps {}

const AccountSuccess: FC<AccountSuccessProps> = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return <>{isMobile && <AccountSuccessMobile />}</>;
};

export default AccountSuccess;
