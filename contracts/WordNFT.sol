pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract WordNFT is ERC721 {
    string[] public words;
    mapping(string => bool) public _wordExists;

    constructor() ERC721('Word', 'WORD') public {
    }

    function mint(string memory _word) public {
        require(!colorExists[_word], 'Word is already claimed');
        words.push(_word);
        uint _id = words.length;
        _mint(msg.sender, _id);
        _wordExists[_word] = true;
    }


}