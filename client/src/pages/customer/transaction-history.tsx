import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';

const TransactionHistory: React.FC = () => {
  // Mock data - replace with actual data fetching logic
  const transactions = [
    { id: 1, date: '2023-05-01', description: 'Purchase', amount: -50.00 },
    { id: 2, date: '2023-05-03', description: 'Deposit', amount: 100.00 },
    // Add more transactions as needed
  ];

  return (
    <Box p={4}>
      <Heading mb={4}>Transaction History</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Description</Th>
            <Th isNumeric>Amount (NGN)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>{transaction.date}</Td>
              <Td>{transaction.description}</Td>
              <Td isNumeric>
                <Text color={transaction.amount >= 0 ? 'green.500' : 'red.500'}>
                  {transaction.amount.toFixed(2)}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TransactionHistory;