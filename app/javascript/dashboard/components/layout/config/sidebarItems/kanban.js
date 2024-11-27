import { FEATURE_FLAGS } from '../../../../featureFlags';
import { frontendURL } from '../../../../helper/URLHelper';

const kanban = accountId => ({
  parentNav: 'kanban_board',
  routes: ['kanban_board'],
  menuItems: [
    {
      icon: 'list',
      label: 'KANBAN_BOARD',
      hasSubMenu: false,
      featureFlag: FEATURE_FLAGS.KANBAN_BOARD,
      toState: frontendURL(`accounts/${accountId}/kanban`),
      toStateName: 'kanban_board',
    },
  ],
});

export default kanban;
