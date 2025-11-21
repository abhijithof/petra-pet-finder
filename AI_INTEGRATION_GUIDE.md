# AI Integration Guide - Open Source Models

## 🎯 Overview

This guide explains how to integrate **FREE open-source AI models** for generating personalized pet parent content. I've created a new API endpoint that supports 4 different free AI providers.

## 🆓 Free AI Options (Recommended Order)

### 1. 🚀 Groq API (RECOMMENDED - Best Choice)

**Why Groq:**
- ✅ **Completely FREE**: 14,400 requests per day
- ✅ **Ultra Fast**: Faster than OpenAI GPT-4
- ✅ **Powerful**: Uses Llama 3.1 70B model
- ✅ **Easy Setup**: Simple API key

**Setup Steps:**

1. **Get API Key** (2 minutes):
   - Go to https://console.groq.com
   - Sign up with email (free)
   - Copy your API key

2. **Add to Environment**:
   ```bash
   # In .env.local
   GROQ_API_KEY=gsk_your_key_here
   ```

3. **Update API endpoint** in `/pages/pet-parent-guide/index.tsx`:
   ```typescript
   // Change this line (around line 211):
   const response = await fetch('/api/generate-pet-guide', {
   
   // To this:
   const response = await fetch('/api/generate-pet-guide-ai', {
   ```

4. **Done!** Restart dev server and test.

**Pricing:**
- Free tier: 14,400 requests/day
- That's ~600 users per day completely free
- More than enough for most apps

---

### 2. 🤗 Hugging Face Inference API

**Why Hugging Face:**
- ✅ **Free**: 1,000 requests per day
- ✅ **Many Models**: Access to thousands of models
- ✅ **No Credit Card**: Truly free forever

**Setup Steps:**

1. **Get API Key**:
   - Go to https://huggingface.co/settings/tokens
   - Create account (free)
   - Generate new token

2. **Add to Environment**:
   ```bash
   # In .env.local
   HUGGINGFACE_API_KEY=hf_your_key_here
   ```

3. **Update Provider** in `/pages/api/generate-pet-guide-ai.ts`:
   ```typescript
   const AI_PROVIDER = 'huggingface'; // Change from 'groq'
   ```

4. **Update API endpoint** in `/pages/pet-parent-guide/index.tsx`:
   ```typescript
   const response = await fetch('/api/generate-pet-guide-ai', {
   ```

**Pricing:**
- Free tier: 1,000 requests/day
- About 40 users per day

---

### 3. 🔗 Together AI

**Why Together:**
- ✅ **$25 Free Credits**: No payment required
- ✅ **Fast**: Good performance
- ✅ **Multiple Models**: Llama, Mistral, etc.

**Setup Steps:**

1. **Get API Key**:
   - Go to https://api.together.xyz
   - Sign up (free $25 credits)
   - Get API key

2. **Add to Environment**:
   ```bash
   # In .env.local
   TOGETHER_API_KEY=your_key_here
   ```

3. **Update Provider**:
   ```typescript
   const AI_PROVIDER = 'together'; // In generate-pet-guide-ai.ts
   ```

**Pricing:**
- $25 free credits
- ~$0.80 per 1M tokens
- About 30,000 guide generations with free credits

---

### 4. 💻 Ollama (Local - 100% Free & Private)

**Why Ollama:**
- ✅ **100% Free**: No API costs ever
- ✅ **Private**: Runs on your machine
- ✅ **No Limits**: Generate unlimited content
- ⚠️ **Needs**: Good computer (8GB+ RAM)

**Setup Steps:**

1. **Install Ollama**:
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.com/install.sh | sh
   
   # Or download from https://ollama.com/download
   ```

2. **Pull Model**:
   ```bash
   ollama pull llama3.1
   ```

3. **Start Server**:
   ```bash
   ollama serve
   ```
   Keep this running in a terminal.

4. **Update Provider**:
   ```typescript
   const AI_PROVIDER = 'local-ollama'; // In generate-pet-guide-ai.ts
   ```

5. **Update API endpoint** in pet-parent-guide page.

**Advantages:**
- No API costs
- Completely private
- Works offline
- No rate limits

**Disadvantages:**
- Slower than cloud APIs
- Requires good hardware
- Need to run server locally

---

## 📝 Quick Setup (Step by Step)

### Recommended: Start with Groq (Easiest & Fastest)

**Step 1: Get Groq API Key**
```bash
# 1. Visit https://console.groq.com
# 2. Sign up (takes 1 minute)
# 3. Copy your API key
```

**Step 2: Create .env.local file**
```bash
cd "/Users/abhijithkumarak/PetRa Pet Finder"
touch .env.local
```

Add this line to `.env.local`:
```
GROQ_API_KEY=gsk_your_actual_key_here
```

**Step 3: Update the main page**

Open `/pages/pet-parent-guide/index.tsx` and find line ~211:

```typescript
// CHANGE THIS:
const response = await fetch('/api/generate-pet-guide', {

// TO THIS:
const response = await fetch('/api/generate-pet-guide-ai', {
```

**Step 4: Restart server**
```bash
npm run dev
```

**Step 5: Test it!**
- Go to http://localhost:3000/pet-parent-guide
- Complete the quiz or enter pet details
- Watch AI generate personalized content! ✨

---

## 🔧 Configuration Options

### Choosing AI Provider

Edit `/pages/api/generate-pet-guide-ai.ts`, line 17:

```typescript
// Choose one:
const AI_PROVIDER = 'groq';           // Recommended
const AI_PROVIDER = 'huggingface';    // Alternative
const AI_PROVIDER = 'together';       // Alternative
const AI_PROVIDER = 'local-ollama';   // For local setup
```

### Adjusting AI Temperature

Make responses more creative or more consistent:

```typescript
// In each provider function, find:
temperature: 0.7,  // Default

// Change to:
temperature: 0.3,  // More consistent, less creative
temperature: 0.9,  // More creative, less consistent
```

### Changing Models

**Groq Models:**
```typescript
model: 'llama-3.1-70b-versatile',  // Best for content
model: 'llama-3.1-8b-instant',     // Faster, cheaper
model: 'mixtral-8x7b-32768',       // Good alternative
```

**Hugging Face Models:**
```typescript
'meta-llama/Meta-Llama-3-8B-Instruct',     // Default
'mistralai/Mixtral-8x7B-Instruct-v0.1',    // Alternative
'google/gemma-7b-it',                       // Another option
```

---

## 📊 Comparison Table

| Provider | Free Limit | Speed | Quality | Setup | Best For |
|----------|-----------|-------|---------|-------|----------|
| **Groq** | 14,400/day | ⚡⚡⚡ | ⭐⭐⭐⭐ | Easy | **Production** |
| Hugging Face | 1,000/day | ⚡⚡ | ⭐⭐⭐ | Easy | Development |
| Together | $25 credits | ⚡⚡⚡ | ⭐⭐⭐⭐ | Easy | Testing |
| Ollama | Unlimited | ⚡ | ⭐⭐⭐ | Medium | Privacy/Cost |

---

## 🧪 Testing AI Integration

### Test 1: Quiz Flow
1. Go to `/pet-parent-guide?flow=quiz`
2. Answer all 3 questions
3. Click "Generate My Guide"
4. Check if AI-generated content appears
5. Verify content is relevant to your answers

### Test 2: Direct Entry
1. Go to `/pet-parent-guide?flow=direct`
2. Enter "Golden Retriever" and "3 months"
3. Generate guide
4. Check if breed-specific content appears

### Test 3: Check Console
Open browser console (F12):
- Should see: "AI Provider: groq" (or your chosen provider)
- No error messages
- Response time logged

---

## 🐛 Troubleshooting

### "API key not found"
**Solution:** 
```bash
# Make sure .env.local exists and has:
GROQ_API_KEY=gsk_your_key

# Restart server:
npm run dev
```

### "Failed to generate guide"
**Solution:**
1. Check API key is correct
2. Check internet connection
3. Check provider status page
4. Look at browser console for specific error

### "Invalid JSON response"
**Solution:**
The AI sometimes returns malformed JSON. The parser handles this, but if it persists:
1. Adjust temperature lower (0.5)
2. Try different model
3. Check prompt formatting

### Ollama: "Connection refused"
**Solution:**
```bash
# Make sure Ollama is running:
ollama serve

# In another terminal:
ollama list  # Should show llama3.1
```

---

## 💰 Cost Estimates (If Going Premium)

If you outgrow free tiers:

**Groq:**
- Pay-as-you-go available
- Very affordable
- ~$0.50 per 1M tokens

**Hugging Face:**
- Inference Endpoints: $0.60/hour
- Only pay when running

**Together AI:**
- After free credits: ~$0.80 per 1M tokens

**Ollama:**
- Always free
- One-time hardware cost

---

## 🎯 Recommendation for Your Pet.Ra App

**Start with Groq** because:
1. ✅ 14,400 free requests/day = 600 users/day
2. ✅ Super fast responses (better UX)
3. ✅ High quality Llama 3.1 model
4. ✅ Easy to implement (5 minutes)
5. ✅ Can scale to paid if needed

**Your daily capacity:**
- 600 guide generations/day FREE
- More than enough to start
- Can add payment later if needed

---

## 📚 Additional Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference)
- [Together AI Docs](https://docs.together.ai)
- [Ollama Documentation](https://github.com/ollama/ollama)

---

## ✅ Quick Start Checklist

- [ ] Choose AI provider (recommend: Groq)
- [ ] Get free API key
- [ ] Add key to `.env.local`
- [ ] Update fetch URL in pet-parent-guide page
- [ ] Restart dev server
- [ ] Test quiz flow
- [ ] Test direct entry flow
- [ ] Check content quality
- [ ] Deploy to production!

---

**Need Help?** Check the error messages in browser console or terminal output. Most issues are:
1. Missing API key in .env.local
2. Wrong API endpoint URL
3. Server not restarted after env changes

Good luck! 🚀🐾

