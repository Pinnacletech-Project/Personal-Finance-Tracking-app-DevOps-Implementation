import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const DB_FILE = 'database.json';

// Helper function to read database
const readDatabase = () => {
    if (!fs.existsSync(DB_FILE)) return { transactions: [] };
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
};

// Helper function to write database
const writeDatabase = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Function to get the current local date in YYYY-MM-DD format
const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-CA'); // Local date format (YYYY-MM-DD)
};

// API to get transactions
app.get('/transactions', (req, res) => {
    const data = readDatabase();
    res.json(data.transactions);
});

// API to add a transaction
app.post('/transactions', (req, res) => {
    const data = readDatabase();
    const newTransaction = {
        id: Date.now(),
        description: req.body.description,
        amount: req.body.amount,
        type: req.body.type,
        date: req.body.date || getFormattedDate()  // Use request date or default to today's local date
    };
    data.transactions.push(newTransaction);
    writeDatabase(data);
    res.json({ message: 'Transaction added', transaction: newTransaction });
});

// API to delete a transaction
app.delete('/transactions/:id', (req, res) => {
    const data = readDatabase();
    const transactionId = parseInt(req.params.id);
    data.transactions = data.transactions.filter(t => t.id !== transactionId);
    writeDatabase(data);
    res.json({ message: 'Transaction deleted' });
});

// API to edit a transaction
app.put('/transactions/:id', (req, res) => {
    const data = readDatabase();
    const transactionId = parseInt(req.params.id);
    
    const index = data.transactions.findIndex(t => t.id === transactionId);
    if (index !== -1) {
        data.transactions[index] = {
            id: transactionId,
            description: req.body.description,
            amount: req.body.amount,
            type: req.body.type,
            date: req.body.date || data.transactions[index].date // Keep existing date if not provided
        };
        writeDatabase(data);
        res.json({ message: 'Transaction updated', transaction: data.transactions[index] });
    } else {
        res.status(404).json({ message: 'Transaction not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
