# Professional QR Attendance System

Sistem Manajemen Kehadiran Berbasis QR Code dengan Fitur Window-Based Precision.

## 🚀 Fitur Utama
- **QR Code Attendance**: Setiap user memiliki QR Code unik untuk dipindai di Scaner.
- **Dynamic Expiring QR**: QR Code dibekali *timestamp* otomatis yang akan kedaluwarsa dalam 60 detik untuk mencegah kecurangan (misal: titip absen via screenshot).
- **Window-Based Shifts**: Pembatasan waktu absen yang presisi (Jam Masuk & Jam Pulang yang bisa diatur window-nya).
- **Admin Dashboard**: Monitoring sistem, manajemen user, pengaturan jadwal, dan data rekap absen.
- **Professional CRUD**: Manajemen User dan Shift yang bersih dan responsif.
- **Scanner Mode**: Mode kamera khusus untuk stan absensi di kantor.

## 🛠️ Stack Teknologi
- **Backend**: Laravel 13 (PHP 8.5)
- **Frontend**: React + Inertia.js
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: MySQL
- **Real-time UI**: React-Toastify untuk notifikasi instan.

## 📁 Struktur Penting
- `app/Http/Controllers/ScannerController.php`: Jantung logika validasi absen.
- `database/migrations/*v2.php`: Struktur database terbaru yang profesional.
- `resources/js/pages/Scanner/Scan.tsx`: Implementasi  Scanner.

## 📋 Standar Kode
- **Clean Architecture**: Mengikuti standar Laravel (Controllers, Models, Migrations).
- **Consistent UI**: Menggunakan komponen yang dapat digunakan kembali (Reusable Components) seperti `DataTable` untuk menjaga keseragaman antar halaman. Diwajibkan untuk memanfaatkan komponen yang sudah ada untuk menjaga konsistensi, namun diperbolehkan membuat komponen baru jika diperlukan untuk fungsionalitas yang belum terakomodasi.
- **Frontend State**: Penggunaan `@inertiajs/react` untuk sinkronisasi state antara Backend dan Frontend tanpa reload halaman.
- **Naming Convention**: Menggunakan `camelCase` untuk Javascript/React dan `snake_case` untuk PHP/Database.

## 🔒 Standar Keamanan
- **Window-Based Validation**: Mencegah manipulasi waktu absen dengan membatasi scan hanya pada jam yang benar-benar aktif (Start & End Time).
- **Dynamic QR Expiration**: Server memvalidasi usia QR Code saat di-scan; jika umur QR lebih dari 60 detik, scan otomatis ditolak untuk menghindari manipulasi kode statis.
- **Daily Unique Constraint**: Mencegah duplikasi data absensi; sistem membatasi satu user hanya bisa memiliki satu baris data absensi per hari.
- **Middleware Protection**: Semua fitur admin dilindungi dengan middleware `role:admin` untuk mencegah akses tidak sah.
- **Input Validation**: Validasi ketat di sisi server untuk semua input form guna mencegah SQL Injection dan XSS.
- **Flash Protection**: Sinkronisasi pesan sukses/error yang aman antara Backend dan Frontend.

## 📝 Catatan Pengembangan
Sistem ini dirancang dengan fokus pada keamanan (mencegah manipulasi waktu) dan kemudahan penggunaan bagi Admin maupun Karyawan.
