// @ts-nocheck

import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  useToast,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Icon,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import FancyButton from "../ui/fancy-button";
import { IoColorWand } from "react-icons/io5";

interface CreateVoucherProps {
  onClose: () => void;
  isOpen: boolean;
}

export const CreateVoucher = ({ onClose, isOpen }: CreateVoucherProps) => {
  const toast = useToast();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent border="2px solid #000" rounded="10px">
        <ModalHeader>
          <Flex align="center" justify="center" gap={2}>
            <Icon as={IoColorWand} />
            <Text>Generate Voucher</Text>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{ amount: "", currency: "NGN" }}
            onSubmit={async (values, actions) => {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_OJAMI}/api/payments/vouchers/generate`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({
                    amount: values.amount,
                    currency: values.currency,
                  }),
                }
              );
              const data = await response.json();
              if (!response.ok) {
                toast({
                  title: "Voucher Generation Error",
                  description: data.errors[0].message,
                  status: "error",
                  duration: 5000,
                  position: "top",
                  containerStyle: {
                    border: "2px solid #000",
                    rounded: "md",
                  },
                });
              } else {
                toast({
                  title: "Voucher Generated",
                  description: "Your voucher has been generated",
                  status: "success",
                  duration: 5000,
                  position: "top",
                  containerStyle: {
                    border: "2px solid #000",
                    rounded: "md",
                  },
                });
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }
            }}
          >
            {(props) => (
              <Form>
                <Flex gap={3} w="full" align="center">
                <Field name="amount">
                  {({ field, form }: any) => (
                    <FormControl>
                      <FormLabel>Amount</FormLabel>
                      <Input
                        {...field}
                        type="number"
                        border="2px solid #000"
                        rounded="12px"
                        py={8}
                        focusBorderColor="#EF8421"
                      />

                      <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="currency">
                  {({ field, form }: any) => (
                    <FormControl>
                      <FormLabel>Select Currency</FormLabel>
                     <Select {...field} placeholder="Select Currency" h="63px" border="2px solid #000"
                        rounded="12px"
                        focusBorderColor="#EF8421">
                        <option value="NGN">NGN</option>
                        <option value="USD">USD</option>
                        <option value="KES">KES</option>
                        <option value="GHS">GHS</option>

                      </Select>

                      <FormErrorMessage>{form.errors.currency}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                </Flex>

                <Flex align="center" direction="column" gap={3} w="full" mt={5}>
                  <FancyButton
                    bg="/assets/buttons/oja-cloud-purple.svg"
                    w="200px"
                    h="90px"
                    fontWeight={700}
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Generate
                  </FancyButton>
                </Flex>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
