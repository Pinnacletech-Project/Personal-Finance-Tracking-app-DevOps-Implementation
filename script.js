document.addEventListener("DOMContentLoaded", () => {
    const transactionsTable = document.getElementById("transactions");
    const addTransactionBtn = document.getElementById("addTransaction");

    async function getTransactions() {
        const response = await fetch("/transactions");
        return response.json();
    }

    async function addTransaction() {
        const description = document.getElementById("description").value;
        const amount = document.getElementById("amount").value;

        if (!description || !amount) {
            console.error("Description and amount are required.");
            return;
        }

        const newTransaction = { description, amount: parseFloat(amount) };

        const response = await fetch("/transactions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTransaction),
        });

        if (response.ok) {
            await renderTransactions();
        }
    }

    async function renderTransactions() {
        if (!transactionsTable) {
            console.error("transactionsTable element not found!");
            return;
        }

        const transactions = await getTransactions();
        transactionsTable.innerHTML = ""; // Clear existing rows

        transactions.forEach((transaction) => {
            const row = transactionsTable.insertRow();
            row.insertCell().textContent = transaction.description;
            row.insertCell().textContent = transaction.amount;
        });
    }

    addTransactionBtn?.addEventListener("click", addTransaction);

    renderTransactions(); // Load transactions initially
});
