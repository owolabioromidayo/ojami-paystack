import { FC, useRef, useState, useEffect } from "react";
import {
  Flex,
  Text,
  Input,
  Box,
  Heading,
  Button,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Textarea,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  useDisclosure,
  Stack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { Formik, Field } from "formik";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";
import FancyButton from "@/components/ui/fancy-button";
import { HiOutlineCamera } from "react-icons/hi2";
import * as Yup from "yup";
import axios from "axios";
import { useOjaContext } from "../provider";
import { RiArrowDownSLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

interface AddProductMobileProps {}

const productDescriptionTags = [
  "Gaming",
  "Mobile-Device",
  "Handmade",
  "Eco-Friendly",
  "Organic",
  "Vintage",
  "Luxury",
  "Durable",
  "Lightweight",
  "Compact",
  "Waterproof",
  "Portable",
  "Customizable",
  "Recyclable",
  "High-Quality",
  "Affordable",
  "Innovative",
  "Artisanal",
  "Limited Edition",
  "Energy Efficient",
  "Multi-Functional",
  "Sustainable",
  "Minimalist",
  "Ergonomic",
  "Natural",
  "Modern",
  "Rustic",
  "Premium",
  "Comfortable",
  "Stylish",
  "High Performance",
  "Versatile",
  "Reusable",
  "Scratch Resistant",
  "Wireless",
  "Smart",
  "Heavy-Duty",
  "Biodegradable",
  "Hypoallergenic",
  "Non-Toxic",
  "Vegan",
];

const AddProductMobile: FC<AddProductMobileProps> = ({}) => {
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dat1uvwz1/image/upload`;
  const upload_preset = "f7jnwshb";
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { user } = useOjaContext();
  const [fileNames, setFileNames] = useState([""]);
  const [imageUrls, setImageUrls] = useState<string[]>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_OJAMI;
  const [currentStoreIndex, setCurrentStoreIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  useViewportHeight();
  const handleFileClick = () => {
    inputRef.current?.click();
  };

  const storeData = user?.storefronts;

  const handleTagChange = (value: any) => {
    setTags(value);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files!;
    const fileNames = [];

    for (let every of files) {
      fileNames.push(every.name);
    }

    setFileNames(fileNames);

    if (files) {
      const fileReaders: FileReader[] = [];
      const fileContents: string[] = [];

      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        fileReaders.push(reader);

        reader.onload = () => {
          fileContents[index] = reader.result as string;
        };

        reader.readAsDataURL(file);
      });
    }

    const urls = await handleImageUpload(files);
    setImageUrls(urls);
  };

  const handleImageUpload = async (selectedFiles: FileList) => {
    const imageUrls: string[] = [];

    try {
      toast({
        title: `Uploading ${selectedFiles!.length} image(s)`,
        description: "Please wait while the images are being uploaded...",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });

      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", upload_preset as string);
        formData.append("cloud_name", "dat1uvwz1");

        const response = await axios.post(CLOUDINARY_URL, formData);
        if (response) {
          return response.data.secure_url;
        } else {
          throw new Error(`Error uploading ${file.name}`);
        }
      });

      const responses = await Promise.all(uploadPromises);
      imageUrls.push(...responses);

      toast({
        title: `${selectedFiles!.length} image(s) uploaded successfully!`,
        description: "Your images have been uploaded to Cloudinary.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });
    } catch (e) {
      console.log("Error:", e);

      toast.closeAll();

      toast({
        title: `Error uploading images`,
        description: "An error occurred while uploading the images.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });
    }

    return imageUrls;
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const postData = {
      name: values.productName,
      images: imageUrls,
      description: values.description,
      tags: tags,
      storefrontId: storeData?.[currentStoreIndex]?.id,
      price: values.price,
      quantity: values.stockQuantity,
    };
    try {
      const response = await axios.post(
        `${baseUrl}/api/ecommerce/products`,
        postData,
        { withCredentials: true }
      );
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: `Product added successfully👌`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
          variant: "subtle",
        });
        setTimeout(() => {
          router.push('/vendor/products')
        }, 2000)
      } else {
        toast({
          title: `Error`,
          description: "An error occurred while adding your product.",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
          variant: "subtle",
        });
      }
    } catch (err: any) {
      console.log("error", err);
      toast({
        title: `Error`,
        description: `${err?.response?.data?.errors[0]?.message}`,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const schema = Yup.object().shape({
    description: Yup.string().max(
      300,
      "Word count exceeded. Maximum is 300 words."
    ),
    productName: Yup.string().required("Product name is required"),
    price: Yup.number().required("Price is required"),
    stockQuantity: Yup.number().required("Stock quantity is required"),
  });

  return (
    <Box h="calc(var(--vh, 1vh) * 100)" w={"100vw"} backgroundColor={"#EF8421"}>
      <Box backgroundColor={"#EF8421"} h="calc(var(--vh, 1vh) * 7)"></Box>
      <Box
        h="calc(var(--vh, 1vh) * 93)"
        w={"100vw"}
        background={"#ffffff"}
        bottom={0}
        roundedTop={"2xl"}
        borderTop={"2px solid #000000"}
        overflowY={"auto"}
        px={"1.5rem"}
        scrollBehavior={"smooth"}
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "scrollbar-width": "none",
          "-webkit-overflow-scrolling": "touch",
        }}
        pb={"3rem"}
      >
        <Heading as={"h1"} size={"lg"} mt={"1.5rem"}>
          Add my products
        </Heading>

        <Flex alignItems={"start"} mt={"1.5rem"} flexDir={"column"}>
          <Popover matchWidth isOpen={isOpen} onClose={onClose}>
            <PopoverTrigger>
              <Flex
                onClick={onToggle}
                alignItems="center"
                gap={2}
                border="2px solid #000000"
                rounded="md"
                p="0.5rem"
                bg="white"
                h={"50px"}
                _hover={{ bg: "#F0F4F8", borderColor: "#2BADE5" }}
                _active={{ bg: "#E2E8F0", borderColor: "#2BADE5" }}
                transition="background-color 0.2s, border-color 0.2s"
                cursor="pointer"
                boxShadow="sm"
                w="full"
                justifyContent="space-between"
              >
                <Text
                  maxW="120px"
                  fontWeight="500"
                  isTruncated
                  fontSize="sm"
                  color="#333"
                >
                  Select Store
                </Text>
                <Icon as={RiArrowDownSLine} color="#333" boxSize={6} />
              </Flex>
            </PopoverTrigger>
            <PopoverContent
              w="95%"
              mx="auto"
              mt={2}
              border={"2px solid #000000"}
              backgroundColor="#FFF9E5"
            >
              <PopoverCloseButton />
              <PopoverHeader fontWeight={"semibold"}>
                Select a Store
              </PopoverHeader>
              <PopoverBody>
                <Stack>
                  {storeData?.map((store, index) => (
                    <Flex
                      key={index}
                      p={"0.3rem"}
                      gap={2}
                      alignItems={"center"}
                      border={"2px solid #000000"}
                      rounded={"10px"}
                      backgroundColor={"#ffffff"}
                      _active={{ bg: "#E2E8F0", borderColor: "#2BADE5" }}
                      onClick={() => {
                        setCurrentStoreIndex(index);
                        onClose();
                      }}
                    >
                      <Avatar
                        size={"sm"}
                        src={store.profileImageUrl}
                        border={"2px solid #000000"}
                      />
                      <Text fontSize={"xs"} fontWeight={"500"}>
                        {store.storename}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Flex flexDir={"column"}>
            <Text fontSize={"2xs"} mt={"0.2rem"} color={"blue.400"}>
              {storeData?.[currentStoreIndex]?.storename}
            </Text>
          </Flex>
        </Flex>

        <Formik
          initialValues={{
            productName: "",
            price: 0,
            description: "",
            stockQuantity: 0,
          }}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={schema}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <FormControl
                isInvalid={!!errors.productName && touched.productName}
              >
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Name
                  </Text>
                  <Field
                    as={Input}
                    id="productName"
                    name="productName"
                    type="text"
                    size="sm"
                    placeholder="E.g. PlayStation 5 Pro 2TB SSD"
                    fontSize={"sm"}
                    border={"2px solid #000000"}
                    rounded={"lg"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    focusBorderColor="#2BADE5"
                    _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
                    _placeholder={{ color: "#B9B9B9" }}
                  />
                </Box>
                <FormErrorMessage>{errors.productName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.price && touched.price}>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Price
                  </Text>
                  <InputGroup rounded={"lg"} height={"50px"}>
                    <InputLeftAddon
                      background={"#FBFBFB"}
                      height={"50px"}
                      border={"2px solid #000000"}
                      borderRightWidth={"0px"}
                    >
                      ₦
                    </InputLeftAddon>
                    <Field
                      as={Input}
                      id="price"
                      name="price"
                      type={"number"}
                      size="sm"
                      height={"50px"}
                      borderLeftWidth="0px"
                      border={"2px solid #000000"}
                      borderRightRadius="lg"
                      placeholder="Enter amount"
                      fontSize={"sm"}
                      background={"#FBFBFB"}
                      focusBorderColor="#2BADE5"
                      _focus={{
                        backgroundColor: "#ffffff",
                        borderWidth: "1px",
                      }}
                      _placeholder={{ color: "#B9B9B9" }}
                    />
                  </InputGroup>
                </Box>
                <FormErrorMessage>{errors.price}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Tags
                  </Text>
                  <Menu matchWidth closeOnSelect={false}>
                    <MenuButton
                      as={Flex}
                      alignItems={"center"}
                      height={"50px"}
                      background={"#FBFBFB"}
                      _placeholder={{ color: "#B9B9B9" }}
                      rounded={"lg"}
                      fontSize={"sm"}
                      border={"2px solid #000000"}
                      w={"full"}
                      textAlign={"start"}
                      px={"0.8rem"}
                      _active={{ borderColor: "#2BADE5" }}
                    >
                      Select Tags
                    </MenuButton>
                    <MenuList px={"1rem"} maxH={"300px"} overflowY={"auto"}>
                      <MenuOptionGroup
                        title="Select all tags that apply to your product"
                        type="checkbox"
                        value={tags}
                        onChange={handleTagChange}
                      >
                        {productDescriptionTags.map((item, index) => (
                          <MenuItemOption
                            value={item}
                            rounded={"sm"}
                            key={index}
                            fontSize={"sm"}
                          >
                            {item}
                          </MenuItemOption>
                        ))}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                </Box>
              </FormControl>

              <FormControl>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Add Product Images
                  </Text>

                  <Input
                    type="file"
                    ref={inputRef}
                    display="none"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg"
                    multiple
                  />

                  <Button
                    w={"full"}
                    border={"2px solid #000000"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    rounded={"lg"}
                    _focus={{ borderColor: "#2BADE5" }}
                    onClick={handleFileClick}
                  >
                    <Icon as={HiOutlineCamera} boxSize={5} />
                  </Button>

                  <Flex flexDir={"column"}>
                    {fileNames.map((filename, index) => (
                      <Text
                        fontSize={"2xs"}
                        mt={"0.2rem"}
                        color={"blue.400"}
                        key={index}
                      >
                        {filename}
                      </Text>
                    ))}
                  </Flex>
                </Box>
              </FormControl>

              <Accordion
                allowToggle
                backgroundColor={"transparent"}
                mt={"1.5rem"}
              >
                <AccordionItem backgroundColor={"transparent"} border={"0px"}>
                  <h2>
                    <AccordionButton
                      p={0}
                      bg={"transparent"}
                      border={"0px"}
                      _focus={{ backgroundColor: "transparent" }}
                    >
                      <Text fontSize={"sm"} fontWeight={"semibold"}>
                        Advanced options
                      </Text>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={"1rem"} px={0}>
                    <FormControl isInvalid={!!errors.description}>
                      <Box mt={"0.3rem"}>
                        <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                          Description
                          <span
                            style={{
                              color: "#ACACAC",
                              fontSize: "10px",
                              fontWeight: "400",
                              paddingLeft: "5px",
                            }}
                          >
                            (300 words)
                          </span>
                        </Text>
                        <Field
                          as={Textarea}
                          id="description"
                          name="description"
                          size="sm"
                          placeholder="Write more about your product"
                          fontSize={"sm"}
                          border={"2px solid #000000"}
                          rounded={"lg"}
                          background={"#FBFBFB"}
                          focusBorderColor="#2BADE5"
                          _focus={{
                            backgroundColor: "#ffffff",
                            borderWidth: "1px",
                          }}
                          _placeholder={{ color: "#B9B9B9" }}
                        />
                        <FormErrorMessage>
                          {errors.description}
                        </FormErrorMessage>
                      </Box>
                    </FormControl>

                    <FormControl>
                      <Box mt={"1.5rem"}>
                        <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                          Stock Quantity
                        </Text>
                        <Field
                          as={Input}
                          id="stockQuantity"
                          name="stockQuantity"
                          type="number"
                          placeholder="Enter stock quantity"
                          min={0}
                          step={1}
                          fontSize={"sm"}
                          border={"2px solid #000000"}
                          rounded={"lg"}
                          height={"50px"}
                          background={"#FBFBFB"}
                          focusBorderColor="#2BADE5"
                          _focus={{
                            backgroundColor: "#ffffff",
                            borderWidth: "1px",
                          }}
                          _placeholder={{ color: "#B9B9B9" }}
                        />
                      </Box>
                    </FormControl>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Flex
                justifyContent={"center"}
                flexDirection="column"
                alignItems={"center"}
                gap={3}
              >
                <FancyButton
                  bg="/assets/buttons/oja-sweet-blue.svg"
                  mt={"1.5rem"}
                  w={200}
                  h={62}
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={imageUrls?.length == 0}
                >
                  <Text
                    maxW="150px"
                    whiteSpace="normal"
                    textAlign="center"
                    fontSize="sm"
                  >
                    Add Product{" "}
                  </Text>
                </FancyButton>
              </Flex>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default AddProductMobile;
