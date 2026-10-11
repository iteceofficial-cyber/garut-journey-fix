import { GoogleGenAI } from '@google/genai'

export interface SeoGenerationOptions {
  scope: 'site' | 'tour' | 'destination'
  subjectName?: string
  subjectDetails?: string
  audienceStyle?: 'keluarga' | 'petualang' | 'eksekutif' | 'healing'
  targetKeywordsHint?: string
}

export interface GeneratedOrganicSeo {
  metaTitle: string
  metaDescription: string
  focusKeywords: string
  ogTitle: string
  ogDescription: string
  organicPitch: string
  faqSchema: { question: string; answer: string }[]
  suggestedSlug?: string
  source: 'gemini' | 'organic-engine'
}

/**
 * Organic travel copywriting corpus for fallback / offline generation.
 * Specially written in natural, fluent Indonesian with genuine warmth.
 */
export const ORGANIC_TITLES = {
  site: [
    'Garut Journey — Jelajahi Swiss van Java, Destinasi & Paket Tour Resmi',
    'Wisata Garut Terbaik — Paket Liburan Keluarga & Trip Alam Swiss van Java',
    'Garut Journey: Temukan Kawah Pegunungan, Air Panas & Kuliner Khas Tatar Sunda',
    'Paket Tour Garut Resmi & Terpercaya — Eksplorasi Cantik Priangan Timur',
  ],
  tour: [
    '{name} — Paket Tour Resmi Garut Hemat & Berkesan',
    'Paket Liburan {name} — Fasilitas Lengkap, Guide HPI & Armada Nyaman',
    '{name} | Pengalaman Wisata Autentik Bersama Garut Journey',
  ],
  destination: [
    'Wisata {name} Garut — Tiket Masuk, Rute & Panduan Lengkap Liburan',
    '{name} Garut: Daya Tarik, Jam Buka & Tips Berkunjung Terbaik',
    'Eksplorasi {name} — Pesona Alam Memikat di Jantung Garut',
  ],
}

const ORGANIC_DESCRIPTIONS = {
  keluarga: [
    'Rencanakan liburan keluarga yang nyaman di Garut. Nikmati hangatnya pemandian air panas alami, asrinya Situ Bagendit, dan kuliner khas Sunda dengan paket tour terpercaya.',
    'Jelajahi keindahan Garut bersama orang tercinta. Pemandu lokal resmi, armada mobil ber-AC prima, dan jadwal santai tanpa buru-buru untuk semua usia.',
  ],
  petualang: [
    'Siap menembus kabut kawah vulkanik aktif dan bermalam di bawah taburan bintang? Ikuti pendakian Gunung Papandayan & Guntur bersama guide gunung berlisensi.',
    'Petualangan seru melintasi Hutan Mati, padang Edelweiss, dan berkemah di alam terbuka Garut. Perlengkapan lengkap, porter amanah, dan pengalaman tak terlupakan.',
  ],
  eksekutif: [
    'Solusi gathering kantor dan family gathering perusahaan di Garut. Layanan bus pariwisata eksekutif, outbound seru, penginapan resort, dan transparansi invoice resmi.',
    'Paket tour rombongan 10 hingga 100+ peserta dengan standar keselamatan tinggi. Nikmati keindahan Swiss van Java dengan pelayanan profesional berstandar bintang lima.',
  ],
  healing: [
    'Lepaskan penat hiruk pikuk kota. Rasakan sejuknya udara pegunungan Priangan, berendam air belerang hangat Darajat, dan nikmati ketenangan danau yang menentramkan.',
    'Perjalanan santai untuk memulihkan energi Anda di Garut. Suasana pedesaan yang asri, keramahan warga lokal, dan cita rasa kuliner legendaris yang memanjakan lidah.',
  ],
}

export async function generateOrganicSeoWithAi(options: SeoGenerationOptions): Promise<GeneratedOrganicSeo> {
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : ''

  const scopeLabel =
    options.scope === 'tour'
      ? `Paket Tour: ${options.subjectName || 'Paket Wisata Garut'}`
      : options.scope === 'destination'
      ? `Destinasi Wisata: ${options.subjectName || 'Objek Wisata Garut'}`
      : 'Portal Resmi Pariwisata Garut Journey'

  const styleLabel = options.audienceStyle || 'keluarga'

  // If Gemini API Key is available, prompt Gemini 2.5 Flash with strict human-organic guidelines
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey })
      const prompt = `
Anda adalah seorang copywriter pariwisata profesional Garut yang menulis seperti MANUSIA ASLI (berbahasa Indonesia yang hangat, mengalir, persuasif, natural, dan sangat disukai Google Search).
Target: Optimasi SEO untuk "${scopeLabel}".
Gaya pembaca: "${styleLabel}".
Rincian tambahan: "${options.subjectDetails || 'Pariwisata alam pegunungan, kawah Papandayan, air panas Darajat, Situ Bagendit, kuliner Sunda, paket tour berlisensi resmi'}".
Kata kunci incaran: "${options.targetKeywordsHint || 'wisata garut, paket tour garut, liburan garut, swiss van java'}".

ATURAN WAJIB COPYWRITING:
1. HINDARI bahasa kaku/robotik AI (jangan gunakan kalimat seperti "Dalam era globalisasi", "Menjadi solusi utama", "Tidak diragukan lagi", "Sebuah keharusan").
2. Gunakan tutur kata manusia yang elegan, ramah, dan membangkitkan rasa ingin berkunjung ke Garut ("Swiss van Java").
3. Meta Title harus antara 50 - 60 karakter, memuat brand "Garut Journey" atau nama destinasi.
4. Meta Description harus antara 130 - 155 karakter, ringkas, menarik, dan ada ajakan bertindak (call-to-action) yang halus.
5. Focus Keywords harus memuat 5-8 frasa long-tail alami yang sering dicari pengguna di Google (misal: "paket tour garut keluarga 2 hari 1 malam", "harga tiket kawah papandayan terbaru", dsb).
6. Buat 3 FAQ Q&A organik yang sering ditanyakan wisatawan.

Balas HANYA dalam format JSON valid tanpa tanda backtick markdown dengan skema berikut:
{
  "metaTitle": "string",
  "metaDescription": "string",
  "focusKeywords": "string",
  "ogTitle": "string",
  "ogDescription": "string",
  "organicPitch": "string (1 paragraf narasi copywriting organik)",
  "faqSchema": [
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" }
  ],
  "suggestedSlug": "string"
}
`
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      })

      const rawText = response.text?.trim() || ''
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim()
      const parsed = JSON.parse(cleaned)

      if (parsed.metaTitle && parsed.metaDescription) {
        return {
          ...parsed,
          source: 'gemini',
        }
      }
    } catch (err) {
      console.warn('Gemini AI SEO Generation fallback to Organic Engine:', err)
    }
  }

  // --- High-Quality Organic Algorithmic Engine ---
  const name = options.subjectName || 'Garut Journey'
  const styleList = ORGANIC_DESCRIPTIONS[styleLabel] || ORGANIC_DESCRIPTIONS.keluarga
  const baseDesc = styleList[Math.floor(Math.random() * styleList.length)]

  let title = ''
  let keywords = ''
  let pitch = ''

  if (options.scope === 'tour') {
    title = `${name} — Paket Tour Garut Hemat & Berfasilitas Lengkap`
    keywords = `${name.toLowerCase()}, paket tour garut murah, harga paket wisata garut, open trip garut, gathering garut, guide hpi garut`
    pitch = `Nikmati pengalaman menjelajahi Garut tanpa ribet bersama paket ${name}. Kami siapkan transportasi nyaman, tiket masuk wisata, makan khas Sunda, dan pemandu lokal berpengalaman agar liburan Anda terasa hangat dan berkesan.`
  } else if (options.scope === 'destination') {
    title = `Wisata ${name} Garut — Daya Tarik, Tiket Masuk & Panduan Berkunjung`
    keywords = `wisata ${name.toLowerCase()}, tiket masuk ${name.toLowerCase()}, rute ke ${name.toLowerCase()}, jam buka ${name.toLowerCase()}, spot foto ${name.toLowerCase()}`
    pitch = `Eksplorasi keindahan ${name} dengan informasi terlengkap: jam operasional terbaik, tarif tiket, tips berpakaian, serta akses rute perjalanan yang nyaman bagi seluruh anggota keluarga.`
  } else {
    title = 'Garut Journey — Jelajahi Swiss van Java, Destinasi & Paket Tour Resmi'
    keywords = 'wisata garut, paket tour garut, liburan garut, kawah papandayan, darajat pass, situ bagendit, hotel garut, rental mobil garut, guide wisata garut'
    pitch = 'Garut Journey menghadirkan cara terbaik menikmati keindahan Priangan Timur. Dari panorama kawah vulkanik yang megah, segarnya kolam air hangat alami, hingga sedapnya nasi liwet Sunda — semua tersaji dalam satu perjalanan terencana.'
  }

  // Ensure character counts meet Google Best Practices
  let finalDesc = baseDesc
  if (finalDesc.length < 130) {
    finalDesc = `${finalDesc} Pesan sekarang di Garut Journey untuk penawaran terbaik.`
  }
  if (finalDesc.length > 158) {
    finalDesc = finalDesc.slice(0, 155) + '...'
  }

  return {
    metaTitle: title.slice(0, 65),
    metaDescription: finalDesc,
    focusKeywords: keywords,
    ogTitle: `${name} — Eksplorasi Swiss van Java`,
    ogDescription: finalDesc,
    organicPitch: pitch,
    suggestedSlug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    faqSchema: [
      {
        question: `Berapa estimasi biaya paket tour di Garut?`,
        answer: `Tarif paket tour Garut bervariasi mulai dari Rp 220.000 hingga Rp 850.000 per orang tergantung jumlah peserta dan durasi trip (1 hari, 2D1N, atau 3D2N). Rombongan di atas 10 hingga 100 orang mendapatkan harga diskon khusus yang jauh lebih hemat.`,
      },
      {
        question: `Fasilitas apa saja yang sudah termasuk dalam paket tour?`,
        answer: `Paket kami sudah mencakup transportasi ber-AC, BBM, driver ramah, pemandu lokal resmi berlisensi HPI, seluruh tiket masuk objek wisata, makan kuliner khas Sunda, air mineral, serta asuransi perjalanan resmi.`,
      },
      {
        question: `Apakah rute wisata di Garut ramah anak-anak dan lansia?`,
        answer: `Sangat ramah. Kami menyediakan opsi paket City Tour dan Rekreasi Keluarga dengan rute santai, jalur landai beraspal, dan akses kendaraan yang nyaman hingga ke dekat lokasi wisata.`,
      },
    ],
    source: 'organic-engine',
  }
}
