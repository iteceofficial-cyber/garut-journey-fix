import * as XLSX from 'xlsx'
import type { Booking } from '@/lib/bookingsStorage'
import { formatRupiah } from '@/lib/bookingsStorage'

export interface ExportReportOptions {
  onlyPaid?: boolean
  statusFilter?: string
  dateRangeLabel?: string
}

export function exportBookingsToExcel(
  bookings: Booking[],
  options: ExportReportOptions = { onlyPaid: false }
) {
  // Filter bookings
  let list = [...bookings]
  if (options.onlyPaid) {
    list = list.filter((b) => b.paymentStatus === 'Lunas' || b.paymentStatus === 'Selesai')
  } else if (options.statusFilter && options.statusFilter !== 'All') {
    list = list.filter((b) => b.paymentStatus === options.statusFilter)
  }

  // Format timestamp for file name
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0]
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '')
  const filterType = options.onlyPaid ? 'Lunas_Sudah_Bayar' : 'Semua_Booking'
  const fileName = `Laporan_Pengunjung_Garut_Journey_${filterType}_${dateStr}_${timeStr}.xlsx`

  // Build rows data
  const rows = list.map((b, idx) => {
    const formattedCreated = b.createdAt ? new Date(b.createdAt).toLocaleString('id-ID') : '-'
    return {
      'No.': idx + 1,
      'Kode Booking': b.id,
      'Tanggal Dibuat': formattedCreated,
      'Nama Pengunjung': b.fullName,
      'No. WhatsApp': b.whatsapp,
      'Email': b.email || '-',
      'Paket / Tour': b.packageOrTour,
      'Tgl Kedatangan': b.arrivalDate || '-',
      'Tgl Trip': b.travelDate || '-',
      'Jam Pertemuan': b.meetingTime || '-',
      'Titik Kumpul (Meeting Point)': b.meetingPoint || '-',
      'Jml Peserta (Orang)': b.travelers,
      'Metode Pembayaran': b.paymentMethod,
      'Total Bayar (IDR)': b.totalPrice,
      'Status Pembayaran': b.paymentStatus,
      'Catatan': b.notes || '-',
    }
  })

  // Summary row
  const totalRevenue = list.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
  const totalTravelers = list.reduce((sum, b) => sum + (b.travelers || 0), 0)

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows)

  // Calculate column widths
  const colWidths = [
    { wch: 6 },  // No
    { wch: 16 }, // Kode Booking
    { wch: 20 }, // Tanggal Dibuat
    { wch: 24 }, // Nama
    { wch: 18 }, // WA
    { wch: 24 }, // Email
    { wch: 32 }, // Paket
    { wch: 16 }, // Kedatangan
    { wch: 16 }, // Trip
    { wch: 22 }, // Jam
    { wch: 34 }, // Titik Kumpul
    { wch: 18 }, // Peserta
    { wch: 22 }, // Metode
    { wch: 18 }, // Total
    { wch: 20 }, // Status
    { wch: 35 }, // Catatan
  ]
  worksheet['!cols'] = colWidths

  // Append summary row at bottom
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      [],
      ['RINGKASAN LAPORAN:'],
      ['Total Transaksi:', list.length, 'Data'],
      ['Total Jumlah Pengunjung:', totalTravelers, 'Orang'],
      ['Total Penerimaan / Omzet:', formatRupiah(totalRevenue)],
      ['Waktu Export:', new Date().toLocaleString('id-ID')],
    ],
    { origin: -1 }
  )

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Pengunjung')

  // Trigger download
  XLSX.writeFile(workbook, fileName)
  return { success: true, count: list.length, totalRevenue, fileName }
}

export function exportBookingsToCSV(
  bookings: Booking[],
  options: ExportReportOptions = { onlyPaid: false }
) {
  let list = [...bookings]
  if (options.onlyPaid) {
    list = list.filter((b) => b.paymentStatus === 'Lunas' || b.paymentStatus === 'Selesai')
  } else if (options.statusFilter && options.statusFilter !== 'All') {
    list = list.filter((b) => b.paymentStatus === options.statusFilter)
  }

  const headers = [
    'No',
    'Kode Booking',
    'Tanggal Dibuat',
    'Nama Pengunjung',
    'WhatsApp',
    'Email',
    'Paket Tour',
    'Tanggal Kedatangan',
    'Tanggal Trip',
    'Jam Pertemuan',
    'Titik Kumpul',
    'Jumlah Peserta',
    'Metode Pembayaran',
    'Total Bayar (IDR)',
    'Status Pembayaran',
    'Catatan',
  ]

  const csvRows = list.map((b, idx) => {
    const formattedCreated = b.createdAt ? new Date(b.createdAt).toLocaleString('id-ID') : '-'
    return [
      idx + 1,
      `"${b.id}"`,
      `"${formattedCreated}"`,
      `"${(b.fullName || '').replace(/"/g, '""')}"`,
      `"${(b.whatsapp || '').replace(/"/g, '""')}"`,
      `"${(b.email || '').replace(/"/g, '""')}"`,
      `"${(b.packageOrTour || '').replace(/"/g, '""')}"`,
      `"${b.arrivalDate || ''}"`,
      `"${b.travelDate || ''}"`,
      `"${(b.meetingTime || '').replace(/"/g, '""')}"`,
      `"${(b.meetingPoint || '').replace(/"/g, '""')}"`,
      b.travelers,
      `"${(b.paymentMethod || '').replace(/"/g, '""')}"`,
      b.totalPrice,
      `"${b.paymentStatus}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
    ].join(',')
  })

  const csvContent = '\uFEFF' + [headers.join(','), ...csvRows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0]
  link.setAttribute('href', url)
  link.setAttribute('download', `Laporan_Pengunjung_Garut_Journey_${dateStr}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
