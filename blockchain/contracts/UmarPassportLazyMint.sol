// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract UmarPassportLazyMint is ERC721, ERC721URIStorage, Ownable, EIP712 {
    using ECDSA for bytes32;

    struct NFTVoucher {
        uint256 tokenId;
        uint256 minPrice;
        string uri;
    }

    mapping(uint256 => bool) private usedNonces;
    
    constructor(address initialOwner)
        ERC721("UmarPassportLazyMint", "UPLM")
        Ownable(initialOwner)
        EIP712("UmarPassportLazyMint", "1.0.0")
    {}

    function _recoverSigner(NFTVoucher calldata voucher, bytes memory signature)
        internal
        view
        returns (address)
    {
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("NFTVoucher(uint256 tokenId,uint256 minPrice,string uri)"),
            voucher.tokenId,
            voucher.minPrice,
            keccak256(bytes(voucher.uri))
        )));
        address recoveredSigner = ECDSA.recover(digest, signature);
        return recoveredSigner;
    }

    function redeem(address redeemer, NFTVoucher calldata voucher, bytes memory signature) 
        public
        payable 
        returns (uint256) 
    {
        // Make sure that the redeemer is paying enough
        require(msg.value >= voucher.minPrice, "Insufficient funds to redeem");

        // Make sure this token id has not been used
        require(!usedNonces[voucher.tokenId], "Token ID already used");

        // Mark the token ID as used
        usedNonces[voucher.tokenId] = true;

        // Make sure that the signer is authorized to mint NFTs
        address signer = _recoverSigner(voucher, signature);
        require(signer == owner(), "Signature invalid or unauthorized");

        // Mint the NFT
        _safeMint(redeemer, voucher.tokenId);
        _setTokenURI(voucher.tokenId, voucher.uri);

        // Transfer the payment to the owner
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Transfer failed");

        return voucher.tokenId;
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}