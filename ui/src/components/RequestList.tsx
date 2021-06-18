
// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Button, List, Segment, Divider, Progress} from 'semantic-ui-react'
import { AccessManagement } from '@daml.js/access-management'
import { ContractId } from '@daml/types';

export interface Approval {
  approval: AccessManagement.RequestApproval,
  id: ContractId<AccessManagement.RequestApproval>,
}

type Props = {
  currentUser: string,
  requests: [AccessManagement.ResourceRequest, Approval | undefined][];
  onApprove: (request: AccessManagement.ResourceRequest, pending: Approval | undefined) => void;
}

/**
 * React component to display a list of `ResourceRequest`s.
 * Admins can approve requests.
 */
export const RequestList: React.FC<Props> = ({currentUser, requests, onApprove}) => {
  const isAdmin = (request: AccessManagement.ResourceRequest) =>
    request.resource.admins.map.has(currentUser);

  return (
    <List divided relaxed >
      {[...requests].map(([request, pending]) => {
        const numOfApprovers: number = pending ? pending.approval.approvedBy.map.entriesArray().length : 0;
        return  <List.Item key={request.resource.description+request.applicant+numOfApprovers}>
                  <Segment clearing>
                    <List.Header as='h3'>Resource: {request.resource.description}</List.Header>
                    <List.Header as='h3'>Request by: {request.applicant}</List.Header>
                    <Divider></Divider>
                    <Progress value={numOfApprovers} total={request.resource.approversNeeded} progress='ratio' />
                    { isAdmin(request) && <Button floated='right' onClick={() => onApprove(request, pending)}>Approve request</Button> }
                  </Segment>
                </List.Item> })}
    </List>
  );
};
