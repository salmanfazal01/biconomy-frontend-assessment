import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { formatDistanceStrict } from "date-fns";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DUMMY_TRANSACTIONS } from "../src/utils/dummy";
import { gasToEth, smallerString, weiToEth } from "../src/utils/helpers";

const colums = [
  { field: "id", headerName: "ID", width: 60, filterable: false },
  {
    field: "hash",
    headerName: "Txn hash",
    width: 230,
    filterable: false,
    renderCell: (params) => {
      return (
        <Link
          href={`/transaction-details/${params.value}`}
          style={{ textDecoration: "none" }}
        >
          {smallerString(params.value, 9, -15)}
        </Link>
      );
    },
  },
  { field: "block", headerName: "Block", width: 110, filterable: false },
  { field: "timestamp", headerName: "Age", width: 170, filterable: false },
  { field: "from_address", headerName: "From", width: 150, filterable: false },
  { field: "to_address", headerName: "To", width: 150, filterable: false },
  { field: "value", headerName: "Value", width: 130, filterable: false },
  { field: "fee", headerName: "Txn Fee", width: 130, filterable: false },
];

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState(DUMMY_TRANSACTIONS);

  useEffect(() => {
    const fetchTransactions = () => {
      setLoading(true);

      fetch("api/transactions").then(async (res) => {
        const _json = await res.json();

        const _transactions = _json.transactions?.map?.((t, idx) => ({
          id: idx + 1,
          hash: t.hash,
          block: t.block_number,
          timestamp: formatDistanceStrict(
            new Date(t.block_timestamp),
            new Date(),
            {
              addSuffix: true,
              includeSeconds: true,
            }
          ),
          from_address: smallerString(t.from_address, 5, -8),
          to_address: smallerString(t.to_address, 5, -8),
          value: weiToEth(t.value),
          fee: gasToEth(t.gas, t.gas_price),
        }));

        setTransactions(_transactions);
        setLoading(false);
      });
    };

    fetchTransactions();

    const interval = setInterval(() => fetchTransactions(), 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container sx={{ py: 8 }}>
      <Stack spacing={3} alignItems="center" sx={{ textAlign: "center" }}>
        <Typography variant="h4">Latest Transactions</Typography>

        <Typography
          color="text.secondary"
          variant="h6"
          sx={{ fontWeight: 400, maxWidth: 700 }}
        >
          Fusce placerat pretium mauris, vel sollicitudin elit lacinia vitae.
          Quisque sit amet nisi erat.
        </Typography>
      </Stack>

      <Paper sx={{ height: 800, mt: 5 }}>
        <DataGrid
          rows={transactions}
          columns={colums}
          autoPageSize
          loading={loading}
        />
      </Paper>
    </Container>
  );
};

export default Transactions;
