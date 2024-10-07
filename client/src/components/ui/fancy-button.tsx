//@ts-nocheck

import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

interface FancyButtonProps extends ButtonProps{
    children: React.ReactNode;
    bg: string
}
const FancyButton: React.FC<FancyButtonProps> = ({ children, bg, ...props }) => {
  return (
    <Button
      {...props}
      bg="none"
      border="none"
    //   width="200px"  
    //   height="100px" 
      backgroundImage={bg}
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      backgroundSize="contain"  // Controls SVG scaling
      color="black"
      _hover={{
        transform: 'scale(1.05)', // Scale on hover
        backgroundImage: `url(${bg})`, // Ensure background is maintained on hover
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
      _focus={{ boxShadow: 'none' }} // Remove focus outline
      _active={{ bg: "none" ,
        transform: 'scale(0.98)', // Scale on hover
        backgroundImage: `url(${bg})`, // Ensure background is maintained on hover
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      {children}
    </Button>
  );
};

export default FancyButton;
