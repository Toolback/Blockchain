import React, { Component } from 'react';
import Layout from '../../components/Layout.js';
import { Button, Checkbox, Form, Input, Message } from 'semantic-ui-react'
import factory from '../../../ethereum/factory';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
 


class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        campaignDescription: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {

        const accounts = await web3.eth.getAccounts();

        await factory.methods
        .createCampaign(this.state.minimumContribution, this.state.campaignDescription)
        .send({
            from: accounts[0]
        });

        Router.pushRoute('/');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });


    };

    render() {
        return (
            <Layout>
                <h3>Lets Create a New Campaign !</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution to be Contributor</label>
                        <Input 
                        label="wei" 
                        labelPosition="right"
                        value={this.state.minimumContribution}
                        onChange={event => 
                        this.setState({minimumContribution: event.target.value})} />

                        <label>Campaign Description</label>
                        
                        <Form.TextArea 
                        value={this.state.campaignDescription}
                        onChange={event => 
                            this.setState({campaignDescription: event.target.value })} />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />

                    <Button loading={this.state.loading} primary="true">Create !</Button>
                </Form>
            </Layout>
        )
    }
}

export default CampaignNew;