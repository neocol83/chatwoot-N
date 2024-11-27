import settings from './settings/settings.routes';
import conversation from './conversation/conversation.routes';
import { routes as searchRoutes } from '../../modules/search/search.routes';
import { routes as contactRoutes } from './contacts/routes';
import { routes as notificationRoutes } from './notifications/routes';
import { routes as inboxRoutes } from './inbox/routes';
import { frontendURL } from '../../helper/URLHelper';
import helpcenterRoutes from './helpcenter/helpcenter.routes';

const AppContainer = () => import('./Dashboard.vue');
const Captain = () => import('./Captain.vue');
const Suspended = () => import('./suspended/Index.vue');
const KanbanBoard = () => import('./kanban/KanbanBoard.vue');
// Remova a linha abaixo
// const RastrearPedido = () => import('./rastrear-pedido/RastrearPedido.vue');

export default {
  routes: [
    ...helpcenterRoutes.routes,
    {
      path: frontendURL('accounts/:account_id'),
      component: AppContainer,
      children: [
        {
          path: frontendURL('accounts/:accountId/captain'),
          name: 'captain',
          component: Captain,
          meta: {
            permissions: ['administrator', 'agent', 'custom_role'],
          },
        },
        {
          path: frontendURL('accounts/:accountId/kanban'),
          name: 'kanban_board',
          component: KanbanBoard,
          meta: {
            permissions: ['administrator', 'agent'],
          },
        },
        // Remova o bloco de código abaixo
        // {
        //   path: frontendURL('accounts/:accountId/rastreio'),
        //   name: 'rastreio',
        //   component: RastrearPedido,
        //   meta: {
        //     permissions: ['administrator', 'agent'],
        //   },
        // },
        ...inboxRoutes,
        ...conversation.routes,
        ...settings.routes,
        ...contactRoutes,
        ...searchRoutes,
        ...notificationRoutes,
      ],
    },
    {
      path: frontendURL('accounts/:accountId/suspended'),
      name: 'account_suspended',
      meta: {
        permissions: ['administrator', 'agent', 'custom_role'],
      },
      component: Suspended,
    },
  ],
};
