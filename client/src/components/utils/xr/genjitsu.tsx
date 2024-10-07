"use client";

import { Canvas } from "@react-three/fiber";
import {
  Center,
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Model } from "./Sofa.jsx";
import { XROrigin, XR, createXRStore, XRStore } from "@react-three/xr";
import React, { Suspense, useEffect, useState } from "react";
import { Avatar, Flex,Button, Icon, IconButton, Stack, Text, useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton, useMediaQuery } from "@chakra-ui/react";
import { TbCube3dSphere, TbShoppingCart } from "react-icons/tb";
import FancyButton from "@/components/ui/fancy-button";
import { RiFullscreenFill } from "react-icons/ri";
import { IoStarSharp } from "react-icons/io5";

interface GenjitsuProps{
    model: JSX.Element;
    avatar: string;
    review: string;
    ratings: number;
    caption: string;
    price: string;
    vendor: string;
}

// Add this function at the top of the file, outside of the component
const isMobileDevice = () => {
  const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
};

export const Genjitsu: React.FC<GenjitsuProps> = ({model, avatar, review, ratings, caption, price, vendor}) => {
  const [store, setStore] = useState<XRStore | null>(null);
  const [scale, setScale] = useState(0.7); // State for model scale
  const [show, setShow] = useState(false)
  const { onOpen, isOpen, onClose } = useDisclosure()
  const { isOpen: isAOpen, onOpen: onAOpen, onClose: onAClose } = useDisclosure()
  const cancelRef = React.useRef(null)
  const [mobile] = useMediaQuery('(max-width: 600px)')
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Create the XR store only in the client
    const xrStore = createXRStore({ depthSensing: true, hand: false });
    setStore(xrStore);

    // Check if the device is mobile
    setIsMobile(isMobileDevice());
  }, []);

  if (!store) {
    return <div>Loading...</div>; // show a loading state while the store is being created
  }



  return (
    <Flex
      id="genjitsu"
      direction="column"
      p={5}
      bg="white"
      h="540px"
      w={{ base: "full", md: "500px"}}
      pos="relative"
      align="center"
      rounded="15px"
      border="2px solid #000"
    >

      <Flex direction="column" align="center" pos="relative"  border="2px solid #000" rounded="10px" h="80%" w="full" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <Canvas shadows camera={{ position: [0, 3, 5], fov: 80 }}>
          <XR store={store}>
            <group position={[0, -0.75, 0]}>
              <Suspense>
                <Center top>
                  {model}
                </Center>
              </Suspense>
              <directionalLight position={[1, 8, 1]} castShadow />
              <ambientLight />
              <mesh receiveShadow rotation-x={-Math.PI / 2} scale={1}>
                <shadowMaterial opacity={0.7} />
                <planeGeometry />
              </mesh>
              <group position={[0, 0, 2.6]}>
                <XROrigin scale={0.08} />
              </group>
            </group>
            <OrbitControls />
            <Suspense>
              <Environment preset="dawn" blur={1} />
            </Suspense>
          </XR>
        </Canvas>
        <IconButton icon={<RiFullscreenFill />} onClick={onOpen} aria-label="full-screen" bottom={5} right={5} pos="absolute"  />
      </Flex>
      <Flex gap={2} align="center" w="full" mt={2} mb={3}>
      <Avatar src={avatar} border="2px solid #000" />
            <Stack spacing={-1}>
                <Text fontSize={18} fontWeight={600}>
                {vendor}
            </Text>
            <Flex align="center" gap={1}>
            <Icon as={IoStarSharp} />
            <Text fontSize={14} color="#000" fontWeight={500}>
                {ratings}({review})
            </Text>
            </Flex>
            </Stack>
      </Flex>
      <Text fontWeight={500} mb={2} textAlign="left" w="full">
      {caption}
      </Text>
      <Text fontWeight={600} fontSize={22} mb={5} textAlign="left" w="full">
     {price}
      </Text>
      <FancyButton
      transform="rotate(-14deg)"
        bg="/assets/buttons/oja-cloud-purple.svg"
        w="200px"
        h="100px"
        bottom="-40px"
        right={"-35px"}
        pos="absolute"
        onClick={() => {isMobile ? store.enterAR() : onAOpen()}}
      >
        <Flex gap={2} align="center">
          <Icon as={TbCube3dSphere} />
          View in AR
        </Flex>
      </FancyButton>



      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent border="2px solid #000" bg="#FFFFFF50" backdropFilter="blur(15px)" >
          <ModalHeader>
            <Flex align="center" justify="space-between" w="full" direction={{ base: "column", lg: "row"}}>
                <Text textAlign={"center"}>
            {caption}   
                </Text>
                <Flex gap={2} align="center">
                    <Button colorScheme='orange' border="2px solid #000" color="black" mr={3} onClick={onClose}>
                Close
                </Button>
                <Button variant='ghost' onClick={() => store.enterAR()}>View in AR</Button>
                </Flex>
            </Flex>
            </ModalHeader>
          <ModalBody>
            <Flex w="full" h={{ base: "500px", lg: "1000px"}} border="2px solid #000" bg="white" rounded="20px">
            <Canvas shadows camera={{ position: [0, 3, 5], fov: 80 }}>
            <XR store={store}>
                <group position={[0, -0.75, 0]}>
                <Suspense>
                    <Center top>
                    {model}
                    </Center>
                </Suspense>
                <directionalLight position={[1, 8, 1]} castShadow />
                <ambientLight />
                <mesh receiveShadow rotation-x={-Math.PI / 2} scale={1}>
                    <shadowMaterial opacity={0.7} />
                    <planeGeometry />
                </mesh>
                <group position={[0, 0, 2.6]}>
                    <XROrigin scale={0.08} />
                </group>
                </group>
                <OrbitControls />
                <Suspense>
                <Environment preset="dawn" blur={1} />
                </Suspense>
            </XR>
            </Canvas>
            </Flex>
            <Flex align="center" w="full" justify="space-between" direction={{ base: "column", lg: "row"}}>
                <Stack>
                    <Flex gap={2} align="center" w="full" mt={2} mb={3}>
            <Avatar src={avatar} border="2px solid #000" />
                    <Stack spacing={-1}>
                        <Text fontSize={18} fontWeight={600}>
                        {vendor}
                    </Text>
                    <Flex align="center" gap={1}>
                    <Icon as={IoStarSharp} />
                    <Text fontSize={14} color="#000" fontWeight={500}>
                        {ratings}({review})
                    </Text>
                    </Flex>
                    </Stack>
            </Flex>
            <Text fontWeight={500} mb={2} textAlign="left" w="full">
            {caption}
            </Text>
            <Text fontWeight={600} fontSize={22} mb={5} textAlign="left" w="full">
            {price}
            </Text>
                </Stack>
      <FancyButton
      transform="rotate(5deg)"
        bg="/assets/buttons/oja-sweet-green.svg"
        w="200px"
        h="100px"
      >
        <Flex gap={2} align="center">
          <Icon as={TbShoppingCart} />
          Add to Cart
        </Flex>
      </FancyButton>
            </Flex>
          </ModalBody>

          <ModalFooter>
            
          </ModalFooter>
        </ModalContent>
      </Modal>



      {/** AR VIEWER ALERT IS NOT MOBILE */}
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onAClose}
        isOpen={isAOpen}
        isCentered
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>View AR Product</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Your device does not support AR. Please use a device with AR capabilities to view this product. 
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onAClose}>
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
}
