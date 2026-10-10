import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { ids, requireProfile } from '../server/session';
import { findAllRecords, tableSchema } from '../server/adminTables';

export default createEndpoint({
  description: 'Admin: lists every record in a table (profiles include login email)',
  authenticated: true,
  inputSchema: z.object({ table: tableSchema }),
  outputSchema: z.object({ records: z.array(z.record(z.string(), z.any())) }),
  execute: async ({ input, context }) => {
    await requireProfile(context.user, ['Admin']);
    const records = await findAllRecords(input.table);
    if (input.table === 'profiles') {
      const { records: users } = await zite.auth.findAllUsers({ limit: 2000 });
      const byId = new Map(users.map((u) => [u.id, u]));
      return {
        records: records.map((r) => {
          const u = byId.get(ids(r.account as string | string[])[0] ?? '');
          return { ...r, email: u?.email ?? '', firstName: u?.firstName ?? '', lastName: u?.lastName ?? '' };
        }),
      };
    }
    return { records };
  },
});
