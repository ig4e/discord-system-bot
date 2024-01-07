import { TextInputStyle } from 'discord.js';

export const config = {
	probotId: '282859044593598464',
	owners: ['456245847462510605', '713835453891215442'] as string[], 
	transferTo: ['456245847462510605'],       
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
		lineURL: `https://cdn.discordapp.com/attachments/1193275569924751491/1193506514518933644/87edc4d2d364426b.png`, // الصورة الي هتكون فل امبد بتاع التكت
		ticketMessageImage: `https://cdn.discordapp.com/attachments/1193275569924751491/1193506514518933644/87edc4d2d364426b.png`
	},
	channels: {

		autoLine: ['1192166498878378046'] as string[], 
		feedback: ['1188184786141970624'] as string[], 
		
		ticket: {
			logs: '1191868391292665856', 
			transcripts: '1191868391292665856' 
		}
	},
	ticket: {
		category: [
			{
				id: 'support',
				label: 'Buy Item',
				emoji: '🟢',
				title: 'Buy Item',
				description: 'Wait for the owner <@&1176628849115676803>',
				categoryId: '1191861952255889541', 
				closedCategoryId: '1191862464787263679' 
			},
			{
				id: 'report',
				label: 'Technical Support',
				emoji: '🔴',
				title: 'Technical Support',
				description: 'Wait for the support team',
				categoryId: '1191861952255889541', 
				closedCategoryId: '1191862464787263679' 
			}
		]
	},
	roles: {
		admins: ['1189289263091687526','1193561880896221204'],
		staff: ['1193561880896221204','1189289263091687526'],
		afterApplyAccept: ['1189289263091687526'], 
		buy: [
			{
				id: '1192966446989447200',
				name: 'Vip', 
				price: 130000 
			},
			{
				id: '1192966608440799312',
				name: 'Monsieur',
				price: 100000
			},
			{
				id: '1192966608440799312',
				name: 'Gentel',
				price: 75000
			},
			{
				id: '1192966487837782138',
				name: 'Hybird',
				price: 50000
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
