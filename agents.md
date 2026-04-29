# Professional QR Attendance System

Sistem Manajemen Kehadiran Berbasis QR Code dengan Fitur Window-Based Precision dan Real-Time Synchronization.

## 🚀 Fitur Utama
- **QR Code Attendance**: Setiap user memiliki QR Code unik untuk dipindai di Scaner.
- **Dynamic Expiring QR**: QR Code dibekali *timestamp* otomatis yang akan kedaluwarsa dalam 60 detik. Dilengkapi fitur **Auto-Regenerate** di sisi klien menggunakan Inertia Partial Reload dan Sinkronisasi `localStorage` sehingga QR Code memperbarui dirinya sendiri tanpa perlu refresh halaman manual.
- **Window-Based Shifts**: Pembatasan waktu absen yang presisi (Jam Masuk & Jam Pulang yang bisa diatur window-nya).
- **Admin Dashboard**: Monitoring sistem, manajemen user, pengaturan jadwal, dan data rekap absen secara **Real-Time**. Tabel absen ter-update otomatis ketika ada *scan* baru menggunakan WebSockets.
- **Professional CRUD**: Manajemen User dan Shift yang bersih dan responsif.
- **Scanner Mode**: Mode kamera khusus untuk stan absensi di kantor.

## 🛠️ Stack Teknologi
- **Backend**: Laravel 13 (PHP 8.5)
- **Real-Time Server**: Laravel Reverb (WebSockets)
- **Frontend**: React + Inertia.js + `@laravel/echo-react`
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: MySQL
- **Notifications**: React-Toastify untuk notifikasi instan.

## 📁 Struktur Penting
- `app/Http/Controllers/ScannerController.php`: Jantung logika validasi absen.
- `app/Events/AttendanceScanned.php`: Event class untuk mendistribusikan data absen ke public channel secara real-time.
- `database/migrations/*v2.php`: Struktur database terbaru yang profesional.
- `resources/js/pages/Scanner/Scan.tsx`: Implementasi Scanner.
- `IMPLEMENTATION_REALTIME.md` & `IMPLEMENTATION_QR_REALTIME.md`: Referensi dokumentasi terkait fitur WebSockets dan Auto-Regenerate QR.

## 📋 Standar Kode
- **Clean Architecture**: Mengikuti standar Laravel (Controllers, Models, Migrations).
- **Consistent UI**: Menggunakan komponen yang dapat digunakan kembali (Reusable Components) seperti `DataTable` untuk menjaga keseragaman antar halaman. Diwajibkan untuk memanfaatkan komponen yang sudah ada untuk menjaga konsistensi.
- **Frontend State**: Penggunaan `@inertiajs/react` untuk sinkronisasi state antara Backend dan Frontend. Mengutamakan *Partial Reload* (`router.reload`) dibandingkan manipulasi *state array* manual untuk pembaruan data real-time.
- **Naming Convention**: Menggunakan `camelCase` untuk Javascript/React dan `snake_case` untuk PHP/Database.

## 🔒 Standar Keamanan
- **Window-Based Validation**: Mencegah manipulasi waktu absen dengan membatasi scan hanya pada jam yang benar-benar aktif (Start & End Time).
- **Dynamic QR Expiration**: Server memvalidasi usia QR Code saat di-scan (maksimal 60 detik).
- **Daily Unique Constraint**: Mencegah duplikasi data absensi per hari.
- **Middleware Protection**: Semua fitur admin dilindungi dengan middleware `role:admin`.
- **Input Validation**: Validasi ketat di sisi server untuk semua input form guna mencegah SQL Injection dan XSS.
- **Flash Protection**: Sinkronisasi pesan sukses/error yang aman antara Backend dan Frontend.

## 📝 Catatan Pengembangan
Sistem ini dirancang dengan fokus pada keamanan tingkat tinggi, *real-time monitoring*, dan kemudahan penggunaan (UX yang dinamis dan tidak merepotkan).
