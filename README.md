## NFT Marketplace – React + Web3

A minimal NFT marketplace front‑end built with React, Web3.js, and MetaMask. It displays deployed contract addresses, lets users connect/disconnect their wallet, and provides basic flows to create, approve, sell, and purchase NFTs.

### Features
- Shows NFT and Marketplace contract addresses (read‑only even without wallet)
- Connect/Disconnect MetaMask from the navbar
- Auto‑updates on `accountsChanged` and `chainChanged` events
- Pages: `My NFTs`, `Create NFT`, `Sell NFT`, `Purchase NFT`

### Prerequisites
- Node.js 18+ or 20+
- MetaMask in the browser
- Deployed contracts and ABIs present at `client/src/contracts/NFT.json` and `client/src/contracts/Marketplace.json`

### Contract Addresses
Hardcoded in `client/src/App.js`:
- `nftAddress`: 0x19D791b89E653AAEA09332e6503c76F1EF2fAb44
- `marketplaceAddress`: 0x6fcc1453319D9627d96f91eF1177ea9B7325Ca34

Update these to your own deployments if needed.

### Environment Variables
Create a `.env` file in `client/` (do not commit secrets):

```
REACT_APP_PUBLIC_RPC_URL=https://your-network-rpc.example
```

Notes:
- This is a read‑only RPC used when MetaMask is not injected (e.g., Netlify preview or first visit).
- Make sure it points to the same chain your contracts are deployed on (e.g., Sepolia).

### Local Development
```
cd client
npm install
npm start
```
Runs at `http://localhost:3000`.

### Build
```
cd client
npm run build
```
Outputs to `client/build`.

### Deploy to Netlify
Netlify settings:
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `client/build`
- Env vars: add `REACT_APP_PUBLIC_RPC_URL`
- Node version (recommended): `18` or `20`

SPA Routing (avoid 404s on deep links): create `client/public/_redirects` with:
```
/* /index.html 200
```

### Wallet Connect/Disconnect
- Click “Connect Wallet” in the navbar to call `eth_requestAccounts`.
- After connection, the address chip and a dedicated “Disconnect” button are always visible in the navbar.
- Disconnect clears local app state (MetaMask does not allow true programmatic disconnect).

### Account & Network Changes
The app listens to MetaMask events:
- `accountsChanged`: updates the selected account immediately
- `chainChanged`: re‑binds Web3 provider to the injected network

### Troubleshooting
- Contracts show “Not deployed” on Netlify:
  - Ensure `REACT_APP_PUBLIC_RPC_URL` is set and points to the correct chain.
  - Verify the hardcoded addresses match your deployed contracts.
- Cannot connect wallet on Netlify:
  - Site must be served over HTTPS, and MetaMask must be installed.
  - Click the green “Connect Wallet” button in the navbar.
- Navigation 404 on refresh:
  - Ensure the `_redirects` file exists as above.

### Project Structure (relevant parts)
```
client/
  src/
    App.js                 # Web3 init, contracts, routes, wallet handlers
    components/Navbar.js   # Navigation + connect/disconnect controls
    contracts/
      NFT.json
      Marketplace.json
  public/
    _redirects             # SPA routing (Netlify)
```

### Security Notes
- Do not expose private keys or sensitive RPCs in the client.
- Prefer rate‑limited, read‑only RPC endpoints for public deployments.

