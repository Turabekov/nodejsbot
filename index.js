const TelegramApi = require("node-telegram-bot-api")
const { gameOptions, againOptions } = require("./options");
const token = "5505158075:AAGcflXo-0MNqXggnYMlpzQDYRzTIFo7TXc"

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, "Сейчас загадаю цифру от 0 до 9, а ты должен ее угадать")
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, "Отгадывай", gameOptions)
}

const start = () => {
	bot.setMyCommands([
		{ command: "/start", description: "Начальное приветствие" },
		{ command: "/info", description: "Получить информацию о пользователе!" },
		{ command: "/game", description: "игра угадай цифру" },
	])

	bot.on("message", async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === "/start") {
			await bot.sendSticker(chatId, "https://tgram.ru/wiki/stickers/img/persik_animated/gif/3.gif")
			return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот автора Khumoyun`)
		}

		if (text === "/info") {
			return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
		}

		if (text === "/game") {
			return startGame(chatId);
		}
		return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!")

	})

	bot.on("callback_query", async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data === "/again") {
			return startGame(chatId);
		}
		if (data == chats[chatId]) {
			return bot.sendMessage(chatId, `Поздравляем!!! :), ты угадал цифру ${chats[chatId]}`, againOptions)
		} else {
			return bot.sendMessage(chatId, `К сожалению ты не угадал :(,бот загадал цифру ${chats[chatId]}`, againOptions)

		}
	})
}

start();