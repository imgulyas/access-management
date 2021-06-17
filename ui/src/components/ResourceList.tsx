// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Button, List } from 'semantic-ui-react'
import { AccessManagement } from '@daml.js/access-management'

type Props = {
  resources: AccessManagement.Resource[];
  onCreateRequest: (resource: AccessManagement.Resource) => void;
}

/**
 * React component to display a list of `User`s.
 * Every party in the list can be added as a friend.
 */
const ResourceList: React.FC<Props> = ({resources, onCreateRequest}) => {

  const	concat = (entries: [string, {}][]) : string => {
	return entries.map(t => t[0]).reduce((a, b) => a+', '+b);
  };

  return (
    <List divided relaxed>
      {/* {[...resources].sort((x, y) => x.username.localeCompare(y.username)).map(resource => */}
      {[...resources].map(resource =>
        <List.Item key={resource.description}>
          <List.Content>
            <List.Content floated='right'>
	      <span>Admins: {concat(resource.admins.map.entriesArray()) + '  '}</span>
	      <Button onClick={() => onCreateRequest(resource)}>Request access</Button>
              {/* <Icon
	        name='universal access'
                link
                className='test-select-add-user-icon'
                onClick={() => onCreateRequest(resource)} /> */}
            </List.Content>
            <List.Header className='test-select-user-in-network'>{resource.description}</List.Header>
          </List.Content>
        </List.Item>
      )}
    </List>
  );
};

export default ResourceList;
