# Instant Quote Calculator (Lead Capture Demo)

A lightweight, polished **instant estimate + lead capture** tool for cleaning businesses (or any service business with simple pricing rules).

This repo contains a Vite + React + Tailwind UI that:
- Calculates an instant estimate range from “Home details”
- Collects contact info (“Where should we send your estimate?”)
- Submits the lead to a Google Sheet via a Google Apps Script Web App
- Sends confirmation emails (business owner + lead)

> **Status:** MVP shipped ✅  
> **Built by:** Service Tools Studio

---

## Features

- **Instant estimate** updates live as the user changes inputs
- **Lead capture** form submission posts to a Google Apps Script endpoint
- **Google Sheets logging** (one row per lead)
- **Email notifications**
  - business owner notification
  - lead confirmation email
- **Basic bot protection**
  - honeypot field
  - simple email/phone sanity checks
- **UX polish**
  - success message renders after the form
  - smooth scroll to the success message on submit

---

## Tech Stack

- Vite
- React
- Tailwind CSS
- Google Apps Script Web App
- Google Sheets (as lead database)

---

## Local Setup

```bash
npm install
npm run dev
