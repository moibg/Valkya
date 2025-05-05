const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const { getLang } = require('../../utils/lang');

const QUIZ_QUESTIONS = [
	{
		question: 'Quelle est la capitale de la France ?',
		answer: 'Paris',
	},
	{
		question: 'Combien de planètes dans le système solaire ?',
		answer: '8',
	},
	{
		question: 'Qui a écrit "Le Petit Prince" ?',
		answer: 'Antoine de Saint-Exupéry',
	},
	{
		question: 'Quelle est la racine carrée de 64 ?',
		answer: '8',
	},
	{
		question: 'Quel est le plus grand océan du monde ?',
		answer: 'Pacifique',
	},
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quiz')
		.setDescription('Réponds à une question quiz !'),
	async execute(interaction) {
		const lang = getLang(interaction);
		const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
		const embed = embedBuilder({
			title: '❓ Quiz',
			description: q.question,
			color: 0x5865F2,
		});
		await interaction.reply({ embeds: [embed] });
		const filter = (m) => m.author.id === interaction.user.id;
		const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });
		collector.on('collect', (msg) => {
			if (msg.content.trim().toLowerCase() === q.answer.toLowerCase()) {
				msg.reply('✅ Bonne réponse !');
			} else {
				msg.reply(`❌ Mauvaise réponse. La bonne réponse était : **${q.answer}**`);
			}
		});
		collector.on('end', (collected) => {
			if (collected.size === 0) {
				interaction.followUp({ content: `⏰ Temps écoulé ! La bonne réponse était : **${q.answer}**`, ephemeral: true });
			}
		});
	},
};