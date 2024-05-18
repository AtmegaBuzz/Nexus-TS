// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract Carbon is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Pausable, Ownable, ERC721Burnable {
    uint256 private _nextTokenId;
    mapping (uint256 tokenId => Info) private _infos;

    struct Info {
        string machine_addr;
        string machine_cid;
        string cid;
        string location;
        string timestamp;
        uint energy;
    }

    constructor(address initialOwner)
        ERC721("Carbon", "CRB")
        Ownable(initialOwner)
    {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function mintInfo(
        string memory machine_addr,
        string memory machine_cid,
        string memory cid,
        string memory location,
        string memory timestamp,
        uint energy,
        uint256 tokenId
    ) public{

        _requireOwned(tokenId);

        Info memory info = _infos[tokenId];
        
        require(keccak256(abi.encodePacked(info.cid)) == keccak256(abi.encodePacked("")), "Token Info already exists");

        _infos[tokenId] = Info(machine_addr,machine_cid,cid,location,timestamp,energy);
    }


    function getInfo(uint256 tokenId) public view returns (string memory,string memory,string memory,string memory,string memory,uint) {

        _requireOwned(tokenId);
        Info memory info = _infos[tokenId];

        return (info.machine_addr,info.machine_cid,info.cid,info.location,info.timestamp,info.energy);

    }


    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

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
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}