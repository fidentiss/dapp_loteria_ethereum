let web3;
let selectedAccount;
let contratoLoteria;

const contratoABI = [
	{ inputs: [], stateMutability: "nonpayable", type: "constructor" },
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "ganador",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "monto",
				type: "uint256",
			},
		],
		name: "Ganador",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "jugador",
				type: "address",
			},
		],
		name: "NuevoJugador",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		inputs: [],
		name: "balanceDeLaPlataforma",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "entrada",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		name: "jugadoresActuales",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		name: "jugadoresEnCola",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "maxJugadores",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "obtenerJugadoresActuales",
		outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "obtenerjugadoresEnCola",
		outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "participar",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "retirarGananciasPlataforma",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
const contratoDireccion = "0xC67C5ea5061D08a2D56bce4fBcD9a237F7B08800";

window.addEventListener("load", async () => {
	if (typeof window.ethereum !== "undefined") {
		web3 = new Web3(window.ethereum);
		contratoLoteria = new web3.eth.Contract(contratoABI, contratoDireccion);

		// Escuchar el evento 'disconnect'
		window.ethereum.on("disconnect", (error) => {
			console.log(`MetaMask Disconnected: ${error.message}`);
			// Aquí puedes manejar la desconexión de MetaMask como lo necesites.
		});

		// El siguiente bloque fue comentado para evitar la conexión automática
		// try {
		//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		//     selectedAccount = accounts[0];
		//     updateUI();
		//     escucharEventos();
		// } catch (error) {
		//     console.error("Usuario rechazó la conexión");
		// }
	} else {
		console.log("MetaMask no está instalado");
	}
});

async function updateUI() {
	if (selectedAccount) {
		document.getElementById("connectWallet").style.display = "none";
		document.getElementById("walletDetails").style.display = "block";
		document.getElementById("walletAddress").textContent = selectedAccount;

		const balanceWei = await web3.eth.getBalance(selectedAccount);
		const balanceEth = web3.utils.fromWei(balanceWei, "ether");
		document.getElementById("walletBalance").textContent =
			parseFloat(balanceEth).toFixed(4);

		mostrarParticipantes();
		escucharEventos();
	}
}

document.getElementById("connectWallet").addEventListener("click", async () => {
	if (typeof window.ethereum !== "undefined") {
		try {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			selectedAccount = accounts[0];
			updateUI();
		} catch (error) {
			console.error("Usuario rechazó la conexión");
		}
	} else {
		alert("Por favor instala MetaMask para usar esta DApp.");
	}
});

document.getElementById("participar").addEventListener("click", async () => {
    if (!selectedAccount) {
        // Solicita la conexión de la wallet si no está conectada
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            selectedAccount = accounts[0];
            updateUI();  // Actualiza la UI con la información de la wallet
        } catch (error) {
            console.error("Usuario rechazó la conexión");
            return;  // Termina la función si el usuario rechaza la conexión
        }
    }

    const valorEnWei = web3.utils.toWei("0.003", "ether");  // Asumiendo 0.003 ether como costo
    try {
        await contratoLoteria.methods
            .participar()
            .send({ from: selectedAccount, value: valorEnWei });
        updateUI();  // Actualiza la UI después de participar
    } catch (error) {
        console.error("Error al participar:", error);
    }
});

async function mostrarParticipantes() {
	try {
		const participantes = await contratoLoteria.methods
			.obtenerJugadoresActuales()
			.call();
		const listaParticipantes = document.getElementById("listaParticipantes");
		listaParticipantes.innerHTML = "";

		participantes.forEach((participante) => {
			const li = document.createElement("li");
			li.textContent = participante;
			listaParticipantes.appendChild(li);
		});
	} catch (error) {
		console.error("Error al obtener los participantes:", error);
	}
}

function escucharEventos() {
    // Suscripción al evento Ganador
    contratoLoteria.events.Ganador({}, (error, event) => {
        if (error) {
            console.error("Error en evento Ganador:", error);
            return;
        }
        // Aquí puedes agregar el ganador a la lista "listaGanadores"
        // o cualquier otra acción que desees hacer al escuchar este evento.
        const ganador = event.returnValues.ganador;
        const monto = web3.utils.fromWei(event.returnValues.monto, "ether");

        const li = document.createElement("li");
        li.textContent = `${ganador} ganó ${monto} ETH`;
        document.getElementById("listaGanadores").appendChild(li);
    });

    // Suscripción al evento NuevoJugador
    contratoLoteria.events.NuevoJugador({}, async (error, event) => {
        if (error) {
            console.error('Error en evento NuevoJugador:', error);
            return;
        }
        // Actualiza la lista de participantes cuando se dispara el evento NuevoJugador
        await mostrarParticipantes();
    });

    // Agrega escuchas para otros eventos si es necesario.
}

