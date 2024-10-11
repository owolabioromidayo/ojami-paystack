import React, { useState } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    VStack,
    useToast,
    Select,
} from '@chakra-ui/react';

const PayInWallet: React.FC = () => {
    const [amount, setAmount] = useState('');
    // const [paymentMethod, setPaymentMethod] = useState('');
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = `${process.env.NEXT_PUBLIC_OJAMI}/api/payments/transaction/initialize`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }),
            });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data);
            if (data.data && data.data.authorization_url) {
                window.location.href = data.data.authorization_url;
            } else {
                throw new Error('Authorization URL not found in the response');
            }
        } catch (error: any) {
            console.log(error);
            // setError(error.message); // Update error state if there's an error
        }

        // console.log('Pay-in requested:', { amount });
        toast({
            title: 'Pay-in Requested',
            description: 'Your pay-in request has been submitted for processing.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });

       
        // Reset form
        setAmount('');
        // setPaymentMethod('');
    };

    return (
        <Box p={4}>
            <Heading mb={4}>Pay In to Wallet</Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                        <FormLabel>Amount (NGN)</FormLabel>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="blue">
                        Pay In
                    </Button>
                </VStack>
            </form >
        </Box >
    );
};

export default PayInWallet;