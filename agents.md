# Professional QR Attendance System

Sistem Manajemen Kehadiran Berbasis QR Code dengan Fitur Window-Based Precision.

## 🚀 Fitur Utama
- **QR Code Attendance**: Setiap user memiliki QR Code unik untuk dipindai di Kiosk.
- **Window-Based Shifts**: Pembatasan waktu absen yang presisi (Jam Masuk & Jam Pulang yang bisa diatur window-nya).
- **Admin Dashboard**: Monitoring sistem, manajemen user, dan pengaturan jadwal.
- **Professional CRUD**: Manajemen User dan Shift yang bersih dan responsif.
- **Kiosk Scanner**: Mode kamera khusus untuk stan absensi di kantor.

## 🛠️ Stack Teknologi
- **Backend**: Laravel 13 (PHP 8.5)
- **Frontend**: React + Inertia.js
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: MySQL
- **Real-time UI**: React-Toastify untuk notifikasi instan.

## 📁 Struktur Penting
- `app/Http/Controllers/ScannerController.php`: Jantung logika validasi absen.
- `database/migrations/*v2.php`: Struktur database terbaru yang profesional.
- `resources/js/pages/Scanner/Scan.tsx`: Implementasi Kiosk Scanner.

## 📋 Standar Kode
- **Clean Architecture**: Mengikuti standar Laravel (Controllers, Models, Migrations).
- **Consistent UI**: Menggunakan komponen yang dapat digunakan kembali (Reusable Components) seperti `DataTable` untuk menjaga keseragaman antar halaman.
- **Frontend State**: Penggunaan `@inertiajs/react` untuk sinkronisasi state antara Backend dan Frontend tanpa reload halaman.
- **Naming Convention**: Menggunakan `camelCase` untuk Javascript/React dan `snake_case` untuk PHP/Database.

## 🔒 Standar Keamanan
- **Window-Based Validation**: Mencegah manipulasi waktu absen dengan membatasi scan hanya pada jam yang benar-benar aktif (Start & End Time).
- **Daily Unique Constraint**: Mencegah duplikasi data absensi; sistem membatasi satu user hanya bisa memiliki satu baris data absensi per hari.
- **Middleware Protection**: Semua fitur admin dilindungi dengan middleware `role:admin` untuk mencegah akses tidak sah.
- **Input Validation**: Validasi ketat di sisi server untuk semua input form guna mencegah SQL Injection dan XSS.
- **Flash Protection**: Sinkronisasi pesan sukses/error yang aman antara Backend dan Frontend.

## 📝 Catatan Pengembangan
Sistem ini dirancang dengan fokus pada keamanan (mencegah manipulasi waktu) dan kemudahan penggunaan bagi Admin maupun Karyawan.
