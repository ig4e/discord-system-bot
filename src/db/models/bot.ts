import { getModelForClass, prop } from '@typegoose/typegoose';

/*
.addStringOption((option) => option.setName('name').setDescription('أسم الحالة').setRequired(true))
				.addStringOption((option) =>
					option
						.setName('status')
						.setDescription('الحالة')
						.addChoices(
							{ name: 'Online', value: 'online' },
							{ name: 'Idle', value: 'idle' },
							{ name: 'Do Not Disturb', value: 'dnd' },
							{ name: 'Invisible', value: 'invisible' }
						)
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('type')
						.setDescription('نوع الحالة')
						.addChoices(
							{ name: 'Playing', value: 0 },
							{ name: 'Streaming', value: 1 },
							{ name: 'Listening', value: 2 },
							{ name: 'Watching', value: 3 },
							{ name: 'Custom', value: 4 },
							{ name: 'Competing', value: 5 }
						)
						.setRequired(true)
				)
*/

enum Status {
	Online = 'online',
	Idle = 'idle',
	DoNotDisturb = 'dnd',
	Invisible = 'invisible'
}

enum StatusType {
	Playing = 0,
	Streaming = 1,
	Listening = 2,
	Watching = 3,
	Custom = 4,
	Competing = 5
}

class BotStatus {
	@prop({ default: 'System bot' })
	name: string;
	@prop({ enum: Status, default: Status.Online })
	status: Status;
	@prop({ enum: StatusType, default: StatusType.Watching })
	type: StatusType;
}

class Bot {
	@prop()
	status: BotStatus;
}

export const BotModel = getModelForClass(Bot);
