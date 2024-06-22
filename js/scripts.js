document.addEventListener("DOMContentLoaded", function() {
    const navbarNav = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');

    // Adicionar funcionalidade ao clicar no botão do menu hamburguer
    navbarToggler.addEventListener('click', function() {
        navbarNav.classList.toggle('show');
    });

    // Adicionar funcionalidade de expansão para os itens da lista de atividades
    const listGroupItems = document.querySelectorAll('.list-group-item');
    listGroupItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
});
