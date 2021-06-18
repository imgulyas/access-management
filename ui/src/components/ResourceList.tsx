// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Button, Icon, List, Segment, Divider } from 'semantic-ui-react'
import { AccessManagement } from '@daml.js/access-management'

type Props = {
  currentUser: string,
  resources: AccessManagement.Resource[];
  requests: AccessManagement.ResourceRequest[];
  grants: AccessManagement.RequestGranted[];
  onCreateRequest: (resource: AccessManagement.Resource) => void;
}

/**
 * React component to display a list of available `Resource`s.
 * One can request access to every resource in the list.
 */
const ResourceList: React.FC<Props> = ({currentUser, resources, requests, grants, onCreateRequest}) => {
  const hasRequestRight = (resource: AccessManagement.Resource) =>
    resource.withRequestRight.find(user => user === currentUser);

  const notRequestedYet = (resource: AccessManagement.Resource): boolean =>
    !requests.find(req => req.applicant === currentUser && req.resource.description === resource.description)

  return (
    <List divided relaxed >
      {[...resources].map(resource =>
        <List.Item key={resource.description}>
          <Segment clearing>
            <List.Content>
              <List.Header as='h3'>{resource.description}</List.Header>
              <Divider></Divider>
              <List.Description>
                Administrators:   <br></br>
                <List horizontal>
                  {resource.admins.map(admin =>
                    <List.Item key={admin}><strong>{admin}</strong></List.Item>  
                  )}
                </List>
                <br></br>Approvals needed:  <strong>{resource.approversNeeded}</strong>
              </List.Description>
              { hasRequestRight(resource) &&
                notRequestedYet(resource) &&
                <Button floated='right' onClick={() => onCreateRequest(resource)}>Request access</Button>}
            </List.Content>
            <List verticalAlign='top'>
              { Array.from(new Set([...grants].filter(g => g.request.resource.description === resource.description).map(g => g.request.applicant)))
                  .map( partyWithAccess =>
                    <List.Item><Icon padding name='thumbs up outline' />{'  '+partyWithAccess}</List.Item>
                  )
              }
            </List>
          </Segment>
        </List.Item>
      )}
    </List>
  );
};

export default ResourceList;
