# Pet.Ra's Pet Finder Form

A fully responsive React + Tailwind form component for Pet.Ra's website that allows users to request a pet and sends submissions via email.

## Features

- 🎨 **Fully Responsive Design**: Works perfectly on desktop and mobile
- 📧 **Email Integration**: Sends form submissions to Pet.Ra'sgroupofficial@gmail.com
- ⚡ **Real-time Validation**: Client-side form validation
- 🎯 **User-friendly UI**: Clean, modern design with Tailwind CSS
- 📱 **Mobile-first**: Optimized for all screen sizes

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
│   └── FindYourPetForm.tsx    # Main form component
├── pages/
│   ├── api/
│   │   └── send-pet-request.ts # API route for email sending
│   ├── _app.tsx               # App wrapper with global styles
│   └── index.tsx              # Home page with the form
├── styles/
│   └── globals.css            # Global Tailwind CSS
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

## Dependencies

- **Next.js 14**: React framework
- **React 18**: UI library
- **Tailwind CSS**: Styling
- **Nodemailer**: Email sending
- **TypeScript**: Type safety
