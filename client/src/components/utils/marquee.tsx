import { useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import {  keyframes } from '@emotion/react';

const marqueeAnimation = keyframes`
 0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
`;

export const Marquee = ({ children }: {children: React.ReactNode}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Flex
      overflow="hidden"
      boxSizing="border-box"
      position="relative"
      alignItems="center"
      justifyContent="center"
      height="450px"
      width="full"
      background="white"
      whiteSpace="nowrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Flex
        position="absolute"
        animation={`${marqueeAnimation} 10s linear infinite`}
        css={isHovered ? { animationPlayState: 'paused' } : {}}
        gap={14}
        bg="red"
      >
        <Box as="span" display="flex" width="150%">
          <Box as="div">{children}</Box>
        </Box>
        <Box as="span" display="flex" width="150%">
          <Box as="div">{children}</Box>
        </Box>
      </Flex>
    </Flex>
  );
};

const marqueeAnimation2 = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const swapAnimation = keyframes`
  0%, 50% {
    left: 0%;
  }
  50.01%, 100% {
    left: 100%;
  }
`;

interface TickerProps {
  children: React.ReactNode;
  duration?: string;
}

export const Ticker: React.FC<TickerProps> = ({ children, duration = "20s" }) => {
  return (
    <Flex
      width="100%"
      height="3.5rem"
      overflow="hidden"
      position="fixed"
      bottom="0"
      backgroundColor="#FFCA46"
      whiteSpace="nowrap"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        display="inline-block"
        animation={`${marqueeAnimation2} ${duration} linear infinite`}
      >
        <Box
          as="span"
          display="inline-block"
          position="relative"
          animation={`${swapAnimation} ${duration} linear infinite`}
        >
          {children}
        </Box>
        <Box
          as="span"
          display="inline-block"
          position="relative"
          animation={`${swapAnimation} ${duration} linear infinite`}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

