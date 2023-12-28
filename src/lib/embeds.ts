import { APIEmbed, CacheType, EmbedBuilder, EmbedData, Message } from 'discord.js';
import { colors } from './constants';
import { Command } from '@sapphire/framework';
import { config } from '../config';

interface EmbedConstructorOptions {
	message?: Message;
	interaction?: Command.ChatInputCommandInteraction<CacheType>;
}

interface EmbedOptions {
	title?: string;
	titleIcon?: string;
	description?: string;
}

export class EmbedManager {
	constructor(public options: EmbedConstructorOptions) {}

	base(options: (EmbedData | APIEmbed | undefined) & { titleIcon?: string }) {
		const author = this.options.message?.author ?? this.options.interaction?.user;
		const guild = this.options.message?.guild ?? this.options.interaction?.guild;

		return new EmbedBuilder({
			title: options.titleIcon && options.title ? `${options.titleIcon} | ${options.title}` : options.title,
			description: options.description && `**${options.description}**`,
			footer: author ? { text: author.username, icon_url: author.avatarURL()! } : undefined,
			author: guild ? { name: guild.name, icon_url: guild.iconURL()! } : undefined
		})
			.setColor(colors.info)
			.setTimestamp();
	}

	info(options: EmbedOptions) {
		return this.base({ ...options, titleIcon: options.titleIcon ?? config.icons.info }).setColor(colors.info);
	}

	success(options: EmbedOptions) {
		return this.base({ ...options, titleIcon: options.titleIcon ?? config.icons.success, title: options.title ?? 'نجاح' }).setColor(colors.success);
	}

	warning(options: EmbedOptions) {
		return this.base({ ...options, titleIcon: options.titleIcon ?? config.icons.warning, title: options.title ?? 'تحذير' }).setColor(colors.warning);
	}

	error(options: EmbedOptions) {
		return this.base({ ...options, titleIcon: options.titleIcon ?? config.icons.error, title: options.title ?? 'فشل' }).setColor(colors.danger);
	}
}
