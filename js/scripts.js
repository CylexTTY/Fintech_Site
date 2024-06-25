document.addEventListener("DOMContentLoaded", function () {
    const categories = {
        "Salários": {
            icon: "fa-building",
            subcategories: ["Salário Fixo", "Salário Extra"]
        },
        "Investimentos": {
            icon: "fa-chart-line",
            subcategories: ["Dividendos", "Juros", "Aluguel de Imóveis"]
        },
        "Vendas": {
            icon: "fa-shopping-cart",
            subcategories: ["Produtos", "Serviços"]
        },
        "Outras Receitas": {
            icon: "fa-gift",
            subcategories: ["Presentes", "Prêmios", "Rendimentos Aleatórios"]
        },
        "Moradia": {
            icon: "fa-home",
            subcategories: ["Aluguel", "Hipoteca", "Manutenção"]
        },
        "Alimentação": {
            icon: "fa-utensils",
            subcategories: ["Supermercado", "Restaurantes", "Cafés"]
        },
        "Transporte": {
            icon: "fa-car",
            subcategories: ["Combustível", "Transporte Público", "Manutenção de Veículos"]
        },
        "Saúde": {
            icon: "fa-heartbeat",
            subcategories: ["Consultas Médicas", "Medicamentos", "Planos de Saúde"]
        },
        "Educação": {
            icon: "fa-book",
            subcategories: ["Mensalidades", "Livros", "Cursos"]
        },
        "Lazer": {
            icon: "fa-smile",
            subcategories: ["Viagens", "Cinema/Teatro", "Atividades Recreativas"]
        },
        "Despesas Domésticas": {
            icon: "fa-lightbulb",
            subcategories: ["Contas de Luz", "Contas de Água", "Contas de Gás", "Internet", "Limpeza"]
        },
        "Seguros": {
            icon: "fa-shield-alt",
            subcategories: ["Veículo", "Residencial", "Vida"]
        },
        "Dívidas": {
            icon: "fa-credit-card",
            subcategories: ["Empréstimos", "Cartão de Crédito", "Financiamentos"]
        },
        "Outras Despesas": {
            icon: "fa-exclamation-circle",
            subcategories: ["Presentes", "Doações", "Taxas e Impostos"]
        }
    };

    // Preenchimento do select de categorias
    const categorySelect = document.getElementById('recordCategory');
    for (const [category, details] of Object.entries(categories)) {
        const optGroup = document.createElement('optgroup');
        optGroup.label = category;
        details.subcategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            optGroup.appendChild(option);
        });
        categorySelect.appendChild(optGroup);
    }

    // Adicionar categorias ao filtro de categoria
    const filterCategorySelect = document.getElementById('filterCategory');
    for (const [category, details] of Object.entries(categories)) {
        const optGroup = document.createElement('optgroup');
        optGroup.label = category;
        details.subcategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            optGroup.appendChild(option);
        });
        filterCategorySelect.appendChild(optGroup);
    }

    // Submissão do formulário para adicionar registros
    document.getElementById('addRecordForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const recordName = document.getElementById('recordName').value;
        const recordValue = parseFloat(document.getElementById('recordValue').value).toFixed(2);
        const recordType = document.querySelector('input[name="recordType"]:checked').value;
        const recordPaymentMethod = document.getElementById('recordPaymentMethod').value;
        const recordDate = document.getElementById('recordDate').value || new Date().toISOString().slice(0, 10);
        const recordCategory = document.getElementById('recordCategory').value;

        const category = getCategory(recordCategory);
        const icon = categories[category].icon;

        addRecordToList(recordName, recordValue, recordType, recordPaymentMethod, formatDate(recordDate), recordCategory, icon);

        document.getElementById('addRecordForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addRecordModal'));
        modal._element.classList.add('fade-out');
        setTimeout(() => {
            modal.hide();
            modal._element.classList.remove('fade-out');
        }, 300);
    });

    // Função para obter a categoria com base na subcategoria
    function getCategory(subcategory) {
        for (const [category, details] of Object.entries(categories)) {
            if (details.subcategories.includes(subcategory)) {
                return category;
            }
        }
        return "Outras Despesas";
    }

    // Função para formatar a data
    function formatDate(date) {
        const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        const monthsOfYear = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const dateObj = new Date(date);
        const day = daysOfWeek[dateObj.getUTCDay()];
        const dayNumber = dateObj.getUTCDate();
        const month = monthsOfYear[dateObj.getUTCMonth()];
        return `${day} ${dayNumber}/${month}`;
    }

    // Função para adicionar um novo registro à lista
    function addRecordToList(name, value, type, paymentMethod, date, category, icon) {
        const listGroup = document.querySelector('.list-group');
        let dateHeader = Array.from(listGroup.querySelectorAll('h5')).find(header => header.textContent === date);

        if (!dateHeader) {
            dateHeader = document.createElement('h5');
            dateHeader.textContent = date;
            listGroup.insertBefore(dateHeader, listGroup.firstChild);
        }

        const newItem = document.createElement('div');
        newItem.classList.add('list-group-item', type.toLowerCase());

        const badgeClass = type === "Receita" ? "bg-success" : "bg-danger";

        newItem.innerHTML = `
            <div class="item-header">
                <span><i class="fas ${icon}"></i> ${name} - ${paymentMethod}</span>
                <span class="badge ${badgeClass}" id="${type.toLowerCase()}-badge"><span>${type === "Receita" ? "+" : "-"} R$ ${value.replace('.', ',')}</span></span>
            </div>
            <div class="details">Data: ${date} | Tipo de pagamento: ${paymentMethod} | Categoria: ${category}</div>
        `;

        listGroup.insertBefore(newItem, dateHeader.nextSibling);
        newItem.style.opacity = 0;
        setTimeout(() => {
            newItem.style.opacity = 1;
        }, 0);

        newItem.addEventListener('click', function () {
            this.classList.toggle('expanded');
            const details = this.querySelector('.details');
            if (this.classList.contains('expanded')) {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
            }
        });

        calculateTotals();
    }

    // Função para calcular totais de receitas e despesas
    function calculateTotals() {
        let totalReceitas = 0;
        let totalDespesas = 0;

        const listItems = document.querySelectorAll('.list-group-item');
        listItems.forEach(item => {
            if (item.classList.contains('receita')) {
                const valorReceita = parseFloat(item.querySelector('.badge.bg-success span').textContent.replace(/[^\d,]/g, '').replace(',', '.'));
                totalReceitas += valorReceita;
            } else if (item.classList.contains('despesa')) {
                const valorDespesa = parseFloat(item.querySelector('.badge.bg-danger span').textContent.replace(/[^\d,]/g, '').replace(',', '.'));
                totalDespesas += valorDespesa;
            }
        });

        const saldoAtual = totalReceitas - totalDespesas;
        document.querySelector('#calc-receita').textContent = `R$ ${totalReceitas.toFixed(2).replace('.', ',')}`;
        document.querySelector('#calc-despesa').textContent = `R$ ${totalDespesas.toFixed(2).replace('.', ',')}`;
        const saldoAtualElement = document.querySelector('#saldo-atual');
        saldoAtualElement.style.opacity = 0;
        setTimeout(() => {
            saldoAtualElement.textContent = `R$ ${saldoAtual.toFixed(2).replace('.', ',')}`;
            saldoAtualElement.style.opacity = 1;
        }, 300);
    }

    // Evento de clique no menu de navegação
    const navbarNav = document.querySelector('.navbar-nav');
    const navbarToggler = document.querySelector('.navbar-toggler');

    navbarToggler.addEventListener('click', function () {
        navbarNav.classList.toggle('show');
        this.classList.toggle('collapsed');
    });

    // Evento de clique nos itens da lista
    const listGroupItems = document.querySelectorAll('.list-group-item');
    listGroupItems.forEach(item => {
        item.addEventListener('click', function () {
            this.classList.toggle('expanded');
            const details = this.querySelector('.details');
            if (this.classList.contains('expanded')) {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
            }
        });
    });

    // Mostrar/ocultar seção de filtro
    const filterBtn = document.getElementById('filter-btn');
    const filterSection = document.getElementById('filter-section');
    filterBtn.addEventListener('click', function () {
        filterSection.classList.toggle('d-none');
    });

    // Aplicar filtros
    const applyFilterBtn = document.getElementById('apply-filter-btn');
    applyFilterBtn.addEventListener('click', function () {
        const paymentMethod = document.getElementById('filterPaymentMethod').value;
        const category = document.getElementById('filterCategory').value;
        const date = document.getElementById('filterDate').value;
        const type = document.getElementById('filterType').value;

        filterRecords(paymentMethod, category, date, type);
    });

    // Função para filtrar registros
    function filterRecords(paymentMethod, category, date, type) {
        const listItems = document.querySelectorAll('.list-group-item');
        const dateHeaders = document.querySelectorAll('.list-group h5');

        listItems.forEach(item => {
            let showItem = true;
            const itemHeaderText = item.querySelector('.item-header').textContent;
            const detailsText = item.querySelector('.details').textContent;

            if (paymentMethod && !itemHeaderText.includes(paymentMethod)) {
                showItem = false;
            }
            if (category && !detailsText.includes(`Categoria: ${category}`)) {
                showItem = false;
            }
            if (date && !detailsText.includes(`Data: ${formatDate(date)}`)) {
                showItem = false;
            }
            if (type && !item.classList.contains(type)) {
                showItem = false;
            }

            item.style.display = showItem ? 'flex' : 'none';
        });

        // Mostrar ou ocultar cabeçalhos de data
        dateHeaders.forEach(header => {
            let nextElement = header.nextElementSibling;
            let hasVisibleItems = false;

            while (nextElement && nextElement.classList.contains('list-group-item')) {
                if (nextElement.style.display !== 'none') {
                    hasVisibleItems = true;
                    break;
                }
                nextElement = nextElement.nextElementSibling;
            }

            header.style.display = hasVisibleItems ? 'block' : 'none';
        });
    }

    window.onload = calculateTotals;
});
