import { EmbedBuilder } from 'discord.js';

export function mainEmbed(
	title = 'Type a keyword or URL in this Channel!',
	img = 'https://media.istockphoto.com/id/1176100626/th/%E0%B9%80%E0%B8%A7%E0%B8%84%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C/%E0%B8%84%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B8%A2%E0%B8%87-%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%84%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%80%E0%B8%84%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%AB%E0%B8%A7.jpg?s=612x612&w=0&k=20&c=PQrksNfKgS12wqOLtNUcyR2NMbzOkL0b6aHU0ylU1BY='
) {
	return new EmbedBuilder()
		.setTitle(title)
		.setColor('DarkBlue')
		.setImage(img);
}
