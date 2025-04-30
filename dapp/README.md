# Decentralized Application based on COMPAS WebViewer

This component is an extension of [COMPAS WebViewer](https://github.com/compas-dev/compas-webviewer).

## Prerequisites

### Only If You Deployed Your Contract On Sepolia

In `./views/HomeView.vue`, update the contract address from:

```javascript
<v-btn
    :href="`https://testnets.opensea.io/assets/sepolia/0xb8Bb0430e7c3392642Cd141824FBf7D300F18901/${dialog.data.tokenId}`"
```

Replace `0xb8Bb0430e7c3392642Cd141824FBf7D300F18901` with your own deployed contract address on Sepolia, if applicable.

### Only If You Minted Your Own NFTs

#### Adding `.obj` and `.json` Files

This application displays `.obj` files representing building components linked to NFTs. To use your own assets:

1. Add or modify `.obj` and `.json` files in the `/data` directory to reflect your minted NFTs.
2. If you're only reproducing the default demo with our predefined NFTs, you can skip this step.

#### Modifying Backend API Endpoints

To serve your own object data:

1. Open `server.py` and create a new route using:

```javascript
@app.get("/load_<your-building-material-name>")
def load_<your-building-material-name>():
    ...
```

2. In `./views/HomeView.vue`, add a new function similar to `loadCooper()`.

3. Also add a corresponding button:

```javascript
<v-btn @click="loadCooper" variant="elevated" class="mx-1"> Cooper </v-btn>
```

Replace the name and function appropriately for your material.

## Running the Prototype

### Installation

Set up the Vue project:

```bash
yarn install
```

Install COMPAS and required Python packages in a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

### Starting the Server

To start the COMPAS backend server:

```bash
source venv/bin/activate # if not already done
python server.py
```

### Starting the Client

To run the Vue frontend with hot-reload (available at [http://localhost:3000](http://localhost:3000)):

```bash
yarn dev
```
