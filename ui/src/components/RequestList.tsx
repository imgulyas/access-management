
// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Button, List, Segment, Divider, Progress} from 'semantic-ui-react'
import { AccessManagement } from '@daml.js/access-management'

type Props = {
  currentUser: string,
  requests: [AccessManagement.ResourceRequest, AccessManagement.RequestApproval | undefined][];
  onApprove: (request: AccessManagement.ResourceRequest) => void;
}

/**
 * React component to display a list of `ResourceRequest`s.
 * Admins can approve requests.
 */
const RequestList: React.FC<Props> = ({currentUser, requests, onApprove}) => {
  const isAdmin = (request: AccessManagement.ResourceRequest) =>
   request.resource.admins.map.has(currentUser);

  return (
    <List divided relaxed >
      {[...requests].map(([request, pending]) =>
        <List.Item key={request.resource.description+request.applicant}>
          <Segment clearing>
            <List.Header as='h3'>Resource: {request.resource.description}</List.Header>
            <List.Header as='h3'>Request by: {request.applicant}</List.Header>
            <Divider></Divider>
            <Progress value={pending?.approvedBy?.map?.entries?.length || 0} total={request.resource.approversNeeded} progress='ratio' />
            { isAdmin(request) && <Button floated='right' onClick={() => onApprove(request)}>Approve request</Button> }
          </Segment>
        </List.Item>
      )}
    </List>
  );
};
export default RequestList;
