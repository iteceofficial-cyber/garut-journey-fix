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
  { image: 'hero.png', title: 'Garut Highland Sunrise', category: 'Nature', description: 'Kabut fajar menyelimuti hamparan teras sawah dan barisan gunung berapi Garut.' },
  { image: 'papandayan.png', title: 'Kawah Gunung Papandayan', category: 'Adventure', description: 'Menjelajahi kawah belerang aktif dan magisnya Hutan Mati.', tall: true },
  { image: 'sundanese.png', title: 'Pesta Nasi Liwet Sunda', category: 'Culinary', description: 'Disajikan hangat di atas daun pisang dengan sambal dadak dan lalapan segar.' },
  { image: 'community.png', title: 'Kehangatan Warga Lokal', category: 'Culture', description: 'Keramahan dan kehidupan pedesaan yang asri di pelosok Garut.', tall: true },
  { image: 'darajat.png', title: 'Darajat Pass Highland', category: 'Nature', description: 'Pemandian air panas alami di tengah sejuknya kebun teh berkabut.' },
  { image: 'basoaci.png', title: 'Baso Aci Garut Juara', category: 'Culinary', description: 'Pedas, kenyal, dan gurih rempah cikur yang melegenda.' },
  { image: 'bagendit.png', title: 'Pesona Situ Bagendit', category: 'Nature', description: 'Danau alami dengan pemandangan pegunungan dan rakit bambu santai.' },
  { image: 'citysquare.png', title: 'Alun-alun Garut', category: 'City', description: 'Pusat denyut kota dengan Masjid Agung dan suasana sore yang syahdu.' },
  { image: 'santolo.png', title: 'Pantai Santolo Selatan', category: 'Adventure', description: 'Bentang samudra lepas berpasir putih dan pulau karang eksotis.', tall: true },
  { image: 'hiking.png', title: 'Trekking di Atas Awan', category: 'Adventure', description: 'Mengejar matahari terbit di puncak punggungan pegunungan Garut.', tall: true },
  { image: 'burayot.png', title: 'Kue Burayot Tradisional', category: 'Culinary', description: 'Kudapan manis legit dari tepung beras dan gula aren khas Leles.' },
  { image: 'cangkuang.png', title: 'Candi Cangkuang & Kampung Pulo', category: 'Culture', description: 'Candi Hindu abad ke-8 di pulau kecil danau yang damai.' },
  { image: 'cipanas.png', title: 'Cipanas Garut', category: 'Nature', description: 'Kolam air hangat kaya belerang alami dari Gunung Guntur.' },
  { image: 'sampireun.png', title: 'Kampung Sampireun', category: 'Nature', description: 'Resor bernuansa romantis Sunda di atas danau tenang berkabut.' },
  { image: 'chocodot.png', title: 'Chocodot Indonesia', category: 'Culinary', description: 'Inovasi cokelat isi dodol Garut yang terkenal hingga mancanegara.' },
  { image: 'streetfood.png', title: 'Wisata Kuliner Malam', category: 'City', description: 'Deretan kuliner kaki lima menggugah selera di pusat kota Garut.' },
  { image: 'rancabuaya.png', title: 'Tebing Pantai Rancabuaya', category: 'Adventure', description: 'Deburan ombak Samudra Hindia menghantam tebing batu megah.', tall: true },
  { image: 'craft.png', title: 'Kerajinan Kulit Sukaregang', category: 'City', description: 'Karya jaket, tas, dan sepatu kulit bermutu tinggi buatan pengrajin Garut.' },
  { image: 'culture.png', title: 'Seni Musik & Tari Sunda', category: 'Culture', description: 'Harmoni suara angklung dan kendang pencak silat warisan leluhur.', tall: true },
  { image: 'dodol.png', title: 'Dodol Garut Autentik', category: 'Culinary', description: 'Oleh-oleh manis ikonik yang telah ada sejak puluhan tahun silam.' },
]
