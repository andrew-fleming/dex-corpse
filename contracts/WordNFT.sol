pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import './DexquisiteToken.sol';

contract WordNFT is ERC721 {
    string[] public words;
    mapping(string => bool) public _wordExists;

    uint256 constant A_CLASS_COST = 2500000000000000000000;
    uint256 constant B_CLASS_COST = 1000000000000000000000;
    uint256 constant C_CLASS_COST = 250000000000000000000;

    DexquisiteToken public dexquisiteToken;

    constructor(DexquisiteToken _dexquisiteToken) ERC721('Word', 'WORD') public {
        dexquisiteToken = _dexquisiteToken;
    }

    function mint(string memory _word) private {
        require(!_wordExists[_word], 'Word is already claimed');
        words.push(_word);
        uint _id = words.length;
        _mint(msg.sender, _id);
        _wordExists[_word] = true;
    }

    function aClassMint(string memory _word) public {
        //check user balance before transfer
        require(dexquisiteToken.balanceOf(msg.sender) >= A_CLASS_COST, 'You do not have enough DXQ tokens');
        //transfer
        dexquisiteToken.transferFrom(msg.sender, address(this), A_CLASS_COST);
        //use mint function
        mint(_word);
    }

    function bClassMint(string memory _word) public {
        //check user balance before transfer
        require(dexquisiteToken.balanceOf(msg.sender) >= B_CLASS_COST, 'You do not have enough DXQ tokens');
        //transfer
        dexquisiteToken.transferFrom(msg.sender, address(this), B_CLASS_COST);
        //use mint function
        mint(_word);
    }

    function cClassMint(string memory _word) public {
        //check user balance before transfer
        require(dexquisiteToken.balanceOf(msg.sender) >= C_CLASS_COST, 'You do not have enough DXQ tokens');
        //transfer
        dexquisiteToken.transferFrom(msg.sender, address(this), C_CLASS_COST);
        //use mint function
        mint(_word);
    }

}