export interface CompanyProfileData {
  legalName: string
  brandName: string
  tagline: string
  nib: string
  skKemenkumham: string
  izinKemenparekraf: string
  asitaMembership: string
  hpiPartnership: string
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
}

export const COMPANY_PROFILE: CompanyProfileData = {
  legalName: 'PT GARUT PESONA JELAJAH NUSANTARA',
  brandName: 'Garut Journey',
  tagline: 'Explore Garut, Feel the Story.',
  nib: '1245000983210 (KBLI 79120 - Aktivitas Biro Perjalanan Wisata)',
  skKemenkumham: 'AHU-0038912.AH.01.01.TAHUN 2020',
  izinKemenparekraf: 'IZIN-TDUP/GRT/2021/0084',
  asitaMembership: 'ASITA DPC Garut No. 031/ASITA-GRT/2021',
  hpiPartnership: 'Mitra Resmi DPC HPI (Himpunan Pramuwisata Indonesia) Garut',
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
}
