import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';

const VirtualTransactionHistory: React.FC = () => {
  // Mock data - replace with actual data fetching logic
  const virtualTransactions = [
    { id: 1, date: '2023-05-02', description: 'Virtual Purchase', amount: -30.00 },
    { id: 2, date: '2023-05-04', description: 'Virtual Deposit', amount: 50.00 },
    // Add more virtual transactions as needed
  ];

  return (
    <Box p={4}>
      <Heading mb={4}>Virtual Transaction History</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Description</Th>
            <Th isNumeric>Amount (NGN)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {virtualTransactions.map((transaction) => (
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

export default VirtualTransactionHistory;