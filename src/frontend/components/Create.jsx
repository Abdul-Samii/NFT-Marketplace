import React from 'react';
import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import { create as ipfsHttpClient } from 'ipfs-http-client';

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(`2QE8N9fErv6xRKKpeQiY3WG1JDx:126c5b8e3c8a63a23144a2e1f9eeb7ca`).toString('base64')}`
  }
});
const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    console.log("------ ", typeof file)
    if (typeof file !== 'undefined') {
      await client.add(file);
      try {
        const result = await client.add(file);
        console.log("result - ", result);
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("IPFS image upload error: ", error);
      }
    }
  }

  const createNFT = async() => {
    if (!image || !price || !name || !description) alert("hi");
    try {
      const result = await client.add(JSON.stringify({ image, name, description }));
      mintThenList(result);
    } catch (error) {
      console.log("IPFS uri upload error: ", error)
    }
  }

  const mintThenList = async (result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    //mint nft
    await (await nft.mint(uri)).wait();
    //get tokenId of new nft
    const id = await nft.tokenCount();
    //approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    //add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                size="lg"
                type='text'
                placeholder='Name'
              />
              <Form.Control
                onChange={(e) => setDescription(e.target.value)}
                size="lg"
                as='textarea'
                placeholder='Description'
              />
              <Form.Control
                onChange={(e) => setPrice(e.target.value)}
                size="lg"
                type='number'
                placeholder='Price in ETH'
              />
              <div className='d-grid px-0'>
                <Button onClick={createNFT} variant="primary" size='lg'>
                  Create & List NFT
                </Button>
              </div>
            </Row>
          </div>

        </main>
      </div>
    </div>
  )
}

export default Create;
