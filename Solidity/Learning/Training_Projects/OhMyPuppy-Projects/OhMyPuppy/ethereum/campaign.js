import web3 from './web3';
import kickstarter from './build/kickstarter.json';

const Campaign = (address) => {
 return new web3.eth.Contract(
     JSON.parse(JSON.stringify(kickstarter.abi)),
     address
 );
};

export default Campaign