const Modal = {
    open() {
        // Abrir modal
        // Adicionar a class active ao modal
        document.querySelector('.modal-overlay')
        .classList.add('active');
    },
    close() {
        // Fechar o modal
        // Remover a class active do modal
        document.querySelector('.modal-overlay')
        .classList.remove('active');
    }
    // // USANDO TOGGLE

    // function Modal() {
    //     const addAndRemoveModal = document.querySelector('.modal-overlay')
    //     addAndRemoveModal.classList.toggle('active');
    // }
}

// TRANSAÇÕES
const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021',
    }, 
    {
        id: 2,
        description: 'WebSite',
        amount: 500000,
        date: '23/01/2021',
    }, 
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021',
    },
    {
        id: 4,
        description: 'App',
        amount: 2000000,
        date: '23/01/2021',
    }
];

const Transaction = {
    incomes() {
        // Somar as entradas ($)
    },
    expenses() {
        // Somar as saídas ($)
    },
    total() {
        // incomes - expenses
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        // console.log(transaction);
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) {

        const cssClasse = transaction.amount > 0 ? "income" : "expense";

        const formatAmount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${cssClasse}">${formatAmount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover transação" />
            </td>
        `;

        return html;
    }
}

const Utils = {
   formatCurrency(value) {
       const signal = Number(value) < 0 ? "-" : "";

       // Expressão Regular (regex)
       // /\D/g = trocar por tudo que não for número, g = globalmente
        value = String(value).replace(/\D/g, "");
        // Formatação da moeda
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

       return signal + value;
   } 
}

// Buscando os elementos dentro do objeto das transações (transactions)
transactions.forEach(function(transaction) {
    DOM.addTransaction(transaction)
})