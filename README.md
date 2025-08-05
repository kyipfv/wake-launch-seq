# Wake Launch Sequence

A bio-hacker precision PWA for optimizing wake-up performance with secure user accounts and cloud-stored data.

## 🚀 Features

- **Chronotype Analysis**: Evidence-based 5-question assessment to determine optimal wake window
- **Reaction Time Testing**: 10-trial precision measurement with median calculation
- **Alertness Tracking**: 0-10 scale mood and energy level monitoring
- **Sunrise Scheduler**: Location-based light therapy recommendations
- **Performance Analytics**: 14-day trend visualization with streak tracking
- **PWA Support**: Works offline, installable as native app
- **Secure Auth**: Email/password + magic link authentication via Supabase

## 🛠 Tech Stack

- **Next.js 15** with App Router & TypeScript
- **Supabase** for authentication, PostgreSQL database, and Row Level Security
- **Tailwind CSS** for utility-first styling with dark/light mode
- **next-pwa** for service worker generation and offline support
- **suncalc** for sunrise/sunset calculations
- **Recharts** for performance data visualization

## 📦 Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd wake-launch-seq
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Set up Supabase database:**
   
   Create the following tables in your Supabase project:

   ```sql
   -- Profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT NOT NULL,
     chrono_window TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Metrics table
   CREATE TABLE metrics (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     date DATE NOT NULL,
     reaction_ms INTEGER,
     mood_score INTEGER CHECK (mood_score >= 0 AND mood_score <= 10),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, date)
   );

   -- Plans table
   CREATE TABLE plans (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     date DATE NOT NULL,
     sunrise_time TIMESTAMP WITH TIME ZONE NOT NULL,
     advice TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, date)
   );
   ```

4. **Enable Row Level Security (RLS):**
   
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
   ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

   -- Profiles policies
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can insert own profile" ON profiles
     FOR INSERT WITH CHECK (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   -- Metrics policies
   CREATE POLICY "Users can view own metrics" ON metrics
     FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own metrics" ON metrics
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own metrics" ON metrics
     FOR UPDATE USING (auth.uid() = user_id);

   -- Plans policies
   CREATE POLICY "Users can view own plans" ON plans
     FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own plans" ON plans
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own plans" ON plans
     FOR UPDATE USING (auth.uid() = user_id);
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment

### Render Deployment

1. **Create a new Web Service** on [Render](https://render.com)

2. **Connect your GitHub repository**

3. **Set environment variables** in Render dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy settings** are configured in `render.yaml`:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

### GitHub Actions CI/CD

1. **Set up Deploy Hook** in Render:
   - Go to your service settings
   - Copy the Deploy Hook URL

2. **Add GitHub Secret**:
   - In your GitHub repo, go to Settings > Secrets and Variables > Actions
   - Add `RENDER_DEPLOY_HOOK` with your deploy hook URL

3. **Automatic deployment**: Pushing to `main` branch triggers the workflow in `.github/workflows/deploy.yml`

## 📱 PWA Features

- **Offline Support**: Core functionality works without internet
- **Installable**: Add to home screen on mobile devices
- **Background Sync**: Queues data when offline, syncs when online
- **Service Worker**: Caches static assets and API responses

## 🏗 Architecture

### File Structure
```
/app
  ├── layout.tsx                 # Root layout with auth provider
  ├── page.tsx                   # Marketing landing page
  ├── (auth)/
  │   ├── sign-in/page.tsx       # Sign-in with magic link option
  │   └── sign-up/page.tsx       # Sign-up with email confirmation
  ├── onboarding/page.tsx        # Chronotype quiz (5 questions)
  └── dashboard/page.tsx         # Main application dashboard
/components
  ├── AuthProvider.tsx           # Auth context and session management
  ├── Nav.tsx                    # Navigation with user menu
  ├── ReactionTest.tsx           # Canvas-based reaction time test
  ├── MoodSlider.tsx             # 0-10 alertness slider
  ├── PlanCard.tsx               # Tomorrow's wake-up recommendation
  └── ChartPanel.tsx             # 14-day performance charts
/lib
  ├── supabase.ts                # Supabase client and types
  └── getSunrise.ts              # Sunrise calculation and advice logic
```

### Data Flow
1. **Authentication**: Supabase Auth handles sign-up/sign-in
2. **Onboarding**: Chronotype quiz saves to `profiles.chrono_window`
3. **Daily Metrics**: Reaction test and mood save to `metrics` table
4. **Recommendations**: Sunrise calculations save to `plans` table
5. **Analytics**: Charts query `metrics` for 14-day trends

## 🔒 Security

- **Row Level Security**: All database access restricted to authenticated users
- **JWT Authentication**: Secure session management via Supabase
- **Environment Variables**: Sensitive keys stored securely
- **Client-side Validation**: Input sanitization and type checking

## 🎯 Performance

- **Lighthouse PWA Score**: Optimized for ≥90 score
- **Code Splitting**: Automatic route-based code splitting via Next.js
- **Image Optimization**: Next.js automatic image optimization
- **Service Worker**: Runtime caching for static assets

## 📊 Data Schema

### Profiles
- `id` (UUID, PK): User ID from auth.users
- `email` (TEXT): User email address
- `chrono_window` (TEXT): Optimal wake time range (e.g., "06:00-06:30")

### Metrics
- `user_id` (UUID, FK): Reference to auth.users
- `date` (DATE): Measurement date
- `reaction_ms` (INTEGER): Median reaction time in milliseconds
- `mood_score` (INTEGER): Alertness score 0-10

### Plans
- `user_id` (UUID, FK): Reference to auth.users
- `date` (DATE): Plan date (tomorrow)
- `sunrise_time` (TIMESTAMPTZ): Sunrise time for location
- `advice` (TEXT): Light therapy recommendation

## 🚨 Troubleshooting

### Common Issues

1. **Supabase connection failed**
   - Verify environment variables are set correctly
   - Check Supabase project URL and anon key

2. **RLS policies blocking access**
   - Ensure all RLS policies are created as shown above
   - Check that user is authenticated before database operations

3. **PWA not installing**
   - Verify manifest.json is accessible
   - Check that HTTPS is enabled in production
   - Ensure service worker is registered correctly

4. **Geolocation not working**
   - App falls back to default location (NYC) if geolocation fails
   - Ensure HTTPS for geolocation API access

### Development Tips

- Use TypeScript strict mode for type safety
- Test offline functionality by throttling network in DevTools
- Monitor RLS policies with Supabase Dashboard > Authentication > Policies
- Check PWA compliance with Lighthouse audit

## 📚 Key Scripts Explained

- **Chronotype Algorithm**: Evidence-based scoring system in `app/onboarding/page.tsx`
- **Sunrise Logic**: Uses suncalc library in `lib/getSunrise.ts`
- **Offline Support**: Service worker configuration in `next.config.mjs`
- **Chart Visualization**: Recharts implementation in `components/ChartPanel.tsx`

## 🎨 Design System

- **Primary Color**: `#00BFFF` (bio-hacker blue accent)
- **Background**: Dark gradient from gray-900 to black
- **Typography**: System fonts for performance
- **Performance Lab Aesthetic**: Clinical precision over self-help vibes

## 📈 Analytics & Tracking

- **Streak Calculation**: Consecutive days with logged data
- **Performance Trends**: 14-day rolling window visualization
- **Reaction Time**: Median of 10-trial tests for accuracy
- **Circadian Alignment**: Sunrise-synchronized recommendations

---

Built with precision for optimal wake performance. 🚀