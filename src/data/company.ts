export interface CustomLegalDoc {
  id: string
  title: string
  number: string
  enabled: boolean
  status?: 'aktif' | 'proses'
  notes?: string
}

export interface CompanyProfileData {
  legalName: string
  brandName: string
  tagline: string
  nib: string
  nibEnabled?: boolean
  nibStatus?: 'aktif' | 'proses' | 'none'
  skKemenkumham: string
  skKemenkumhamEnabled?: boolean
  skKemenkumhamStatus?: 'aktif' | 'proses' | 'none'
  izinKemenparekraf: string
  izinKemenparekrafEnabled?: boolean
  izinKemenparekrafStatus?: 'aktif' | 'proses' | 'none'
  asitaMembership: string
  asitaMembershipEnabled?: boolean
  asitaMembershipStatus?: 'aktif' | 'proses' | 'none'
  hpiPartnership: string
  hpiPartnershipEnabled?: boolean
  hpiPartnershipStatus?: 'aktif' | 'proses' | 'none'
  customLegalDocs?: CustomLegalDoc[]
  address: string
  phone: string
  whatsapp: string
  email: string
  establishedYear: number
  stats: {
    travelersServed: number
    satisfactionRate: string
    yearsExperience: number
    umkmPartners: number
    destinationsCovered: number
  }
  bankAccounts: {
    bank: string
    accountNumber: string
    accountName: string
    logoText: string
  }[]
  vision: string
  mission: string[]
  pillars: {
    title: string
    description: string
    iconName: string
  }[]
  downPaymentPercentage?: number
  enableDownPayment?: boolean
  showTermsAndConditionsSection?: boolean
  termsAndConditions: string[]
  updatedAt?: string
}

export const COMPANY_PROFILE: CompanyProfileData = {
  legalName: 'PT GARUT PESONA JELAJAH NUSANTARA',
  brandName: 'Garut Journey',
  tagline: 'Explore Garut, Feel the Story.',
  nib: '1245000983210 (KBLI 79120 - Aktivitas Biro Perjalanan Wisata)',
  nibEnabled: true,
  nibStatus: 'aktif',
  skKemenkumham: 'AHU-0038912.AH.01.01.TAHUN 2020',
  skKemenkumhamEnabled: true,
  skKemenkumhamStatus: 'aktif',
  izinKemenparekraf: 'IZIN-TDUP/GRT/2021/0084',
  izinKemenparekrafEnabled: true,
  izinKemenparekrafStatus: 'aktif',
  asitaMembership: 'ASITA DPC Garut No. 031/ASITA-GRT/2021',
  asitaMembershipEnabled: true,
  asitaMembershipStatus: 'aktif',
  hpiPartnership: 'Mitra Resmi DPC HPI (Himpunan Pramuwisata Indonesia) Garut',
  hpiPartnershipEnabled: true,
  hpiPartnershipStatus: 'aktif',
  customLegalDocs: [
    {
      id: 'doc-npwp',
      title: 'NPWP Badan Usaha',
      number: '42.891.034.9-443.000',
      enabled: true,
      status: 'aktif',
      notes: 'KPP Pratama Garut',
    },
  ],
  address: 'Jl. Raya Bayongbong - Cikajang No. 103, Garut Kota, Jawa Barat 44115',
  phone: '+62 (0262) 238-912',
  whatsapp: '+62 851-5645-6791',
  email: 'halo@garutjourney.com',
  establishedYear: 2014,
  stats: {
    travelersServed: 5850,
    satisfactionRate: '99.4%',
    yearsExperience: 12,
    umkmPartners: 65,
    destinationsCovered: 28,
  },
  bankAccounts: [
    {
      bank: 'Bank Central Asia (BCA)',
      accountNumber: '148-092-8811',
      accountName: 'PT GARUT PESONA JELAJAH',
      logoText: 'BCA',
    },
    {
      bank: 'Bank Mandiri',
      accountNumber: '131-00-1928374-2',
      accountName: 'PT GARUT PESONA JELAJAH',
      logoText: 'MANDIRI',
    },
    {
      bank: 'Bank Rakyat Indonesia (BRI)',
      accountNumber: '0032-01-003948-53-9',
      accountName: 'PT GARUT PESONA JELAJAH',
      logoText: 'BRI',
    },
  ],
  vision:
    'Menjadi biro perjalanan wisata terdepan dan terpercaya di Jawa Barat yang mengangkat kekayaan alam, budaya luhur Sunda, dan ekonomi masyarakat lokal Garut ke kancah nasional dan internasional dengan standar keselamatan prima.',
  mission: [
    'Menghadirkan pengalaman berwisata yang bermakna, personal, dan aman bagi setiap wisatawan.',
    'Memberdayakan pemandu lokal berlisensi resmi dan ratusan mitra UMKM kuliner, pengrajin kriya, serta warga desa.',
    'Menjaga kelestarian ekosistem alam pegunungan dan kearifan cagar budaya tatar Garut.',
    'Memberikan transparansi harga, kepastian jadwal, dan pelayanan profesional berstandar bintang lima.',
  ],
  pillars: [
    {
      title: 'Legalitas Resmi & Terproteksi Asuransi',
      description:
        'Terdaftar resmi dengan NIB dan Izin Pariwisata Kemenparekraf RI. Setiap trip dilindungi asuransi perjalanan resmi demi kenyamanan dan keselamatan maksimal.',
      iconName: 'ShieldCheck',
    },
    {
      title: 'Pemandu Lokal Berlisensi HPI & BNSP',
      description:
        'Bukan pihak ketiga atau makelar. Seluruh guide kami adalah putra-putri daerah Garut yang tersertifikasi kepemanduan, menguasai sejarah, dan terlatih pertolongan pertama (First Aid).',
      iconName: 'Users',
    },
    {
      title: 'Armada Terawat & Standar SOP Wisata',
      description:
        'Kendaraan pariwisata (HiAce, Innova, Bus Pariwisata, Jeep 4x4) dirawat berkala dengan driver berpengalaman, ramah, dan menguasai medan pegunungan Garut.',
      iconName: 'Car',
    },
    {
      title: '100% Harga Jujur Tanpa Biaya Tersembunyi',
      description:
        'Kwitansi resmi ber-QR Code, rincian biaya transparan sejak awal, dan jaminan tidak ada pemaksaan belanja toko oleh-oleh.',
      iconName: 'BadgeCheck',
    },
  ],
  downPaymentPercentage: 30,
  enableDownPayment: true,
  showTermsAndConditionsSection: false,
  termsAndConditions: [
    'Pemesanan paket wisata (booking) dinyatakan sah setelah peserta melakukan pembayaran Down Payment (DP) sebesar 30% dari total biaya trip atau pembayaran penuh (Full Payment 100%).',
    'Sisa pelunasan sebesar 70% (bagi yang memilih opsi DP 30%) wajib dilunasi paling lambat H-1 sebelum keberangkatan atau saat penjemputan di titik kumpul (Meeting Point).',
    'Perubahan jadwal keberangkatan (Reschedule) dapat diajukan maksimal H-3 sebelum tanggal trip tanpa biaya tambahan (selama kuota armada & pemandu tersedia).',
    'Pembatalan sepihak oleh peserta kurang dari H-3 sebelum keberangkatan menyebabkan Down Payment (DP 30%) tidak dapat dikembalikan (non-refundable), namun dapat dialihkan ke peserta pengganti.',
    'Seluruh tarif paket sudah termasuk fasilitas sesuai rincian yang tertera (transportasi AC, BBM, driver, pemandu resmi HPI, dan tiket objek wisata utama).',
    'Peserta wajib mematuhi arahan keselamatan dari Tour Leader / Guide HPI, terutama saat eksplorasi kawasan vulkanik Kawah Papandayan, perairan danau, maupun pantai selatan.',
    'Apabila terjadi kondisi Force Majeure (bencana alam, penutupan jalur resmi oleh pemerintah, atau cuaca ekstrem), jadwal atau rute destinasi akan disesuaikan demi keselamatan bersama.',
  ],
}
