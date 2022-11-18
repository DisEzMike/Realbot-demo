import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, AutocompleteInteraction } from 'discord.js'

export default interface COMMAND {
	data: SlashCommandBuilder
	autocomplete(interaction: AutocompleteInteraction): Promise<void>
	execute(...arg: any): Promise<void>
}

export default interface EVENT {
	name: string
	once?: boolean
	execute(...arg: any): Promise<void>
}

export type CommandType = {
	name: string
	description: string
	options?: any
	default_permission?: any
	category: string
}
