document.addEventListener('DOMContentLoaded', function() {
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');

    // Fetch transactions from server
    fetchTransactions();

    // Add event listener to form submission
    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(transactionForm);
        const type = formData.get('type');
        const amount = formData.get('amount');
        const description = formData.get('description');

        // Send transaction data to server
        addTransaction({ type, amount, description });

        // Clear form fields
        transactionForm.reset();
    });

    // Function to fetch transactions from server
    function fetchTransactions() {
        fetch('/api/transactions')
            .then(response => response.json())
            .then(transactions => {
                transactionList.innerHTML = '';
                transactions.forEach(transaction => {
                    const transactionElement = document.createElement('div');
                    transactionElement.classList.add('transaction');
                    transactionElement.innerHTML = `
                        <strong>Type:</strong> ${transaction.type}<br>
                        <strong>Amount:</strong> $${transaction.amount}<br>
                        <strong>Description:</strong> ${transaction.description}<br>
                        <strong>Date:</strong> ${new Date(transaction.date).toLocaleString()}<br>
                    `;
                    transactionList.appendChild(transactionElement);
                });
            })
            .catch(error => console.error('Error fetching transactions:', error));
    }

    // Function to add a transaction
    function addTransaction(transactionData) {
        fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        })
        .then(response => response.json())
        .then(transaction => {
            fetchTransactions();
        })
        .catch(error => console.error('Error adding transaction:', error));
    }
});
