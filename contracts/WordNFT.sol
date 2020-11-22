pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import './DexquisiteToken.sol';

contract WordNFT is ERC721 {
    string[] public words;
    mapping(string => bool) public _wordExists;

    DexquisiteToken public dexquisiteToken;

    constructor(DexquisiteToken _dexquisiteToken) ERC721('Word', 'WORD') public {
        dexquisiteToken = _dexquisiteToken;
    }

    function mint(string memory _word) public {
        require(!_wordExists[_word], 'Word is already claimed');
        words.push(_word);
        uint _id = words.length;
        _mint(msg.sender, _id);
        _wordExists[_word] = true;
    }




}