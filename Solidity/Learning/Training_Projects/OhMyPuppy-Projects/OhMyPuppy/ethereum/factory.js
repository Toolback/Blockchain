import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(JSON.stringify(CampaignFactory.abi)),
    '0x5F21Bd8ACC49C9482F51D2C1ACFF0da07137ae00'
);

export default instance;