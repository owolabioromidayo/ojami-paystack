import React, { useState, useEffect } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, Spinner, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';

interface VirtualTransaction {
  id: number;
  currency: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  isInstantPurchase: boolean;
  sendingWallet: number;
  receivingWallet: number;
}

interface PendingBalance {
  id: number;
  createdAt: Date;
  resolvesAt: Date;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  currency: string;
  order: Order;
  role: 'sender' | 'receiver';
}

interface Order {
  id: number;
  product: { name: string; price: number };
  count: number;
  status: 'pending' | 'processing' | 'completed' | 'canceled';
}

const VirtualTransactionHistory: React.FC = () => {
  const [virtualTransactions, setVirtualTransactions] = useState<VirtualTransaction[]>([]);
  const [pendingBalances, setPendingBalances] = useState<PendingBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWalletId, setCurrentWalletId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsResponse, pendingBalancesResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_OJAMI}/api/payments/transactions/virtual`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_OJAMI}/api/payments/pending_balances`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        ]);

        const transactionsData = await transactionsResponse.json();
        const pendingBalancesData = await pendingBalancesResponse.json();

        if (!transactionsResponse.ok || !pendingBalancesResponse.ok) {
          throw new Error(transactionsData.message || pendingBalancesData.message || 'Failed to fetch data');
        }

        setVirtualTransactions(transactionsData.data.transactions);
        setPendingBalances(pendingBalancesData.pendingBalances);
        setCurrentWalletId(transactionsData.data.id);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  const isPayin = (transaction: VirtualTransaction, walletId: number) => {
    return transaction.receivingWallet === walletId;
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleVerifyPendingBalance = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_OJAMI}/api/payments/pending_balances/${id}/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to verify pending balance');
      }
      // Update the pending balance status in place
      setPendingBalances(prevBalances =>
        prevBalances.map(balance =>
          balance.id === id ? { ...balance, status: 'completed' } : balance
        )
      );
    } catch (error) {
      console.error('Error verifying pending balance:', error);
    }
  }

  const handleDisputePendingBalance = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_OJAMI}/api/payments/pending_balances/${id}/dispute`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to dispute pending balance');
      }
      // Update the pending balance status in place
      setPendingBalances(prevBalances =>
        prevBalances.map(balance =>
          balance.id === id ? { ...balance, status: 'failed' } : balance
        )
      );
    } catch (error) {
      console.error('Error disputing pending balance:', error);
    }
  }


  return (
    <Box p={4}>
      <Heading mb={4}>Virtual Transaction History</Heading>
      <Table variant="simple" mb={8}>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th isNumeric>Amount</Th>
            <Th>Currency</Th>
            <Th>Instant Purchase</Th>
          </Tr>
        </Thead>
        <Tbody>
          {virtualTransactions.map((transaction: VirtualTransaction) => (
            <Tr key={transaction.id}>
              <Td>{new Date(transaction.createdAt).toLocaleDateString()}</Td>
              <Td>{transaction.status}</Td>
              <Td isNumeric>
                <Text color={isPayin(transaction, currentWalletId!) ? 'green.500' : 'red.500'}>
                  {isPayin(transaction, currentWalletId!) ? '+' : '-'}{transaction.amount.toFixed(2)}
                </Text>
              </Td>
              <Td>{transaction.currency}</Td>
              <Td>{transaction.isInstantPurchase ? 'Yes' : 'No'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Heading mb={4}>Pending Balances</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Created At</Th>
            <Th>Resolves At</Th>
            <Th isNumeric>Amount</Th>
            <Th>Currency</Th>
            <Th>Status</Th>
            <Th>User Action</Th>
            <Th>Order Details</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pendingBalances?.map((balance: PendingBalance) => (
            <Tr key={balance.id}>
              <Td>{new Date(balance.createdAt).toLocaleDateString()}</Td>
              <Td>{new Date(balance.resolvesAt).toLocaleDateString()}</Td>
              <Td isNumeric>
                <Text color={balance.role === 'receiver' ? 'green.500' : 'red.500'}>
                  {balance.role === 'receiver' ? '+' : '-'}{balance.amount.toFixed(2)}
                </Text>
              </Td>
              <Td>{balance.currency}</Td>
              <Td>{balance.status}</Td>
              <Td>{balance.role === 'sender' ? 'Sent' : 'Received'}</Td>
              <Td>
                <Button size="sm" onClick={() => handleOrderClick(balance.order)}>
                  View Order
                </Button>
              </Td>
              <Td>
                <Button size="sm" colorScheme="green" mr={2} onClick={() => handleVerifyPendingBalance(balance.id)}>
                  Verify
                </Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDisputePendingBalance(balance.id)}>
                  Dispute
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <>
                <Text><strong>Order ID:</strong> {selectedOrder.id}</Text>
                <Text><strong>Product:</strong> {selectedOrder.product.name}</Text>
                <Text><strong>Price:</strong> {selectedOrder.product.price.toFixed(2)}</Text>
                <Text><strong>Quantity:</strong> {selectedOrder.count}</Text>
                <Text><strong>Total:</strong> {(selectedOrder.product.price * selectedOrder.count).toFixed(2)}</Text>
                <Text><strong>Status:</strong> {selectedOrder.status}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default VirtualTransactionHistory;