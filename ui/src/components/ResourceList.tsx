import React from 'react'
import { Button, Container, Icon, List, Segment, Divider } from 'semantic-ui-react'
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
              <Container>
                <Container floated='left'><List.Header  as='h3'>{resource.description}</List.Header></Container>
                { hasRequestRight(resource) &&
                  notRequestedYet(resource) &&
                  <Button floated='right' onClick={() => onCreateRequest(resource)}>Request access</Button>
                }
              </Container>
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
            </List.Content>
            <List>
              { Array.from(new Set([...grants].filter(g => g.request.resource.description === resource.description).map(g => g.request.applicant)))
                  .map( partyWithAccess =>
                    <List.Item key={partyWithAccess}><Icon name='thumbs up outline' />{'  '+partyWithAccess}</List.Item>
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
