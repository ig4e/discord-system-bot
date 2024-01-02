import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { EmbedManager } from '../../lib/embeds';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const embedManager = new EmbedManager({ message });
		const prefix = await this.container.client.fetchPrefix(message);

		return message.reply({
			embeds: [
				embedManager.info({
					title: `المساعدة`,
					description: `${prefix}ping - التحقق من البنق\n${prefix}apply - للتقديم علي الادارة \n${prefix}buy - لشراء الرتب \n${prefix}line - يرسل خط \n${prefix}suggestion -  يقدم اقتراح \n${prefix}tax - يحسب ضرايب برو بوت \n${prefix}ban - يقم بحظر عضو \n${prefix}call - يقوم بارسال نداء عبر خاص الشخص \n${prefix}clear - يحذف الرسايل يلي بل شات \n${prefix}kick - يطرد عضو \n${prefix}lock - يقفل الروم \n${prefix}unlock - يفتح الشات \n${prefix}mute - يقوم باعطاء ميوت لشخص \n${prefix}unmute - يفك الميوت \n${prefix}say - البوت يقوم بارسال النص \n${prefix}unban - يقوم بفك الحظر عن شخص \n${prefix}warn - يقوم باعطاء تحظير لشخص \n${prefix}unwarn - يقوم بازاله التحظير من الشخص \n${prefix}warnings - يقوم باظهرا قائمه الوارانات لدي الشخص \n${prefix}add - يقوم باضافه شخص للتكت \n${prefix}claim - يفوم باستلام التكت \n${prefix}close - يقوم بقفل التكت \n${prefix}delete - يقوم بحذف التذكرة \n${prefix}tlock - يقوم بقفل التكت علي الشخص المسلتم للتكت و الشخص الي فاتح التكت\n${prefix}open - يقوم باعاده فتح التذكرة\n${prefix}unclaim - يترك التكت \n${prefix}tunlock - يقوم باعاده فتح شات التكت\n${prefix}send-ticket-message - يوقوم بارسال امبد التكت\n/set-avatar - يقوم بتغير افتار البوت\n/set-name - يقوم بتغير اسم البوت\n/set-prefix - يقوم بتغير بريفكس البوت\n/set-status - يقوم بتغير حالة البوت`
				})
			]
		});
	}
}
