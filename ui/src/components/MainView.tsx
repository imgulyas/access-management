// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { Party } from '@daml/types';
import { AccessManagement } from '@daml.js/access-management';
import { useParty, useLedger, useStreamFetchByKeys, useStreamQueries } from '@daml/react';
import ResourceList from './ResourceList';
import RequestList from './RequestList';
import PartyListEdit from './PartyListEdit';


const MainView: React.FC = () => {
  // USERS_BEGIN
  const username = useParty();
  //const myUserResult = useStreamFetchByKeys(User.User, () => [username], [username]);
  //const myUser = myUserResult.contracts[0]?.payload;
  //const allUsers = useStreamQueries(User.User).contracts;
  // USERS_END


  // // Sorted list of users that are following the current user
  // const followers = useMemo(() =>
  //   allUsers
  //   .map(user => user.payload)
  //   .filter(user => user.username !== username)
  //   .sort((x, y) => x.username.localeCompare(y.username)),
  //   [allUsers, username]);

  // // FOLLOW_BEGIN

  const ledger = useLedger();

  // const follow = async (userToFollow: Party): Promise<boolean> => {
  //   try {
  //     await ledger.exerciseByKey(User.User.Follow, username, {userToFollow});
  //     return true;
  //   } catch (error) {
  //     alert(`Unknown error:\n${error}`);
  //     return false;
  //   }
  // }
  // FOLLOW_END

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

  const requests: [AccessManagement.ResourceRequest, (AccessManagement.RequestApproval | undefined)][] = useMemo(() => requestQuery.map(r => [r.payload, undefined]), [requestQuery]);
  //const approvals = useMemo(() => requestQuery.map(r => r.payload), [requestQuery]);

  const approveRequest = async (request: AccessManagement.ResourceRequest): Promise<boolean> => {
    try {
      //await ledger.exercise(AccessManagement.ResourceRequest.Approve, {resource: resource, applicant: username});
      await Promise.resolve();
      alert('approved!');
      return true;
    } catch (error) {
      alert(`Unknown error:\n${error}`);
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
                resources={resources}
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
              />
            </Segment>
          </Grid.Column>

        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
