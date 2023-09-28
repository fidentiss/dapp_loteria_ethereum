let web3;
let selectedAccount;

window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            // Solicitar acceso a la cuenta
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            selectedAccount = accounts[0];
            updateUI();
        } catch (error) {
            console.error("Usuario rechazó la conexión");
        }
    } else {
        console.log('MetaMask no está instalado');
    }
});

async function updateUI() {
    if (selectedAccount) {
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('walletDetails').style.display = 'block';
        document.getElementById('walletAddress').textContent = selectedAccount;

        const balanceWei = await web3.eth.getBalance(selectedAccount);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        document.getElementById('walletBalance').textContent = parseFloat(balanceEth).toFixed(4);
    }
}

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            selectedAccount = accounts[0];
            updateUI();
        } catch (error) {
            console.error("Usuario rechazó la conexión");
        }
    } else {
        alert('Por favor instala MetaMask para usar esta DApp.');
    }
});
