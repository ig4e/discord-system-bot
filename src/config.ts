import { TextInputStyle } from 'discord.js';

export const config = {
	botId: '929149701012475924',
	probotId: '282859044593598464',
	owners: ['436231895651450890', '713835453891215442'] as string[],
	transferTo: ['436231895651450890', '713835453891215442'],
	icons: {
		claim: '🛄',
		warning: '⚠️',
		info: 'ℹ️',
		error: '❌',
		success: '✅',
		loading: '🔄',
		arrowRight: '➡️',
		arrowLeft: '⬅️',
		arrowUp: '⬆️',
		arrowDown: '⬇️',
		up: '🔼',
		down: '🔽',
		left: '🔙',
		right: '🔜',
		back: '🔙',
		lock: '🔒',
		unLock: '🔓'
	},
	colors: {
		primary: '#16a34a',
		info: '#2563eb',
		success: '#059669',
		danger: '#e11d48',
		warning: '#d97706'
	},
	images: {
		lineURL: `https://media.discordapp.net/attachments/859712578087288852/1014460808014602240/Untitled-1.png`,
		ticketMessageImage: `https://cdn.discordapp.com/attachments/859712578087288852/1014459743609303100/Untitled-2.png`
	},
	channels: {
		apply: {
			send: '1189928888227332216',
			receive: '1189928900499873842'
		},
		autoLine: ['1190496851225485312'] as string[],
		feedback: ['1190526152717119569'] as string[],
		suggestions: {
			developer: '1190499941102125126',
			bot: '1190499930360512542'
		},
		AIChat: ['1190735504413560933'] as string[],
		ticket: {
			logs: '1191233943782035479',
			transcripts: '1191233908344377354'
		}
	},
	ticket: {
		category: [
			{
				id: 'support',
				label: 'الدعم الفني',
				emoji: '🟢',
				title: 'الدعم الفني',
				description: 'شكرا لتواصلك معنا بخصوص الدعم الفني',
				categoryId: '1190753725627781191',
				closedCategoryId: '1191123838671523840'
			},
			{
				id: 'report',
				label: 'تبليغ',
				emoji: '🔴',
				title: 'تبليغ',
				description: 'شكرا لتواصلك معنا بخصوص التبليغ',
				categoryId: '1190753725627781191',
				closedCategoryId: '1191123838671523840'
			}
		]
	},
	roles: {
		admins: ['1191151553889968138'],
		staff: ['1190719718424838195'],
		afterApplyAccept: ['1189933546777878589'],
		buy: [
			{
				id: '1190510109680472074',
				name: 'Vip',
				price: 130000
			},
			{
				id: '1190510139007057981', //
				name: 'Monsieur',
				price: 100000
			},
			{
				id: '1190510347694653501',
				name: 'Gentel',
				price: 75000
			},
			{
				id: '1190510168765628457',
				name: 'Hybird',
				price: 50000
			},

			{
				id: '1190518104317513879',
				name: 'CheapAF',
				price: 1
			}
		]
	},
	applyQuestions: [
		{
			id: 'name',
			label: 'اسمك',
			type: TextInputStyle.Short,
			placeholder: 'أحمد',
			minLength: 3,
			maxLength: 100,
			required: true
		},
		{
			id: 'age',
			label: 'عمرك',
			type: TextInputStyle.Short,
			placeholder: '18',
			minLength: 0,
			maxLength: 100,
			required: true
		},
		{
			id: 'country',
			label: 'بلدك',
			type: TextInputStyle.Short,
			placeholder: 'مصر',
			minLength: 0,
			maxLength: 100,
			required: true
		},
		{
			id: 'active-time',
			label: 'كم مده تفاعلك ',
			type: TextInputStyle.Short,
			placeholder: '5 ساعات يوميا',
			minLength: 3,
			maxLength: 500,
			required: true
		},
		{
			id: 'exp',
			label: 'ما خبرتك ',
			type: TextInputStyle.Paragraph,
			placeholder: 'أدارة, برمجة, تصميم....',
			minLength: 10,
			maxLength: 1000,
			required: true
		}
	]
} as const;

export const messages = {};
