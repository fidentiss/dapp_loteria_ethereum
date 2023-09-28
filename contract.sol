// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract Loteria {
    address public owner;
    address[] public participantes;
    address[] public listaEspera;
    address payable public plataforma = payable(0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB); 

    uint256 public constant COSTO_PARTICIPACION = 0.0031 ether;
    uint256 public constant CANTIDAD_PARTICIPANTES = 10;
    uint256 public constant PORCENTAJE_PLATAFORMA = 15; // 15%

    constructor() {
        owner = msg.sender;
    }

    modifier soloDueno() {
        require(msg.sender == owner, "Solo el dueno puede llamar a esta funcion");
        _;
    }

    function participar() external payable {
        require(msg.value == COSTO_PARTICIPACION, "Debe enviar exactamente 0.00063 ETH para participar");

        if (participantes.length < CANTIDAD_PARTICIPANTES) {
            participantes.push(msg.sender);
        } else {
            listaEspera.push(msg.sender);
        }

        // Si hay 10 participantes, seleccionar un ganador y pagar
        if (participantes.length == CANTIDAD_PARTICIPANTES) {
            seleccionarGanador();
        }
    }

    function seleccionarGanador() internal {
        uint256 ganadorIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % participantes.length;
        address ganador = participantes[ganadorIndex];

        // Pago a la plataforma
        uint256 montoPlataforma = (COSTO_PARTICIPACION * CANTIDAD_PARTICIPANTES * PORCENTAJE_PLATAFORMA) / 100;
        plataforma.transfer(montoPlataforma);

        // Pago al ganador
        uint256 montoGanador = address(this).balance;
        payable(ganador).transfer(montoGanador);

        // Limpiar lista de participantes
        delete participantes;

        // Mover participantes de lista de espera a participantes, si hay
        for (uint256 i = 0; i < CANTIDAD_PARTICIPANTES && i < listaEspera.length; i++) {
            participantes.push(listaEspera[i]);
        }

        // Limpiar participantes que han sido movidos de lista de espera
        uint256 length = listaEspera.length;
        for (uint256 i = 0; i < CANTIDAD_PARTICIPANTES && i < length; i++) {
            listaEspera.pop();
        }
    }

    function verParticipantes() external view returns (address[] memory) {
        return participantes;
    }

    function verListaEspera() external view returns (address[] memory) {
        return listaEspera;
    }

    // En caso de que quieras retirar los fondos (por ejemplo, por un error o para cerrar la lotería)
    function retirarFondos() external soloDueno {
        payable(owner).transfer(address(this).balance);
    }
}
