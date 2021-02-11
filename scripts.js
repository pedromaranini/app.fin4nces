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

const Storage = {
    // Salvando no storage do browser
    get() {
        // Convertendo de string para array ou objeto
        return JSON.parse(localStorage.getItem("app.finances:Transaction")) ||
        [];
    },
    set(transactions) {
        localStorage.setItem("app.finances:Transaction",
        // Convertendo para string
        JSON.stringify(transactions));
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        // Adicionando nova transação
        Transaction.all.push(transaction)
        
        // Dando reload na aplicação atualizando os valores das novas transações
        App.reload();
    },
    remove(index) {
        // Removendo a transação
        Transaction.all.splice(index, 1);
            App.reload();
    },
    incomes() {
        // Somar as entradas ($)
        let income = 0;
        // Para cada transação, verificar se é > 0
        Transaction.all.forEach((transaction) => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        });
        // se for > 0, somar a uma variável e retornar
        return income;
    },
    expenses() {
        // Somar as saídas ($)
        let expense = 0;
        // Para cada transação, verificar se é > 0
        Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        });
        // se for > 0, somar a uma variável e retornar
        return expense;
    },
    total() {
        // incomes - expenses
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        // Adicionando uma nova transação na tabela
        // console.log(transaction);
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        // Busncado o conteudo HTML e alterando os valores no Javascript
        const cssClasse = transaction.amount > 0 ? "income" : "expense";

        const formatAmount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${cssClasse}">${formatAmount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img 
                    onclick="Transaction.remove(${index})"
                    src="./assets/minus.svg" 
                    alt="Remover transação" 
                />
            </td>
        `;

        return html;
    },
    updateBalance() {
        // Atualizando so valores das Entradas, Saídas e o Total
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses());
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());
    },
    clearTransactions() {
        // Limpando a lista de transações, para depois popular
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    // Formatando a data inserida no input
    formatDate(date) {
        // Split = Seprações
        const spplitedDate = date.split("-");
        // Posição 2 = Dia, Posição 1 = Mês, Posição 0 = Ano
        return `${spplitedDate[2]}/${spplitedDate[1]}/${spplitedDate[0]}`;
    },
    // Formatando o valor digitado no input, caso seja inserido com ponto
    formatAmount(value) {
        value = Number(value) * 100;
        
        return value;
    },
    // Formatação dos valores para o REAL
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

const Form  = {
    description: document.querySelector('#description'),
    amount: document.querySelector('#amount'),
    date: document.querySelector('#date'),

    // Armazenando os valores dos inputs
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },
    // Verificar se todos os campos estão preenchidos
    validateField() {
        const { description, amount, date } = Form.getValues();
        
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "" ) {
                throw new Error("Preencha todos os campos!");
        }
    },
    // Formatar os dados para salvar
    formatValues() {
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date,
        }
    },
    // Apagar os dados do form
    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },

    submit(event) {
        // Evitando comportamento padrão do form
        // e buscando todos os dados preenchidos
        event.preventDefault();

        try {              
            Form.validateField();
            const transaction = Form.formatValues();
            // Salvar e aplicação ja é atualizada
            Transaction.add(transaction);
            Form.clearFields();
            // Fechar Modal
            Modal.close();
            // Atualizar App
        } catch (error) {
            alert(error.message);
        }
    }
}

const App = {
    // Adicionando e populando os valores em tela
    init() {
        // Buscando os elementos dentro do objeto das transações (transactions)
        Transaction.all.forEach(DOM.addTransaction);

        // Invocando a atualização dos valores
        DOM.updateBalance();

        Storage.set(Transaction.all);
    },
    reload() {
        // Limpando lista de transações
        DOM.clearTransactions();
        // Iniciando aplicação
        App.init();
    },
}
// Iniciando a aplicação
App.init();

// Adicionando nova transação
// Transaction.add({
//     description: 'Alo',
//     amount: 20000,
//     date: '24/01/2021'
// });

// Transaction.remove(2);