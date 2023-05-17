import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container} from 'react-bootstrap';
import market from './market.png';

const Navigation = ({ web3Handler, account }) => {

  return (
    <Navbar className="bg-dark">
      <Container>
        <Navbar.Brand className="text-light">
          <img src={market} width="40" height="40" />
          &nbsp; DApp NFT Marketplace
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="m-auto ">
            <Nav.Link as={Link} to='/' className="text-light">Home</Nav.Link>
            <Nav.Link as={Link} to='/create' className="text-light">Create</Nav.Link>
            <Nav.Link as={Link} to='/my-listed-items' className="text-light">My Listed Items</Nav.Link>
            <Nav.Link as={Link} to='/my-purchases' className="text-light">My Purchases</Nav.Link>
          </Nav>
          <Nav>
            {account ? (
              <Nav.Link>
                <Button
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button nav-button btn-sm mx-4"
                >
                  {account.slice(0, 5) + '...' + account.slice(38, 42)}
                </Button>
              </Nav.Link>
            ) : (
              <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation;
