export type GalleryCategory = 'Nature' | 'City' | 'Culinary' | 'Culture' | 'Adventure'

export interface GalleryItem {
  id?: string
  image: string
  title: string
  category: GalleryCategory
  description: string
  /** Visual height in the masonry grid. */
  tall?: boolean
}

export const galleryFilters: ('All' | GalleryCategory)[] = ['All', 'Nature', 'City', 'Culinary', 'Culture', 'Adventure']

export const gallery: GalleryItem[] = [
  { id: 'gal-sunrise', image: 'hero.png', title: 'Garut Highland Sunrise', category: 'Nature', description: 'Kabut fajar menyelimuti hamparan teras sawah dan barisan gunung berapi Garut.' },
  { id: 'gal-papandayan', image: 'papandayan.png', title: 'Kawah Gunung Papandayan', category: 'Adventure', description: 'Menjelajahi kawah belerang aktif dan magisnya Hutan Mati.', tall: true },
  { id: 'gal-liwet', image: 'sundanese.png', title: 'Pesta Nasi Liwet Sunda', category: 'Culinary', description: 'Disajikan hangat di atas daun pisang dengan sambal dadak dan lalapan segar.' },
  { id: 'gal-warga', image: 'community.png', title: 'Kehangatan Warga Lokal', category: 'Culture', description: 'Keramahan dan kehidupan pedesaan yang asri di pelosok Garut.', tall: true },
  { id: 'gal-darajat', image: 'darajat.png', title: 'Darajat Pass Highland', category: 'Nature', description: 'Pemandian air panas alami di tengah sejuknya kebun teh berkabut.' },
  { id: 'gal-basoaci', image: 'basoaci.png', title: 'Baso Aci Garut Juara', category: 'Culinary', description: 'Pedas, kenyal, dan gurih rempah cikur yang melegenda.' },
  { id: 'gal-bagendit', image: 'bagendit.png', title: 'Pesona Situ Bagendit', category: 'Nature', description: 'Danau alami dengan pemandangan pegunungan dan rakit bambu santai.' },
  { id: 'gal-alunalun', image: 'citysquare.png', title: 'Alun-alun Garut', category: 'City', description: 'Pusat denyut kota dengan Masjid Agung dan suasana sore yang syahdu.' },
  { id: 'gal-santolo', image: 'santolo.png', title: 'Pantai Santolo Selatan', category: 'Adventure', description: 'Bentang samudra lepas berpasir putih dan pulau karang eksotis.', tall: true },
  { id: 'gal-hiking', image: 'hiking.png', title: 'Trekking di Atas Awan', category: 'Adventure', description: 'Mengejar matahari terbit di puncak punggungan pegunungan Garut.', tall: true },
  { id: 'gal-burayot', image: 'burayot.png', title: 'Kue Burayot Tradisional', category: 'Culinary', description: 'Kudapan manis legit dari tepung beras dan gula aren khas Leles.' },
  { id: 'gal-cangkuang', image: 'cangkuang.png', title: 'Candi Cangkuang & Kampung Pulo', category: 'Culture', description: 'Candi Hindu abad ke-8 di pulau kecil danau yang damai.' },
  { id: 'gal-cipanas', image: 'cipanas.png', title: 'Cipanas Garut', category: 'Nature', description: 'Kolam air hangat kaya belerang alami dari Gunung Guntur.' },
  { id: 'gal-sampireun', image: 'sampireun.png', title: 'Kampung Sampireun', category: 'Nature', description: 'Resor bernuansa romantis Sunda di atas danau tenang berkabut.' },
  { id: 'gal-chocodot', image: 'chocodot.png', title: 'Chocodot Indonesia', category: 'Culinary', description: 'Inovasi cokelat isi dodol Garut yang terkenal hingga mancanegara.' },
  { id: 'gal-streetfood', image: 'streetfood.png', title: 'Wisata Kuliner Malam', category: 'City', description: 'Deretan kuliner kaki lima menggugah selera di pusat kota Garut.' },
  { id: 'gal-rancabuaya', image: 'rancabuaya.png', title: 'Tebing Pantai Rancabuaya', category: 'Adventure', description: 'Deburan ombak Samudra Hindia menghantam tebing batu megah.', tall: true },
  { id: 'gal-kulit', image: 'craft.png', title: 'Kerajinan Kulit Sukaregang', category: 'City', description: 'Karya jaket, tas, dan sepatu kulit bermutu tinggi buatan pengrajin Garut.' },
  { id: 'gal-angklung', image: 'culture.png', title: 'Seni Musik & Tari Sunda', category: 'Culture', description: 'Harmoni suara angklung dan kendang pencak silat warisan leluhur.', tall: true },
  { id: 'gal-dodol', image: 'dodol.png', title: 'Dodol Garut Autentik', category: 'Culinary', description: 'Oleh-oleh manis ikonik yang telah ada sejak puluhan tahun silam.' },
]
