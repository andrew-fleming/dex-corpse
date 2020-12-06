pragma solidity ^0.6.0;

import './DexquisiteToken.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

interface DaiToken {
        function transfer(address dst, uint wad) external returns (bool);
        function transferFrom(address from, address to, uint wad) external returns (bool);
        function balanceOf(address user) external view returns (uint);
        function approve(address _spender, uint256 _value) external returns (bool);
        }

contract DexFarm is Ownable {

    string public name = 'DexFarm';

    DexquisiteToken public dexquisiteToken;
    DaiToken public daitoken;

    address[] public stakers;

    mapping(address => uint256) public startTime;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DexquisiteToken _dexquisiteToken) public {
        dexquisiteToken = _dexquisiteToken;
        //kovan network
        daitoken = DaiToken(0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa);
    }

    //staking
    function stake(uint256 _amount) public {
        require(_amount > 0, 'You cannot stake zero tokens');
        daitoken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        //if user hasn't staked, add them to array
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
        startTime[msg.sender] = block.timestamp;
    }

/*
    //issue tokens
    function issueTokens() public onlyOwner {
        for(uint i = 0; i < stakers.length; i++){
            address recipient = stakers[i];
            //1% yield every minute to quickly show proof of concept
            uint timeStaked = calculateYield(msg.sender);
            uint bal = (stakingBalance[recipient] * timeStaked ) / 100;
            dexquisiteToken.transfer(msg.sender, bal);
        }        
    }
*/

    //withdraw yield
    function withdrawYield() public {
        uint timeStaked = calculateYield(msg.sender);
        uint bal = (stakingBalance[msg.sender] * timeStaked) / 100;

        //reset timestamp
        startTime[msg.sender] = block.timestamp;
        
        //transfer dxq
        dexquisiteToken.transfer(msg.sender, bal);
    }


    //subtract initial timestamp from current timestamp
    function calculateYield(address usr) public view returns(uint){
        uint end = block.timestamp;
        uint totalTime = end - startTime[usr];
        //convert sec to minutes
        uint minTime = totalTime / 60;
        return minTime;
    }


    //unstaking
    function unstake() public {
        require(isStaking[msg.sender] = true, 'You are not staking tokens');
        
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, 'You do not have funds to fetch');
        stakingBalance[msg.sender] = 0;
        daitoken.transfer(msg.sender, balance);

        //update staking status
        isStaking[msg.sender] = false;
    }

}