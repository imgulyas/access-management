// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { AccessManagement } from '@daml.js/access-management';
import { useParty, useLedger, useStreamQueries } from '@daml/react';
import ResourceList from './ResourceList';
import { Approval, RequestList } from './RequestList';


const MainView: React.FC = () => {
  const username = useParty();
  const ledger = useLedger();

  // RESOURCES_BEGIN
  const resourceQuery = useStreamQueries(AccessManagement.Resource).contracts;
  const resources = useMemo(() => resourceQuery.map(r => r.payload), [resourceQuery]);

  const createRequest = async (resource: AccessManagement.Resource): Promise<boolean> => {
    try {
      await ledger.create(AccessManagement.ResourceRequest, {resource: resource, applicant: username});
      return true;
    } catch (error) {
      alert('You already have a pending request for this resource');
      return false;
    }
  }
  //RESOURCES_END

  // REQUESTS_BEGIN
  const requestQuery = useStreamQueries(AccessManagement.ResourceRequest).contracts;
  const approvalQuery = useStreamQueries(AccessManagement.RequestApproval).contracts;

  const requests: [AccessManagement.ResourceRequest, Approval | undefined][] =
    useMemo(
      () => requestQuery
        .map(req => {
          const payload = req.payload;
          const matchingApp = approvalQuery
            .find(app => app.payload.request.applicant === payload.applicant
                         && app.payload.request.resource.description === payload.resource.description);
          const app: Approval | undefined = matchingApp ? { id: matchingApp.contractId, approval: matchingApp.payload } : undefined;
          return  [payload, app];}),
      [requestQuery, approvalQuery]);

  const approveRequest = async (request: AccessManagement.ResourceRequest, pending: Approval | undefined): Promise<boolean> => {
    try {
      if(pending) {
        await ledger.exercise(
          AccessManagement.RequestApproval.Approve,
          pending?.id,
          { approver: username }) ;
      } else {
        await ledger.create(
          AccessManagement.RequestApproval,
          { approvedBy: [username],  request: request });
      }

      return true;

    } catch (error) {
        alert('error');
        return false;
    }
  }

  const grantRequest = async (approval: Approval | undefined): Promise<boolean> => {
    try {
      if(approval) {
        await ledger.exercise(
          AccessManagement.RequestApproval.GrantRequest,
          approval?.id,
          { grantor: username });
      }
      return true;

    } catch (error) {
        alert('error');
        return false;
    }
  }
  //REQUESTS_END

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row >
          <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
              {username ? `Welcome, ${username}!` : 'Loading...'}
          </Header>
        </Grid.Row>
        <Grid.Row stretched>

          <Grid.Column>
            <Segment>
              <Header as='h3'>
                <Icon name='box' />
                <Header.Content>
                  Available Resources
                  <Header.Subheader>You can request access to these resources</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <ResourceList
                currentUser={username}
                resources={resources}
                requests={requests.map(([r, x]) => r)}
                onCreateRequest={createRequest}
              />
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment>
              <Header as='h3'>
                <Icon name='question' />
                <Header.Content>
                  Pending requests
                  <Header.Subheader>Follow and approve resource requests</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <RequestList
                currentUser={username}
                requests={requests}
                onApprove={approveRequest}
                onGrantRequest={grantRequest}
              />
            </Segment>
          </Grid.Column>

        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
