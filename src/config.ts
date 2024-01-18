import { TextInputStyle } from 'discord.js';

export const config = {
	probotId: '282859044593598464',
	owners: ['885627298743738380', '713835453891215442', '744280854188130414', '436231895651450890'] as string[], // الهيكون معاهم صلاحيات فل تحكم فل بوت زي تغير الصورة و الاسم و الكلام ده
	transferTo: ['744280854188130414'], //الشخص الهتخلي الناس تحولو الكردت فشراء الرتب
	icons: {
		//تقدر تغير الايكونات عادي و تحط اي اموجي انت عايزة
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
		lineURL: `https://media.discordapp.net/attachments/859712578087288852/1014460808014602240/Untitled-1.png`, // الصورة الي هتكون فل امبد بتاع التكت
		ticketMessageImage: `https://cdn.discordapp.com/attachments/859712578087288852/1014459743609303100/Untitled-2.png`
	},
	channels: {
		apply: {
			send: '1191394688641531914', // روم تقديم الادارة
			receive: '1191394688641531914' // روم استقبال التقديمات
		},
		autoLine: ['1191411144460797433916'] as string[], // روم الخط التلقائي
		feedback: ['1191394688644441531914'] as string[], // روم الفيدباك
		suggestions: {
			developer: '1190499941102125126', // روم الاتقراحات
			bot: '1191394688641531914' // روم الاقتراحات
		},
		AIChat: ['1191411160797433916'] as string[], // شات ال ai
		ticket: {
			logs: '1191394688641531914', // لوج التكتات
			transcripts: '1191394688641531914' // ترانكسربت التكتات
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
				categoryId: '1190753725627781191', // ايدي الكاتيجوري الهتفتح فيها التكت
				closedCategoryId: '1191123838671523840' // ايدي الكاتيجوري الهتقفل فيها التكت
			},
			{
				id: 'report',
				label: 'تبليغ',
				emoji: '🔴',
				title: 'تبليغ',
				description: 'شكرا لتواصلك معنا بخصوص التبليغ',
				categoryId: '1190753725627781191', // ايدي الكاتيجوري الهتفتح فيها التكت
				closedCategoryId: '1191123838671523840' // ايدي الكاتيجوري الهتقفل فيها التكت
			}
		]
	},
	roles: {
		admins: ['1191151553889968138'],
		staff: ['1190719718424838195'],
		afterApplyAccept: ['1189933546777878589'], // الرول لما يتقبل فل اداره
		buy: [
			{
				id: '1190510109680472074', // ايدي الرول
				name: 'Vip', // اسم الرول
				price: 130000 // سعر الرول
			},
			{
				id: '1190510139007057981',
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
				id: '1183739836172087448',
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
