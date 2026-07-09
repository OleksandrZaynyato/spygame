import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot.js';

bot.start();

console.log('🤖 Spy Bot is running...');