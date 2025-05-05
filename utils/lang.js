const LANGS = {
  fr: {
    levelup: (user, level) => `🎉 ${user} passe niveau **${level}** !`,
    balance: (user, coins) => `💰 Solde de ${user}\n> **Coins :** ${coins}`,
    daily: (coins, total) => `Tu as reçu **${coins} coins** !\n> **Nouveau solde :** ${total}`,
    pay: (from, to, amount) => `${from} a donné **${amount} coins** à ${to} !`,
    suggestSent: 'Suggestion envoyée !',
    pollCreated: 'Sondage créé !',
    featureDisabled: '❌ Cette fonctionnalité est désactivée sur ce serveur.',
    // Nouveaux textes centralisés :
    invalidAmount: 'Montant invalide.',
    insufficientBalance: 'Solde insuffisant.',
    dailyCooldown: '⏳ Tu as déjà récupéré ta récompense aujourd\'hui !',
    leaderboardTitle: '🏆 Leaderboard XP',
    leaderboardEmpty: 'Aucun membre classé.',
    leaderboardFooter: 'Système de niveaux',
    rankTitle: user => `🏅 Niveau de ${user}`,
    rankDescription: (level, xp) => `> **Niveau :** ${level}\n> **XP :** ${xp}`,
    rankFooter: 'Système de niveaux',
    paymentTitle: '💸 Paiement',
    paymentFooter: 'Système d\'économie',
    dailyTitle: '🎁 Daily',
    dailyFooter: 'Système d\'économie',
    balanceFooter: 'Système d\'économie',
    pollTitle: '📊 Sondage',
    pollFooter: user => `Par ${user}`,
    suggestTitle: '💡 Nouvelle suggestion',
    suggestFooter: user => `Par ${user}`,
    eightballTitle: '🎱 8ball',
    eightballResponses: [
      'Oui', 'Non', 'Peut-être', 'Certainement', 'Jamais', 'Demande plus tard', 'Probablement', 'Impossible'
    ],
    coinflipTitle: '🪙 Pile ou Face',
    coinflipResult: result => `Résultat : **${result}**`,
  },
  en: {
    levelup: (user, level) => `🎉 ${user} reached level **${level}**!`,
    balance: (user, coins) => `💰 Balance of ${user}\n> **Coins:** ${coins}`,
    daily: (coins, total) => `You received **${coins} coins**!\n> **New balance:** ${total}`,
    pay: (from, to, amount) => `${from} gave **${amount} coins** to ${to}!`,
    suggestSent: 'Suggestion sent!',
    pollCreated: 'Poll created!',
    featureDisabled: '❌ This feature is disabled on this server.',
    // Centralized texts:
    invalidAmount: 'Invalid amount.',
    insufficientBalance: 'Insufficient balance.',
    dailyCooldown: '⏳ You have already claimed your daily reward today!',
    leaderboardTitle: '🏆 XP Leaderboard',
    leaderboardEmpty: 'No ranked members.',
    leaderboardFooter: 'Level system',
    rankTitle: user => `🏅 ${user}'s Level`,
    rankDescription: (level, xp) => `> **Level:** ${level}\n> **XP:** ${xp}`,
    rankFooter: 'Level system',
    paymentTitle: '💸 Payment',
    paymentFooter: 'Economy system',
    dailyTitle: '🎁 Daily',
    dailyFooter: 'Economy system',
    balanceFooter: 'Economy system',
    pollTitle: '📊 Poll',
    pollFooter: user => `By ${user}`,
    suggestTitle: '💡 New suggestion',
    suggestFooter: user => `By ${user}`,
    eightballTitle: '🎱 8ball',
    eightballResponses: [
      'Yes', 'No', 'Maybe', 'Certainly', 'Never', 'Ask later', 'Probably', 'Impossible'
    ],
    coinflipTitle: '🪙 Coinflip',
    coinflipResult: result => `Result: **${result}**`,
  }
};

function getLang(interaction) {
  const locale = interaction.locale || interaction.user?.locale || 'fr';
  if (locale.startsWith('fr')) return LANGS.fr;
  return LANGS.en;
}

module.exports = { getLang };