import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';

const CustomNavbar = ({ accounts = [], account, handleAccountChange }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Navbar.Brand className="ms-3">
        <h1 className="mb-0">NFT Marketplace</h1>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/my-nfts">My NFTs</Nav.Link>
          <Nav.Link as={Link} to="/create-nft">Create NFT</Nav.Link>
          <Nav.Link as={Link} to="/sell-nft">Sell NFT</Nav.Link>
          <Nav.Link as={Link} to="/purchase-nft">Purchase NFT</Nav.Link>
        </Nav>
        <Form className="d-flex align-items-center ms-auto">
          <DropdownButton
            id="dropdown-basic-button"
            title={account ? `Account: ${account}` : 'Select Account'}
            variant="outline-info"
            className="me-2"
          >
            {accounts.map((acc) => (
              <Dropdown.Item
                key={acc}
                onClick={() => handleAccountChange({ target: { value: acc } })}
              >
                {acc}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <FormControl
            type="text"
            placeholder="Signed in as"
            readOnly
            value={account || 'Not Connected'}
            className="bg-dark text-light border-0"
          />
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
