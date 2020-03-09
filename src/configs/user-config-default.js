export const userConfigSchema = {
  type: 'object',
  properties: {
    version: {
      type: 'number',
    },
    enabled: {
      type: 'boolean',
    },
    autoLoadCommentsAtLogoutEnabled: {
      type: 'boolean',
    },
    mutedByUsernameEnabled: {
      type: 'boolean',
    },
    mutedByKeywordEnabled: {
      type: 'boolean',
    },
    mutedByDownVoteEnabled: {
      type: 'boolean',
    },
    profileMutedShortcutEnabled: {
      type: 'boolean',
    },
    syncSettings: {
      type: 'boolean',
    },
    mutedUsers: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    mutedKeywords: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    subscriptions: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    downVote: {
      type: 'number',
    },
  },
  additionalProperties: false,
};

export default {
  version: 1,
  enabled: true,
  autoLoadCommentsAtLogoutEnabled: false,
  mutedByUsernameEnabled: true,
  mutedUsers: [],
  mutedByKeywordEnabled: true,
  mutedKeywords: [],
  mutedByDownVoteEnabled: false,
  profileMutedShortcutEnabled: true, // enable author profile shortcut add muted user
  downVote: 15,
  syncSettings: true,
  subscriptions: [], // config subscriptions url
};
