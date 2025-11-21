# Pet.Ra - Pet Finder & Pet Parent Guide

A comprehensive Next.js application for Pet.Ra's website featuring pet finder services and an intelligent Pet Parent Learning Hub.

## Features

### Pet Finder
- 🎨 **Fully Responsive Design**: Works perfectly on desktop and mobile
- 📧 **Email Integration**: Sends form submissions to Petragroupofficial@gmail.com
- ⚡ **Real-time Validation**: Client-side form validation
- 🎯 **User-friendly UI**: Clean, modern design with Tailwind CSS
- 📱 **Mobile-first**: Optimized for all screen sizes

### Pet Parent Learning Hub ✨ NEW
- 🧠 **Smart Discovery Quiz**: 3-question intelligent questionnaire
- 🔍 **Direct Breed Entry**: Enter breed and age for instant guidance
- 📚 **Personalized Content**: AI-powered learning paths
- 💾 **Bookmark & Share**: Save favorite tips and share with others
- 📄 **Premium PDF Export**: Comprehensive 20-30 page guides (₹99)
- ✅ **Vet-Reviewed**: Expert-verified content for new pet parents

## Form Fields

1. **Full Name** (required)
2. **Email or Phone** (required)
3. **Pet Type** (dropdown: Dog, Cat, Bird, Other)
4. **Breed / Size Preference** (optional)
5. **Age Preference** (dropdown: Puppy/Kitten, Adult, Senior)
6. **Budget Range** (optional)
7. **Location (City/State)** (optional)
8. **Additional Notes** (textarea, optional)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gmail SMTP

1. Copy the environment file:
   ```bash
   cp env.example .env.local
   ```

2. Set up Gmail App Password:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Navigate to Security → 2-Step Verification
   - Generate an App Password for "Mail"
   - Use this password in your `.env.local` file

3. Update `.env.local` with your credentials:
   ```env
   GMAIL_USER=Pet.Ra'sgroupofficial@gmail.com
   GMAIL_APP_PASSWORD=your_generated_app_password
   ```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the form.

## File Structure

```
├── components/
│   ├── FindYourPetForm.tsx        # Main pet finder form
│   ├── QuizQuestionCard.tsx       # Quiz question component
│   └── ContentCard.tsx            # Learning content card
├── pages/
│   ├── api/
│   │   ├── send-pet-request.ts    # Pet finder email API
│   │   ├── generate-pet-guide.ts  # Content generation API
│   │   └── generate-pdf.ts        # PDF generation with paywall
│   ├── pet-parent-guide/
│   │   └── index.tsx              # Pet Parent Learning Hub
│   ├── _app.tsx                   # App wrapper with global styles
│   └── index.tsx                  # Home page
├── types/
│   └── petParent.ts               # TypeScript types for pet parent feature
├── styles/
│   └── globals.css                # Global Tailwind CSS
└── package.json
```

## Usage

### As a Component

```tsx
import FindYourPetForm from './components/FindYourPetForm';

function MyPage() {
  return (
    <div>
      <FindYourPetForm />
    </div>
  );
}
```

### API Endpoint

The form sends POST requests to `/api/send-pet-request` with the following payload:

```json
{
  "fullName": "John Doe",
  "emailOrPhone": "john@example.com",
  "petType": "Dog",
  "breedSizePreference": "Golden Retriever",
  "agePreference": "Adult",
  "budgetRange": "$500-1000",
  "location": "New York, NY",
  "additionalNotes": "Looking for a friendly family dog"
}
```

## Email Format

Emails are sent to `Pet.Ra'sgroupofficial@gmail.com` with:
- **Subject**: "New Pet Request – {Pet Type}"
- **Body**: Nicely formatted HTML with all form fields organized in sections

## Styling

The form uses Tailwind CSS with the following design system:
- **Background**: `bg-gray-50`
- **Card**: `bg-white p-8 rounded-2xl shadow-lg`
- **Inputs**: `w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300`
- **Button**: `bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl`

## Responsive Breakpoints

- **Mobile**: Full width, stacked layout
- **Desktop**: Centered card with max-width of 600px

## Error Handling

- Form validation for required fields
- Network error handling
- Success/error state management
- User-friendly error messages

## Pages

### `/` - Home Page
- Hero section with pet finder CTA
- Pet Parent Guide promotion
- How it works section
- Subscription plans
- Pet finder form

### `/pet-parent-guide` - Learning Hub
- Two entry flows: Quiz or Direct Entry
- Personalized content generation
- Bookmark and share functionality
- Premium PDF export feature

### `/pet-parent-guide?flow=quiz` - Quiz Flow
Direct link to start the 3-question quiz

### `/pet-parent-guide?flow=direct` - Direct Entry Flow
Direct link to breed and age entry

## API Routes

### `POST /api/send-pet-request`
Handles pet finder form submissions and sends email

### `POST /api/generate-pet-guide`
Generates personalized learning content based on profile

### `POST /api/generate-pdf`
Generates and delivers PDF guide (requires payment/subscription)

## Dependencies

- **Next.js 14**: React framework
- **React 18**: UI library
- **Tailwind CSS**: Styling
- **Nodemailer**: Email sending
- **TypeScript**: Type safety
- **Phosphor React**: Icon library
- **Vercel Analytics**: Analytics tracking

## Documentation

For detailed information about the Pet Parent Learning Hub feature, see:
- [Pet Parent Guide Documentation](./PET_PARENT_GUIDE_README.md)
