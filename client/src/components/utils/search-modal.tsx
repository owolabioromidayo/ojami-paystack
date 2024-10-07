import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  ModalBody,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Collapse,
  Icon,
  useDisclosure,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { IoCamera, IoSearch, IoSparkles, IoSparklesOutline } from "react-icons/io5";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isOpen: isMOpen, onToggle } = useDisclosure();
  const tools = [
    { 
        label: "AI Chat",
    },
    { 
        label: "AI Search",
    },
    { 
        label: "Explore",
    },
    { 
        label: "AR Store",
    },
  ]

  return (
    <Modal
      isCentered
      onClose={() => {
        onClose();
        isMOpen === true ? onToggle() : null;
      }}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      size="xl"
    >
      <ModalOverlay />
      <ModalContent rounded="20px" border="2px solid #000" px={1} py={5}>
        <ModalBody>
          <Flex align="center" gap={1}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" py={"34px"}>
                <Icon as={IoSearch} />
              </InputLeftElement>
              <Input
                border="2px solid #000"
                rounded="12px"
                py={8}
                focusBorderColor="#EF8421"
              />
            </InputGroup>
            <IconButton
              // onClick={() => onToggle()}
              colorScheme="orange"
              _hover={{ bg: "orange.100"}}
              variant="ghost"
              icon={<IoCamera />}
              fontSize={32}
              aria-label="image search"
              py={8}
              px={6}
            />
            <IconButton
              onClick={() => onToggle()}
              _hover={{ bg: "orange.100"}}
              colorScheme="orange"
              variant="ghost"
              icon={<IoSparkles />}
              fontSize={30}
              aria-label="shop assistant"
              py={8}
              px={6}
            />
          </Flex>
          <Collapse in={isMOpen} animateOpacity>
            <Box
              p="20px"
              mt="4"
              bg="white"
              border="2px solid #000"
              rounded="md"
            >
              <Text color="black" mb={2} fontWeight={600}>
                Quick Tools
              </Text>
              <Flex gap={2} align="center">
                {tools.map((item) => (
                    <Box
                    key={item.label}
                    bg="orange"
                    w="115px"
                    h="80px"
                    rounded="12px"
                    border="2px solid #000"
                    alignContent="center"
                    textAlign="center"
                    fontWeight={600}
                    cursor="pointer"
                    transition="0.5s ease"
                    _hover={{ transform: 'scale(1.05)' }}
                    _active={{ transform: 'scale(0.95)' }}
                    >
                    {item.label}
                    </Box>

                ))}
              </Flex>

              <Flex align="center" gap={2} mt={10} mb={2} fontWeight={600}>
                <Icon as={IoSparklesOutline} />
                <Text>Suggested searches</Text>
              </Flex>
              <Flex
                align="center"
                gap={2}
                p={2}
                _hover={{ bg: "#f0f0f0" }}
                rounded="lg"
                cursor="pointer"
              >
                <Icon
                  as={IoSearch}
                  fontSize={36}
                  p={2}
                  border="1px solid #e2e2e2"
                  rounded="4"
                />
                <Text>PlayStation 5 Pro</Text>
              </Flex>
            </Box>
          </Collapse>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
