import { FC } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import AddProductAddProductMobile from "@/components/mobile/AddProduct";

interface AddProductProps {}

const AddProduct: FC<AddProductProps> = ({}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return <>{isMobile && <AddProductAddProductMobile />}</>;
};

export default AddProduct;
