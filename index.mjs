import TelegramApi from 'node-telegram-bot-api';

import 'dotenv/config';
import './options.mjs';
import { optionParametrs } from './options.mjs';
const {gameOptions,againOptions} = optionParametrs();
const token = process.env.BOT_TOKEN;
const url = process.env.APP_URL;
const bot = new TelegramApi(token, {polling: true});
const chats = {};
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});
const starGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен будешь ее отгадать!');
  const randomNumer = Math.floor(Math.random() *10);
  chats[chatId] = randomNumer.toString();
  await bot.sendMessage(chatId,'Отгадывай', gameOptions );
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
      return starGame(chatId);
    }
    console.log(text);
    console.log(text === 'Да');
    return bot.sendMessage(chatId, 'Я тебя не понимаю попробуй еще раз!');
  })
  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    const text = msg.text;
    if (text === 'Да') {
      return starGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю ты угадал, это цифра ${chats[chatId]}`, againOptions);
    }
    else {
      return await bot.sendMessage(chatId, `Ты не угадал, я загадал цифру ${chats[chatId]}`),
              await bot.sendMessage(chatId, `Сиграем еще раз?`, againOptions);
              
    }
    
  })
}

start();