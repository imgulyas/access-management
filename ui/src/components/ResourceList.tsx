// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Button, List, Segment, Divider } from 'semantic-ui-react'
import { AccessManagement } from '@daml.js/access-management'

type Props = {
  resources: AccessManagement.Resource[];
  onCreateRequest: (resource: AccessManagement.Resource) => void;
}

/**
 * React component to display a list of available `Resource`s.
 * One can request access to every resource in the list.
 */
const ResourceList: React.FC<Props> = ({resources, onCreateRequest}) => {

  return (
    <List divided relaxed >
      {[...resources].map(resource =>
        <List.Item key={resource.description}>
          <Segment clearing>
            <List.Header as='h3'>{resource.description}</List.Header>
            <Divider></Divider>
            <List.Description>
              Administrators:   <br></br>
              <List horizontal>
                {resource.admins.map.entriesArray().map(t => t[0]).map(admin =>
                  <List.Item key={admin}><strong>{admin}</strong></List.Item>  
                )}
              </List>
              <br></br>Approvals needed:  <strong>{resource.approversNeeded}</strong>
            </List.Description>
            <Button floated='right' onClick={() => onCreateRequest(resource)}>Request access</Button>
          </Segment>
        </List.Item>
      )}
    </List>
  );
};

export default ResourceList;
