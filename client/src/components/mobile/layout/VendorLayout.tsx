import { FC, ReactNode, useEffect } from "react";
import { Box, Text, Icon, Flex } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { BiHomeAlt, BiBox } from "react-icons/bi";
import { LiaTagSolid } from "react-icons/lia";
import { IoStorefrontOutline } from "react-icons/io5";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";

interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
  tag: keyof ActiveBg;
}

interface ActiveBg {
  home: string;
  orders: string;
  products: string;
  store: string;
}

interface VendorLayoutProps {
  children: ReactNode;
}

const LinkItems: Array<LinkItemProps> = [
  {
    name: "Home",
    icon: BiHomeAlt,
    url: "/vendor/home",
    tag: "home",
  },
  {
    name: "Orders",
    icon: BiBox,
    url: "/vendor/orders",
    tag: "orders",
  },
  {
    name: "Products",
    icon: LiaTagSolid,
    url: "/vendor/products",
    tag: "products",
  },
  {
    name: "My Store",
    icon: IoStorefrontOutline,
    url: "/vendor/store",
    tag: "store",
  },
];

const activeLinkBg: ActiveBg = {
  home: "/images/mobile/orange-star.svg",
  orders: "/images/mobile/purple-star.svg",
  products: "/images/mobile/green-star.svg",
  store: "/images/mobile/blue-star.svg",
};

const VendorLayout: FC<VendorLayoutProps> = ({ children }) => {
  useViewportHeight();
  const pathName = usePathname();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_OJAMI;

  useEffect(() => {
    const fetchUserData = async () => {
      const url = `${baseUrl}/api/auth/users/me`;
      try {
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) {
          router.push("/auth/signin");
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchUserData();
  });

  return (
    <Box backgroundColor={"#FFFFFF"}>
      <Box
        height="calc(var(--vh, 1vh) * 100 - 60px)"
        overflowY={"auto"}
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "scrollbar-width": "none",
          "-webkit-overflow-scrolling": "touch",
        }}
      >
        {children}
      </Box>

      <Box
        display={{ base: "block", md: "none" }}
        position={"fixed"}
        bottom="0"
        left="0"
        right="0"
        bg="#ffffff"
        boxShadow="xl"
        zIndex="1000"
        height={"60px"}
        borderTopWidth={"2px"}
        borderTopColor={"#000000"}
      >
        <Flex
          justify={"space-around"}
          alignItems={"center"}
          h={"full"}
          py={"0.1rem"}
        >
          {LinkItems.map((item, index) => (
            <Flex
              key={index}
              _hover={{
                cursor: "pointer",
              }}
              onClick={() => router.push(item?.url)}
              alignItems={"center"}
              flexDir={"column"}
              backgroundImage={
                pathName.includes(item.url) ? activeLinkBg[item.tag] : "#B0B0B0"
              }
              backgroundPosition={"center"}
              backgroundRepeat={"no-repeat"}
              backgroundSize={"contain"}
              w={"full"}
              h={"full"}
              justifyContent={"center"}
            >
              <Icon
                as={item.icon}
                color={pathName.includes(item.url) ? "#000000" : "#B0B0B0"}
                boxSize={5}
                _hover={{
                  transform: "scale(1.1)",
                  transition: "0.5s",
                }}
                aria-label={item.name}
              />
              <Text
                color={pathName.includes(item.url) ? "#000000" : "#B0B0B0"}
                fontSize={"2xs"}
                fontWeight={"500"}
                whiteSpace="normal"
                textAlign="center"
              >
                {item?.name}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default VendorLayout;
