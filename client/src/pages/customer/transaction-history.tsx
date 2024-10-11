import React, { useState, useEffect } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, Spinner } from '@chakra-ui/react';
import axios from 'axios';

interface Transaction {
  id: number;
  type: "payin" | "payout";
  status: "pending" | "success" | "failed";
  reference?: string;
  amount: number;
  paidAt?: Date;
  createdAt: Date;
  channel?: string;
  failureReason?: string;
  currency: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_OJAMI}/api/payments/transactions`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch transactions');
        }
        setTransactions(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading mb={4}>Transaction History</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Reference</Th>
            <Th isNumeric>Amount</Th>
            <Th>Channel</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>{new Date(transaction.createdAt).toLocaleDateString()}</Td>
              <Td>{transaction.type}</Td>
              <Td>{transaction.status}</Td>
              <Td>{transaction.reference || 'N/A'}</Td>
              <Td isNumeric>
                <Text color={transaction.type === 'payin' ? 'green.500' : 'red.500'}>
                  {transaction.amount.toFixed(2)} {transaction.currency}
                </Text>
              </Td>
              <Td>{transaction.channel || 'N/A'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TransactionHistory;