
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
  grants: AccessManagement.RequestGranted[];
  onApprove: (request: AccessManagement.ResourceRequest, approval: Approval | undefined) => void;
  onGrantRequest: (approval: Approval | undefined) => void;
}

/**
 * React component to display a list of `ResourceRequest`s.
 * Admins can approve requests.
 */
export const RequestList: React.FC<Props> = ({currentUser, requests, grants, onApprove, onGrantRequest}) => {
  const isAdmin = (request: AccessManagement.ResourceRequest) =>
    request.resource.admins.find(a => a === currentUser);
  const wasGranted = (req: AccessManagement.ResourceRequest) =>
    grants.find(g => g.request.applicant === req.applicant && g.request.resource.description === req.resource.description);

  return (
    <List divided relaxed >
      {[...requests]
        .filter(([r, p]) => !wasGranted(r))
        .map(([request, pending]) => {
        const numOfApprovers: number = pending ? pending.approval.approvedBy.length : 0;
        const neededApprovers: number = +request.resource.approversNeeded;
        const enoughApprovers: boolean = numOfApprovers >= neededApprovers;
        const didApprove = pending ? pending.approval.approvedBy.filter(a => a === currentUser).length > 0 : false;
        return  <List.Item key={request.resource.description+request.applicant+numOfApprovers}>
                  <Segment clearing>
                    <List.Header as='h3'>Resource: {request.resource.description}</List.Header>
                    <List.Header as='h3'>Request by: {request.applicant}</List.Header>
                    <Divider></Divider>
                    <Progress value={numOfApprovers} total={neededApprovers} success={enoughApprovers} progress='ratio' />
                    { isAdmin(request) &&
                      !didApprove &&
                      <Button floated='right' onClick={() => onApprove(request, pending)}>Approve request</Button> }
                    { didApprove &&
                      enoughApprovers &&
                      <Button floated='right' onClick={() => onGrantRequest(pending)}>Grant request</Button>}
                  </Segment>
                </List.Item> })}
    </List>
  );
};
