import { ApplyModel } from './models/apply';
import { BotModel } from './models/bot';
import { GuildModel } from './models/guild';

export const db = { guilds: GuildModel, bots: BotModel, applies: ApplyModel };
