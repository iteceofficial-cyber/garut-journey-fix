export interface GuideTeamMember {
  id: string
  name: string
  role: string
  nickname: string
  specialties: string[]
  experience: string
  certifications: string[]
  languages: string[]
  bio: string
  rating: number
  reviewCount: number
  image: string
  featured?: boolean
  quote: string
  totalTrips: number
}

export const GUIDE_TEAM: GuideTeamMember[] = [
  {
    id: 'guide-asep',
    name: 'Kang Asep Saepudin',
    nickname: 'Kang Asep',
    role: 'Senior Mountain & Highland Trekking Guide',
    specialties: ['Gunung Papandayan', 'Hutan Mati', 'Kawah Belerang', 'Highland Camping'],
    experience: '12+ Tahun',
    certifications: ['Sertifikasi BNSP Pemandu Gunung', 'Anggota HPI Garut No. 042/HPI-GRT', 'Sertifikasi Wilderness First Aid (WFA)'],
    languages: ['Bahasa Indonesia', 'Basa Sunda', 'English (Conversational)'],
    bio: 'Putra asli Cisurupan yang telah mendaki dan memandu lebih dari 850 rombongan ke Gunung Papandayan dan Gunung Guntur. Dikenal sangat sabar mendampingi pemula serta menguasai jalur aman flora-fauna endemik.',
    rating: 4.98,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    featured: true,
    quote: 'Gunung bukan sekadar pemandangan, melainkan ruang refleksi yang mengajarkan kita kerendahan hati.',
    totalTrips: 870,
  },
  {
    id: 'guide-rina',
    name: 'Teh Rina Nurhayati, S.Par',
    nickname: 'Teh Rina',
    role: 'Heritage & Cultural Storyteller Guide',
    specialties: ['Candi Cangkuang', 'Kampung Adat Pulo', 'Situs Kerajaan Sunda', 'Kesenian Tradisional'],
    experience: '8+ Tahun',
    certifications: ['Sertifikasi Pemandu Budaya BNSP', 'HPI Garut No. 078/HPI-GRT', 'Alumni Pariwisata Budaya'],
    languages: ['Bahasa Indonesia', 'Basa Sunda Lemes', 'English (Fluent)'],
    bio: 'Lulusan Manajemen Pariwisata yang mendedikasikan hidupnya merawat narasi sejarah tatar Garut. Gaya bertuturnya hangat dan kaya filosofi, menjadikan kunjungan ke situs kuno terasa hidup dan berkesan.',
    rating: 4.96,
    reviewCount: 245,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    featured: true,
    quote: 'Setiap batu candi dan untaian rakit bambu menyimpan cerita peradaban luhur yang pantas didengar dunia.',
    totalTrips: 520,
  },
  {
    id: 'guide-deden',
    name: 'Kang Deden Ramdani',
    nickname: 'Kang Deden',
    role: 'Southern Coast & 4x4 Offroad Specialist',
    specialties: ['Pantai Santolo', 'Tebing Rancabuaya', 'Jalur Pesisir Selatan', 'Ekspedisi Offroad Jeep'],
    experience: '10+ Tahun',
    certifications: ['Sertifikasi Pemandu Petualangan Alam', 'HPI Garut No. 063/HPI-GRT', 'Sertifikasi Safety Driving Offroad'],
    languages: ['Bahasa Indonesia', 'Basa Sunda'],
    bio: 'Pemberani dan penuh perhitungan matang di medan pesisir Samudra Hindia. Ahli membaca pasang surut air laut dan navigasi jalur tersembunyi pantai pasir putih selatan Garut.',
    rating: 4.95,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    featured: true,
    quote: 'Garut Selatan adalah keajaiban samudra dan tebing karang yang belum banyak terjamah riuhnya keramaian.',
    totalTrips: 430,
  },
  {
    id: 'guide-sarah',
    name: 'Teh Sarah Melati',
    nickname: 'Teh Sarah',
    role: 'Culinary Specialist & Sukaregang Craft Curator',
    specialties: ['Jelajah Kuliner Garut', 'Sentra Kulit Sukaregang', 'Pabrik Dodol Tradisional', 'Wisata Belanja'],
    experience: '7+ Tahun',
    certifications: ['Sertifikasi Pemandu Kota & Kuliner BNSP', 'HPI Garut No. 091/HPI-GRT'],
    languages: ['Bahasa Indonesia', 'Basa Sunda', 'English'],
    bio: 'Pencinta rasa autentik dan pengamat kriya lokal. Teh Sarah menghubungkan wisatawan langsung ke dapur pengrajin dodol tertua dan workshop perajin jaket kulit asli nomor satu di Sukaregang.',
    rating: 4.97,
    reviewCount: 220,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    featured: false,
    quote: 'Rasa autentik rempah dan keahlian tangan pengrajin Garut adalah warisan yang selalu bikin rindu kembali.',
    totalTrips: 390,
  },
  {
    id: 'guide-cecep',
    name: 'Kang Cecep Hendra',
    nickname: 'Kang Cecep',
    role: 'Family & Eco-Tourism Coordinator',
    specialties: ['Darajat Pass', 'Situ Bagendit', 'Resor Kampung Sampireun', 'Trip Ramah Anak & Lansia'],
    experience: '9+ Tahun',
    certifications: ['Sertifikasi Pemandu Ekowisata BNSP', 'Sertifikasi First Aid & K3 Wisata', 'HPI Garut No. 055/HPI-GRT'],
    languages: ['Bahasa Indonesia', 'Basa Sunda'],
    bio: 'Dikenal sangat teliti dalam memastikan kenyamanan lansia dan keceriaan anak-anak. Mengatur ritme perjalanan keluarga secara fleksibel tanpa buru-buru, lengkap dengan dokumentasi foto ciamik.',
    rating: 4.99,
    reviewCount: 280,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    featured: false,
    quote: 'Liburan keluarga terbaik adalah ketika semua generasi tersenyum puas dan pulang membawa cerita hangat.',
    totalTrips: 610,
  },
]
