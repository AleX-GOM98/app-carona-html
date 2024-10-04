// Função para exibir a tela
export function showScreen(screen) {
    const screens = [
        'login-container',
        'register-container',
        'carona-container',
        'historico-corridas-container',
        'dashboard-container',
        'map-container',
        'acompanhamento-container'
    ];

    screens.forEach(s => {
        const element = document.getElementById(s);
        if (element) {
            element.style.display = 'none';
        }
    });

    const currentScreen = document.getElementById(screen);
    if (currentScreen) {
        currentScreen.style.display = 'block';
    }
}

// Lógica de login
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            showScreen('dashboard-container');
        });
    }

    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', (event) => {
            event.preventDefault();
            showScreen('register-container');
        });
    }
}

// Lógica de cadastro
function initRegister() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Cadastro realizado com sucesso!');
            showScreen('login-container');
        });
    }

    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            showScreen('login-container');
        });
    }
}

// Lógica para a dashboard
function initDashboard() {
    const novaCorridaButton = document.getElementById('novaCorridaButtonDashboard');
    if (novaCorridaButton) {
        novaCorridaButton.addEventListener('click', () => {
            showScreen('carona-container');
        });
    }

    const historicoButton = document.getElementById('historicoButton');
    if (historicoButton) {
        historicoButton.addEventListener('click', () => {
            showScreen('historico-corridas-container');
            renderAcceptedRides();
        });
    }

    const acompanhamentoButton = document.getElementById('acompanhamentoButton');
    if (acompanhamentoButton) {
        acompanhamentoButton.addEventListener('click', () => {
            showScreen('map-container');
            initMap(); // Inicializa o mapa ao exibir a tela
        });
    }

    const sairButton = document.getElementById('sairButton');
    if (sairButton) {
        sairButton.addEventListener('click', () => {
            showScreen('login-container');
        });
    }
}

// Lógica de Solicitação de Carona
function initCarona() {
    const caronaForm = document.getElementById('caronaForm');
    if (caronaForm) {
        caronaForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const startAddress = document.getElementById('startAddress').value;
            const endAddress = document.getElementById('endAddress').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;

            const carona = { startAddress, endAddress, date, time, status: 'Pendente' };
            let corridas = JSON.parse(localStorage.getItem('corridas')) || [];
            corridas.push(carona);
            localStorage.setItem('corridas', JSON.stringify(corridas));

            alert('Carona solicitada com sucesso!');
            showScreen('historico-corridas-container');
            renderAcceptedRides();
        });
    }

    const cancelarButton = document.getElementById('cancelarCorridaButton');
    if (cancelarButton) {
        cancelarButton.addEventListener('click', (event) => {
            event.preventDefault();
            showScreen('dashboard-container');
        });
    }
}

// Função para exibir o histórico de corridas em uma tabela
export function renderAcceptedRides() {
    const corridas = JSON.parse(localStorage.getItem('corridas')) || [];
    const historicoList = document.getElementById('historicoList');
    if (historicoList) {
        historicoList.innerHTML = ''; // Limpa a lista atual

        corridas.forEach((corrida, index) => {
            const tr = document.createElement('tr');

            const dataCell = document.createElement('td');
            dataCell.textContent = corrida.date;
            tr.appendChild(dataCell);

            const horaCell = document.createElement('td');
            horaCell.textContent = corrida.time;
            tr.appendChild(horaCell);

            const partidaCell = document.createElement('td');
            partidaCell.textContent = corrida.startAddress;
            tr.appendChild(partidaCell);

            const destinoCell = document.createElement('td');
            destinoCell.textContent = corrida.endAddress;
            tr.appendChild(destinoCell);

            const acoesCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Usando Font Awesome
            deleteButton.addEventListener('click', () => {
                deleteRide(index);
            });
            acoesCell.appendChild(deleteButton);
            tr.appendChild(acoesCell);

            historicoList.appendChild(tr);
        });
    }
}

// Função de inicialização do histórico
export function initHistorico() {
    const novaCorridaButton = document.getElementById('novaCorridaButtonHistorico');
    if (novaCorridaButton) {
        novaCorridaButton.addEventListener('click', () => {
            showScreen('carona-container'); // Vai para a tela de solicitar nova corrida
        });
    }
    
    const voltarButton = document.getElementById('voltarDashboardButton');
    if (voltarButton) {
        voltarButton.addEventListener('click', () => {
            showScreen('dashboard-container');
        });
    }

    renderAcceptedRides();
}

// Função para excluir corrida
export function deleteRide(index) {
    let corridas = JSON.parse(localStorage.getItem('corridas')) || [];
    corridas.splice(index, 1);
    localStorage.setItem('corridas', JSON.stringify(corridas));
    renderAcceptedRides();
}

let map; // Variável global para o mapa

// Função para inicializar o mapa
export function initMap() {
    const initialLocation = { lat: -23.5505, lng: -46.6333 }; // Coordenadas de exemplo (São Paulo)

    // Verifica se o mapa já foi inicializado
    if (!map) {
        map = L.map('map').setView([initialLocation.lat, initialLocation.lng], 13);

        // Adiciona a camada de tiles do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Adiciona um marcador
        L.marker([initialLocation.lat, initialLocation.lng]).addTo(map)
            .bindPopup('Corrida em Andamento')
            .openPopup();
    }
}

// Lógica para a tela de acompanhamento
function initAcompanhamento() {
    const voltarButton = document.getElementById('voltarAcompanhamentoButton');
    if (voltarButton) {
        voltarButton.addEventListener('click', () => {
            showScreen('dashboard-container'); // Retorna para a tela do dashboard
        });
    }
}

// Evento de inicialização
document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initRegister();
    initCarona();
    initDashboard();
    initHistorico();
    initAcompanhamento();
});
