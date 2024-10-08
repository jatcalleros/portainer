import { Meta } from '@storybook/react';
import { useState } from 'react';

import { TeamsSelector } from './TeamsSelector';
import { createMockTeam } from './TeamsSelector.mocks';

const meta: Meta = {
  title: 'Components/TeamsSelector',
  component: TeamsSelector,
};

export default meta;
export { Example };

function Example() {
  const [selectedTeams, setSelectedTeams] = useState<readonly number[]>([1]);

  const teams = [createMockTeam(1, 'team1'), createMockTeam(2, 'team2')];

  return (
    <TeamsSelector
      value={selectedTeams}
      onChange={(value) => setSelectedTeams(value)}
      teams={teams}
      placeholder="Select one or more teams"
      dataCy="teams-selector"
    />
  );
}
