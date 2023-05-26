import React, { Component, useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';
import Navigation from './Navbar';
import Home from './Home';
import Create from './Create';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});

  const web3Handler = async() => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        loadContracts(signer);
      } else {
        alert("No Account found")
      }
    } else {
      alert("Please install metamask")
    }
  }
  useEffect(() => {
      console.log("lll ", account)

  }, [account])
  const loadContracts = async(signer) => {
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
  }
  console.log("------------- ", nft)
    return (
      <BrowserRouter>
        <div>
          <Navigation web3Handler={web3Handler} account={account} />
          <Routes>
            <Route path="/" element={<Home marketplace={marketplace} nft={nft} />} />
            <Route path="/create" element={<Create marketplace={marketplace} nft={nft} />} />
            <Route path="/my-listed-items" />
            <Route path="/my-purchases" />

          </Routes>
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <h3 className='m-auto text-dark'>Welcome to NFT Marketplace</h3>
              </main>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
}

export default App;
