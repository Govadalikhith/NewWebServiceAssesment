# 🚀 Render Deployment Guide

This guide explains how to deploy your **InvenTracker Pro** project to Render.

## 1. Prerequisites
- Create a [Render account](https://render.com/).
- Push your code to a **GitHub repository**.

## 2. Render Setup Steps

### Create a Static Site (Optional but recommended for separation)
*Actually, we configured the project as a **Monolith** for easier deployment.*

### Create a Web Service
1. In the Render Dashboard, click **New +** and select **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name:** `inventracker-pro`
   - **Environment:** `Node`
   - **Region:** Choose the one closest to you.
   - **Branch:** `main` (or your default branch)
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

### 4. Environment Variables
In the **Environment** tab of your Render service, add:
- `PORT`: `10000` (Render's default)
- `NODE_ENV`: `production`

## 3. Important Notes on SQLite
> [!WARNING]
> Render's free tier uses an **ephemeral file system**. This means your `inventory.db` will be **deleted** every time the server restarts or you deploy new code.

### How to keep your data:
1. **Persistent Disks (Paid Tier)**: You can add a disk to your Render service and store the database there.
2. **PostgreSQL**: For production apps on Render, it's better to use their hosted **PostgreSQL** service. If you'd like to switch, let me know and I can modify the code to support Postgres.

## 4. Final URL
Once the build is complete (it may take 2-4 minutes), Render will provide a URL like `https://inventracker-pro.onrender.com`.

---
**Your app is now ready for the world!**
