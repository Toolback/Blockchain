import React, {Component} from 'react';
import factory from '../../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import Layout from '../components/Layout'
import { Link } from '../../routes';
import mintNft from '../../scripts/mint-nft'


class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { campaigns };
  }

  async mintNft() {
    mintNft
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((kickstarter) => {
      return {
        header: kickstarter,
        description: (
        <Link route={`/campaigns/${kickstarter}`}>
          <a>View Campaigns</a>
        </Link>
        ),
        fluid: true // Stretch cards full width
      };
    });

    console.log("From index.js:");
    console.log(this.props);

    return <Card.Group items={items} />;
  }

  render () {
    return (
   <Layout>
    <div>
      <h3>Open Campaigns</h3>

      <Link route="./campaigns/new">
      <a>
      <Button
      Button floated="right"
      content="Create Campaign"
      icon="add"
      primary
      />
      </a>
      </Link>

      {this.renderCampaigns()}

    </div>
   </Layout>
    );
  }
}

export default CampaignIndex;