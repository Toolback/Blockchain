import React, { Component } from 'react';
import { Button, Table, Icon, Label } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import Campaign from '../../ethereum/campaign';
import { Link, Router } from '../../routes';

class RequestRow extends Component {

    onApprove = async () => {
        const campaign = Campaign(this.props.address);

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });

        
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    };

    onFinalize = async () => {
        const campaign = Campaign(this.props.address);

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });

        
        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    };


    render() {
        
    console.log('result from this props id');
    console.log(this.props.id);
    console.log('result from this props address');
    console.log(this.props.address);
    console.log('result from this props kickstarter');
    console.log(this.props.kickstarter);

        const { Row, Cell } = Table;
        const {id, request, voicesCount } = this.props;
        const readyToFinalize = request.approvalCount > voicesCount / 3;
        return (

            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>
                    <Label ribbon>{id}</Label>
                </Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{request.disapprovalCount}/{voicesCount}</Cell>
                <Cell>
                    {request.complete ? null : ( // If request is complete, then hide button
                        <Button color="green" basic onClick={this.onApprove}>
                            Approve
                        </Button>
                    )}
                </Cell>
                <Cell>

                    {request.complete ? null : ( // If request is complete, then hide button
                        <Button color="teal" basic onClick={this.onFinalize}>
                            Finalize
                        </ Button>
                    )}
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;