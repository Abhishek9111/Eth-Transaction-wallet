import {
  http,
  createConfig,
  useAccount,
  useBalance,
  useSendTransaction,
} from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, safe } from "wagmi/connectors";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { useConnect } from "wagmi";

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [mainnet],
  connectors: [injected(), safe()],
  transports: {
    [mainnet.id]: http(),
  },
});

import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <WallterConnector />
          <EthSend />
          <MyAddress />
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
function WallterConnector() {
  const { connectors, connect } = useConnect();
  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ));
}
function MyAddress() {
  const { address } = useAccount();
  const balance = useBalance(address);
  return (
    <div>
      {address}-balance-{balance?.data?.formatted}
    </div>
  );
}
function EthSend() {
  const { data: hash, sendTransaction } = useSendTransaction();
  function sendEth() {
    sendTransaction({
      to: document.getElementById("text").value,
      value: 100000000000000000, //0.1 ETH 17 0's
    });
  }
  return (
    <div>
      <input type="text" style={{ marginRight: "8px" }}></input>
      <button onClick={sendEth}>Send</button>
    </div>
  );
}

export default App;
