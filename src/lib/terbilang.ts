/**
 * Convert number to Indonesian words (terbilang).
 * e.g. 1400000 -> 'Satu Juta Empat Ratus Ribu Rupiah'
 */
const SATUAN = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas']

export function angkaKeTerbilang(nilai: number): string {
  if (nilai === 0) return 'Nol Rupiah'
  const abs = Math.abs(Math.round(nilai))

  function konversi(n: number): string {
    if (n < 12) {
      return SATUAN[n]
    }
    if (n < 20) {
      return konversi(n - 10) + ' Belas'
    }
    if (n < 100) {
      return konversi(Math.floor(n / 10)) + ' Puluh ' + konversi(n % 10)
    }
    if (n < 200) {
      return 'Seratus ' + konversi(n - 100)
    }
    if (n < 1000) {
      return konversi(Math.floor(n / 100)) + ' Ratus ' + konversi(n % 100)
    }
    if (n < 2000) {
      return 'Seribu ' + konversi(n - 1000)
    }
    if (n < 1000000) {
      return konversi(Math.floor(n / 1000)) + ' Ribu ' + konversi(n % 1000)
    }
    if (n < 1000000000) {
      return konversi(Math.floor(n / 1000000)) + ' Juta ' + konversi(n % 1000000)
    }
    if (n < 1000000000000) {
      return konversi(Math.floor(n / 1000000000)) + ' Miliar ' + konversi(n % 1000000000)
    }
    return konversi(Math.floor(n / 1000000000000)) + ' Triliun ' + konversi(n % 1000000000000)
  }

  const hasil = konversi(abs).replace(/\s+/g, ' ').trim()
  return `${hasil} Rupiah`
}
