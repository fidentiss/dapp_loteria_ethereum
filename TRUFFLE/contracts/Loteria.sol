// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Importando la biblioteca OpenZeppelin para gestión de propiedad
import "./contracts/access/Ownable.sol";

/**
 * @title Loteria
 * @author Fidentis
 * @notice Este contrato implementa una lotería simple en la blockchain de Ethereum.
 * Los jugadores pueden comprar entradas con Ether, y una vez que se alcanza un número
 * determinado de jugadores, se selecciona un ganador al azar y se le otorga el premio.
 * También se incluye una cola para los jugadores si el número máximo de jugadores ha sido alcanzado.
 * El propietario del contrato puede retirar las ganancias generadas por la plataforma.
 */
contract Loteria is Ownable {
    address[] public jugadoresActuales;
    address[] public jugadoresEnCola;

    uint256 public constant entrada = 0.003 ether;
    uint256 public constant maxJugadores = 10;
    uint256 public balanceDeLaPlataforma;

    event Ganador(address indexed ganador, uint256 monto);
    event NuevoJugador(address indexed jugador);

    constructor() {}

    function participar() external payable {
        require(msg.value == entrada, "Debes enviar 1 ETH");

        if (jugadoresActuales.length == maxJugadores) {
            jugadoresEnCola.push(msg.sender);
        } else {
            jugadoresActuales.push(msg.sender);
        }

        emit NuevoJugador(msg.sender);

        if (jugadoresActuales.length == maxJugadores) {
            _finalizarRonda();
        }
    }

    function _finalizarRonda() private {
        address ganador = jugadoresActuales[random() % maxJugadores];
        uint256 montoGanador = (entrada * maxJugadores * 85) / 100;

        payable(ganador).transfer(montoGanador);
        balanceDeLaPlataforma += (entrada * maxJugadores) - montoGanador;

        emit Ganador(ganador, montoGanador);

        uint256 jugadoresMovidos = min(maxJugadores, jugadoresEnCola.length);

        for (uint256 i = 0; i < jugadoresMovidos; i++) {
            jugadoresActuales[i] = jugadoresEnCola[i];
        }

        while (jugadoresActuales.length > jugadoresMovidos) {
            jugadoresActuales.pop();
        }

        for (
            uint256 i = 0;
            i < jugadoresEnCola.length - jugadoresMovidos;
            i++
        ) {
            jugadoresEnCola[i] = jugadoresEnCola[i + jugadoresMovidos];
        }
        for (uint256 i = 0; i < jugadoresMovidos; i++) {
            jugadoresEnCola.pop();
        }
    }

    function random() private view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp,
                        jugadoresActuales
                    )
                )
            );
    }

    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }

    function retirarGananciasPlataforma() external onlyOwner {
        uint balance = balanceDeLaPlataforma;
        balanceDeLaPlataforma = 0;
        payable(owner()).transfer(balance); // usamos owner() que es una función proporcionada por Ownable
    }

    function obtenerJugadoresActuales()
        external
        view
        returns (address[] memory)
    {
        return jugadoresActuales;
    }

    function obtenerjugadoresEnCola() external view returns (address[] memory) {
        return jugadoresEnCola;
    }

    function renounceOwnership() public view override onlyOwner {
        revert("Esta funcion ha sido desactivada");
    }

    function transferOwnership(address) public view override onlyOwner {
        revert("Transferencia de propiedad desactivada");
    }
}
