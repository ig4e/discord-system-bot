import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { AttachmentBuilder, Message } from 'discord.js';
import { Hercai } from 'hercai';
import { createWorker } from 'tesseract.js';
import { config } from '../config';

const MAX_MESSAGE_LENGTH = 2000;

@ApplyOptions<Listener.Options>({
	name: 'ai-chat',
	once: false,
	event: Events.MessageCreate,
	enabled: true
})
export class UserEvent extends Listener {
	public override async run(message: Message) {
		if (!config.channels.AIChat.includes(message.channelId)) return;
		if (message.author.bot || !message.guild) return;
		const herc = new Hercai();
		let { content } = message;

		const loadingMessage = await message.reply({ content: `جاري التحميل...` });

		if (content.toLowerCase().startsWith('draw')) {
			const userPrompt = content.slice(4).trim();
			const response = await herc.drawImage({ model: 'v2', prompt: userPrompt });
			content = response.url;

			return await loadingMessage.edit({
				content: response.prompt,
				files: [new AttachmentBuilder(content, { name: 'image.png' })]
			});
		}

		if (message.attachments.size > 0) {
			const attachment = message.attachments.first();
			const imageUrl = attachment?.url;

			const worker = await createWorker();
			const {
				data: { text }
			} = await worker.recognize(imageUrl);
			await worker.terminate();

			content += '\n' + text;
		}

		try {
			const response = await herc.question({ model: 'v3-beta', content: content });

			content = response.reply;

			while (content.length > MAX_MESSAGE_LENGTH) {
				const chunk = content.slice(0, MAX_MESSAGE_LENGTH);
				content = content.slice(MAX_MESSAGE_LENGTH);

				const chunkWithReplacements = this.replaceOpenAIPhrases(chunk, message);
				await loadingMessage.edit({ content: chunkWithReplacements });
			}

			return await loadingMessage.edit({ content: this.replaceOpenAIPhrases(content, message) });
		} catch (error) {
			console.error(error);
			return await loadingMessage.edit('An error occurred while processing your request.');
		}
	}

	replaceOpenAIPhrases(originalResponse: string, message: Message) {
		const openAIKeywords = [
			'developed by OpenAI',
			'developers',
			'OpenAI',
			'maintained by OpenAI',
			'intelligence research organization',
			'organization',
			'developed me is called OpenAI Research',
			'Research',
			'team',
			'engineers',
			'designers',
			'scientists',
			'developed and maintained',
			'Herc.ai',
			'commonly referred to as Herc.ai'
		];

		const replacementMessage = `مرحبًا ${message.author.username}، اسمي ChatAI.\n> - إذا كنت ترغب في أن يقوم البوت برسم شيء، ابدأ رسالتك بكلمة "draw"`;

		const modifiedResponse = openAIKeywords.reduce((acc, keyword) => {
			const regex = new RegExp(keyword, 'gi');
			return acc.replace(regex, replacementMessage);
		}, originalResponse);

		return modifiedResponse;
	}
}
