# dapp_loteria_ethereum
DApp Loteria Ethereum


# Documentación del Smart Contract: Lotería

## Introducción

Este Smart Contract implementa una lotería simple en la blockchain de Ethereum. Los jugadores pueden participar comprando entradas con Ether. Cuando se alcanza un número determinado de jugadores, se selecciona un ganador al azar y se le otorga el premio. También se incluye una cola para los jugadores si el número máximo de jugadores ha sido alcanzado. El propietario del contrato puede retirar las ganancias generadas por la plataforma.

## Detalles Técnicos

### Versión de Solidity

pragma solidity ^0.8.19;

### Dependencias

- OpenZeppelin Ownable.sol: Para la gestión de propiedad del contrato.

import "./contracts/access/Ownable.sol";

### Variables del contrato

- `jugadoresActuales`: Un arreglo de direcciones de los jugadores actuales en la ronda.
- `jugadoresEnCola`: Un arreglo de direcciones de jugadores en espera para la próxima ronda.
- `entrada`: El costo para participar en la lotería (0.003 ether).
- `maxJugadores`: El número máximo de jugadores por ronda (10 jugadores).
- `balanceDeLaPlataforma`: Las ganancias acumuladas de la plataforma.

### Eventos

- `Ganador`: Emitido cuando se selecciona un ganador.
- `NuevoJugador`: Emitido cuando un nuevo jugador se une a la ronda.

### Funciones

- `participar`: Permite a los jugadores comprar una entrada para la lotería.
- `_finalizarRonda`: Selecciona un ganador al azar, distribuye el premio y prepara la próxima ronda.
- `random`: Genera un número aleatorio para la selección del ganador.
- `min`: Función auxiliar para obtener el mínimo entre dos números.
- `retirarGananciasPlataforma`: Permite al propietario del contrato retirar las ganancias acumuladas de la plataforma.
- `obtenerJugadoresActuales`: Retorna la lista de jugadores actuales.
- `obtenerjugadoresEnCola`: Retorna la lista de jugadores en espera.
- `renounceOwnership` y `transferOwnership`: Funciones desactivadas para evitar la transferencia de propiedad del contrato.

### Constructor

El contrato tiene un constructor vacío, y hereda el modificador `Ownable` de OpenZeppelin, que establece al creador del contrato como el propietario.

### Modificadores

- `onlyOwner`: Restringe el acceso a ciertas funciones solo al propietario del contrato.

### Notas de Seguridad

- Se recomienda revisar el mecanismo de generación de números aleatorios (`random`) ya que la aleatoriedad en blockchain es un tema complejo y podría ser predecible.

### Autor

Fidentis

---

## Uso

1. **Participar en la Lotería**: Los jugadores pueden llamar a la función `participar` enviando 0.003 ether. Si el máximo de jugadores ha sido alcanzado, el jugador será colocado en la cola para la próxima ronda.
2. **Finalizar Ronda**: Cuando el número de jugadores alcanza el máximo (10), la función `_finalizarRonda` es llamada automáticamente, seleccionando un ganador al azar, distribuyendo el premio y preparando la próxima ronda.
3. **Retirar Ganancias**: El propietario del contrato puede retirar las ganancias acumuladas de la plataforma llamando a la función `retirarGananciasPlataforma`.

Esta documentación proporciona una visión general de la estructura y funcionalidades del Smart Contract de Lotería. Para cualquier detalle adicional o consultas, por favor refiérase al código fuente del contrato.
