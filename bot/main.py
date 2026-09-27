import os
import re
import secrets
import time
import random
import aiohttp
import asyncpg
from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, CommandObject
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import (
    Message,
    CallbackQuery,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    FSInputFile,
    URLInputFile
)

BOT_TOKEN = os.getenv("BOT_TOKEN")
DATABASE_URL = os.getenv("DATABASE_URL")
PROXY_URL = os.getenv("PROXY_URL", "https://arena-tracker-proxy.onrender.com")

if not BOT_TOKEN or not DATABASE_URL:
    raise ValueError("BOT_TOKEN and DATABASE_URL environment variables are required")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())
db_pool = None

class LoginStates(StatesGroup):
    waiting_ally_code = State()
    code_ready = State()

class RegisterStates(StatesGroup):
    waiting_ally_code = State()
    code_ready = State()
    verifying_portrait = State()

def clean_ally_code(text: str) -> str:
    return re.sub(r"\D", "", text)

def format_ally_code(code: str) -> str:
    cleaned = clean_ally_code(code)
    if len(cleaned) == 9:
        return f"{cleaned[:3]}-{cleaned[3:6]}-{cleaned[6:]}"
    return cleaned

async def fetch_game_profile(ally_code: str):
    url = f"{PROXY_URL}/profile?allyCode={clean_ally_code(ally_code)}"
    async with aiohttp.ClientSession() as session:
        async with session.get(url, timeout=15) as resp:
            if resp.status == 200:
                return await resp.json()
            return None

async def complete_session_in_db(session_token: str, ally_code: str, telegram_id: int, auth_token: str):
    if not session_token:
        return
    async with db_pool.acquire() as conn:
        await conn.execute(
            """
            UPDATE auth_sessions
            SET status = 'approved',
                ally_code = $1,
                telegram_id = $2,
                auth_token = $3
            WHERE session_token = $4
            """,
            ally_code,
            telegram_id,
            auth_token,
            session_token
        )

@dp.message(CommandStart())
async def cmd_start(message: Message, command: CommandObject, state: FSMContext):
    await state.clear()
    
    session_token = command.args if command.args and command.args.startswith("auth_") else None
    if session_token:
        await state.update_data(session_token=session_token)

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="Войти", callback_data="start_login"),
                InlineKeyboardButton(text="Я здесь впервые", callback_data="start_register"),
            ]
        ]
    )

    caption = (
        f"<b>Привет, {message.from_user.first_name}!</b>\n\n"
        "Выбери, войти или зарегистрироваться на Арене, ниже 👇"
    )

    photo_path = "assets/start.png"
    if os.path.exists(photo_path):
        await message.answer_photo(
            photo=FSInputFile(photo_path),
            caption=caption,
            parse_mode=ParseMode.HTML,
            reply_markup=keyboard
        )
    else:
        await message.answer(
            text=caption,
            parse_mode=ParseMode.HTML,
            reply_markup=keyboard
        )

@dp.callback_query(F.data == "start_login")
async def on_start_login(callback: CallbackQuery, state: FSMContext):
    await state.set_state(LoginStates.waiting_ally_code)
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔒 Продолжить", callback_data="noop")]
        ]
    )
    await callback.message.edit_reply_markup(reply_markup=None)
    await callback.message.answer(
        "<b>Начинаем входить</b>\n\n"
        "С возвращением! Чтобы я понял кто ты, отправь мне свой код союзника. "
        "Отвечать на сообщение не обязательно.",
        parse_mode=ParseMode.HTML,
        reply_markup=keyboard
    )
    await callback.answer()

@dp.message(LoginStates.waiting_ally_code)
async def on_login_code_received(message: Message, state: FSMContext):
    cleaned = clean_ally_code(message.text)
    if len(cleaned) < 9:
        await message.answer("Код союзника должен содержать 9 цифр. Попробуй еще раз:")
        return

    async with db_pool.acquire() as conn:
        user = await conn.fetchrow("SELECT * FROM users WHERE ally_code = $1", cleaned)

    if not user:
        keyboard = InlineKeyboardMarkup(
            inline_keyboard=[
                [InlineKeyboardButton(text="🔒 Продолжить", callback_data="login_not_found")]
            ]
        )
        await message.answer(
            "<b>Начинаем входить</b>\n\n"
            "С возвращением! Чтобы я понял кто ты, отправь мне свой код союзника.",
            parse_mode=ParseMode.HTML,
            reply_markup=keyboard
        )
        return

    await state.update_data(ally_code=cleaned, user_auth_token=user["auth_token"])
    await state.set_state(LoginStates.code_ready)

    formatted = format_ally_code(cleaned)
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=f"✅ {formatted}", callback_data="login_submit")]
        ]
    )
    await message.answer("Код принят. Нажми кнопку для завершения входа:", reply_markup=keyboard)

@dp.callback_query(F.data == "login_not_found")
async def on_login_not_found(callback: CallbackQuery):
    await callback.answer("Код не найден, проверь-ка еще раз", show_alert=False)

@dp.callback_query(F.data == "login_submit")
async def on_login_submit(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    ally_code = data.get("ally_code")
    auth_token = data.get("user_auth_token")
    session_token = data.get("session_token")

    await complete_session_in_db(session_token, ally_code, callback.from_user.id, auth_token)

    try:
        await callback.message.delete()
    except Exception:
        pass

    await callback.message.answer(
        "<b>С возвращением!</b>\n\n"
        "Теперь можно вернуться обратно на сайт. Спасибо что пользуешься Ареной!",
        parse_mode=ParseMode.HTML
    )
    await state.clear()
    await callback.answer()

@dp.callback_query(F.data == "start_register")
async def on_start_register(callback: CallbackQuery, state: FSMContext):
    await state.set_state(RegisterStates.waiting_ally_code)
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔒 Продолжить", callback_data="noop")]
        ]
    )
    await callback.message.edit_reply_markup(reply_markup=None)
    await callback.message.answer(
        "<b>Оп, новый аккаунт</b>\n\n"
        "О, ты здесь впервые? Не страшно! Введи свой код союзника пожалуйста, "
        "чтобы я внес тебя в нашу базу пользователей.",
        parse_mode=ParseMode.HTML,
        reply_markup=keyboard
    )
    await callback.answer()

@dp.message(RegisterStates.waiting_ally_code)
async def on_register_code_received(message: Message, state: FSMContext):
    cleaned = clean_ally_code(message.text)
    if len(cleaned) < 9:
        await message.answer("Код союзника должен состоять из 9 цифр. Введи снова:")
        return

    async with db_pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT * FROM users WHERE ally_code = $1", cleaned)

    if existing:
        keyboard = InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(text="Войти", callback_data="start_login"),
                    InlineKeyboardButton(text="< Назад", callback_data="start_register"),
                ]
            ]
        )
        await message.answer(
            "<b>Упс, ошибочка…</b>\n\n"
            "Кажется аккаунт с таким кодом союзника уже числится. Если это ты, давай войдем в него?",
            parse_mode=ParseMode.HTML,
            reply_markup=keyboard
        )
        return

    await state.update_data(ally_code=cleaned)
    await state.set_state(RegisterStates.code_ready)

    formatted = format_ally_code(cleaned)
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=f"✅ {formatted}", callback_data="register_confirm_code")]
        ]
    )
    await message.answer("Код принят. Нажми кнопку для перехода к проверке:", reply_markup=keyboard)

@dp.callback_query(F.data == "register_confirm_code")
async def on_register_confirm_code(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    ally_code = data.get("ally_code")

    profile_data = await fetch_game_profile(ally_code)
    if not profile_data:
        await callback.answer("Не удалось загрузить данные из SWGOH. Проверь код союзника.", show_alert=True)
        return

    portraits = profile_data.get("playerPortraits", [])
    selected_portrait = profile_data.get("selectedPlayerPortrait", {})
    current_portrait_id = str(selected_portrait.get("id", ""))

    available = [p for p in portraits if str(p.get("id")) != current_portrait_id]

    if not available:
        await callback.answer("Ошибка: не найдено доступных портретов для проверки.", show_alert=True)
        return

    target = random.choice(available)
    target_id = str(target.get("id"))
    target_name = target.get("name") or target_id

    await state.update_data(
        target_portrait_id=target_id,
        target_portrait_name=target_name,
        verification_time=time.time(),
        player_name=profile_data.get("name") or profile_data.get("playerName") or "Player",
        guild_name=profile_data.get("guildName") or profile_data.get("guild") or ""
    )
    await state.set_state(RegisterStates.verifying_portrait)

    try:
        await callback.message.delete()
    except Exception:
        pass

    image_url = f"{PROXY_URL}/portraitImage?portraitId={target_id}"
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Сменил, проверяй", callback_data="verify_portrait_check")]
        ]
    )

    caption = (
        "<b>Финишная прямая</b>\n\n"
        "Мы же не можем пустить абы-кого под этот код союзника, да? "
        f"Пройди проверку, смени портрет в игре на <b>{target_name}</b>."
    )

    try:
        await callback.message.answer_photo(
            photo=URLInputFile(image_url),
            caption=caption,
            parse_mode=ParseMode.HTML,
            reply_markup=keyboard
        )
    except Exception:
        await callback.message.answer(
            text=caption,
            parse_mode=ParseMode.HTML,
            reply_markup=keyboard
        )

    await callback.answer()

@dp.callback_query(F.data == "verify_portrait_check")
async def on_verify_portrait_check(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()
    issued_time = data.get("verification_time", 0)
    target_id = data.get("target_portrait_id")
    ally_code = data.get("ally_code")

    if time.time() - issued_time > 120:
        await callback.answer("Прошло много времени", show_alert=False)
        await on_register_confirm_code(callback, state)
        return

    profile_data = await fetch_game_profile(ally_code)
    if not profile_data:
        await callback.answer("Сервер игры не отвечает. Попробуй через пару секунд.", show_alert=True)
        return

    current_id = str(profile_data.get("selectedPlayerPortrait", {}).get("id", ""))

    if current_id != target_id:
        await callback.answer("Портрет еще не сменился. Смени его в игре и нажми кнопку еще раз.", show_alert=True)
        return

    auth_token = secrets.token_hex(32)
    telegram_id = callback.from_user.id
    telegram_username = callback.from_user.username or ""
    player_name = data.get("player_name", "Player")
    guild_name = data.get("guild_name", "")

    async with db_pool.acquire() as conn:
        await conn.execute(
            """
            INSERT INTO users (ally_code, telegram_id, telegram_username, player_name, portrait_id, guild_name, auth_token)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (ally_code) DO UPDATE
            SET telegram_id = EXCLUDED.telegram_id,
                telegram_username = EXCLUDED.telegram_username,
                portrait_id = EXCLUDED.portrait_id,
                player_name = EXCLUDED.player_name,
                auth_token = EXCLUDED.auth_token,
                last_active_at = NOW()
            """,
            ally_code,
            telegram_id,
            telegram_username,
            player_name,
            current_id,
            guild_name,
            auth_token
        )

    session_token = data.get("session_token")
    await complete_session_in_db(session_token, ally_code, telegram_id, auth_token)

    try:
        await callback.message.delete()
    except Exception:
        pass

    await callback.message.answer(
        "<b>Регистрация закончена</b>\n\n"
        "Регистрация закончена. Можешь вернуться на сайт.",
        parse_mode=ParseMode.HTML
    )
    await state.clear()
    await callback.answer()

@dp.callback_query(F.data == "noop")
async def on_noop(callback: CallbackQuery):
    await callback.answer()

async def main():
    global db_pool
    db_pool = await asyncpg.create_pool(
        dsn=DATABASE_URL,
        min_size=2,
        max_size=10,
        ssl="require"
    )
    try:
        await dp.start_polling(bot)
    finally:
        await db_pool.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
