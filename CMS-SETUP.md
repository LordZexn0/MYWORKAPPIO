# CMS Database Setup Guide

## 🚨 Issue Identified
The CMS database is not working because the Upstash Redis environment variables are not configured.

## 🔧 Quick Fix

### Option 1: Set Up Upstash Redis (Recommended)

1. **Create Upstash Account**
   - Go to [https://console.upstash.com/](https://console.upstash.com/)
   - Sign up for a free account
   - Create a new Redis database

2. **Get Your Credentials**
   - Copy the `UPSTASH_KV_REST_API_URL`
   - Copy the `UPSTASH_KV_REST_API_TOKEN`

3. **Set Environment Variables**

   **For Local Development:**
   ```bash
   # Create .env.local file in project root
   UPSTASH_KV_REST_API_URL=https://your-database-url.upstash.io
   UPSTASH_KV_REST_API_TOKEN=your-database-token
   ```

   **For Vercel Production:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add the same variables

### Option 2: Use File Storage Only (Fallback)

If you don't want to set up Upstash Redis, the CMS will automatically fall back to file storage using `cms/content.json`.

## 🧪 Testing the Fix

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the CMS API:**
   ```bash
   node test-cms.js
   ```

3. **Visit the admin panel:**
   - Go to `http://localhost:3000/admin`
   - Try making changes and saving them

## 📊 Expected Behavior

### With Upstash Redis (Option 1):
- ✅ Content saved to cloud database
- ✅ Changes persist across deployments
- ✅ Real-time updates
- ✅ Better performance

### With File Storage (Option 2):
- ✅ Content saved to local file
- ✅ Changes persist locally
- ⚠️ Changes don't persist on Vercel (read-only)
- ⚠️ Slower performance

## 🔍 Troubleshooting

### "Missing Redis environment variables"
- Check that your `.env.local` file exists
- Verify the variable names are correct
- Restart the development server

### "Redis connection test failed"
- Check your Upstash credentials
- Verify your database is active
- Check network connectivity

### "Failed to save content"
- Check file permissions for `cms/content.json`
- Ensure the `cms` directory exists

## 🎯 Next Steps

1. **Set up environment variables** (see above)
2. **Test the CMS functionality**
3. **Deploy to Vercel with environment variables**
4. **Verify admin panel works in production**

## 📞 Support

If you're still having issues:
1. Check the browser console for errors
2. Check the terminal for server logs
3. Verify all environment variables are set correctly
