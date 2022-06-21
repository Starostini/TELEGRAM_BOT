const TelegramApi = require ('node-telegram-bot-api');

const token ='5556402948:AAFgaovRLjWoaarK9pBJc6mlvjkE-VvWorQ';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: '1', callback_data: '1'},{ text: '2', callback_data: '2'},{ text: '3', callback_data: '3'}],
      [{ text: '4', callback_data: '4'},{ text: '5', callback_data: '5'},{ text: '6', callback_data: '6'}],
      [{ text: '7', callback_data: '7'},{ text: '8', callback_data: '8'},{ text: '9', callback_data: '9'}],
      [{ text: '0', callback_data: '0'}]
    ]
  })
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'В начало'},
    {command: '/myname', description: 'Как меня зовут?'},
    {command: '/game', description: 'Игра!'}
  ])
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const UserName = msg.from.first_name;
    const UserFemale = msg.from.last_name;
    console.log(msg);
    if (text === '/start') {
      await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/1.webp`);
      return bot.sendMessage(chatId, `Добро пожаловать ${UserName}, я Тест Бот! `);
    }
    if (text ==='/myname') {
      return bot.sendMessage(chatId, `Тебя зовут ${UserName +' '+ UserFemale}`);
    }
    if (text ==='/game') {
      bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен будешь ее отгадать!');
      const randomNumer = Math.floor(Math.random() *10);
      chats[chatId] = randomNumer;
      return bot.sendMessage(chatId,'Отгадывай', gameOptions );
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю попробуй еще раз!');
  })
}

start();