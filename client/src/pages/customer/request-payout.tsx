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
} from '@chakra-ui/react';

const RequestPayout: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const toast = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to process the payout request
        console.log('Payout requested:', { amount, bankName, accountNumber });
        toast({
            title: 'Payout Requested',
            description: 'Your payout request has been submitted for processing.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
        // Reset form
        setAmount('');
        setBankName('');
        setAccountNumber('');
    };

    return (
        <Box p={4}>
            <Heading mb={4}>Request Payout</Heading>
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
                    <FormControl isRequired>
                        <FormLabel>Bank Name</FormLabel>
                        <Input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="Enter bank name"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Account Number</FormLabel>
                        <Input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="blue">
                        Request Payout
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default RequestPayout;