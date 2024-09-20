from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, CallbackContext
import google.generativeai as genai


TELEGRAM_BOT_TOKEN = ""
genai.configure(api_key='')

user_states = {}


# Function for the start command
async def start(update: Update, context: CallbackContext) -> None:
    user_states.clear()
    keyboard = [
        [InlineKeyboardButton("Студент", callback_data='student')],
        [InlineKeyboardButton("IT-технології", callback_data='it')],
        [InlineKeyboardButton("Контакти", callback_data='contacts')],
        [InlineKeyboardButton("Prompt Gemini", callback_data='gemini')],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text('Оберіть опцію:', reply_markup=reply_markup)


# Function to show the "Back to Menu" button
async def show_back_to_menu_button(query):
    back_keyboard = [
        [InlineKeyboardButton("Back to Menu", callback_data='back_to_menu')]
    ]
    reply_markup = InlineKeyboardMarkup(back_keyboard)
    await query.message.reply_text('Повернутися до початкового меню:', reply_markup=reply_markup)


# Function to handle button clicks
async def button(update: Update, context: CallbackContext) -> None:
    query = update.callback_query
    await query.answer()

    if query.data == 'student':
        await query.edit_message_text(text="Студент: Лисенко А.О., група ІП-13")
        await show_back_to_menu_button(query)
    elif query.data == 'it':
        await query.edit_message_text(text="IT-технології: Python, Front-end, Back-end, WEB-технології і т.д.")
        await show_back_to_menu_button(query)
    elif query.data == 'contacts':
        await query.edit_message_text(text="Контакти: Телефон: +380687985543, Email: anastasiialysenko0@gmail.com")
        await show_back_to_menu_button(query)
    elif query.data == 'gemini':
        await query.edit_message_text(text="Задайте ваше питання Gemini:")
        user_states[query.from_user.id] = 'awaiting_gemini_query'
    elif query.data == 'back_to_menu':
        user_states.clear()
        keyboard = [
            [InlineKeyboardButton("Студент", callback_data='student')],
            [InlineKeyboardButton("IT-технології", callback_data='it')],
            [InlineKeyboardButton("Контакти", callback_data='contacts')],
            [InlineKeyboardButton("Prompt Gemini", callback_data='gemini')],
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text('Оберіть опцію:', reply_markup=reply_markup)


# Function to handle text messages
async def handle_message(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id
    if user_id in user_states and user_states[user_id] == 'awaiting_gemini_query':
        question = update.message.text

        # Call the Gemini API to get the response
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(question)
            answer = response.text
            await update.message.reply_text(answer)

        except Exception as e:
            await update.message.reply_text(f"Error: {str(e)}")


# Main function to run the bot
def main() -> None:
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Commands and handlers
    application.add_handler(CommandHandler('start', start))
    application.add_handler(CallbackQueryHandler(button))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Start the bot
    application.run_polling()

if __name__ == '__main__':
    main()


