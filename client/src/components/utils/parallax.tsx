import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { Flex } from "@chakra-ui/react";

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity?: number;
}

export function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  // Wrap value to create a continuous scrolling effect
  const x = useTransform(baseX, (v) => `${wrap(-100, -50, v)}%`);

  const directionFactor = useRef<number>(1);
  
  // Animation frame for smooth scrolling
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Change direction based on scroll velocity
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <Flex className="parallax" bg="red" width="100%" overflow="hidden">
      <motion.div className="scroller" style={{ x }}>
        <Flex gap={14} whiteSpace="nowrap">
          {/* Repeat children dynamically based on content length */}
         
              <span>{children}</span>
              <span>{children}</span>
              <span>{children}</span>
              <span>{children}</span>

             
        </Flex>
      </motion.div>
    </Flex>
  );
}