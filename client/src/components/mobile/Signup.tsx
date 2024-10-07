import { FC, useState, useEffect } from "react";
import {
  Flex,
  Text,
  Input,
  Box,
  Heading,
  FormControl,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useViewportHeight } from "@/utils/hooks/useViewportHeight";
import FancyButton from "@/components/ui/fancy-button";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

interface SignupMobileProps {}

const SignupMobile: FC<SignupMobileProps> = ({}) => {
  useViewportHeight();
  const [dateInput, setDateInput] = useState("text");
  const [role, setRole] = useState<string | null>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const baseUrl = process.env.NEXT_PUBLIC_OJAMI

  useEffect(() => {
    let role = localStorage.getItem("role");
    setRole(role);
  }, []);

  const schema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),

    lastName: Yup.string().required("Last name is required"),

    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^(\+\d{1,3}[- ]?)?\d{11}$/, "Phone number is not valid")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number can be up to 15 digits"),

    birthDate: Yup.string().required("birthDate is required"),

    email: Yup.string()
      .required("Email is required")
      .email("Invalid Email Format"),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must contain at least 6 characters")
      .matches(
        /[A-Z]/,
        "Password must contain at least one uppercase character"
      )
      .matches(/\d/, "Password must contain at least one number"),
  });

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    const postData = {
      firstname: values.firstName.trim(),
      lastname: values.lastName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      birthDate: values.birthDate.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
    };
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/users/signup`,
        postData
      );
      if (response.status >= 200 && response.status < 300) {
        window.location.assign("/auth/account-success");
      } else {
        toast({
          title: `Error`,
          description: "An error occurred while signing you up.",
          status: "error",
          duration: 3000,
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
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box h="calc(var(--vh, 1vh) * 100)" w={"100vw"} backgroundColor={"#2BADE5"}>
      <Box backgroundColor={"#2BADE5"} h="calc(var(--vh, 1vh) * 7)"></Box>
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
          Create account
        </Heading>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            birthDate: "",
            email: "",
            phoneNumber: "",
            password: "",
          }}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={schema}
        >
          {({ handleSubmit, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <Box mt={"2rem"}>
                <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                  Full name
                </Text>
                <FormControl
                  isInvalid={!!errors.firstName && touched.firstName}
                >
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                  <Field
                    as={Input}
                    id="firstName"
                    name="firstName"
                    type="text"
                    size="sm"
                    placeholder="First Name"
                    fontSize={"sm"}
                    border={"2px solid #000000"}
                    roundedTop={"lg"}
                    borderBottomWidth={"1px"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    focusBorderColor="#2BADE5"
                    roundedBottom={"0px"}
                    _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
                    _placeholder={{ color: "#B9B9B9" }}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.lastName && touched.lastName}>
                  <Field
                    as={Input}
                    id="lastName"
                    name="lastName"
                    type="text"
                    size="sm"
                    placeholder="Last Name"
                    fontSize={"sm"}
                    border={"2px solid #000000"}
                    borderTopWidth={"1px"}
                    roundedTop={"0px"}
                    roundedBottom={"lg"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    focusBorderColor="#2BADE5"
                    _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
                    _placeholder={{ color: "#B9B9B9" }}
                  />
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                </FormControl>

                <Text fontSize={"2xs"} color={"#767676"} mt={"0.5rem"}>
                  Make sure it matches the name on your government ID
                </Text>
              </Box>

              <FormControl isInvalid={!!errors.birthDate && touched.birthDate}>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Date Of Birth
                  </Text>
                  <Field
                    as={Input}
                    id="birthDate"
                    name="birthDate"
                    type={dateInput}
                    size="sm"
                    placeholder="dd/mm/yyyy"
                    fontSize={"sm"}
                    border={"2px solid #000000"}
                    rounded={"lg"}
                    height={"50px"}
                    background={"#FBFBFB"}
                    focusBorderColor="#2BADE5"
                    _focus={{ backgroundColor: "#ffffff", borderWidth: "1px" }}
                    _placeholder={{ color: "#B9B9B9" }}
                    onFocus={() => setDateInput("date")}
                    onBlur={(e: any) => !e.target.value && setDateInput("text")}
                  />
                </Box>
                <FormErrorMessage>{errors.birthDate}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email && touched.email}>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Email Address
                  </Text>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type={"email"}
                    size="sm"
                    placeholder="example@gmail.com"
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
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!errors.phoneNumber && touched.phoneNumber}
              >
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Phone Number
                  </Text>
                  <Field
                    as={Input}
                    id="phoneNumber"
                    name="phoneNumber"
                    type={"tel"}
                    size="sm"
                    placeholder="0801 999 9999"
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
                <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password && touched.password}>
                <Box mt={"1.5rem"}>
                  <Text mb="6px" fontSize={"sm"} fontWeight={"semibold"}>
                    Password
                  </Text>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type={"password"}
                    size="sm"
                    placeholder="••••••••••••"
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
                <FormErrorMessage>{errors.password}</FormErrorMessage>
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
                    continue
                  </Text>
                </FancyButton>
              </Flex>
            </form>
          )}
        </Formik>

        <Flex justifyContent={"center"} mt={"1rem"}>
          <Text fontSize={"xs"} textAlign={"center"}>
            By clicking Continue you agree to out terms and conditions
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default SignupMobile;
