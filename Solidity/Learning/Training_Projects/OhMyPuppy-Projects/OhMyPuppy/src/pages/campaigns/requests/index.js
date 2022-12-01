import React, { Component } from 'react'; 
import Layout from '../../../components/Layout';
import { Button, Table, Icon, Label, Menu } from 'semantic-ui-react';
import { Link } from '../../../../routes';
import Campaign from '../../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { kickstarter } = props.query;
        const campaign = Campaign(kickstarter);
        const requestCount = await campaign.methods.getAllRequests().call();
        const voicesCount = await campaign.methods.voicesCount().call();


        // Fetch from mapping instead of array
        const requests = await Promise.all(
            Array(parseInt(requestCount))
            .fill()
            .map((element, index) => {
                return campaign.methods.requests(index).call()
            })
        )
        console.log("Result of requests:")
        console.log(requests);

        console.log("From requests>index.js:");
        console.log(props);

        return { kickstarter, requests, requestCount, voicesCount };
    }
    
    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
            key={index}
            id={index}
            request={request}
            address={this.props.kickstarter} 
            voicesCount={this.props.voicesCount}
            />
        })

    }

    render() {
        return (
            <Layout>
                
                <h3>Request</h3>

                <Link route={`/campaigns/${this.props.kickstarter}`}>
                    <a>
                        <Button primary>Back</Button>
                    </a>
                </Link>

                <Link route={`/campaigns/${this.props.kickstarter}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
                    </a>
                </Link>

                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>Voting Count</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                            <Table.HeaderCell>Finalize</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.renderRows()}
                    </Table.Body>

                </Table>

                <div>found {this.props.requestCount} requests.</div>

            </Layout>
        );
     }
}

export default RequestIndex;