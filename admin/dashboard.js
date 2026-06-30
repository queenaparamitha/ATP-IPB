// ============================================
// MASTER DATA
// ============================================

let masterRuangan = ['R.Meeting', 'R. VIP', 'Balai Rakyat/BRI', 'Guest House'];
let masterTempat = ['STP', 'ATP', 'TNC'];
let masterPic = ['Novi Putri Jelita S.Pi', 'Isti Rahmani S.P', 'Winda Oktaviona S.K.Pm', 'Pandu Pamungkas S.Si'];
let masterInstansi = ['Mahasiswa', 'Guru', 'Dosen', 'Masyarakat', 'Instansi Pemerintah', 'Perusahaan Swasta', 'Siswa'];

// ============================================
// DATA JADWAL (4 Jenis)
// ============================================

// 1. Data Jadwal Kunjungan (dengan jumlahPengunjung)
let kunjunganData = [
    
];
let nextKunjunganId = 3;

// 2. Data Jadwal Pemakaian Ruang
let ruangData = [
    
];
let nextRuangId = 2;

// 3. Data Jadwal Balai BRI
let balaiData = [];
let nextBalaiId = 1;

// 4. Data Jadwal Per Program
let programData = [
    
];
let nextProgramId = 2;

// ============================================
// DATA EVENT KALENDER
// ============================================
let eventData = [];
let nextEventId = 1;

// ============================================
// DATA CAPAIAN PENGUNJUNG (Dengan Kategori)
// ============================================
let capaianData = [
    { bulan: 'Jan', jumlah: 120, target: 200, mahasiswa: 54, dosen: 30, umum: 24, instansi: 12 },
    { bulan: 'Feb', jumlah: 150, target: 200, mahasiswa: 67, dosen: 37, umum: 30, instansi: 16 },
    { bulan: 'Mar', jumlah: 180, target: 200, mahasiswa: 81, dosen: 45, umum: 36, instansi: 18 },
    { bulan: 'Apr', jumlah: 170, target: 200, mahasiswa: 76, dosen: 42, umum: 34, instansi: 18 },
    { bulan: 'Mei', jumlah: 200, target: 200, mahasiswa: 90, dosen: 50, umum: 40, instansi: 20 },
    { bulan: 'Jun', jumlah: 220, target: 200, mahasiswa: 99, dosen: 55, umum: 44, instansi: 22 },
    { bulan: 'Jul', jumlah: 190, target: 200, mahasiswa: 85, dosen: 47, umum: 38, instansi: 20 },
    { bulan: 'Agu', jumlah: 210, target: 200, mahasiswa: 94, dosen: 52, umum: 42, instansi: 22 },
    { bulan: 'Sep', jumlah: 240, target: 200, mahasiswa: 108, dosen: 60, umum: 48, instansi: 24 },
    { bulan: 'Okt', jumlah: 260, target: 200, mahasiswa: 117, dosen: 65, umum: 52, instansi: 26 },
    { bulan: 'Nov', jumlah: 230, target: 200, mahasiswa: 103, dosen: 57, umum: 46, instansi: 24 },
    { bulan: 'Des', jumlah: 280, target: 200, mahasiswa: 126, dosen: 70, umum: 56, instansi: 28 },
];

// ============================================
// DATA CAPAIAN MINGGUAN (Dari Jadwal Kunjungan)
// ============================================
let capaianMingguanData = [];

// ============================================
// FUNGSI UNTUK GRAFIK
// ============================================
function getMonthlyData() {
    return {
        labels: capaianData.map(d => d.bulan),
        values: capaianData.map(d => d.jumlah)
    };
}

function getWeeklyData() {
    const weekLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const weekValues = [0, 0, 0, 0, 0, 0, 0];
    
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay() || 7;
    startOfWeek.setDate(now.getDate() - day + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    capaianMingguanData.forEach(item => {
        const date = new Date(item.tanggal);
        if (date >= startOfWeek && date <= endOfWeek) {
            const dayIndex = date.getDay() || 7;
            weekValues[dayIndex - 1] += item.jumlah;
        }
    });
    
    return {
        labels: weekLabels,
        values: weekValues
    };
}

function getYearlyData() {
    const tahunData = {
        labels: ['2022', '2023', '2024', '2025', '2026'],
        values: []
    };
    
    let total2026 = 0;
    capaianData.forEach(item => {
        total2026 += item.jumlah || 0;
    });
    
    const tahunList = [2022, 2023, 2024, 2025, 2026];
    const baseValue = Math.round(total2026 / 12);
    
    tahunData.labels = tahunList.map(t => String(t));
    tahunData.values = tahunList.map(t => {
        if (t === 2026) return total2026;
        const yearIndex = tahunList.indexOf(t);
        const growthFactor = 1 + (yearIndex * 0.15);
        return Math.round(baseValue * 6 * growthFactor);
    });
    
    console.log('📊 Data Tahunan:', tahunData);
    return tahunData;
}

function getDataByPeriod(period) {
    console.log('📊 Get data period:', period);
    switch(period) {
        case 'mingguan': return getWeeklyData();
        case 'bulanan': return getMonthlyData();
        case 'tahunan': return getYearlyData();
        default: return getMonthlyData();
    }
}

// ============================================
// DATA UNTUK GRAFIK PIE
// ============================================
function getPieData() {
    let totalMahasiswa = 0, totalDosen = 0, totalUmum = 0, totalInstansi = 0;
    capaianData.forEach(item => {
        totalMahasiswa += item.mahasiswa || 0;
        totalDosen += item.dosen || 0;
        totalUmum += item.umum || 0;
        totalInstansi += item.instansi || 0;
    });
    const total = totalMahasiswa + totalDosen + totalUmum + totalInstansi;
    if (total === 0) {
        return { labels: ['Belum ada data'], values: [1], colors: ['#e0e0e0'] };
    }
    const labels = ['Mahasiswa', 'Dosen', 'Umum', 'Instansi'];
    const values = [totalMahasiswa, totalDosen, totalUmum, totalInstansi];
    const colors = ['#1a237e', '#3949ab', '#5c6bc0', '#9fa8da'];
    const filteredLabels = [], filteredValues = [], filteredColors = [];
    for (let i = 0; i < labels.length; i++) {
        if (values[i] > 0) {
            filteredLabels.push(labels[i]);
            filteredValues.push(values[i]);
            filteredColors.push(colors[i]);
        }
    }
    return {
        labels: filteredLabels.length > 0 ? filteredLabels : ['Belum ada data'],
        values: filteredLabels.length > 0 ? filteredValues : [1],
        colors: filteredLabels.length > 0 ? filteredColors : ['#e0e0e0'],
        total: total
    };
}

// ============================================
// SINKRONISASI KUNJUNGAN KE CAPAIAN MINGGUAN
// ============================================
function sinkronkanKunjunganKeCapaian() {
    capaianMingguanData = [];
    const dataKunjungan = kunjunganData.filter(item => item.jumlahPengunjung && item.jumlahPengunjung > 0);
    dataKunjungan.forEach(item => {
        const existing = capaianMingguanData.find(d => d.tanggal === item.tanggal && d.instansi === item.instansi);
        if (existing) {
            existing.jumlah += item.jumlahPengunjung;
        } else {
            capaianMingguanData.push({
                tanggal: item.tanggal,
                instansi: item.instansi,
                jumlah: item.jumlahPengunjung,
                pic: item.pic,
                nama: item.nama
            });
        }
    });
    updateCapaianBulanan();
    updateAllCharts();
}

function updateCapaianBulanan() {
    const bulanMap = {};
    const bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    capaianMingguanData.forEach(item => {
        const tanggal = new Date(item.tanggal);
        const bulan = bulanNames[tanggal.getMonth()];
        const instansi = item.instansi;
        if (!bulanMap[bulan]) {
            bulanMap[bulan] = { total: 0, mahasiswa: 0, dosen: 0, umum: 0, instansi: 0 };
        }
        bulanMap[bulan].total += item.jumlah;
        if (instansi === 'Mahasiswa' || instansi === 'mahasiswa') {
            bulanMap[bulan].mahasiswa += item.jumlah;
        } else if (instansi === 'Dosen' || instansi === 'dosen') {
            bulanMap[bulan].dosen += item.jumlah;
        } else if (instansi === 'Umum' || instansi === 'umum' || instansi === 'Masyarakat' || instansi === 'masyarakat') {
            bulanMap[bulan].umum += item.jumlah;
        } else {
            bulanMap[bulan].instansi += item.jumlah;
        }
    });
    capaianData = capaianData.map(item => {
        const bulanData = bulanMap[item.bulan];
        if (bulanData && bulanData.total > 0) {
            return {
                ...item,
                jumlah: Math.max(item.jumlah, bulanData.total),
                mahasiswa: Math.max(item.mahasiswa || 0, bulanData.mahasiswa),
                dosen: Math.max(item.dosen || 0, bulanData.dosen),
                umum: Math.max(item.umum || 0, bulanData.umum),
                instansi: Math.max(item.instansi || 0, bulanData.instansi)
            };
        }
        return item;
    });
}

// ============================================
// LOCALSTORAGE - DENGAN CEK DATA MASTER
// ============================================
function simpanSemuaData() {
    try {
        localStorage.setItem('masterRuangan', JSON.stringify(masterRuangan));
        localStorage.setItem('masterTempat', JSON.stringify(masterTempat));
        localStorage.setItem('masterPic', JSON.stringify(masterPic));
        localStorage.setItem('masterInstansi', JSON.stringify(masterInstansi));
        localStorage.setItem('kunjunganData', JSON.stringify(kunjunganData));
        localStorage.setItem('ruangData', JSON.stringify(ruangData));
        localStorage.setItem('balaiData', JSON.stringify(balaiData));
        localStorage.setItem('programData', JSON.stringify(programData));
        localStorage.setItem('eventData', JSON.stringify(eventData));
        localStorage.setItem('capaianData', JSON.stringify(capaianData));
        localStorage.setItem('capaianMingguanData', JSON.stringify(capaianMingguanData));
        localStorage.setItem('nextKunjunganId', String(nextKunjunganId));
        localStorage.setItem('nextRuangId', String(nextRuangId));
        localStorage.setItem('nextBalaiId', String(nextBalaiId));
        localStorage.setItem('nextProgramId', String(nextProgramId));
        localStorage.setItem('nextEventId', String(nextEventId));
        console.log('💾 Data disimpan ke localStorage');
    } catch (e) {
        console.log('Gagal menyimpan data:', e);
    }
}

function muatSemuaData() {
    try {
        const savedRuangan = localStorage.getItem('masterRuangan');
        const savedTempat = localStorage.getItem('masterTempat');
        const savedPic = localStorage.getItem('masterPic');
        const savedInstansi = localStorage.getItem('masterInstansi');
        const savedKunjungan = localStorage.getItem('kunjunganData');
        const savedRuang = localStorage.getItem('ruangData');
        const savedBalai = localStorage.getItem('balaiData');
        const savedProgram = localStorage.getItem('programData');
        const savedEvent = localStorage.getItem('eventData');
        const savedCapaian = localStorage.getItem('capaianData');
        const savedCapaianMingguan = localStorage.getItem('capaianMingguanData');
        const savedNextKunjunganId = localStorage.getItem('nextKunjunganId');
        const savedNextRuangId = localStorage.getItem('nextRuangId');
        const savedNextBalaiId = localStorage.getItem('nextBalaiId');
        const savedNextProgramId = localStorage.getItem('nextProgramId');
        const savedNextEventId = localStorage.getItem('nextEventId');

        if (savedRuangan) masterRuangan = JSON.parse(savedRuangan);
        if (savedTempat) masterTempat = JSON.parse(savedTempat);
        if (savedPic) masterPic = JSON.parse(savedPic);
        if (savedInstansi) masterInstansi = JSON.parse(savedInstansi);
        if (savedKunjungan) kunjunganData = JSON.parse(savedKunjungan);
        if (savedRuang) ruangData = JSON.parse(savedRuang);
        if (savedBalai) balaiData = JSON.parse(savedBalai);
        if (savedProgram) programData = JSON.parse(savedProgram);
        if (savedEvent) eventData = JSON.parse(savedEvent);
        if (savedCapaian) capaianData = JSON.parse(savedCapaian);
        if (savedCapaianMingguan) capaianMingguanData = JSON.parse(savedCapaianMingguan);
        if (savedNextKunjunganId) nextKunjunganId = parseInt(savedNextKunjunganId) || 3;
        if (savedNextRuangId) nextRuangId = parseInt(savedNextRuangId) || 2;
        if (savedNextBalaiId) nextBalaiId = parseInt(savedNextBalaiId) || 1;
        if (savedNextProgramId) nextProgramId = parseInt(savedNextProgramId) || 2;
        if (savedNextEventId) nextEventId = parseInt(savedNextEventId) || 1;
    } catch (e) {
        console.log('Gagal memuat data:', e);
    }
}

// ============================================
// SINKRONISASI JADWAL KE KALENDER
// ============================================
function sinkronkanJadwalKeKalender() {
    eventData = eventData.filter(e => !e.dariJadwal);

    kunjunganData.forEach(item => {
        if (item.tanggal) {
            const parts = item.tanggal.split('-');
            const tgl = parseInt(parts[2]);
            const bln = parseInt(parts[1]);
            const thn = parseInt(parts[0]);
            eventData.push({
                id: nextEventId++,
                tanggal: tgl,
                bulan: bln,
                tahun: thn,
                nama: `📋 ${item.nama}`,
                waktu: item.waktu,
                ruangan: item.ruangan || '-',
                tempat: item.instansi || '-',
                pic: item.pic,
                dariJadwal: true,
                sumber: 'Kunjungan',
                sumberId: item.id
            });
        }
    });

    ruangData.forEach(item => {
        if (item.tanggal) {
            const parts = item.tanggal.split('-');
            const tgl = parseInt(parts[2]);
            const bln = parseInt(parts[1]);
            const thn = parseInt(parts[0]);
            eventData.push({
                id: nextEventId++,
                tanggal: tgl,
                bulan: bln,
                tahun: thn,
                nama: `🏢 ${item.kegiatan}`,
                waktu: item.waktu,
                ruangan: item.ruangan,
                tempat: item.ruangan,
                pic: item.pic,
                dariJadwal: true,
                sumber: 'Pemakaian Ruang',
                sumberId: item.id
            });
        }
    });

    balaiData.forEach(item => {
        if (item.tanggal) {
            const parts = item.tanggal.split('-');
            const tgl = parseInt(parts[2]);
            const bln = parseInt(parts[1]);
            const thn = parseInt(parts[0]);
            eventData.push({
                id: nextEventId++,
                tanggal: tgl,
                bulan: bln,
                tahun: thn,
                nama: `🏛️ ${item.kegiatan}`,
                waktu: item.waktu,
                ruangan: item.ruangan,
                tempat: item.ruangan,
                pic: item.pic,
                dariJadwal: true,
                sumber: 'Balai BRI',
                sumberId: item.id
            });
        }
    });

    programData.forEach(item => {
        if (item.tanggal) {
            const parts = item.tanggal.split('-');
            const tgl = parseInt(parts[2]);
            const bln = parseInt(parts[1]);
            const thn = parseInt(parts[0]);
            eventData.push({
                id: nextEventId++,
                tanggal: tgl,
                bulan: bln,
                tahun: thn,
                nama: `📊 ${item.program}`,
                waktu: item.waktu,
                ruangan: item.lokasi || '-',
                tempat: item.lokasi || '-',
                pic: item.pic,
                dariJadwal: true,
                sumber: 'Per Program',
                sumberId: item.id
            });
        }
    });

    renderCalendar(currentMonth, currentYear);
    renderCalendarFull(currentMonthFull, currentYearFull);
    renderDashboardEvents();
    simpanSemuaData();
}

// ============================================
// SIDEBAR TOGGLE
// ============================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const hamburger = document.getElementById('hamburgerBtn');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
    if (window.innerWidth <= 768) {
        sidebar.style.transform = sidebar.classList.contains('open') ? 'translateX(0)' : 'translateX(-100%)';
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const hamburger = document.getElementById('hamburgerBtn');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    if (window.innerWidth <= 768) {
        sidebar.style.transform = 'translateX(-100%)';
    }
}

document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburgerBtn');
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            closeSidebar();
        }
    }
});

window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
        sidebar.style.transform = '';
        sidebar.classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
        document.getElementById('hamburgerBtn').classList.remove('active');
    } else {
        if (!sidebar.classList.contains('open')) {
            sidebar.style.transform = 'translateX(-100%)';
        }
    }
});

// ============================================
// NAVIGASI
// ============================================
const pageTitles = {
    dashboard: { title: 'Dashboard', subtitle: 'Selamat datang, Admin 👋' },
    jadwal: { title: 'Jadwal Harian', subtitle: 'Kelola semua jadwal kegiatan' },
    kalender: { title: 'Kalender Kegiatan', subtitle: 'Kelola event per tanggal' },
    capaian: { title: 'Capaian Pengunjung', subtitle: 'Kelola data capaian pengunjung' },
    laporan: { title: 'Laporan', subtitle: 'Download laporan lengkap' },
};

function switchMenu(page) {
    const link = document.querySelector(`.menu a[data-page="${page}"]`);
    if (link) link.click();
}

function switchTab(tab) {
    setTimeout(() => {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
        if (tabBtn) tabBtn.click();
    }, 200);
}

document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
        const page = this.dataset.page;
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) targetPage.classList.add('active');
        const titleData = pageTitles[page] || pageTitles.dashboard;
        document.getElementById('pageTitle').textContent = titleData.title;
        document.getElementById('pageSubtitle').textContent = titleData.subtitle;
        if (window.innerWidth <= 768) closeSidebar();
        if (page === 'capaian') {
            setTimeout(() => {
                renderCapaianTable();
                updateAllCharts();
            }, 100);
        }
        if (page === 'kalender') {
            setTimeout(() => {
                renderCalendarFull(currentMonthFull, currentYearFull);
            }, 100);
        }
        if (page === 'jadwal') {
            renderKunjunganTable();
            renderRuangTable();
            renderBalaiTable();
            renderProgramTable();
            updateDropdowns();
        }
        if (page === 'laporan') setTimeout(generateLaporan, 100);
    });
});

// ============================================
// FUNGSI UPDATE DROPDOWN
// ============================================
function updateDropdowns() {
    const ruanganSelects = document.querySelectorAll('#fRuangan, #eventRuangan');
    ruanganSelects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = '<option value="">Pilih Ruangan</option>';
        masterRuangan.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            select.appendChild(opt);
        });
        if (currentVal && masterRuangan.includes(currentVal)) {
            select.value = currentVal;
        }
    });
    const tempatSelects = document.querySelectorAll('#fTempat, #eventTempat');
    tempatSelects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = '<option value="">Pilih Tempat</option>';
        masterTempat.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            select.appendChild(opt);
        });
        if (currentVal && masterTempat.includes(currentVal)) {
            select.value = currentVal;
        }
    });
    const picSelects = document.querySelectorAll('#fPic, #eventPic');
    picSelects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = '<option value="">Pilih PIC</option>';
        masterPic.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            select.appendChild(opt);
        });
        if (currentVal && masterPic.includes(currentVal)) {
            select.value = currentVal;
        }
    });
    const instansiSelects = document.querySelectorAll('#fInstansi');
    instansiSelects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = '<option value="">Pilih Instansi</option>';
        masterInstansi.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            select.appendChild(opt);
        });
        if (currentVal && masterInstansi.includes(currentVal)) {
            select.value = currentVal;
        }
    });
}

// ============================================
// TAB NAVIGASI JADWAL
// ============================================
let currentTab = 'kunjungan';

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tab}`).classList.add('active');
    renderJadwalTab(tab);
}

function renderJadwalTab(tab) {
    switch(tab) {
        case 'kunjungan': renderKunjunganTable(); break;
        case 'ruang': renderRuangTable(); break;
        case 'balai': renderBalaiTable(); break;
        case 'program': renderProgramTable(); break;
        default: break;
    }
}

// ============================================
// RENDER TABEL KUNJUNGAN
// ============================================
function renderKunjunganTable() {
    const tbody = document.getElementById('kunjunganTableBody');
    if (!tbody) return;
    if (kunjunganData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#888;padding:20px;">Belum ada data kunjungan</td></tr>`;
        return;
    }
    tbody.innerHTML = kunjunganData.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${item.nama || '-'}</strong></td>
            <td>${item.instansi || '-'}</td>
            <td>${item.tanggal || '-'}</td>
            <td>${item.waktu || '-'}</td>
            <td>${item.jumlahPengunjung || 0}</td>
            <td>${item.tujuan || '-'}</td>
            <td>${item.pic || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editJadwal('kunjungan', ${item.id})">✏️</button>
                <button style="background:#f44336;color:#fff;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;" onclick="hapusJadwal('kunjungan', ${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// RENDER TABEL PEMAKAIAN RUANG
// ============================================
function renderRuangTable() {
    const tbody = document.getElementById('ruangTableBody');
    tbody.innerHTML = ruangData.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${item.kegiatan}</strong></td>
            <td>${item.ruangan}</td>
            <td>${item.tanggal}</td>
            <td>${item.waktu}</td>
            <td>${item.kapasitas} orang</td>
            <td>${item.pic}</td>
            <td>
                <button class="btn-edit" onclick="editJadwal('ruang', ${item.id})">✏️</button>
                <button style="background:#f44336;color:#fff;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;" onclick="hapusJadwal('ruang', ${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// RENDER TABEL BALAI BRI
// ============================================
function renderBalaiTable() {
    const tbody = document.getElementById('balaiTableBody');
    tbody.innerHTML = balaiData.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${item.kegiatan}</strong></td>
            <td>${item.jenis}</td>
            <td>${item.tanggal}</td>
            <td>${item.waktu}</td>
            <td>${item.ruangan}</td>
            <td>${item.pic}</td>
            <td>
                <button class="btn-edit" onclick="editJadwal('balai', ${item.id})">✏️</button>
                <button style="background:#f44336;color:#fff;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;" onclick="hapusJadwal('balai', ${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// RENDER TABEL PER PROGRAM
// ============================================
function renderProgramTable() {
    const tbody = document.getElementById('programTableBody');
    tbody.innerHTML = programData.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${item.program}</strong></td>
            <td>${item.kegiatan}</td>
            <td>${item.tanggal}</td>
            <td>${item.waktu}</td>
            <td>${item.lokasi}</td>
            <td>${item.pic}</td>
            <td>
                <button class="btn-edit" onclick="editJadwal('program', ${item.id})">✏️</button>
                <button style="background:#f44336;color:#fff;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;" onclick="hapusJadwal('program', ${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// RINGKASAN 4 JADWAL DI BERANDA
// ============================================
function renderRingkasanJadwal() {
    const today = new Date().toISOString().split('T')[0];
    console.log('📋 Render Ringkasan - Hari ini:', today);

    const kunjunganHariIni = kunjunganData.filter(item => item.tanggal === today);
    const tbodyKunjungan = document.getElementById('ringkasanKunjungan');
    if (tbodyKunjungan) {
        if (kunjunganHariIni.length === 0) {
            tbodyKunjungan.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#888;padding:10px;">Tidak ada kunjungan hari ini</td></tr>`;
        } else {
            tbodyKunjungan.innerHTML = kunjunganHariIni.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.nama || '-'}</strong></td>
                    <td>${item.waktu || '-'}</td>
                    <td>${item.pic || '-'}</td>
                </tr>
            `).join('');
        }
    }

    const ruangHariIni = ruangData.filter(item => item.tanggal === today);
    const tbodyRuang = document.getElementById('ringkasanRuang');
    if (tbodyRuang) {
        if (ruangHariIni.length === 0) {
            tbodyRuang.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#888;padding:10px;">Tidak ada pemakaian ruang hari ini</td></tr>`;
        } else {
            tbodyRuang.innerHTML = ruangHariIni.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.kegiatan || '-'}</strong></td>
                    <td>${item.waktu || '-'}</td>
                    <td>${item.ruangan || '-'}</td>
                </tr>
            `).join('');
        }
    }

    const balaiHariIni = balaiData.filter(item => item.tanggal === today);
    const tbodyBalai = document.getElementById('ringkasanBalai');
    if (tbodyBalai) {
        if (balaiHariIni.length === 0) {
            tbodyBalai.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#888;padding:10px;">Tidak ada kegiatan Balai BRI hari ini</td></tr>`;
        } else {
            tbodyBalai.innerHTML = balaiHariIni.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.kegiatan || '-'}</strong></td>
                    <td>${item.waktu || '-'}</td>
                    <td>${item.ruangan || '-'}</td>
                </tr>
            `).join('');
        }
    }

    const programHariIni = programData.filter(item => item.tanggal === today);
    const tbodyProgram = document.getElementById('ringkasanProgram');
    if (tbodyProgram) {
        if (programHariIni.length === 0) {
            tbodyProgram.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#888;padding:10px;">Tidak ada kegiatan program hari ini</td></tr>`;
        } else {
            tbodyProgram.innerHTML = programHariIni.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.program || '-'}</strong></td>
                    <td>${item.waktu || '-'}</td>
                    <td>${item.lokasi || '-'}</td>
                </tr>
            `).join('');
        }
    }
    updateStats();
}

// ============================================
// CRUD JADWAL
// ============================================
function hapusJadwal(jenis, id) {
    if (confirm('Yakin ingin menghapus jadwal ini?')) {
        switch(jenis) {
            case 'kunjungan': kunjunganData = kunjunganData.filter(d => d.id !== id); renderKunjunganTable(); break;
            case 'ruang': ruangData = ruangData.filter(d => d.id !== id); renderRuangTable(); break;
            case 'balai': balaiData = balaiData.filter(d => d.id !== id); renderBalaiTable(); break;
            case 'program': programData = programData.filter(d => d.id !== id); renderProgramTable(); break;
            default: return;
        }
        renderRingkasanJadwal();
        sinkronkanJadwalKeKalender();
        sinkronkanKunjunganKeCapaian();
        simpanSemuaData();
        alert('✅ Jadwal berhasil dihapus!');
    }
}

function hapusJadwalFromModal() {
    const id = document.getElementById('jadwalId').value;
    const jenis = document.getElementById('jadwalJenis').value || document.getElementById('formJenis').value;
    if (!id) return;
    if (confirm('Yakin ingin menghapus jadwal ini?')) {
        hapusJadwal(jenis, parseInt(id));
        closeJadwalModal();
    }
}

// ============================================
// FUNGSI TAMBAH MASTER CEPAT
// ============================================
function tambahMasterRuanganCepat() {
    const val = prompt('Masukkan nama ruangan baru:');
    if (!val) return;
    if (masterRuangan.includes(val)) { alert('Ruangan sudah ada!'); return; }
    masterRuangan.push(val);
    updateDropdowns();
    renderMasterData();
    simpanSemuaData();
    alert('✅ Ruangan berhasil ditambahkan!');
}

function tambahMasterTempatCepat() {
    const val = prompt('Masukkan nama tempat baru:');
    if (!val) return;
    if (masterTempat.includes(val)) { alert('Tempat sudah ada!'); return; }
    masterTempat.push(val);
    updateDropdowns();
    renderMasterData();
    simpanSemuaData();
    alert('✅ Tempat berhasil ditambahkan!');
}

function tambahMasterPicCepat() {
    const val = prompt('Masukkan nama PIC baru:');
    if (!val) return;
    if (masterPic.includes(val)) { alert('PIC sudah ada!'); return; }
    masterPic.push(val);
    updateDropdowns();
    renderMasterData();
    simpanSemuaData();
    alert('✅ PIC berhasil ditambahkan!');
}

function tambahMasterInstansiCepat() {
    const val = prompt('Masukkan nama instansi baru:');
    if (!val) return;
    if (masterInstansi.includes(val)) { alert('Instansi sudah ada!'); return; }
    masterInstansi.push(val);
    updateDropdowns();
    renderMasterData();
    simpanSemuaData();
    alert('✅ Instansi berhasil ditambahkan!');
}

// ============================================
// MASTER DATA CRUD - DENGAN AUTO REFRESH
// ============================================
function bukaMasterData() {
    document.getElementById('masterModal').classList.add('active');
    renderMasterData();
}

function closeMasterModal() {
    document.getElementById('masterModal').classList.remove('active');
}

let currentMasterTab = 'ruangan';

function switchMasterTab(tab) {
    currentMasterTab = tab;
    document.querySelectorAll('.master-tab').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
    });
    document.querySelectorAll('#masterModal .tab-btn').forEach(el => {
        el.classList.remove('active');
    });
    const targetTab = document.getElementById(`master-${tab}`);
    if (targetTab) {
        targetTab.classList.add('active');
        targetTab.style.display = 'block';
    }
    const targetBtn = document.querySelector(`#masterModal .tab-btn[onclick="switchMasterTab('${tab}')"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    renderMasterData();
}

function renderMasterData() {
    const listRuangan = document.getElementById('listRuangan');
    if (listRuangan) {
        if (masterRuangan.length === 0) {
            listRuangan.innerHTML = '<p style="color:#888;font-size:13px;padding:8px 0;">Belum ada data ruangan</p>';
        } else {
            listRuangan.innerHTML = masterRuangan.map(item => `
                <span class="master-item">
                    ${item}
                    <button onclick="hapusMaster('ruangan', '${item}')">✕</button>
                </span>
            `).join('');
        }
    }
    const listTempat = document.getElementById('listTempat');
    if (listTempat) {
        if (masterTempat.length === 0) {
            listTempat.innerHTML = '<p style="color:#888;font-size:13px;padding:8px 0;">Belum ada data tempat</p>';
        } else {
            listTempat.innerHTML = masterTempat.map(item => `
                <span class="master-item">
                    ${item}
                    <button onclick="hapusMaster('tempat', '${item}')">✕</button>
                </span>
            `).join('');
        }
    }
    const listPic = document.getElementById('listPic');
    if (listPic) {
        if (masterPic.length === 0) {
            listPic.innerHTML = '<p style="color:#888;font-size:13px;padding:8px 0;">Belum ada data PIC</p>';
        } else {
            listPic.innerHTML = masterPic.map(item => `
                <span class="master-item">
                    ${item}
                    <button onclick="hapusMaster('pic', '${item}')">✕</button>
                </span>
            `).join('');
        }
    }
    const listInstansi = document.getElementById('listInstansi');
    if (listInstansi) {
        if (masterInstansi.length === 0) {
            listInstansi.innerHTML = '<p style="color:#888;font-size:13px;padding:8px 0;">Belum ada data instansi</p>';
        } else {
            listInstansi.innerHTML = masterInstansi.map(item => `
                <span class="master-item">
                    ${item}
                    <button onclick="hapusMaster('instansi', '${item}')">✕</button>
                </span>
            `).join('');
        }
    }
}

function tambahMasterRuangan() {
    const input = document.getElementById('inputRuangan');
    const val = input.value.trim();
    if (!val) { alert('Masukkan nama ruangan!'); return; }
    if (masterRuangan.includes(val)) { alert('Ruangan sudah ada!'); return; }
    masterRuangan.push(val);
    input.value = '';
    renderMasterData();
    updateDropdowns();
    simpanSemuaData();
    alert('✅ Ruangan berhasil ditambahkan!');
}

function tambahMasterTempat() {
    const input = document.getElementById('inputTempat');
    const val = input.value.trim();
    if (!val) { alert('Masukkan nama tempat!'); return; }
    if (masterTempat.includes(val)) { alert('Tempat sudah ada!'); return; }
    masterTempat.push(val);
    input.value = '';
    renderMasterData();
    updateDropdowns();
    simpanSemuaData();
    alert('✅ Tempat berhasil ditambahkan!');
}

function tambahMasterPic() {
    const input = document.getElementById('inputPic');
    const val = input.value.trim();
    if (!val) { alert('Masukkan nama PIC!'); return; }
    if (masterPic.includes(val)) { alert('PIC sudah ada!'); return; }
    masterPic.push(val);
    input.value = '';
    renderMasterData();
    updateDropdowns();
    simpanSemuaData();
    alert('✅ PIC berhasil ditambahkan!');
}

function tambahMasterInstansi() {
    const input = document.getElementById('inputInstansi');
    const val = input.value.trim();
    if (!val) { alert('Masukkan nama instansi!'); return; }
    if (masterInstansi.includes(val)) { alert('Instansi sudah ada!'); return; }
    masterInstansi.push(val);
    input.value = '';
    renderMasterData();
    updateDropdowns();
    simpanSemuaData();
    alert('✅ Instansi berhasil ditambahkan!');
}

function hapusMaster(jenis, value) {
    if (!confirm(`Hapus "${value}" dari master ${jenis}?`)) return;
    switch(jenis) {
        case 'ruangan': masterRuangan = masterRuangan.filter(item => item !== value); break;
        case 'tempat': masterTempat = masterTempat.filter(item => item !== value); break;
        case 'pic': masterPic = masterPic.filter(item => item !== value); break;
        case 'instansi': masterInstansi = masterInstansi.filter(item => item !== value); break;
        default: return;
    }
    renderMasterData();
    updateDropdowns();
    simpanSemuaData();
    alert('✅ Data master berhasil dihapus!');
}

// ============================================
// RESET MASTER DATA - UNTUK YANG DI JS
// ============================================
function resetMasterData() {
    if (confirm('⚠️ Reset semua master data ke default?')) {
        masterRuangan = ['R.Meeting', 'R. VIP', 'Balai Rakyat/BRI', 'Guest House'];
        masterTempat = ['STP', 'ATP', 'TNC'];
        masterPic = ['Novi Putri Jelita S.Pi', 'Isti Rahmani S.P', 'Winda Oktaviona S.K.Pm', 'Pandu Pamungkas S.Si'];
        masterInstansi = ['Mahasiswa', 'Guru', 'Dosen', 'Masyarakat', 'Instansi Pemerintah', 'Perusahaan Swasta', 'Siswa'];
        
        simpanSemuaData();
        updateDropdowns();
        renderMasterData();
        
        alert('✅ Master data berhasil direset!');
        location.reload();
    }
}

// ============================================
// PRINT JADWAL
// ============================================
function printJadwal() {
    const now = new Date();
    document.getElementById('printDate').textContent = now.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    window.print();
}

// ============================================
// DASHBOARD EVENT LIST
// ============================================
function renderDashboardEvents() {
    const container = document.getElementById('dashboardEventList');
    const badge = document.getElementById('eventCountBadge');
    if (!container) return;
    const sortedEvents = [...eventData].sort((a, b) => a.tanggal - b.tanggal);
    const totalEvents = sortedEvents.length;
    if (badge) badge.textContent = `${totalEvents} Kegiatan`;
    if (totalEvents === 0) {
        container.innerHTML = `<div class="dashboard-empty-event">📭 Belum ada kegiatan bulan ini</div>`;
        return;
    }
    let html = '';
    sortedEvents.forEach(e => {
        html += `
            <div class="dashboard-event-item">
                <span class="event-date">${e.tanggal}</span>
                <span class="event-name">${e.nama}</span>
                <span class="event-time">🕐 ${e.waktu || '--:--'}</span>
                <span class="event-pic">👤 ${e.pic}</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ============================================
// KALENDER DASHBOARD
// ============================================
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar(month, year) {
    const grid = document.getElementById('calendarGrid');
    const monthYear = document.getElementById('monthYear');

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().getDate();
    const todayMonth = new Date().getMonth();
    const todayYear = new Date().getFullYear();

    const eventsThisMonth = eventData.filter(e => {
        return e.bulan === (month + 1) && e.tahun === year;
    });
    const eventDates = eventsThisMonth.map(e => e.tanggal);

    let html = '';
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    dayNames.forEach(name => {
        html += `<div class="day-name">${name}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
        html += `<div class="day empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const hasEvent = eventDates.includes(d);
        const isToday = (d === today && month === todayMonth && year === todayYear);
        let className = 'day';
        if (hasEvent) className += ' has-event';
        if (isToday) className += ' today';
        if (!hasEvent && !isToday) className += ' no-event';
        html += `<div class="${className}">${d}</div>`;
    }

    grid.innerHTML = html;
    renderDashboardEvents();
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentMonth, currentYear);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentMonth, currentYear);
});

// ============================================
// KALENDER FULL
// ============================================
let currentMonthFull = new Date().getMonth();
let currentYearFull = new Date().getFullYear();

function renderCalendarFull(month, year) {
    const grid = document.getElementById('calendarGridFull');
    const monthYear = document.getElementById('monthYearFull');

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const eventsThisMonth = eventData.filter(e => {
        return e.bulan === (month + 1) && e.tahun === year;
    });
    const eventDates = eventsThisMonth.map(e => e.tanggal);

    let html = '';
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    dayNames.forEach(name => {
        html += `<div class="day-name">${name}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
        html += `<div class="day empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const hasEvent = eventDates.includes(d);
        const isToday = (d === todayDate && month === todayMonth && year === todayYear);
        
        let className = 'day';
        if (hasEvent) className += ' has-event';
        if (isToday) className += ' today';
        if (!hasEvent && !isToday) className += ' no-event';
        
        html += `<div class="${className}" onclick="showEventDetail(${d})">${d}</div>`;
    }

    grid.innerHTML = html;
    showEventDetail(null);
    renderDashboardEvents();
}

function showEventDetail(tanggal) {
    const container = document.getElementById('eventListFull');
    const month = currentMonthFull + 1;
    const year = currentYearFull;
    
    const events = eventData.filter(e => {
        return e.bulan === month && e.tahun === year && e.tanggal === tanggal;
    });

    if (events.length === 0) {
        if (tanggal) {
            container.innerHTML = `
                <div style="padding:12px;background:#fff;border-radius:8px;text-align:center;color:#888;">
                    📭 Tidak ada event pada tanggal ${tanggal}/${month}/${year}
                </div>
            `;
        } else {
            container.innerHTML = `<p style="color:#888;">Klik tanggal untuk melihat event</p>`;
        }
        return;
    }

    container.innerHTML = events.map(e => `
        <div style="padding:8px 12px;background:#fff;border-radius:8px;margin-bottom:6px;border-left:4px solid #1a237e;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
                <strong>${e.nama}</strong> - ${e.waktu} (${e.ruangan}) - PIC: ${e.pic}
                ${e.dariJadwal ? '<span style="font-size:10px;color:#888;margin-left:8px;">📌 dari Jadwal</span>' : ''}
            </div>
            <div style="display:flex;gap:6px;">
                ${e.dariJadwal ? 
                    `<button class="btn-edit" onclick="alert('Event ini berasal dari jadwal ${e.sumber}. Edit di halaman Jadwal.')">🔗 Lihat Sumber</button>` :
                    `<button class="btn-edit" onclick="editEvent(${e.id})">✏️ Edit</button>
                    <button style="background:#f44336;color:#fff;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;" onclick="hapusEventById(${e.id})">🗑️</button>`
                }
            </div>
        </div>
    `).join('');
}

function tambahEvent() {
    document.getElementById('modalEventTitle').textContent = 'Tambah Event';
    document.getElementById('eventId').value = '';
    document.getElementById('eventTanggal').value = '';
    document.getElementById('eventNama').value = '';
    document.getElementById('eventWaktuMulai').value = '';
    document.getElementById('eventWaktuSelesai').value = '';
    document.getElementById('eventRuangan').value = '';
    document.getElementById('eventTempat').value = '';
    document.getElementById('eventPic').value = '';
    document.getElementById('btnDeleteEvent').style.display = 'none';
    updateDropdowns();
    document.getElementById('eventModal').classList.add('active');
}

function tambahEventTanggal(tanggal) {
    tambahEvent();
    document.getElementById('eventTanggal').value = tanggal;
}

function editEvent(id) {
    const event = eventData.find(e => e.id === id);
    if (!event) return;
    document.getElementById('modalEventTitle').textContent = 'Edit Event';
    document.getElementById('eventId').value = event.id;
    document.getElementById('eventTanggal').value = event.tanggal;
    document.getElementById('eventNama').value = event.nama;
    
    if (event.waktu) {
        const parts = event.waktu.split(' - ');
        if (parts.length === 2) {
            document.getElementById('eventWaktuMulai').value = parts[0].trim();
            document.getElementById('eventWaktuSelesai').value = parts[1].trim();
        }
    }
    
    document.getElementById('eventRuangan').value = event.ruangan;
    document.getElementById('eventTempat').value = event.tempat;
    document.getElementById('eventPic').value = event.pic;
    document.getElementById('btnDeleteEvent').style.display = 'inline-block';
    updateDropdowns();
    document.getElementById('eventModal').classList.add('active');
}

function hapusEvent() {
    const id = document.getElementById('eventId').value;
    if (!id) return;
    if (confirm('Yakin ingin menghapus event ini?')) {
        eventData = eventData.filter(e => e.id !== parseInt(id));
        closeEventModal();
        renderCalendarFull(currentMonthFull, currentYearFull);
        renderCalendar(currentMonth, currentYear);
        simpanSemuaData();
        alert('✅ Event berhasil dihapus!');
    }
}

function hapusEventById(id) {
    if (confirm('Yakin ingin menghapus event ini?')) {
        eventData = eventData.filter(e => e.id !== id);
        renderCalendarFull(currentMonthFull, currentYearFull);
        renderCalendar(currentMonth, currentYear);
        simpanSemuaData();
        alert('✅ Event berhasil dihapus!');
    }
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
}

function refreshKalenderFull() {
    renderCalendarFull(currentMonthFull, currentYearFull);
    alert('🔄 Kalender berhasil direfresh!');
}

document.getElementById('prevMonthFull').addEventListener('click', () => {
    currentMonthFull--;
    if (currentMonthFull < 0) { currentMonthFull = 11; currentYearFull--; }
    renderCalendarFull(currentMonthFull, currentYearFull);
});

document.getElementById('nextMonthFull').addEventListener('click', () => {
    currentMonthFull++;
    if (currentMonthFull > 11) { currentMonthFull = 0; currentYearFull++; }
    renderCalendarFull(currentMonthFull, currentYearFull);
});

// ============================================
// CAPAIAN CRUD
// ============================================
function tambahCapaian() {
    document.getElementById('modalCapaianTitle').textContent = 'Tambah Data Capaian';
    document.getElementById('capaianIndex').value = '';
    document.getElementById('capaianBulan').value = 'Jan';
    document.getElementById('capaianJumlah').value = '';
    document.getElementById('capaianTarget').value = '200';
    document.getElementById('capaianMahasiswa').value = '';
    document.getElementById('capaianDosen').value = '';
    document.getElementById('capaianUmum').value = '';
    document.getElementById('capaianInstansi').value = '';
    document.getElementById('btnDeleteCapaian').style.display = 'none';
    document.getElementById('capaianModal').classList.add('active');
}

function editCapaian(index) {
    const data = capaianData[index];
    if (!data) return;
    document.getElementById('modalCapaianTitle').textContent = 'Edit Data Capaian';
    document.getElementById('capaianIndex').value = index;
    document.getElementById('capaianBulan').value = data.bulan;
    document.getElementById('capaianJumlah').value = data.jumlah;
    document.getElementById('capaianTarget').value = data.target;
    document.getElementById('capaianMahasiswa').value = data.mahasiswa || 0;
    document.getElementById('capaianDosen').value = data.dosen || 0;
    document.getElementById('capaianUmum').value = data.umum || 0;
    document.getElementById('capaianInstansi').value = data.instansi || 0;
    document.getElementById('btnDeleteCapaian').style.display = 'inline-block';
    document.getElementById('capaianModal').classList.add('active');
}

function hapusCapaian() {
    const index = document.getElementById('capaianIndex').value;
    if (index === '') return;
    if (confirm('Yakin ingin menghapus data capaian ini?')) {
        capaianData.splice(parseInt(index), 1);
        closeCapaianModal();
        renderCapaianTable();
        updateAllCharts();
        simpanSemuaData();
        alert('✅ Data capaian berhasil dihapus!');
    }
}

function hapusCapaianByIndex(index) {
    if (confirm('Yakin ingin menghapus data capaian ini?')) {
        capaianData.splice(index, 1);
        renderCapaianTable();
        updateAllCharts();
        simpanSemuaData();
        alert('✅ Data capaian berhasil dihapus!');
    }
}

function refreshCapaian() {
    renderCapaianTable();
    updateAllCharts();
    alert('🔄 Data capaian berhasil direfresh!');
}

// ============================================
// RENDER CAPAIAN TABLE BY PERIOD
// ============================================
function renderCapaianTableByPeriod(period) {
    console.log('📊 Render capaian periode:', period);
    const tbody = document.getElementById('capaianTableBody');
    if (!tbody) return;
    
    if (period === 'mingguan') {
        const data = capaianMingguanData || [];
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#888;padding:20px;">Belum ada data capaian mingguan</td></tr>`;
            return;
        }
        
        const dayMap = {};
        const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        data.forEach(item => {
            if (item.tanggal) {
                const date = new Date(item.tanggal);
                const dayIndex = date.getDay() || 7;
                const dayName = dayNames[dayIndex - 1];
                if (!dayMap[dayName]) dayMap[dayName] = 0;
                dayMap[dayName] += item.jumlah || 0;
            }
        });
        
        const dayList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        const maxVal = Math.max(...Object.values(dayMap), 1);
        
        tbody.innerHTML = dayList.map((day, index) => {
            const val = dayMap[day] || 0;
            const persentase = Math.round((val / maxVal) * 100);
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${day}</strong></td>
                    <td>${val}</td>
                    <td>-</td>
                    <td>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <div style="flex:1;background:#e0e0e0;border-radius:10px;height:8px;max-width:100px;">
                                <div style="width:${persentase}%;background:#ff9800;border-radius:10px;height:8px;transition:width 0.5s;"></div>
                            </div>
                            <span style="font-weight:700;color:#1a237e;min-width:45px;font-size:14px;">${persentase}%</span>
                        </div>
                    </td>
                    <td>${val > 0 ? '✅ Ada Kegiatan' : '⬜ Kosong'}</td>
                </tr>
            `;
        }).join('');
        return;
    }
    
    if (period === 'bulanan') {
        const data = capaianData || [];
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#888;padding:20px;">Belum ada data capaian bulanan</td></tr>`;
            return;
        }
        
        tbody.innerHTML = data.map((item, index) => {
            const persentase = Math.round((item.jumlah / item.target) * 100);
            let status = '', statusClass = '';
            if (persentase >= 100) { status = '✅ Tercapai'; statusClass = 'status-success'; }
            else if (persentase >= 75) { status = '⚠️ Mendekati'; statusClass = 'status-warning'; }
            else { status = '❌ Belum Tercapai'; statusClass = 'status-danger'; }
            
            const progressWidth = Math.min(persentase, 100);
            let barColor = '#f44336';
            if (persentase >= 75) barColor = '#ff9800';
            if (persentase >= 100) barColor = '#4caf50';
            
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.bulan}</strong></td>
                    <td>${item.jumlah}</td>
                    <td>${item.target}</td>
                    <td>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <div style="flex:1;background:#e0e0e0;border-radius:10px;height:8px;max-width:100px;">
                                <div style="width:${progressWidth}%;background:${barColor};border-radius:10px;height:8px;transition:width 0.5s;"></div>
                            </div>
                            <span style="font-weight:700;color:#1a237e;min-width:45px;font-size:14px;">${persentase}%</span>
                        </div>
                    </td>
                    <td><span class="${statusClass}">${status}</span></td>
                    <td>
                        <button class="btn-edit" onclick="editCapaian(${index})">✏️ Edit</button>
                        <button style="background:#f44336;color:#fff;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;" onclick="hapusCapaianByIndex(${index})">🗑️</button>
                    </td>
                </tr>
            `;
        }).join('');
        return;
    }
    
    if (period === 'tahunan') {
        const data = getYearlyData();
        if (!data || data.values.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">Belum ada data capaian tahunan</td></tr>`;
            return;
        }
        
        const maxVal = Math.max(...data.values, 1);
        
        tbody.innerHTML = data.labels.map((year, index) => {
            const val = data.values[index] || 0;
            const persentase = Math.round((val / maxVal) * 100);
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${year}</strong></td>
                    <td>${val}</td>
                    <td>-</td>
                    <td>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <div style="flex:1;background:#e0e0e0;border-radius:10px;height:8px;max-width:100px;">
                                <div style="width:${persentase}%;background:#ffca28;border-radius:10px;height:8px;transition:width 0.5s;"></div>
                            </div>
                            <span style="font-weight:700;color:#1a237e;min-width:45px;font-size:14px;">${persentase}%</span>
                        </div>
                    </td>
                    <td>${val > 0 ? '📈 Ada Data' : '📭 Kosong'}</td>
                </tr>
            `;
        }).join('');
        return;
    }
}

function renderCapaianTable() {
    renderCapaianTableByPeriod(currentPeriodFull || 'bulanan');
}

// ============================================
// UPDATE STATS - OTOMATIS DARI DATA JADWAL
// ============================================
function updateStats() {
    const totalKunjungan = kunjunganData ? kunjunganData.length : 0;
    const totalRuang = ruangData ? ruangData.length : 0;
    const totalBalai = balaiData ? balaiData.length : 0;
    const totalProgram = programData ? programData.length : 0;
    
    document.getElementById('totalKunjungan').textContent = totalKunjungan;
    document.getElementById('totalRuang').textContent = totalRuang;
    document.getElementById('totalBalai').textContent = totalBalai;
    document.getElementById('totalProgram').textContent = totalProgram;
    
    const lapKunjungan = document.getElementById('lapTotalKunjungan');
    const lapRuang = document.getElementById('lapTotalRuang');
    const lapBalai = document.getElementById('lapTotalBalai');
    const lapProgram = document.getElementById('lapTotalProgram');
    
    if (lapKunjungan) lapKunjungan.textContent = totalKunjungan;
    if (lapRuang) lapRuang.textContent = totalRuang;
    if (lapBalai) lapBalai.textContent = totalBalai;
    if (lapProgram) lapProgram.textContent = totalProgram;
    
    console.log('📊 Stats diupdate - Kunjungan:', totalKunjungan, 'Ruang:', totalRuang, 'Balai:', totalBalai, 'Program:', totalProgram);
}

// ============================================
// UPDATE ALL CHARTS
// ============================================
let currentPeriod = 'mingguan';
let currentPeriodFull = 'bulanan';
let currentLaporanPeriod = 'mingguan';

function updateAllCharts() {
    initBarChart(currentPeriod || 'mingguan');
    initBarChartFull(currentPeriodFull || 'bulanan');
    initBarChartLaporan(currentLaporanPeriod || 'mingguan');
    initPieChart();
    initPieChartFull();
    initPieChartLaporan();
}

// ============================================
// GRAFIK PIE
// ============================================
let pieChartInstance = null;

function initPieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    if (pieChartInstance) pieChartInstance.destroy();
    const pieData = getPieData();
    const total = pieData.values.reduce((a, b) => a + b, 0);
    if (total === 0 || pieData.labels[0] === 'Belum ada data') {
        pieChartInstance = new Chart(ctx, {
            type: 'pie',
            data: { labels: ['Belum ada data'], datasets: [{ data: [1], backgroundColor: ['#e0e0e0'], borderWidth: 2, borderColor: '#fff' }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, pointStyle: 'circle', font: { size: 13 } } },
                    tooltip: { callbacks: { label: function() { return 'Belum ada data capaian'; } } }
                }
            }
        });
        return;
    }
    pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: { labels: pieData.labels, datasets: [{ data: pieData.values, backgroundColor: pieData.colors, borderWidth: 2, borderColor: '#fff' }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, pointStyle: 'circle', font: { size: 13 } } },
                tooltip: { callbacks: { label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return `${label}: ${percentage}% (${value} orang)`;
                } } }
            }
        }
    });
}

let pieChartFullInstance = null;

function initPieChartFull() {
    const ctx = document.getElementById('pieChartFull').getContext('2d');
    if (pieChartFullInstance) pieChartFullInstance.destroy();
    const pieData = getPieData();
    const total = pieData.values.reduce((a, b) => a + b, 0);
    if (total === 0 || pieData.labels[0] === 'Belum ada data') {
        pieChartFullInstance = new Chart(ctx, {
            type: 'pie',
            data: { labels: ['Belum ada data'], datasets: [{ data: [1], backgroundColor: ['#e0e0e0'], borderWidth: 2, borderColor: '#fff' }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, pointStyle: 'circle', font: { size: 13 } } },
                    tooltip: { callbacks: { label: function() { return 'Belum ada data capaian'; } } }
                }
            }
        });
        return;
    }
    pieChartFullInstance = new Chart(ctx, {
        type: 'pie',
        data: { labels: pieData.labels, datasets: [{ data: pieData.values, backgroundColor: pieData.colors, borderWidth: 2, borderColor: '#fff' }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, pointStyle: 'circle', font: { size: 13 } } },
                tooltip: { callbacks: { label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return `${label}: ${percentage}% (${value} orang)`;
                } } }
            }
        }
    });
}

let pieChartLaporanInstance = null;

function initPieChartLaporan() {
    const ctx = document.getElementById('pieChartLaporan').getContext('2d');
    if (pieChartLaporanInstance) pieChartLaporanInstance.destroy();
    const pieData = getPieData();
    const total = pieData.values.reduce((a, b) => a + b, 0);
    if (total === 0 || pieData.labels[0] === 'Belum ada data') {
        pieChartLaporanInstance = new Chart(ctx, {
            type: 'pie',
            data: { labels: ['Belum ada data'], datasets: [{ data: [1], backgroundColor: ['#e0e0e0'], borderWidth: 3, borderColor: '#fff' }] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 13 } } },
                    tooltip: { callbacks: { label: function() { return 'Belum ada data capaian'; } } }
                }
            }
        });
        return;
    }
    pieChartLaporanInstance = new Chart(ctx, {
        type: 'pie',
        data: { labels: pieData.labels, datasets: [{ data: pieData.values, backgroundColor: pieData.colors, borderWidth: 3, borderColor: '#fff' }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 13 } } },
                tooltip: { callbacks: { label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return `${label}: ${percentage}% (${value} orang)`;
                } } }
            }
        }
    });
}

// ============================================
// GRAFIK BATANG
// ============================================
let barChartInstance = null;

function initBarChart(period) {
    const ctx = document.getElementById('barChart').getContext('2d');
    if (barChartInstance) barChartInstance.destroy();
    const data = getDataByPeriod(period);
    const labelMap = { 'mingguan': 'Pengunjung per Hari (Minggu Ini)', 'bulanan': 'Jumlah Pengunjung per Bulan', 'tahunan': 'Jumlah Pengunjung per Tahun' };
    const colorMap = { 'mingguan': '#ff9800', 'bulanan': '#1a237e', 'tahunan': '#ffca28' };
    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels: data.labels, datasets: [{ label: labelMap[period] || 'Jumlah Pengunjung', data: data.values, backgroundColor: colorMap[period] || '#1a237e', borderColor: period === 'bulanan' ? '#0d1445' : '#e6b800', borderWidth: 1, borderRadius: 4 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16 } } },
            scales: { y: { beginAtZero: true, grid: { color: '#eee' } }, x: { grid: { display: false } } }
        }
    });
}

let barChartFullInstance = null;

function initBarChartFull(period) {
    const ctx = document.getElementById('barChartFull').getContext('2d');
    if (barChartFullInstance) barChartFullInstance.destroy();
    const data = getDataByPeriod(period);
    const labelMap = { 'mingguan': 'Pengunjung per Hari (Minggu Ini)', 'bulanan': 'Jumlah Pengunjung per Bulan', 'tahunan': 'Jumlah Pengunjung per Tahun' };
    const colorMap = { 'mingguan': '#ff9800', 'bulanan': '#1a237e', 'tahunan': '#ffca28' };
    barChartFullInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels: data.labels, datasets: [{ label: labelMap[period] || 'Jumlah Pengunjung', data: data.values, backgroundColor: colorMap[period] || '#1a237e', borderColor: period === 'bulanan' ? '#0d1445' : '#e6b800', borderWidth: 1, borderRadius: 4 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16 } } },
            scales: { y: { beginAtZero: true, grid: { color: '#eee' } }, x: { grid: { display: false } } }
        }
    });
}

let barChartLaporanInstance = null;

function initBarChartLaporan(period) {
    const ctx = document.getElementById('barChartLaporan').getContext('2d');
    if (barChartLaporanInstance) barChartLaporanInstance.destroy();
    const data = getDataByPeriod(period);
    const labelMap = { 'mingguan': 'Pengunjung per Hari (Minggu Ini)', 'bulanan': 'Jumlah Pengunjung per Bulan', 'tahunan': 'Jumlah Pengunjung per Tahun' };
    const colorMap = { 'mingguan': '#ff9800', 'bulanan': '#1a237e', 'tahunan': '#ffca28' };
    barChartLaporanInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels: data.labels, datasets: [{ label: labelMap[period] || 'Jumlah Pengunjung', data: data.values, backgroundColor: colorMap[period] || '#1a237e', borderColor: period === 'bulanan' ? '#0d1445' : '#e6b800', borderWidth: 2, borderRadius: 6 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 13 } } } },
            scales: { y: { beginAtZero: true, grid: { color: '#eee' }, ticks: { font: { size: 12 } } }, x: { grid: { display: false }, ticks: { font: { size: 12 } } } }
        }
    });
}

// ============================================
// UBAH GRAFIK CAPAIAN
// ============================================
window.ubahGrafikCapaianJS = function(period) {
    console.log('🔄 Ubah grafik capaian ke:', period);
    currentPeriodFull = period;
    
    document.querySelectorAll('#page-capaian .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.period === period) {
            btn.classList.add('active');
        }
    });
    
    const filterSelect = document.getElementById('capaianFilter');
    if (filterSelect) {
        filterSelect.value = period;
    }
    
    initBarChartFull(period);
    
    const titleMap = {
        'mingguan': '📋 Detail Capaian Mingguan',
        'bulanan': '📋 Detail Capaian Bulanan',
        'tahunan': '📋 Detail Capaian Tahunan'
    };
    const titleEl = document.getElementById('capaianTableTitle');
    if (titleEl) {
        titleEl.textContent = titleMap[period] || '📋 Detail Capaian';
    }
    
    renderCapaianTableByPeriod(period);
    
    console.log('✅ Grafik capaian diubah ke:', period);
};

function ubahGrafikLaporan(period) {
    currentLaporanPeriod = period;
    document.querySelectorAll('#page-laporan .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.period === period) btn.classList.add('active');
    });
    initBarChartLaporan(period);
}

// ============================================
// FILTER DROPDOWN DASHBOARD
// ============================================
document.querySelectorAll('#page-dashboard .filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const parent = this.closest('.chart-filter');
        parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const period = this.dataset.period === 'weekly' ? 'mingguan' : this.dataset.period === 'monthly' ? 'bulanan' : 'tahunan';
        currentPeriod = period;
        initBarChart(period);
        initPieChart();
    });
});

// ============================================
// GENERATE LAPORAN
// ============================================
window.generateLaporanJS = function() {
    console.log('📊 Generate Laporan dipanggil');
    const jenis = document.getElementById('laporanJenis').value;
    
    document.getElementById('lapTotalKunjungan').textContent = kunjunganData ? kunjunganData.length : 0;
    document.getElementById('lapTotalRuang').textContent = ruangData ? ruangData.length : 0;
    document.getElementById('lapTotalBalai').textContent = balaiData ? balaiData.length : 0;
    document.getElementById('lapTotalProgram').textContent = programData ? programData.length : 0;
    
    const now = new Date();
    document.getElementById('lapTanggalCetak').textContent = now.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    
    const jenisText = document.getElementById('laporanJenis').options[document.getElementById('laporanJenis').selectedIndex].text;
    document.getElementById('lapJenisLaporan').textContent = jenisText;
    
    renderLaporanTable(jenis);
    initBarChartLaporan(currentLaporanPeriod || 'mingguan');
    initPieChartLaporan();
    
    let totalData = 0;
    if (jenis === 'all' || jenis === 'kunjungan') totalData += kunjunganData.length;
    if (jenis === 'all' || jenis === 'ruang') totalData += ruangData.length;
    if (jenis === 'all' || jenis === 'balai') totalData += balaiData.length;
    if (jenis === 'all' || jenis === 'program') totalData += programData.length;
    if (jenis === 'all' || jenis === 'capaian') totalData += capaianData.length;
    if (jenis === 'all' || jenis === 'kalender') totalData += eventData.length;
    
    document.getElementById('lapJumlahData').textContent = `${totalData} Data`;
    document.getElementById('lapStatus').textContent = '✅ Siap';
    document.getElementById('lapStatus').style.background = '#4caf50';
    document.getElementById('lapStatus').style.color = '#fff';
    
    console.log('✅ Laporan selesai digenerate, total data:', totalData);
};

function generateLaporan() {
    window.generateLaporanJS();
}

// ============================================
// RENDER LAPORAN TABLE
// ============================================
function renderLaporanTable(jenis) {
    console.log('📋 Render laporan per bulan untuk jenis:', jenis);
    const tbody = document.getElementById('laporanTableBody');
    const thead = document.getElementById('laporanThead');
    
    let headers = [];
    let rows = [];
    
    const bulanMap = {};
    const bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const bulanFull = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    function getBulanFromDate(tanggal) {
        if (!tanggal) return null;
        const parts = tanggal.split('-');
        if (parts.length < 2) return null;
        const bln = parseInt(parts[1]) - 1;
        return bulanNames[bln] || null;
    }
    
    function getTahunFromDate(tanggal) {
        if (!tanggal) return null;
        const parts = tanggal.split('-');
        if (parts.length < 1) return null;
        return parts[0] || null;
    }
    
    // === DATA KUNJUNGAN PER BULAN ===
    if (jenis === 'all' || jenis === 'kunjungan') {
        const kunjunganBulanan = {};
        kunjunganData.forEach(item => {
            const bulan = getBulanFromDate(item.tanggal);
            const tahun = getTahunFromDate(item.tanggal);
            const key = bulan ? `${tahun}-${bulan}` : 'unknown';
            if (!kunjunganBulanan[key]) {
                kunjunganBulanan[key] = { bulan: bulan, tahun: tahun, total: 0, count: 0, instansi: {} };
            }
            kunjunganBulanan[key].total += item.jumlahPengunjung || 0;
            kunjunganBulanan[key].count += 1;
            const inst = item.instansi || 'Umum';
            if (!kunjunganBulanan[key].instansi[inst]) {
                kunjunganBulanan[key].instansi[inst] = 0;
            }
            kunjunganBulanan[key].instansi[inst] += item.jumlahPengunjung || 0;
        });
        
        if (headers.length === 0) {
            headers = ['No', 'Bulan', 'Total Kunjungan', 'Jumlah Kegiatan', 'Rata-rata', 'Instansi Terbanyak'];
        }
        
        Object.keys(kunjunganBulanan).sort().forEach((key, index) => {
            const data = kunjunganBulanan[key];
            const bulanDisplay = data.bulan ? bulanFull[bulanNames.indexOf(data.bulan)] + ' ' + data.tahun : 'Tidak Diketahui';
            const avg = data.count > 0 ? Math.round(data.total / data.count) : 0;
            
            let maxInst = 'Tidak Ada';
            let maxVal = 0;
            Object.keys(data.instansi).forEach(inst => {
                if (data.instansi[inst] > maxVal) {
                    maxVal = data.instansi[inst];
                    maxInst = inst;
                }
            });
            
            rows.push({
                no: index + 1,
                bulan: bulanDisplay,
                total: data.total,
                count: data.count,
                rata: avg,
                instansi: `${maxInst} (${maxVal} orang)`
            });
        });
    }
    
    // === DATA PEMAKAIAN RUANG PER BULAN ===
    if (jenis === 'all' || jenis === 'ruang') {
        const ruangBulanan = {};
        ruangData.forEach(item => {
            const bulan = getBulanFromDate(item.tanggal);
            const tahun = getTahunFromDate(item.tanggal);
            const key = bulan ? `${tahun}-${bulan}` : 'unknown';
            if (!ruangBulanan[key]) {
                ruangBulanan[key] = { bulan: bulan, tahun: tahun, total: 0, count: 0, ruangan: {} };
            }
            ruangBulanan[key].total += item.kapasitas || 0;
            ruangBulanan[key].count += 1;
            const ruang = item.ruangan || 'Tidak Diketahui';
            if (!ruangBulanan[key].ruangan[ruang]) {
                ruangBulanan[key].ruangan[ruang] = 0;
            }
            ruangBulanan[key].ruangan[ruang] += 1;
        });
        
        if (headers.length === 0) {
            headers = ['No', 'Bulan', 'Total Kapasitas', 'Jumlah Kegiatan', 'Rata-rata Kapasitas', 'Ruangan Terbanyak'];
        }
        
        Object.keys(ruangBulanan).sort().forEach((key, index) => {
            const data = ruangBulanan[key];
            const bulanDisplay = data.bulan ? bulanFull[bulanNames.indexOf(data.bulan)] + ' ' + data.tahun : 'Tidak Diketahui';
            const avg = data.count > 0 ? Math.round(data.total / data.count) : 0;
            
            let maxRuang = 'Tidak Ada';
            let maxVal = 0;
            Object.keys(data.ruangan).forEach(r => {
                if (data.ruangan[r] > maxVal) {
                    maxVal = data.ruangan[r];
                    maxRuang = r;
                }
            });
            
            rows.push({
                no: rows.length + 1,
                bulan: bulanDisplay,
                total: data.total,
                count: data.count,
                rata: avg,
                instansi: `${maxRuang} (${maxVal}x pakai)`
            });
        });
    }
    
    // === DATA BALAI BRI PER BULAN ===
    if (jenis === 'all' || jenis === 'balai') {
        const balaiBulanan = {};
        balaiData.forEach(item => {
            const bulan = getBulanFromDate(item.tanggal);
            const tahun = getTahunFromDate(item.tanggal);
            const key = bulan ? `${tahun}-${bulan}` : 'unknown';
            if (!balaiBulanan[key]) {
                balaiBulanan[key] = { bulan: bulan, tahun: tahun, count: 0, jenis: {} };
            }
            balaiBulanan[key].count += 1;
            const jenisKeg = item.jenis || 'Lainnya';
            if (!balaiBulanan[key].jenis[jenisKeg]) {
                balaiBulanan[key].jenis[jenisKeg] = 0;
            }
            balaiBulanan[key].jenis[jenisKeg] += 1;
        });
        
        if (headers.length === 0) {
            headers = ['No', 'Bulan', 'Jumlah Kegiatan', 'Jenis Terbanyak'];
        }
        
        Object.keys(balaiBulanan).sort().forEach((key, index) => {
            const data = balaiBulanan[key];
            const bulanDisplay = data.bulan ? bulanFull[bulanNames.indexOf(data.bulan)] + ' ' + data.tahun : 'Tidak Diketahui';
            
            let maxJenis = 'Tidak Ada';
            let maxVal = 0;
            Object.keys(data.jenis).forEach(j => {
                if (data.jenis[j] > maxVal) {
                    maxVal = data.jenis[j];
                    maxJenis = j;
                }
            });
            
            rows.push({
                no: rows.length + 1,
                bulan: bulanDisplay,
                total: data.count,
                count: '-',
                rata: '-',
                instansi: `${maxJenis} (${maxVal}x)`
            });
        });
    }
    
    // === DATA PER PROGRAM PER BULAN ===
    if (jenis === 'all' || jenis === 'program') {
        const programBulanan = {};
        programData.forEach(item => {
            const bulan = getBulanFromDate(item.tanggal);
            const tahun = getTahunFromDate(item.tanggal);
            const key = bulan ? `${tahun}-${bulan}` : 'unknown';
            if (!programBulanan[key]) {
                programBulanan[key] = { bulan: bulan, tahun: tahun, count: 0, program: {} };
            }
            programBulanan[key].count += 1;
            const prog = item.program || 'Program Lainnya';
            if (!programBulanan[key].program[prog]) {
                programBulanan[key].program[prog] = 0;
            }
            programBulanan[key].program[prog] += 1;
        });
        
        if (headers.length === 0) {
            headers = ['No', 'Bulan', 'Jumlah Kegiatan', 'Program Terbanyak'];
        }
        
        Object.keys(programBulanan).sort().forEach((key, index) => {
            const data = programBulanan[key];
            const bulanDisplay = data.bulan ? bulanFull[bulanNames.indexOf(data.bulan)] + ' ' + data.tahun : 'Tidak Diketahui';
            
            let maxProg = 'Tidak Ada';
            let maxVal = 0;
            Object.keys(data.program).forEach(p => {
                if (data.program[p] > maxVal) {
                    maxVal = data.program[p];
                    maxProg = p;
                }
            });
            
            rows.push({
                no: rows.length + 1,
                bulan: bulanDisplay,
                total: data.count,
                count: '-',
                rata: '-',
                instansi: `${maxProg} (${maxVal}x)`
            });
        });
    }
    
    // === DATA CAPAIAN (Sudah per bulan) ===
    if (jenis === 'all' || jenis === 'capaian') {
        headers = ['No', 'Bulan', 'Jumlah', 'Target', 'Pencapaian', 'Status'];
        capaianData.forEach((item, index) => {
            const persentase = Math.round((item.jumlah / item.target) * 100);
            let status = item.jumlah >= item.target ? '✅ Tercapai' : 
                         item.jumlah >= (item.target * 0.75) ? '⚠️ Mendekati' : '❌ Belum';
            rows.push({
                no: index + 1,
                bulan: item.bulan || '-',
                total: item.jumlah || 0,
                count: item.target || 0,
                rata: `${persentase}%`,
                instansi: status
            });
        });
    }
    
    // === DATA KALENDER PER BULAN ===
    if (jenis === 'all' || jenis === 'kalender') {
        const kalenderBulanan = {};
        eventData.forEach(item => {
            const bulan = item.bulan ? bulanNames[item.bulan - 1] : null;
            const tahun = item.tahun || '2026';
            const key = bulan ? `${tahun}-${bulan}` : 'unknown';
            if (!kalenderBulanan[key]) {
                kalenderBulanan[key] = { bulan: bulan, tahun: tahun, count: 0 };
            }
            kalenderBulanan[key].count += 1;
        });
        
        if (headers.length === 0) {
            headers = ['No', 'Bulan', 'Jumlah Event'];
        }
        
        Object.keys(kalenderBulanan).sort().forEach((key, index) => {
            const data = kalenderBulanan[key];
            const bulanDisplay = data.bulan ? bulanFull[bulanNames.indexOf(data.bulan)] + ' ' + data.tahun : 'Tidak Diketahui';
            
            rows.push({
                no: rows.length + 1,
                bulan: bulanDisplay,
                total: data.count,
                count: '-',
                rata: '-',
                instansi: '-'
            });
        });
    }
    
    // Jika tidak ada data
    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:#888;padding:40px;">📂 Tidak ada data. Tambahkan jadwal terlebih dahulu.</td></tr>`;
        thead.innerHTML = '';
        return;
    }
    
    // Buat header
    let headerHtml = '<tr>';
    headers.forEach(h => {
        headerHtml += `<th>${h}</th>`;
    });
    headerHtml += '</tr>';
    thead.innerHTML = headerHtml;
    
    // Buat body
    let bodyHtml = '';
    rows.forEach(row => {
        bodyHtml += '<tr>';
        Object.values(row).forEach(val => {
            if (typeof val === 'string' && (val.includes('✅') || val.includes('⚠️') || val.includes('❌'))) {
                const isSuccess = val.includes('✅');
                const isWarning = val.includes('⚠️');
                const bgColor = isSuccess ? '#4caf50' : (isWarning ? '#ff9800' : '#f44336');
                bodyHtml += `<td><span style="background:${bgColor};color:#fff;padding:2px 12px;border-radius:12px;font-size:12px;">${val}</span></td>`;
            } else {
                bodyHtml += `<td>${val}</td>`;
            }
        });
        bodyHtml += '</tr>';
    });
    tbody.innerHTML = bodyHtml;
    console.log('✅ Tabel laporan selesai dirender, total baris:', rows.length);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function exportPDF() {
    alert('📄 Download PDF\n\nGunakan tombol "Cetak" dan pilih "Save as PDF"');
}

function exportExcel() {
    const table = document.getElementById('laporanTable');
    let csv = '';
    const headers = document.querySelectorAll('#laporanThead th');
    headers.forEach(th => { csv += th.textContent + ','; });
    csv += '\n';
    const rows = document.querySelectorAll('#laporanTableBody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            let text = cell.textContent.trim();
            text = text.replace(/[^\w\s,.]/g, '').trim();
            csv += '"' + text + '",';
        });
        csv += '\n';
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ File Excel (CSV) berhasil didownload!');
}

function printLaporan() {
    generateLaporan();
    setTimeout(() => { window.print(); }, 300);
}

function exportWord() {
    alert('📝 Download Word\n\nCopy data dari tabel dan paste ke Word.');
}

// ============================================
// TANGGAL SEKARANG
// ============================================
function setCurrentDate() {
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

// ============================================
// HAPUS SEMUA DATA
// ============================================
function resetAllData() {
    if (confirm('⚠️ Yakin ingin menghapus SEMUA data? Ini tidak bisa dibatalkan!')) {
        localStorage.clear();
        location.reload();
    }
}

// ============================================
// RESET DATA DARI USER
// ============================================
function resetDataFromUser() {
    kunjunganData = [
        { id: 1, nama: 'PJ KKN', instansi: 'Mahasiswa', tanggal: '2026-06-29', waktu: '08:00 - 09:30', tujuan: 'KKN', pic: 'Nurul', jumlahPengunjung: 100 },
        { id: 2, nama: 'IPB UNIVERSITY', instansi: 'Mahasiswa', tanggal: '2026-06-29', waktu: '10:00 - 11:00', tujuan: 'Kunjungan', pic: 'Novi', jumlahPengunjung: 100 },
    ];
    nextKunjunganId = 3;
    
    ruangData = [
        { id: 1, kegiatan: 'Penerimaan Siswa PKL', ruangan: 'R. VIP', tanggal: '2026-06-29', waktu: '10:00 - 11:00', kapasitas: 20, pic: 'Budi' },
    ];
    nextRuangId = 2;
    
    balaiData = [];
    nextBalaiId = 1;
    
    programData = [
        { id: 1, program: 'MBG', kegiatan: 'Program MBG', tanggal: '2026-06-29', waktu: '10:00 - 12:00', lokasi: 'ATP IPB', pic: 'Andi' },
    ];
    nextProgramId = 2;
    
    simpanSemuaData();
    
    renderKunjunganTable();
    renderRuangTable();
    renderBalaiTable();
    renderProgramTable();
    renderRingkasanJadwal();
    updateStats();
    
    alert('✅ Data berhasil direset sesuai user.html!');
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    muatSemuaData();
    
    // CEK APAKAH MASTER DATA MASIH DEFAULT LAMA
    if (masterRuangan.includes('R. Meeting 1') || masterRuangan.includes('Lab. Komputer')) {
        console.log('⚠️ Master data masih default lama, mereset...');
        masterRuangan = ['R.Meeting', 'R. VIP', 'Balai Rakyat/BRI', 'Guest House'];
        masterTempat = ['STP', 'ATP', 'TNC'];
        masterPic = ['Novi Putri Jelita S.Pi', 'Isti Rahmani S.P', 'Winda Oktaviona S.K.Pm', 'Pandu Pamungkas S.Si'];
        masterInstansi = ['Mahasiswa', 'Guru', 'Dosen', 'Masyarakat', 'Instansi Pemerintah', 'Perusahaan Swasta', 'Siswa'];
        simpanSemuaData();
    }
    
    renderKunjunganTable();
    renderRuangTable();
    renderBalaiTable();
    renderProgramTable();
    renderRingkasanJadwal();
    renderCalendar(currentMonth, currentYear);
    renderCalendarFull(currentMonthFull, currentYearFull);
    renderDashboardEvents();
    updateStats();
    setCurrentDate();
    renderCapaianTable();
    updateDropdowns();
    sinkronkanJadwalKeKalender();
    sinkronkanKunjunganKeCapaian();
    initBarChart('mingguan');
    initPieChart();
    initBarChartFull('bulanan');
    initPieChartFull();
    initBarChartLaporan('mingguan');
    initPieChartLaporan();
    generateLaporan();
    simpanSemuaData();
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').style.transform = 'translateX(-100%)';
    }
    console.log('✅ Data berhasil dimuat dari localStorage!');
    console.log('📋 Kunjungan:', kunjunganData.length, 'data');
    console.log('🏢 Ruang:', ruangData.length, 'data');
    console.log('🏛️ Balai:', balaiData.length, 'data');
    console.log('📊 Program:', programData.length, 'data');
    console.log('📅 Event:', eventData.length, 'data');
    console.log('📊 Capaian:', capaianData.length, 'data');
    console.log('📊 Capaian Mingguan:', capaianMingguanData.length, 'data');
    console.log('📋 Master Ruangan:', masterRuangan.length, 'data');
    console.log('📋 Master Tempat:', masterTempat.length, 'data');
    console.log('📋 Master PIC:', masterPic.length, 'data');
    console.log('📋 Master Instansi:', masterInstansi.length, 'data');
});

console.log('💡 Untuk reset master data, ketik: resetMasterData()');
console.log('💡 Untuk reset data dari user.html, ketik: resetDataFromUser()');
console.log('💡 Untuk mereset semua data, ketik: resetAllData()');
