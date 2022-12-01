import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import { Card, Grid, Container, Divider, Button } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../../routes';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.kickstarter);

        const summary = await campaign.methods.getResume().call();

        console.log("From show.js:");
        console.log(props);

        return { 
            address: props.query.kickstarter,
            campaignDescription: summary[0],
            minimumContribution: summary[1],
            balance: summary[2],
            numRequests: summary[3],
            voicesCount: summary[4],
            manager: summary[5]
        };
    }

    campaignDescription = this.props.campaignDescription;
    //contributor = this.props.address;

    renderCards() {
        const { 
            minimumContribution,
            balance,
            numRequests,
            voicesCount,
            manager
        } = this.props;


        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to spending campaign funds',
                style: {overflowWrap: 'break-word' }
            }, {

               header: minimumContribution,
               meta: 'Minimum Contribution (wei)',
               description:'You must contribute at least this much wei to vote on this campaign',
            }, {
                header: numRequests,
                meta:'Number of Requests',
                description: 'A request is created by the manager to request a spending monney'
            }, {
                header: voicesCount,
                meta:'Number of Voices',
                description: 'People voices'
            }, {
                header: web3.utils.fromWei(balance, 'ether'),
                meta:'Campaign Balance (ether)',
                description: 'Balance is how much campaign has left to spend'
            }
        ];

        return <Card.Group items = {items} />
    }

    render() {
        return (
        <Layout>
            <div> 
                <Container textAlign='justified'>
                    <h2>Summary</h2>
                    <p> {this.campaignDescription}
                    </p>
                    <Divider /> 

                </Container>

            </div>

                <h3>Details</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}

                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>

                    </Grid.Row>
                </Grid>
            </Layout>
            );
    }
}

export default CampaignShow;