const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledKickstarter = require('../ethereum/build/kickstarter.json');

let accounts;
let kickstarter;
let factory;
let campaignAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "3000000" });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '3000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    kickstarter = await new web3.eth.Contract(compiledKickstarter.abi, campaignAddress);

});

describe('Kickstarter', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(kickstarter.options.address);
    });

    it('makes msg sender as the campaign manager', async () => {
        const manager = await kickstarter.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('Allow ppl to contribute monney and marks them as contributor', async () => {
        await kickstarter.methods.contribute().send({
            value: '300',
            from: accounts[1],
            gas: '3000000'
        });
        const isContributor = await kickstarter.methods.contributor(accounts[1]).call();
        assert(isContributor);
    });

    it('require a minimum contribution', async () => {
        try {
            await kickstarter.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false);

        } catch (err) {
            assert(err);

        }

    });

    it('allows a manager to create a request', async () => {
        await kickstarter.methods
          .createRequest('Buy Leather', '1999', accounts[1])
          .send({from: accounts[0], gas: "3000000" })
          const request = await kickstarter.methods.requests(0).call();

          assert.equal('Buy Leather', request.description);
    });

    it('processes requests', async () => {
        await kickstarter.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await kickstarter.methods
          .createRequest('Desc1', web3.utils.toWei('5', 'ether'), accounts[1])
          .send({ from: accounts[0], gas:'3000000'} );

          await kickstarter.methods.approveRequest(0).send({ from: accounts[0], gas: '3000000'} );

          await kickstarter.methods.finalizeRequest(0).send({ from: accounts[0], gas:'3000000'});

          let balance = await web3.eth.getBalance(accounts[1]);
          balance = web3.utils.fromWei(balance, 'ether');
          balance = parseFloat(balance);
          console.log(balance)

          assert(balance > 104 )
    });
    
});
