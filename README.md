# 🍽️ My Meal Agent (MM Agent)

## 🚀 Inspiration

My Meal Agent was born from a simple but universal problem:

We save dozens of recipes from cookbooks, YouTube, TikTok, and social media - but most of them never make it to the kitchen.

The gap isn’t inspiration.  
It’s execution.

Planning meals, checking ingredients, writing grocery lists, and managing time often break the flow between *“That looks delicious”* and *“Dinner is ready.”*

My Meal Agent exists to close that gap.

---

## 🧠 What It Does

My Meal Agent transforms saved recipes into real meals.

It intelligently considers:

- 🥕 Ingredients users already have  
- ⏱️ Available cooking time  
- 👨‍👩‍👧‍👦 Number of servings  
- 📅 When the meal is planned  

Then it:

- 🍳 Selects the best recipe option  
- 🛒 Generates a smart grocery list  
- ⏰ Schedules cooking reminders  
- 👩‍🍳 Guides users step-by-step through the cooking process  

From inspiration to execution - seamlessly.

---

## 🛠️ How We Built It

### 📱 Frontend
- React Native (Expo)
- Clean modular architecture
- Production-ready iOS build via TestFlight
- RevenueCat for subscriptions

### ⚙️ Backend
- FastAPI REST APIs
- Celery for asynchronous recipe imports
- Redis for task queue
- Docker for containerized deployment
- Azure for cloud hosting

### 🤖 AI & Processing
- Tesseract OCR for extracting text from images
- OpenAI API for:
  - Converting video to transcript
  - Summarizing transcript into structured ingredients & steps
- Intelligent parsing of social media recipe URLs

---

## 🧩 Challenges We Ran Into

- 📱 Building, deploying, and testing our first iOS app with Expo + TestFlight  
- 🎥 Handling large video URLs and bot detection from YouTube & Instagram  
- 🖼️ Processing large images reliably with OCR inside Docker containers  
- ⚙️ Deploying Celery workers and Redis in cloud infrastructure  
- 💳 Integrating RevenueCat with App Store subscriptions  

---

## 🏆 Accomplishments We’re Proud Of

- Successfully processing large images and long-form video URLs  
- Building a fully async recipe import pipeline  
- Deploying scalable Docker infrastructure with OCR support  
- Getting in-app purchases working via RevenueCat Test Store  

---

## 📚 What We Learned

- End-to-end iOS development with Expo  
- FastAPI backend architecture with async task processing  
- AI-driven text extraction and summarization workflows  
- Docker-based deployment for cloud-ready services  
- Subscription handling with RevenueCat + TestFlight  

---

## 🔮 What’s Next for MyMealAgent

- 🌐 Support for more website and recipe sources  
- 🍽️ Enhanced AI recipe optimization  
- 🛍️ Improved grocery intelligence  
- 💳 Production-ready App Store subscription rollout  
- 🤝 Social and shared meal planning features  

---

## 💡 The Vision

My Meal Agent is not just a recipe organizer.

It’s an intelligent cooking companion that helps people turn saved inspiration into real meals - effortlessly.
