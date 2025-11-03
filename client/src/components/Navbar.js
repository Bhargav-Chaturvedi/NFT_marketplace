import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const CustomNavbar = ({ accounts = [], account, handleAccountChange, onConnectWallet, onDisconnectWallet }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // SVG Icons
  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  const ImageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );

  const PlusCircleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );

  const TagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );

  const ShoppingCartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );

  const WalletIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
    </svg>
  );

  const navLinks = [
    { path: '/my-nfts', label: 'My NFTs', icon: <ImageIcon /> },
    { path: '/create-nft', label: 'Create NFT', icon: <PlusCircleIcon /> },
    { path: '/sell-nft', label: 'Sell NFT', icon: <TagIcon /> },
    { path: '/purchase-nft', label: 'Purchase NFT', icon: <ShoppingCartIcon /> }
  ];

  const styles = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .nav-link-hover {
      transition: all 0.3s ease;
      position: relative;
    }
    .nav-link-hover::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }
    .nav-link-hover:hover::after {
      width: 100%;
    }
    .dropdown-menu {
      animation: slideDown 0.3s ease;
    }
    .mobile-menu {
      animation: slideDown 0.3s ease;
    }
    .desktop-nav {
      display: none;
    }
    .mobile-menu-btn {
      display: block;
    }
    @media (min-width: 1024px) {
      .desktop-nav {
        display: flex;
      }
      .mobile-menu-btn {
        display: none;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <nav style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px'
          }}>
            {/* Logo */}
            <Link 
              to="/"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <ImageIcon />
              </div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0
              }}>
                NFT Marketplace
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="desktop-nav" style={{
              alignItems: 'center',
              gap: '2rem',
              flex: 1,
              justifyContent: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="nav-link-hover"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 1rem',
                      color: isActive(link.path) ? '#fff' : '#b0b0b0',
                      textDecoration: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: isActive(link.path) ? '600' : '500',
                      background: isActive(link.path) ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(link.path)) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#b0b0b0';
                      }
                    }}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Account - Desktop */}
            <div className="desktop-nav" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {account ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 1.25rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <WalletIcon />
                    <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {`${account.slice(0, 6)}...${account.slice(-4)}`}
                    </span>
                    <ChevronDownIcon />
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        right: 0,
                        background: 'white',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        minWidth: '250px',
                        overflow: 'hidden',
                        zIndex: 1000
                      }}
                    >
                      {accounts.length > 0 && (
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0e0e0', fontWeight: '600', color: '#333' }}>
                          Select Account
                        </div>
                      )}
                      {accounts.map((acc) => (
                        <button
                          key={acc}
                          onClick={() => {
                            handleAccountChange({ target: { value: acc } });
                            setIsDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            background: acc === account ? '#f5f5f5' : 'white',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            color: '#333',
                            transition: 'background 0.2s ease',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                          onMouseLeave={(e) => e.currentTarget.style.background = acc === account ? '#f5f5f5' : 'white'}
                        >
                          {acc}
                        </button>
                      ))}
                      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e0e0e0' }}>
                        <button
                          onClick={() => { setIsDropdownOpen(false); onDisconnectWallet && onDisconnectWallet(); }}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            background: '#fce7e7',
                            color: '#b42323',
                            border: '1px solid #f5c2c2',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Always-visible Disconnect button next to chip */}
                  <button
                    onClick={() => onDisconnectWallet && onDisconnectWallet()}
                    style={{
                      padding: '0.55rem 0.9rem',
                      background: 'transparent',
                      color: '#ffb3b3',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onConnectWallet && onConnectWallet()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 1.25rem',
                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <WalletIcon />
                  Connect Wallet
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className="mobile-menu"
              style={{
                paddingBottom: '1rem'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem 1rem',
                      color: isActive(link.path) ? '#fff' : '#b0b0b0',
                      textDecoration: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: isActive(link.path) ? '600' : '500',
                      background: isActive(link.path) ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.05)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}

                {/* Mobile Account Section */}
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    <WalletIcon />
                    <span>Connected Account</span>
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.375rem',
                    color: 'white',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    wordBreak: 'break-all'
                  }}>
                    {account || 'Not Connected'}
                  </div>
                  <button
                    onClick={() => (account ? (onDisconnectWallet && onDisconnectWallet()) : (onConnectWallet && onConnectWallet()))}
                    style={{
                      width: '100%',
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      background: account ? '#fce7e7' : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                      color: account ? '#b42323' : 'white',
                      border: account ? '1px solid #f5c2c2' : 'none',
                      borderRadius: '0.375rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {account ? 'Disconnect' : 'Connect Wallet'}
                  </button>
                  {accounts.length > 1 && (
                    <select
                      value={account}
                      onChange={handleAccountChange}
                      style={{
                        width: '100%',
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        background: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {accounts.map((acc) => (
                        <option key={acc} value={acc}>
                          {acc}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay for dropdown */}
      {(isDropdownOpen || isMenuOpen) && (
        <div
          onClick={() => {
            setIsDropdownOpen(false);
            setIsMenuOpen(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
    </>
  );
};

export default CustomNavbar;