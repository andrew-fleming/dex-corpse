pragma solidity ^0.6.0;

import './DexquisiteToken.sol';
import './MockDai.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract DexFarm is Ownable {

    string public name = 'DexFarm';

    DexquisiteToken public dexquisiteToken;
    MockDai public mockDai;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DexquisiteToken _dexquisiteToken, MockDai _mockDai) public {
        dexquisiteToken = _dexquisiteToken;
        mockDai = _mockDai;
    }

    //staking
    function stake(uint256 _amount) public {
        require(_amount > 0, 'You cannot stake zero tokens');
        mockDai.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        //if user hasn't staked, add them to array
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    //issue tokens
    function issueTokens() public onlyOwner {
        for(uint i = 0; i < stakers.length; i++){
            address recipient = stakers[i];
            //stakers receive 5% of their dai principle in dexquisite
            uint balance = (stakingBalance[recipient] / 20);
            if(balance > 0){
                dexquisiteToken.transfer(recipient, balance);
            }
        }        
    }

    //unstaking
    function unstake() public {
        require(isStaking[msg.sender] = true, 'You are not staking tokens');
        
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, 'You do not have funds to fetch');
        stakingBalance[msg.sender] = 0;
        mockDai.transfer(msg.sender, balance);

        //update staking status
        isStaking[msg.sender] = false;
    }

}