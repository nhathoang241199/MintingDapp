import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { create } from "ipfs-http-client";

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState('Maybe its your lucky day!');

  const mintNFTs = (_amount) => {
    setLoading(true);
    setNotify('Minting....');
    blockchain.smartContract.methods.mint(blockchain.account, _amount).send({
      from: blockchain.account,
      value: blockchain.web3.utils.toWei((0.01*_amount).toString(), "ether") 
    }).once("error", (err) => {
      console.log(err);
      setNotify("Error");
      setLoading(false);
    }).then((receipt)=> {
      setNotify("Success");
      setLoading(false);
    });
  }

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);

  return (
    <s.Screen>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the Blockchain</s.TextTitle>
          <s.SpacerSmall />
          <StyledButton
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            CONNECT
          </StyledButton>
          <s.SpacerSmall />
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container 
          flex={1} 
          ai={"center"}
          jc={"center"}
          style={{ padding: 24 }}
        >
          <s.TextTitle style={{ textAlign: "center" }}>
            Total supply: {data.totalSupply} / {data.maxSupply}
          </s.TextTitle>
          <s.SpacerLarge />
          <s.TextTitle style={{ textAlign: "center" }}>
            Let get 1 NFT with 0.01 ETH.
          </s.TextTitle>
          <s.SpacerLarge />
          <s.TextTitle style={{ textAlign: "center" }}>
            {notify}
          </s.TextTitle>
          <s.SpacerLarge />
          <StyledButton
            disabled={loading ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              mintNFTs(1);
            }}
          >
            {loading ? 'Busy minting' : 'MINT 1 NFT'}
          </StyledButton>
          <s.SpacerSmall />
          <StyledButton
            disabled={loading ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              mintNFTs(3);
            }}
          >
            {loading ? 'Busy minting' : 'MINT 3 NFTs'}
          </StyledButton>
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;
