<img width="900" alt="30 Jul - Navigating the DeFi Ecosystem" src="https://github.com/user-attachments/assets/f4166974-50f5-400f-b084-5b95428f48ed">


---

# Proyecto DeFi Intercambio

Este proyecto es un **Token Swap DeFi** que interactúa con el protocolo Aave para aprobar y depositar tokens LINK en la red de pruebas Sepolia. Se construyó utilizando Node.js, ethers.js y herramientas de desarrollo blockchain.

## Requisitos

Para ejecutar este proyecto, necesitas tener instalado lo siguiente:

- **Node.js** (versión 14.x o superior)
- **npm** (administrador de paquetes de Node.js)
- **Metamask** (para manejar tus claves privadas y conectarte a la red Sepolia)
- **Infura** o **Alchemy** (para conectarse a la red Ethereum)
  
## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. **Clona el repositorio**:

    ```bash
    git clone https://github.com/tu_usuario/proyecto-defi-intercambio.git
    cd proyecto-defi-intercambio
    ```

2. **Instala las dependencias**:

    ```bash
    npm install
    ```

3. **Configura las variables de entorno**:

   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido, reemplazando los valores por tus claves y configuraciones personales:

    ```bash
    INFURA_PROJECT_ID=tu_infura_project_id
    PRIVATE_KEY=tu_clave_privada
    TOKEN_ADDRESS=dirección_del_token_LINK
    AAVE_LENDING_POOL_ADDRESS=dirección_del_pool_de_prestamos_de_Aave
    ```

   - **INFURA_PROJECT_ID**: Tu ID de proyecto en Infura.
   - **PRIVATE_KEY**: La clave privada de la cuenta que realizará las transacciones (no compartir esta información).
   - **TOKEN_ADDRESS**: La dirección del contrato del token LINK en la red Sepolia.
   - **AAVE_LENDING_POOL_ADDRESS**: La dirección del contrato Aave Lending Pool en la red Sepolia.

4. **Actualiza el archivo `index.js`**:

   Asegúrate de que el archivo `index.js` esté configurado correctamente para interactuar con Aave y el contrato de token LINK. Este archivo incluye el proceso para aprobar y depositar tokens en Aave.

## Árbol de Directorios del Proyecto

ProyectoDeFi_Intercambio/

├── abis/

│       ├── factory.json

│       ├── lendingpool.json

│       ├── pool.json

│       └── swaprouter.json

├── node_modules/

├── .env

├── index.js

├── package-lock.json

└── package.json

├── README.md



## Ejecución

Para ejecutar el script, utiliza el siguiente comando:

```bash
node index.js
```

El script realizará las siguientes operaciones:

1. **Aprobar el Token:** Se aprueba el token USDC para que el contrato de intercambio pueda utilizarlo.
   - *Script ejecutado:* `approveToken(tokenAddress, tokenABI, amount, wallet)`

2. **Obtener Información del Pool:** Se obtiene la información del pool en Uniswap para preparar los parámetros del intercambio.
   - *Script ejecutado:* `getPoolInfo(factoryContract, tokenIn, tokenOut)`

3. **Preparar los Parámetros de Intercambio:** Se preparan los parámetros necesarios para realizar el intercambio.
   - *Script ejecutado:* `prepareSwapParams(poolContract, signer, amountIn)`

4. **Ejecutar el Intercambio:** Se ejecuta el intercambio de USDC a LINK utilizando Uniswap V3.
   - *Script ejecutado:* `executeSwap(swapRouter, params, signer)`

5. **Depositar en Aave:** Los tokens LINK obtenidos son depositados en Aave para generar intereses.
   - *Script ejecutado:* `depositToAave(tokenAddress, amount, signer)`

## Detalles del Script (`index.js`)

### Importaciones y Configuración

```javascript
import { ethers } from "ethers";
import FACTORY_ABI from "./abis/factory.json" assert { type: "json" };
import SWAP_ROUTER_ABI from "./abis/swaprouter.json" assert { type: "json" };
import POOL_ABI from "./abis/pool.json" assert { type: "json" };
import TOKEN_IN_ABI from "./abis/token.json" assert { type: "json" };
import AAVE_LENDING_POOL_ABI from "./abis/lendingpool.json" assert { type: "json" };
import dotenv from "dotenv";
dotenv.config();
```

El script comienza importando las dependencias necesarias, incluyendo `ethers` para interactuar con la blockchain, ABIs de los contratos inteligentes y configuraciones de variables de entorno.

### Configuración de Tokens y Contratos

Los tokens USDC y LINK son configurados con sus respectivas direcciones en la red Sepolia.

```javascript
const USDC = { /* Configuración del token USDC */ };
const LINK = { /* Configuración del token LINK */ };
```

Se configuran las direcciones de los contratos Factory, Swap Router, y Aave Lending Pool.

### Funciones Principales

1. **approveToken:** Permite que el contrato de intercambio gaste tokens USDC del usuario.
2. **getPoolInfo:** Obtiene la dirección del pool y la información básica del mismo.
3. **prepareSwapParams:** Prepara los parámetros necesarios para realizar el intercambio en Uniswap V3.
4. **executeSwap:** Realiza el intercambio de USDC a LINK.
5. **depositToAave:** Deposita los tokens LINK en Aave.

### Función Principal (`main`)

La función `main` coordina todo el flujo de ejecución:

1. Se llama a `approveToken` para aprobar los USDC.
2. Se obtiene la información del pool.
3. Se preparan los parámetros de intercambio.
4. Se ejecuta el intercambio de USDC a LINK.
5. Finalmente, se deposita el LINK en Aave.

```javascript
main(1); // Ejecuta el intercambio y depósito con 1 USDC
```

**Diagrama de Flujo:**

```mermaid
graph LR
A[Start] --> B{Configura contratos (Uniswap Factory, Router, Aave Lending Pool)}
B --> C{Aprueba USDC para Swap Router}
C --> D{Obtiene información del pool USDC-LINK}
D --> E{Prepara parámetros para el swap}
E --> F{Ejecuta swap USDC por LINK}
F --> G{Deposita LINK en Aave}
G --> H[End]
```

## Descripción detallada del script (basado en el código):

1. **Importación de librerías y variables de entorno (líneas 1-18):**
   - Se importan las librerías necesarias para interactuar con la blockchain de Ethereum (ethers.js) y para leer archivos JSON (dotenv).
   - Se carga el archivo `.env` que contiene las variables de entorno sensibles (claves privadas, direcciones de contratos, URL del RPC).

2. **Configuración de contratos (líneas 19-33):**
   - Se definen las direcciones de los contratos de Uniswap Factory, Swap Router y Aave Lending Pool.
   - Se crea un proveedor JSON RPC para conectarse a la red Sepolia.
   - Se crean objetos para interactuar con los contratos Uniswap Factory y Swap Router utilizando las direcciones y el proveedor.
   - Se crea una instancia del signer utilizando la clave privada del wallet del usuario.

3. **Configuración de tokens (líneas 34-54):**
   - Se definen objetos para los tokens USDC y LINK con sus detalles (dirección, decimales, símbolos, etc.).

4. **Función `approveToken` (líneas 56-87):**
   - Esta función permite aprobar el gasto de una cantidad específica de un token por parte del Swap Router.
   - Recibe la dirección del token, su ABI, la cantidad a aprobar y el signer como parámetros.
   - Crea una transacción para aprobar el token y la envía a la red.

5. **Función `getPoolInfo` (líneas 89-112):**
   - Esta función obtiene la dirección del pool de liquidez que contiene los dos tokens proporcionados (tokenIn y tokenOut).
   - Utiliza el contrato Uniswap Factory para consultar la dirección del pool.
   - Crea una instancia del contrato del pool para interactuar con él y obtener información adicional (direcciones de los tokens del pool y tarifa).

6. **Función `prepareSwapParams` (líneas 114-121):**
   - Esta función prepara los parámetros necesarios para realizar un swap en Uniswap.
   - Recibe el contrato del pool y el signer como parámetros.
   - Define un objeto con los detalles del swap (tokenIn, tokenOut, tarifa, destinatario, cantidad a intercambiar, etc.).

7. **Función `executeSwap` (líneas 123-134):**
   - Esta función ejecuta el swap de tokens utilizando el Swap Router de Uniswap.
   - Recibe el contrato Swap Router, los parámetros del swap y el signer como parámetros.
   - Crea una transacción para realizar el swap y la envía a la red.

8. **Función `depositToAave` (líneas 136-167):**
   - Esta función deposita tokens en el protocolo Aave.
   - Recibe la dirección del token, la cantidad a depositar y el signer como parámetros.
   - Crea una instancia del contrato Aave Lending Pool para interactuar con él.
   - Primero aprueba a Aave para gastar la cantidad de tokens a depositar.
   - Luego, crea una transacción para depositar los tokens en Aave y la envía a la red.

9. **Función `main` (líneas 169-190):**
   - Esta es la función principal del script que se ejecuta al iniciar el programa.
   - Recibe la cantidad de tokens USDC a intercambiar como parámetro.
   - Convierte la cantidad a unidades del token USDC (wei).
   


## Resultados Esperados

Al ejecutar el script, deberías ver en la consola los hashes de las transacciones realizadas, junto con enlaces a Etherscan para verificar el estado de cada transacción.

## Contribuciones

Cualquier contribución al proyecto es bienvenida. Si encuentras algún problema o tienes sugerencias de mejora, por favor abre un issue o envía un pull request.


Durante la ejecución, verás la siguiente secuencia en la consola:

1. **Aprobación de la transacción**: Se envía una transacción de aprobación para permitir que el contrato Aave gaste tus tokens LINK.
2. **Confirmación de la transacción de aprobación**: Una vez confirmada la transacción, se muestra un enlace a Etherscan.
3. **Depósito en Aave**: Luego de la aprobación, se envía una transacción para depositar tus tokens LINK en Aave.
4. **Confirmación del depósito**: Cuando el depósito es confirmado, se muestra un enlace a Etherscan para revisar los detalles de la transacción.

## Ejemplo de salida

Al ejecutar `node index.js`, deberías ver una salida similar a esta:

```plaintext
-------------------------------
Sending Approval Transaction...
-------------------------------
Transaction Sent: 0xd3be023c557f767bccaca31999f41adc06a7e1693c1f6aa92a48e38a7df35caf
-------------------------------
Approval Transaction Confirmed! https://sepolia.etherscan.io/tx/0xd3be023c557f767bccaca31999f41adc06a7e1693c1f6aa92a48e38a7df35caf
-------------------------------
Receipt: https://sepolia.etherscan.io/tx/0xa517d4bed6f9a2cf22dca2128693ee26ae95392f85c5420f980e010362133588
-------------------------------
-------------------------------
Depositing LINK into Aave...
Transaction Sent: 0x30e6df4636a05d8cd76c236326cf28b41f6fa4186931cdcbfa6fbcbf2fb12afa
Deposit Confirmed! https://sepolia.etherscan.io/tx/0x30e6df4636a05d8cd76c236326cf28b41f6fa4186931cdcbfa6fbcbf2fb12afa
```

## Referencias

- [Ethers.js Documentation](https://docs.ethers.io/v5/)
- [Aave Protocol](https://docs.aave.com/)
- [Infura](https://infura.io/)
- [Node.js Documentation](https://nodejs.org/en/docs/)

Saludos cordiales Dev_antony