const { assert } = require('chai')
const { default: Web3 } = require('web3')

const MockDai = artifacts.require('MockDai')
const DexquisiteToken = artifacts.require('DexquisiteToken')
const DexFarm = artifacts.require('DexFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()


//function for easy decimal conversions
function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}


contract('DexFarm', ([owner, investor, investorTwo]) => {
    let mockDai, dexquisiteToken, dexFarm

    //recreate what should happen in migrations
    before(async() => {
        mockDai = await MockDai.new(tokens('10000'))
        dexquisiteToken = await DexquisiteToken.new(tokens('5000000'))
        dexFarm = await DexFarm.new(dexquisiteToken.address, mockDai.address)

        //transfer dexquisiteToken to dexFarm
        await dexquisiteToken.transfer(dexFarm.address, tokens('5000000'))

        //transfer dai to investor
        await mockDai.transfer(investor, tokens('100'), { from: owner })

        //transfer dai to a different investor
        await mockDai.transfer(investorTwo, tokens('125'), { from: owner })
    })

    describe('MockDai deployment', async() => {
        it('has a name', async() => {
            const name = await mockDai.name()
            assert.equal(name, 'MockDai', 'mockDai name was not fetched correctly')
        })
    })

    describe('Dexquisite deployment', async() => {
        it('has a name', async() => {
            const name = await dexquisiteToken.name()
            assert.equal(name, 'Dexquisite', 'dexquisiteToken name was not fetched correctly')
        })
    })

    describe('DexFarm deployment', async() => {
        it('has a name', async() => {
            const name = await dexFarm.name()
            assert.equal(name, 'DexFarm', 'dexFarm name was not fetched correctly')
        })

        it('has tokens', async() => {
            const balance = await dexquisiteToken.balanceOf(dexFarm.address)
            assert.equal(balance.toString(), tokens('5000000'), 'dexFarm does not have tokens')
        })
    })

    describe('staking', async() => {
        let result

        it('rewards user for staking', async() => {

            //check balance before staking
            result = await mockDai.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'balance prior to staking not correct')

            //check second investor balance before staking
            result = await mockDai.balanceOf(investorTwo)
            assert.equal(result.toString(), tokens('125'), 'balance prior to staking not correct')
        
            //check approval and staking
            await mockDai.approve(dexFarm.address, tokens('100'), { from: investor })
            await dexFarm.stake(tokens('100'), { from: investor })

            //check wallet balance of investor
            result = await mockDai.balanceOf(investor)
            assert.equal(result.toString(), '0', 'wallet balance not correct after staking')

            //check that staking balance is correct
            result = await dexFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'staking balance not correct after staking')

            //issue tokens
            await dexFarm.issueTokens({ from: owner })

            //check balance after issuance
            result = await dexquisiteToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor was not rewarded correctly')

            //ensure only the owner can issue tokens
            await dexFarm.issueTokens({ from: investor }).should.be.rejected

            //check balance before unstaking
            result = await mockDai.balanceOf(investor)
            assert.equal(result.toString(), '0')

            //unstake
            await dexFarm.unstake({ from: investor })

            //check investor balance
            result = await mockDai.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'))

            //check staking balance
            result = await dexFarm.stakingBalance(investor)
            assert.equal(result.toString(), '0')

            //check that user still has dexquisite tokens
            result = await dexquisiteToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'))
        })
    })



})