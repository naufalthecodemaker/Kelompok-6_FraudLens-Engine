# FraudLens Engine

## Project Description
FraudLens Engine adalah platform intelijen identitas proaktif dan pendeteksi kejahatan finansial. Dibangun menggunakan Next.js dan didukung oleh Graph Database Neo4j, platform ini mengubah paradigma dari database relasional konvensional yang terisolasi menjadi *property graph model*. Hal ini memungkinkan investigator untuk memvisualisasikan relasi, mendeteksi identitas sintetis, serta mengungkap anomali seperti kolusi perangkat (*device collusion*) dan pencucian uang (*circular money laundering*) secara *real-time*.

## Team Members (Kelompok 6)
- **Naufal Rahman (2406413142)** - Backend Developer
- **Ahmad Malik Prasetyo (2406416270)** - Frontend Developer
- **Eugenia Huwaida Imtinan (2406421384)** - Database Engineer
- **Haikal Gifari Inzaghi (2406432261)** - Data Modeler & Query Specialist
- **Nadia Izzati (2406487033)** - Technical Writer & QA

## Architecture Diagram
![image](https://hackmd.io/_uploads/SJtKQIYJMl.png)

## Getting Started

### Prerequisites
Before running the development server, ensure your Neo4j AuraDB credentials are set up. Create a `.env.local` file in the root directory and add the following variables:

```env
NEO4J_URI=neo4j+s://<your-neo4j-uri>
NEO4J_USER=neo4j
NEO4J_PASSWORD=<your-neo4j-password>
```

### Running the Application
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`]([https://github.com/vercel/next.js/tree/canary/packages/create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`]([https://nextjs.org/docs/app/building-your-application/optimizing/fonts](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Credits, Datasets & Third-Party Tools
All external code, tools, and platforms utilized to build this project are credited below:

- **[Next.js]:** Framework React yang digunakan untuk UI frontend dan *serverless API routing*.
- **[Neo4j AuraDB & neo4j-driver]:** Platform *cloud graph database* dan *driver* JavaScript yang digunakan untuk persistensi data serta eksekusi query Cypher.
- **[react-force-graph]:** Library berbasis D3.js yang digunakan untuk merender kanvas graf interaktif 2D/3D.
- **[Tailwind CSS]:** Framework CSS berbasis utilitas yang digunakan untuk penataan gaya (*styling*) antarmuka web.

### Penggunaan Asisten AI (AI Assistant Disclosure)
Berikut adalah rincian  penggunaan AI selama proses pengembangan *FraudLens Engine*:

- **Gemini AI (Model Bahasa / Text Generation):** 
Digunakan sebagai asisten pengembangan (*pair-programming*).
  - **Bagian yang di-generate:** Membantu menyusun kerangka dasar dan struktur tampilan antarmuka (Frontend UI dengan Tailwind), membantu menuliskan sintaks teknis spesifik pada Backend (seperti format fungsi *driver* Neo4j dan penulisan *syntax* Cypher), serta membantu mengoreksi kesalahan yang kami buat selama proses pembuatan kode.
  - **Metode Verifikasi:** Seluruh alur sistem (*flow*), logika bisnis, dan skema *database* dirancang secara mandiri oleh tim kami. Kode fungsional yang diberikan oleh AI ditinjau dan diuji coba secara lokal di bagian development, dan dimodifikasi secara manual agar terintegrasi sempurna dengan komponen arsitektur yang kami bangun. Hal ini agar setiap query Cypher yang dihasilkan dapat memberikan data graph yang valid.

- **Gemini AI (Nano Banana 2 / Image Generation):** 
Digunakan untuk men-*generate* ilustrasi visual grafis pada bagian *System Architecture*.
  - **Metode Verifikasi:** Gambar hasil generasi AI dievaluasi secara visual dan konseptual untuk memastikan bahwa alur (dari Frontend, Server Node.js, hingga Cloud Database) secara akurat merepresentasikan arsitektur yang kami terapkan di dalam proyek.

## Learn More
To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.