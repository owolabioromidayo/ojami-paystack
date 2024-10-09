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
import axios from 'axios';

const bankOptions = [
    { code: '120001', name: '9mobile 9Payment Service Bank' },
    { code: '801', name: 'Abbey Mortgage Bank' },
    { code: '51204', name: 'Above Only MFB' },
    { code: '51312', name: 'Abulesoro MFB' },
    { code: '044', name: 'Access Bank' },
    { code: '063', name: 'Access Bank (Diamond)' },
    { code: '120004', name: 'Airtel Smartcash PSB' },
    { code: '035A', name: 'ALAT by WEMA' },
    { code: '50926', name: 'Amju Unique MFB' },
    { code: '50083', name: 'Aramoko MFB' },
    { code: '401', name: 'ASO Savings and Loans' },
    { code: 'MFB50094', name: 'Astrapolaris MFB LTD' },
    { code: '51229', name: 'Bainescredit MFB' },
    { code: '50931', name: 'Bowen Microfinance Bank' },
    { code: '565', name: 'Carbon' },
    { code: '50823', name: 'CEMCS Microfinance Bank' },
    { code: '50171', name: 'Chanelle Microfinance Bank Limited' },
    { code: '023', name: 'Citibank Nigeria' },
    { code: '50204', name: 'Corestep MFB' },
    { code: '559', name: 'Coronation Merchant Bank' },
    { code: '51297', name: 'Crescent MFB' },
    { code: '050', name: 'Ecobank Nigeria' },
    { code: '50263', name: 'Ekimogun MFB' },
    { code: '562', name: 'Ekondo Microfinance Bank' },
    { code: '50126', name: 'Eyowo' },
    { code: '070', name: 'Fidelity Bank' },
    { code: '51314', name: 'Firmus MFB' },
    { code: '011', name: 'First Bank of Nigeria' },
    { code: '214', name: 'First City Monument Bank' },
    { code: '501', name: 'FSDH Merchant Bank Limited' },
    { code: '812', name: 'Gateway Mortgage Bank LTD' },
    { code: '00103', name: 'Globus Bank' },
    { code: '100022', name: 'GoMoney' },
    { code: '058', name: 'Guaranty Trust Bank' },
    { code: '51251', name: 'Hackman Microfinance Bank' },
    { code: '50383', name: 'Hasal Microfinance Bank' },
    { code: '030', name: 'Heritage Bank' },
    { code: '120002', name: 'HopePSB' },
    { code: '51244', name: 'Ibile Microfinance Bank' },
    { code: '50439', name: 'Ikoyi Osun MFB' },
    { code: '50457', name: 'Infinity MFB' },
    { code: '301', name: 'Jaiz Bank' },
    { code: '50502', name: 'Kadpoly MFB' },
    { code: '082', name: 'Keystone Bank' },
    { code: '50200', name: 'Kredi Money MFB LTD' },
    { code: '50211', name: 'Kuda Bank' },
    { code: '90052', name: 'Lagos Building Investment Company Plc.' },
    { code: '50549', name: 'Links MFB' },
    { code: '031', name: 'Living Trust Mortgage Bank' },
    { code: '303', name: 'Lotus Bank' },
    { code: '50563', name: 'Mayfair MFB' },
    { code: '50304', name: 'Mint MFB' },
    { code: '120003', name: 'MTN Momo PSB' },
    { code: '100002', name: 'Paga' },
    { code: '999991', name: 'PalmPay' },
    { code: '104', name: 'Parallex Bank' },
    { code: '311', name: 'Parkway - ReadyCash' },
    { code: '999992', name: 'Paycom' },
    { code: '50746', name: 'Petra Mircofinance Bank Plc' },
    { code: '076', name: 'Polaris Bank' },
    { code: '50864', name: 'Polyunwana MFB' },
    { code: '105', name: 'PremiumTrust Bank' },
    { code: '101', name: 'Providus Bank' },
    { code: '51293', name: 'QuickFund MFB' },
    { code: '502', name: 'Rand Merchant Bank' },
    { code: '90067', name: 'Refuge Mortgage Bank' },
    { code: '125', name: 'Rubies MFB' },
    { code: '51113', name: 'Safe Haven MFB' },
    { code: '50800', name: 'Solid Rock MFB' },
    { code: '51310', name: 'Sparkle Microfinance Bank' },
    { code: '221', name: 'Stanbic IBTC Bank' },
    { code: '068', name: 'Standard Chartered Bank' },
    { code: '51253', name: 'Stellas MFB' },
    { code: '232', name: 'Sterling Bank' },
    { code: '100', name: 'Suntrust Bank' },
    { code: '302', name: 'TAJ Bank' },
    { code: '51269', name: 'Tangerine Money' },
    { code: '51211', name: 'TCF MFB' },
    { code: '102', name: 'Titan Bank' },
    { code: '100039', name: 'Titan Paystack' },
    { code: '50871', name: 'Unical MFB' },
    { code: '032', name: 'Union Bank of Nigeria' },
    { code: '033', name: 'United Bank For Africa' },
    { code: '215', name: 'Unity Bank' },
    { code: '566', name: 'VFD Microfinance Bank Limited' },
    { code: '035', name: 'Wema Bank' },
    { code: '057', name: 'Zenith Bank' },
];

const RequestPayout: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [bankCode, setBankCode] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log(bankCode);
            const response = await fetch(`${process.env.NEXT_PUBLIC_OJAMI}/api/payments/payout/initialize`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Number(amount),
                    bank_code: bankCode,
                    account_number: Number(accountNumber),
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to process payout request');
            }

            toast({
                title: 'Payout Requested',
                description: 'Your payout request has been submitted for processing.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // Reset form
            setAmount('');
            setBankCode('');
            setAccountNumber('');
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to process payout request. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
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
                        <FormLabel>Bank</FormLabel>
                        <Select
                            value={bankCode}
                            onChange={(e) => setBankCode(e.target.value)}
                            placeholder="Select bank"
                        >
                            {bankOptions.map((bank) => (
                                <option key={bank.code} value={bank.code}>
                                    {bank.name}
                                </option>
                            ))}
                        </Select>
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