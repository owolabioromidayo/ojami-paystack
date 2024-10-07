import { FC, useState, useRef } from "react";
import {
  Flex,
  Text,
  Input,
  Box,
  Heading,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  FormErrorMessage,
  FormControl,
  Button,
  Icon,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";
import FancyButton from "@/components/ui/fancy-button";
import { states, countries } from "@/utils/states";
import uploadImage from "./utils/UploadImage";
import Link from "next/link";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { HiOutlineCamera } from "react-icons/hi2";
import axios from "axios";

interface RegisterBusinessMobileProps {}

const businessCategories = [
  "Retail (B2C)",
  "Wholesale (B2B)",
  "Services",
  "Marketplace (C2C)",
  "Subscription Services",
  "Digital Products",
  "Dropshipping",
  "Private Labeling",
  "Food and Beverage",
  "Health and Wellness",
  "Fashion and Apparel",
  "Home Goods",
  "Electronics",
  "Automotive",
  "Beauty and Personal Care",
  "Education and Training",
];

const eCommerceTags = [
  { tag: "Electronics", value: "electronics" },
  { tag: "Clothing", value: "clothing" },
  { tag: "Home & Kitchen", value: "home and kitchen" },
  { tag: "Beauty & Personal Care", value: "beauty and personal care" },
  { tag: "Toys & Games", value: "toys and games" },
  { tag: "Sports & Outdoors", value: "sports and outdoors" },
  { tag: "Automotive", value: "automotive" },
  { tag: "Health & Wellness", value: "health and wellness" },
  { tag: "Grocery", value: "grocery" },
  { tag: "Casual", value: "casual" },
  { tag: "Formal", value: "formal" },
  { tag: "Best Seller", value: "best seller" },
  { tag: "On Sale", value: "on sale" },
  { tag: "New Arrival", value: "new arrival" },
  { tag: "Eco-Friendly", value: "eco friendly" },
  { tag: "Portable", value: "portable" },
  { tag: "Waterproof", value: "waterproof" },
  { tag: "Luxury", value: "luxury" },
  { tag: "Gift Ideas", value: "gift ideas" },
];

const RegisterBusinessMobile: FC<RegisterBusinessMobileProps> = ({}) => {
  useViewportHeight();

  const toast = useToast();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileImageName, setProfileImageName] = useState("");
  const [bannerImageName, setBannerImageName] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_OJAMI;

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleTagChange = (value: any) => {
    setTags(value);
  };

  //handle business registration
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);

    const kybData = {
      businessName: values.businessName,
      address: values.address,
      state: values.state,
      country: values.country,
      hasPhysicalStore: values.hasPhysicalStore === "yes",
      hasDeliveryMethod: values.hasDeliveryMethod === "yes",
      usagePlan: values.usagePlan,
      businessCategory: values.businessCategory,
      RCNumber: "012200101",
    };

    const storeData = {
      storename: values.businessName,
      description: values.description,
      tags: tags,
      bannerImageUrl: bannerImageUrl,
      profileImageUrl: profileImageUrl,
    };

    try {
      const kybResponse = await axios.post(
        `${baseUrl}/api/identity/kyb`,
        kybData,
        {
          withCredentials: true,
        }
      );

      if (kybResponse.status >= 200 && kybResponse.status < 300) {
        const storeResponse = await axios.post(
          `${baseUrl}/api/ecommerce/storefronts`,
          storeData,
          {
            withCredentials: true,
          }
        );

        if (storeResponse.status >= 200 && storeResponse.status < 300) {
          toast({
            title: `Success`,
            description: "Your business has been registered successfully.",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top",
          });
          setTimeout(() => {
            window.location.assign("/vendor/store");
          }, 1000);
        } else {
          console.error("Error creating store:", storeResponse.data);
        }
      } else {
        console.error("Error processing KYB:", kybResponse.data);
      }
    } catch (err: any) {
      console.log("Error occurred during requests:", err);

      if (err.response) {
        console.error("Error response:", err.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const schema = Yup.object().shape({
    businessName: Yup.string().required("Business name is required"),

    description: Yup.string()
      .required("Description is required")
      .max(150, "Word count exceeded. Maximum is 150 words."),

    address: Yup.string().required("Address is required"),

    state: Yup.string().required("State is required"),

    country: Yup.string().required("Country is required"),

    hasPhysicalStore: Yup.string().required("Physical store is required"),

    hasDeliveryMethod: Yup.string().required("Delivery method is required"),

    usagePlan: Yup.string().required("Usage plan is required"),

    businessCategory: Yup.string().required("Business category is required"),
  });

  return (
    <Box h="calc(var(--vh, 1vh) * 100)" w={"100vw"} backgroundColor={"#A580FF"}>
      <Box backgroundColor={"#A580FF"} h="calc(var(--vh, 1vh) * 7)"></Box>
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
          Register Business
        </Heading>

        <Formik
          initialValues={{
            businessName: "",
            address: "",
            state: "",
            country: "",
            hasPhysicalStore: "",
            hasDeliveryMethod: "",
            usagePlan: "",
            businessCategory: "",
            RCNumber: "",
            description: "",
          }}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={schema}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <FormControl
                isInvalid={!!errors.businessName && touched.businessName}
              >
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Business Name
                  </Text>
                  <Field
                    as={Input}
                    id="businessName"
                    name="businessName"
                    type={"text"}
                    size="sm"
                    placeholder="e.g., John's Electronics"
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
                <FormErrorMessage>{errors.businessName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.address && touched.address}>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Address
                  </Text>
                  <Field
                    as={Input}
                    id="address"
                    name="address"
                    type={"text"}
                    size="sm"
                    placeholder="123 Example Street, City"
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
                <FormErrorMessage>{errors.address}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.state && touched.state}>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    State
                  </Text>
                  <Field
                    as={Select}
                    id="state"
                    name="state"
                    placeholder="Select state"
                    border={"2px solid #000000"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    _placeholder={{ color: "#B9B9B9" }}
                    rounded={"lg"}
                    size={"sm"}
                    fontSize={"sm"}
                    focusBorderColor="#2BADE5"
                  >
                    {states?.map((state, index) => (
                      <option value={state} key={index}>
                        {state}
                      </option>
                    ))}
                  </Field>
                </Box>
                <FormErrorMessage>{errors.state}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.country && touched.country}>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Country
                  </Text>
                  <Field
                    as={Select}
                    id="country"
                    name="country"
                    placeholder="Select Country"
                    border={"2px solid #000000"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    _placeholder={{ color: "#B9B9B9" }}
                    rounded={"lg"}
                    size={"sm"}
                    fontSize={"sm"}
                    focusBorderColor="#2BADE5"
                  >
                    {countries?.map((country, index) => (
                      <option value={country.name} key={index}>
                        {country.name}
                      </option>
                    ))}
                  </Field>
                </Box>
                <FormErrorMessage>{errors.country}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  !!errors.hasPhysicalStore && touched.hasPhysicalStore
                }
              >
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Do you have a physical store?
                  </Text>
                  <Field
                    as={Select}
                    id="hasPhysicalStore"
                    name="hasPhysicalStore"
                    placeholder="select option"
                    border={"2px solid #000000"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    _placeholder={{ color: "#B9B9B9" }}
                    rounded={"lg"}
                    size={"sm"}
                    fontSize={"sm"}
                    focusBorderColor="#2BADE5"
                  >
                    <option value={"yes"}>Yes</option>
                    <option value={"no"}>No</option>
                  </Field>
                </Box>
                <FormErrorMessage>{errors.hasPhysicalStore}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  !!errors.hasDeliveryMethod && touched.hasDeliveryMethod
                }
              >
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Do you have a delivery method?
                  </Text>
                  <Field
                    as={Select}
                    id="hasDeliveryMethod"
                    name="hasDeliveryMethod"
                    placeholder="select option"
                    border={"2px solid #000000"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    _placeholder={{ color: "#B9B9B9" }}
                    rounded={"lg"}
                    size={"sm"}
                    fontSize={"sm"}
                    focusBorderColor="#2BADE5"
                  >
                    <option value={"yes"}>Yes</option>
                    <option value={"no"}>No</option>
                  </Field>
                </Box>
                <FormErrorMessage>{errors.hasDeliveryMethod}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.usagePlan && touched.usagePlan}>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    How do you plan to use Oja mi
                  </Text>
                  <Field
                    as={Select}
                    id="usagePlan"
                    name="usagePlan"
                    placeholder="select plan"
                    border={"2px solid #000000"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    _placeholder={{ color: "#B9B9B9" }}
                    rounded={"lg"}
                    size={"sm"}
                    fontSize={"sm"}
                    focusBorderColor="#2BADE5"
                  >
                    <option value="Sell Products Online">
                      Sell Products Online
                    </option>
                    <option value="Offer Services">Offer Services</option>
                    <option value="Create a Storefront for Brand Awareness">
                      Create a Storefront for Brand Awareness
                    </option>
                  </Field>
                </Box>
                <FormErrorMessage>{errors.usagePlan}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  !!errors.businessCategory && touched.businessCategory
                }
              >
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Business category
                  </Text>
                  <Field
                    as={Select}
                    id="businessCategory"
                    name="businessCategory"
                    placeholder="Select business category"
                    border={"2px solid #000000"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    _placeholder={{ color: "#B9B9B9" }}
                    rounded={"lg"}
                    size={"sm"}
                    fontSize={"sm"}
                    focusBorderColor="#2BADE5"
                  >
                    {businessCategories?.map((category, index) => (
                      <option value={category} key={index}>
                        {category}
                      </option>
                    ))}
                  </Field>
                </Box>
                <FormErrorMessage>{errors.businessCategory}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!errors.description && touched.description}
              >
                <Box mt={"1.5rem"}>
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
                      (150 words)
                    </span>
                  </Text>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    size="sm"
                    placeholder="Store Description"
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
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </Box>
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
                        {eCommerceTags.map((item, index) => (
                          <MenuItemOption
                            value={item.value}
                            rounded={"sm"}
                            key={index}
                            fontSize={"sm"}
                          >
                            {item.tag}
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
                    Add Profile Image
                  </Text>

                  <Input
                    ref={profileInputRef}
                    type="file"
                    display="none"
                    onChange={(event) =>
                      uploadImage(event, toast, (name, url) => {
                        setProfileImageUrl(url);
                        setProfileImageName(name);
                      })
                    }
                    accept="image/png, image/jpeg"
                  />

                  <Button
                    w={"full"}
                    border={"2px solid #000000"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    rounded={"lg"}
                    _focus={{ borderColor: "#2BADE5" }}
                    onClick={() => profileInputRef.current?.click()}
                  >
                    <Icon as={HiOutlineCamera} boxSize={5} />
                  </Button>

                  <Flex flexDir={"column"}>
                    <Text fontSize={"2xs"} mt={"0.2rem"} color={"blue.400"}>
                      {profileImageName}
                    </Text>
                  </Flex>
                </Box>
              </FormControl>

              <FormControl>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Add Banner Image
                  </Text>

                  <Input
                    type="file"
                    ref={bannerInputRef}
                    display="none"
                    onChange={(event) =>
                      uploadImage(event, toast, (name, url) => {
                        setBannerImageUrl(url);
                        setBannerImageName(name);
                      })
                    }
                    accept="image/png, image/jpeg"
                  />

                  <Button
                    w={"full"}
                    border={"2px solid #000000"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    rounded={"lg"}
                    _focus={{ borderColor: "#2BADE5" }}
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <Icon as={HiOutlineCamera} boxSize={5} />
                  </Button>

                  <Flex flexDir={"column"}>
                    <Text fontSize={"2xs"} mt={"0.2rem"} color={"blue.400"}>
                      {bannerImageName}
                    </Text>
                  </Flex>
                </Box>
              </FormControl>

              <Flex justifyContent={"center"}>
                <FancyButton
                  bg="/assets/buttons/oja-sweet-purple.svg"
                  mt={"1.5rem"}
                  w={200}
                  h={62}
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                >
                  <Text
                    maxW="150px"
                    whiteSpace="normal"
                    textAlign="center"
                    fontSize="sm"
                  >
                    Register Business
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

export default RegisterBusinessMobile;
