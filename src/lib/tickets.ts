import { Command } from '@sapphire/framework';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CacheType,
	ChannelType,
	Message,
	MessageCreateOptions,
	MessageEditOptions,
	MessagePayload,
	PermissionFlagsBits,
	PermissionsBitField,
	TextChannel
} from 'discord.js';
import { config } from '../config';
import { db } from '../db';
import { TicketCategoryId, TicketStatus } from '../db/models/ticket';
import { EmbedManager } from './embeds';
import discordTranscripts from 'discord-html-transcripts';
import { translateTicketActions } from './utils';

interface TicketConstructorOptions {
	message?: Message;
	interaction?: Command.ChatInputCommandInteraction<CacheType>;
}

export const allowedPermissions = [
	PermissionFlagsBits.SendMessages,
	PermissionFlagsBits.ViewChannel,
	PermissionFlagsBits.ReadMessageHistory,
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.AttachFiles
];

export type TicketAction = 'create' | 'open' | 'close' | 'claim' | 'unclaim' | 'add' | 'remove' | 'lock' | 'unlock' | 'delete';

export class TicketManager {
	interactionOrMessage: Command.ChatInputCommandInteraction<CacheType> | Message;
	embedManager: EmbedManager;
	constructor(public options: TicketConstructorOptions) {
		this.embedManager = new EmbedManager({
			message: options.message,
			interaction: options.interaction
		});

		this.interactionOrMessage = options.interaction ?? options.message!;
	}

	async create({ categoryId }: { categoryId: TicketCategoryId }) {
		const ticketCategory = config.ticket.category.find((c) => c.id === categoryId)!;

		const ticketNumber = ((await db.counters.findOne({ id: 'number' }))?.seq || 0) + 1

		const { guild, user, client } = this.getInfoFromInteractionOrMessage();

		const ticketChannel = await this.interactionOrMessage.guild?.channels.create({
			name: `ticket-${ticketNumber}`,
			type: ChannelType.GuildText,
			parent: ticketCategory.categoryId,
			permissionOverwrites: [
				{
					id: user.id!,
					allow: allowedPermissions
				},
				{
					id: client.user.id,
					allow: allowedPermissions
				},
				{
					id: guild.roles.everyone.id,
					deny: [PermissionFlagsBits.ViewChannel]
				},
				...config.roles.staff.map((r) => ({
					id: r,
					allow: allowedPermissions
				}))
			]
		});

		if (!ticketChannel) throw new Error('حدث خطأ أثناء إنشاء التذكرة');

		const ticket = await db.tickets.create({
			userId: user.id,
			channelId: ticketChannel!.id,
			number: ticketNumber,
			categoryId: ticketCategory.id
		});

		const ticketMessage = await ticketChannel.send(await this.ticketMessage({ ticketId: ticket.id }));

		await ticket.updateOne({ messageId: ticketMessage.id });

		try {
			await user.send({
				embeds: [this.embedManager.success({ description: `${ticketChannel}, تم انشاء تذكرتك بنجاح` })]
			});
		} catch {}

		this.logAction({ action: 'create', ticketId: ticket.id });

		return { ticket, ticketChannel };
	}

	async claim() {
		const isStaff = await this.isStaff();

		if (!isStaff) {
			throw new Error('ليس لديك صلاحيات لأستلام التذكرة');
		}

		const { user, channel } = this.getInfoFromInteractionOrMessage();
		const ticket = await this.getTicket();

		await Promise.all([
			(channel as TextChannel).permissionOverwrites.edit(user, { ViewChannel: true }),
			...[...config.roles.staff].map((role) => {
				(channel as TextChannel).permissionOverwrites.edit(role, { ViewChannel: false });
			}),
			ticket.updateOne({ claimed: true, claimedBy: user.id }),
			this.updateTicketMessage()
		]);

		this.logAction({ action: 'claim' });

		return ticket;
	}

	async unclaim() {
		const isStaff = await this.isStaff();

		if (!isStaff) {
			throw new Error('ليس لديك صلاحيات لألغاء أستلام التذكرة');
		}

		const { user, channel } = this.getInfoFromInteractionOrMessage();
		const ticket = await this.getTicket();

		await Promise.all([
			(channel as TextChannel).permissionOverwrites.delete(user),
			...[...config.roles.staff].map((role) => {
				(channel as TextChannel).permissionOverwrites.edit(role, { ViewChannel: true });
			}),
			ticket.updateOne({ claimed: false, claimedBy: null }),
			this.updateTicketMessage()
		]);

		this.logAction({ action: 'unclaim' });

		return ticket;
	}

	async open() {
		const ticket = await this.getTicket();

		const isStaff = await this.isStaff();

		if (!isStaff) {
			throw new Error('ليس لديك صلاحيات فتح التذكرة');
		}

		const { channel, guild } = this.getInfoFromInteractionOrMessage();

		const ticketCategory = config.ticket.category.find((c) => c.id === ticket.categoryId)!;
		const ticketChannel = (await guild.channels.fetch(ticket.channelId))!;

		await Promise.all([
			(channel as TextChannel).permissionOverwrites.edit(ticket.userId, { ViewChannel: true }),
			...[...config.roles.staff].map((role) => {
				(channel as TextChannel).permissionOverwrites.edit(role, { ViewChannel: true });
			}),
			ticket.updateOne({ status: TicketStatus.Open }),
			ticketChannel.edit({ parent: ticketCategory.categoryId }),
			this.updateTicketMessage()
		]);

		this.logAction({ action: 'open' });

		return ticket;
	}

	async close() {
		const ticket = await this.getTicket();

		const { user, channel, guild } = this.getInfoFromInteractionOrMessage();

		const isStaff = await this.isStaff();

		if (!isStaff && user.id !== ticket.userId) {
			throw new Error('ليس لديك صلاحيات لألغلاق التذكرة');
		}

		const ticketCategory = config.ticket.category.find((c) => c.id === ticket.categoryId)!;
		const ticketChannel = (await guild.channels.fetch(ticket.channelId))!;

		await Promise.all([
			(channel as TextChannel).permissionOverwrites.edit(ticket.userId, { ViewChannel: false }),
			...[...config.roles.staff].map((role) => {
				(channel as TextChannel).permissionOverwrites.edit(role, { ViewChannel: false });
			}),
			ticket.updateOne({ status: TicketStatus.Closed }),
			ticketChannel.edit({ parent: ticketCategory.closedCategoryId }),
			this.updateTicketMessage()
		]);

		this.logAction({ action: 'close' });

		return ticket;
	}

	async lock() {
		const ticket = await this.getTicket();

		const isStaff = await this.isStaff();

		if (!isStaff) {
			throw new Error('ليس لديك صلاحيات لقفل التذكرة');
		}

		if (ticket.status === TicketStatus.Closed) {
			throw new Error('التذكرة مغلقة');
		}

		const { guild } = this.getInfoFromInteractionOrMessage();

		const ticketChannel = (await guild.channels.fetch(ticket.channelId))! as TextChannel;
		const member = await guild.members.fetch(ticket.userId);
		await Promise.all([ticketChannel.permissionOverwrites.edit(member, { ViewChannel: true, SendMessages: false })]);

		this.logAction({ action: 'lock' });

		return ticket;
	}

	async unlock() {
		const ticket = await this.getTicket();

		const isStaff = await this.isStaff();

		if (!isStaff) {
			throw new Error('ليس لديك صلاحيات لالغاء قفل التذكرة');
		}

		if (ticket.status === TicketStatus.Closed) {
			throw new Error('التذكرة مغلقة');
		}

		const { guild } = this.getInfoFromInteractionOrMessage();

		const ticketChannel = (await guild.channels.fetch(ticket.channelId))! as TextChannel;
		const member = await guild.members.fetch(ticket.userId);
		await Promise.all([ticketChannel.permissionOverwrites.edit(member, { ViewChannel: true, SendMessages: true })]);

		this.logAction({ action: 'unlock' });

		return ticket;
	}

	async delete() {
		const ticket = await this.getTicket();

		const isStaff = await this.isStaff();

		if (!isStaff) {
			throw new Error('ليس لديك صلاحيات لحذف التذكرة');
		}

		const { guild, send } = this.getInfoFromInteractionOrMessage();

		const ticketChannel = (await guild.channels.fetch(ticket.channelId)) as TextChannel;

		await send({ embeds: [this.embedManager.info({ description: 'سيتم حذف التذكرة خلال 10 ثوان' })] });

		await this.saveTranscript();

		setTimeout(async () => {
			await Promise.all([ticket.deleteOne(), ticketChannel.delete()]);
		}, 10000);

		this.logAction({ action: 'delete' });

		return ticket;
	}

	async add({ userId }: { userId: string }) {
		const ticket = await this.getTicket();

		const isStaff = await this.isStaff();

		if (!isStaff) {
			throw new Error('ليس لديك صلاحيات لأضافة عضو للتذكرة');
		}

		const { guild } = this.getInfoFromInteractionOrMessage();
		const ticketChannel = (await guild.channels.fetch(ticket.channelId)) as TextChannel;
		const member = await guild.members.fetch(userId);

		try {
			await member.send({
				embeds: [this.embedManager.info({ description: `${ticketChannel}, تم أضافتك في تذكرة` })]
			});
		} catch {}

		await Promise.all([ticketChannel.permissionOverwrites.edit(member, { ViewChannel: true, SendMessages: true })]);

		this.logAction({ action: 'add' });

		return ticket;
	}

	async remove({ userId }: { userId: string }) {
		const ticket = await this.getTicket();

		const isStaff = await this.isStaff();

		if (!isStaff) {
			throw new Error('ليس لديك صلاحيات لأزالة عضو للتذكرة');
		}

		const { guild } = this.getInfoFromInteractionOrMessage();
		const ticketChannel = (await guild.channels.fetch(ticket.channelId)) as TextChannel;
		const member = await guild.members.fetch(userId);

		try {
			await member.send({
				embeds: [this.embedManager.info({ description: `${ticketChannel}, تم أزالتك من تذكرة` })]
			});
		} catch {}

		await Promise.all([ticketChannel.permissionOverwrites.edit(member, { ViewChannel: false, SendMessages: false })]);

		this.logAction({ action: 'remove' });

		return ticket;
	}

	async saveTranscript() {
		const ticket = await this.getTicket();
		const { guild, user } = this.getInfoFromInteractionOrMessage();

		try {
			const ticketChannel = (await guild.channels.fetch(ticket.channelId)) as TextChannel;
			const attachment = await discordTranscripts.createTranscript(ticketChannel);

			let transcriptChannel = guild.channels.cache.get(config.channels.ticket.transcripts) as TextChannel;
			if (!transcriptChannel) {
				transcriptChannel = (await guild.channels.fetch(config.channels.ticket.logs)) as any as typeof transcriptChannel;
			}

			await transcriptChannel
				.send({
					embeds: [
						this.embedManager
							.info({
								title: 'نسخة من التذكرة'
							})
							.addFields(
								{ name: 'أي دي التيكيت', value: `${ticket.number} (${ticketChannel})`, inline: true },
								{ name: 'صاحب التيكت', value: `<@${ticket.userId}> (${ticket.userId})`, inline: true },
								{ name: 'المسؤول عن الامر', value: `${user}`, inline: true },
								{
									name: 'الى عمل كليم للتيكيت التيكت',
									value: ticket.claimedBy ? `<@${ticket.claimedBy}> (${ticket.claimedBy})` : 'لا يوجد',
									inline: true
								}
							)
					]
				})
				.then((msg) => msg.channel.send({ files: [attachment] }));
		} catch {}
	}

	async logAction({ action, ticketId }: { action: TicketAction; ticketId?: string }) {
		const ticket = await this.getTicket({ ticketId });
		const { guild, user } = this.getInfoFromInteractionOrMessage();

		try {
			const ticketChannel = (await guild.channels.fetch(ticket.channelId)) as TextChannel;

			let logChannel = guild.channels.cache.get(config.channels.ticket.logs) as TextChannel;
			if (!logChannel) {
				logChannel = (await guild.channels.fetch(config.channels.ticket.logs)) as any as typeof logChannel;
			}

			await logChannel.send({
				embeds: [
					this.embedManager
						.info({
							title: translateTicketActions(action)
						})
						.addFields(
							{ name: 'أي دي التيكيت', value: `${ticket.number} (${ticketChannel})`, inline: true },
							{ name: 'صاحب التيكت', value: `<@${ticket.userId}> (${ticket.userId})`, inline: true },
							{ name: 'المسؤول عن الامر', value: `${user}`, inline: true },
							{
								name: 'الى عمل كليم للتيكيت التيكت',
								value: ticket.claimedBy ? `<@${ticket.claimedBy}> (${ticket.claimedBy})` : 'لا يوجد',
								inline: true
							}
						)
				]
			});
		} catch {}
	}

	async updateTicketMessage() {
		const ticket = await this.getTicket();
		const { guild } = this.getInfoFromInteractionOrMessage();
		const ticketChannel = (await guild.channels.fetch(ticket.channelId)) as TextChannel;
		const ticketMessage = await ticketChannel.messages.fetch(ticket.messageId);

		return await ticketMessage.edit(await this.ticketMessage({ ticketId: ticket.id, edit: true }));
	}

	async ticketMessage({ ticketId }: { ticketId?: string }): Promise<MessagePayload | MessageCreateOptions>;
	async ticketMessage({ ticketId }: { ticketId?: string; edit: boolean }): Promise<MessagePayload | MessageEditOptions>;
	async ticketMessage({ ticketId }: { ticketId?: string }) {
		const ticket = await db.tickets.findById(ticketId);
		if (!ticket) return { embeds: [this.embedManager.error({ description: 'حدث خطأ أثناء الحصول على التذكرة' })] };
		const ticketCategory = config.ticket.category.find((category) => category.id === ticket.categoryId)!;

		const ticketButtons = [
			{ id: 'claim', label: 'أستلام التذكرة', emoji: config.icons.claim, style: ButtonStyle.Primary, enabled: ticket.claimed === false },
			{
				id: 'unclaim',
				label: 'الغاء أستلام التذكرة',
				emoji: config.icons.lock,
				style: ButtonStyle.Danger,
				enabled: ticket.claimed === true
			},
			{ id: 'lock', label: 'قفل التذكرة', emoji: config.icons.lock, style: ButtonStyle.Secondary, enabled: true },
			{ id: 'unlock', label: 'فتح التذكرة', emoji: config.icons.unLock, style: ButtonStyle.Secondary, enabled: true },
			{
				id: 'close',
				label: 'غلق التذكرة',
				emoji: config.icons.error,
				style: ButtonStyle.Danger,
				enabled: ticket.status !== TicketStatus.Closed
			},
			{ id: 'open', label: 'فتح التذكرة', emoji: config.icons.success, style: ButtonStyle.Danger, enabled: ticket.status !== TicketStatus.Open }
		];

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			...ticketButtons
				.filter((b) => b.enabled)
				.map((button) =>
					new ButtonBuilder().setCustomId(`ticket-a:${button.id}`).setLabel(button.label).setEmoji(button.emoji).setStyle(button.style)
				)
		);

		return {
			embeds: [
				this.embedManager.primary({ titleIcon: ticketCategory.emoji, title: ticketCategory.title, description: ticketCategory.description })
			],
			components: [row]
		};
	}

	async getTicket({ channelId, ticketId }: { channelId?: string; ticketId?: string } = {}) {
		const { channel } = this.getInfoFromInteractionOrMessage();
		const ticket = ticketId ? await db.tickets.findById(ticketId) : await db.tickets.findOne({ channelId: channelId ?? channel.id });

		if (!ticket) throw new Error('حدث خطأ أثناء الحصول على التذكرة');

		return ticket;
	}

	async isStaff() {
		const { user } = this.getInfoFromInteractionOrMessage();
		const member = await this.interactionOrMessage.guild?.members.fetch(user.id)!;
		if (member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return true;
		return [...config.roles.staff].some((r) => member.roles.cache.has(r));
	}

	getInfoFromInteractionOrMessage() {
		const send =
			this.interactionOrMessage instanceof Message
				? this.interactionOrMessage.reply
				: this.interactionOrMessage.deferred
					? this.interactionOrMessage.editReply
					: this.interactionOrMessage.reply;

		return {
			guild: this.interactionOrMessage.guild!,
			user:
				this.interactionOrMessage instanceof Message
					? this.interactionOrMessage.member?.user ?? this.interactionOrMessage.author
					: this.interactionOrMessage.user,
			client: this.interactionOrMessage.client,
			send: send.bind(this.interactionOrMessage),
			channel: this.interactionOrMessage.channel!
		};
	}
}
