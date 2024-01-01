import { ApplyModel } from './models/apply';
import { BotModel } from './models/bot';
import { GuildModel } from './models/guild';
import { CounterModel } from './models/seq';
import { TicketModel } from './models/ticket';
import { WarnModel } from './models/warn';

export const db = { guilds: GuildModel, bots: BotModel, applies: ApplyModel, tickets: TicketModel, counters: CounterModel, warns: WarnModel };
