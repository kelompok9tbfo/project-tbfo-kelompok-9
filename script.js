document.getElementById('startSimulation').addEventListener('click', async function () {
    const input = document.getElementById('inputString').value.trim();
    
    // Validasi input (hanya 'a' dan 'b')
    if (!/^[ab]+$/.test(input)) {
        document.getElementById('output').textContent = 'Hanya karakter "a" dan "b" yang diperbolehkan!';
        return;
    }

    try {
        // Tunggu hasil dari simulasi Mesin Turing
        const result = await simulateTuringMachine(input);
        // Tampilkan hasil setelah simulasi selesai
        document.getElementById('output').textContent = result;
    } catch (error) {
        // Tangani error jika ada
        console.error(error);
        document.getElementById('output').textContent = 'Terjadi kesalahan dalam simulasi!';
    }
});

function simulateTuringMachine(input) {
    return new Promise((resolve, reject) => {
        let tape = input.split('');
        let head = 0;
        let state = 'q0';
        
        // Membuat tampilan tape
        createTapeDisplay(tape);

        function createTapeDisplay(tape) {
            const tapeContainer = document.getElementById('tapeContainer');
            tapeContainer.innerHTML = ''; // Kosongkan tape container sebelumnya
            
            tape.forEach((symbol, index) => {
                const cell = document.createElement('div');
                cell.classList.add('tape-cell');
                cell.textContent = symbol;
                cell.setAttribute('data-index', index);
                tapeContainer.appendChild(cell);
            });
            updateHeadPosition(head); // Menandai posisi head
        }

        function updateHeadPosition(head) {
            const tapeCells = document.querySelectorAll('.tape-cell');
            tapeCells.forEach(cell => cell.classList.remove('active')); // Hapus highlight sebelumnya
            const activeCell = tapeCells[head];
            if (activeCell) activeCell.classList.add('active'); // Menandai posisi head yang aktif
        }

        // Loop untuk simulasi Mesin Turing
        let interval = setInterval(() => {
            const symbol = tape[head] || '_';
            updateHeadPosition(head);
            
            switch (state) {
                case 'q0': // mencari 'a' pertama
                    if (symbol === 'a') {
                        tape[head] = 'X';  // Tandai dengan 'X'
                        head++;             // Pindah ke kanan untuk mencari 'b'
                        state = 'q1';
                    } else if (symbol === 'b') {
                        state = 'q_reject'; // Tidak ada 'a' untuk dipasangkan
                    } else {
                        state = 'q_accept'; // Semua karakter sudah diproses
                    }
                    break;

                case 'q1': // mencari 'b' untuk dipasangkan dengan 'a'
                    if (symbol === 'b') {
                        tape[head] = 'Y';  // Tandai dengan 'Y'
                        head--;             // Kembali ke kiri untuk mencari 'X'
                        state = 'q2';
                    } else if (symbol === '_') {
                        state = 'q_reject'; // Tidak ada 'b' untuk dipasangkan
                    } else {
                        head++;             // Lanjutkan ke kanan untuk mencari 'b'
                    }
                    break;

                case 'q2': // Kembali ke kiri untuk mencari pasangan berikutnya
                    if (symbol === 'X') {
                        head++;            // Pindah ke kanan untuk mencari 'a'
                        state = 'q0';      // Ulangi proses mencari pasangan berikutnya
                    } else if (symbol === 'Y') {
                        head--;            // Lanjutkan ke kiri
                    } else {
                        head--;            // Pindah ke kiri jika menemukan karakter lain
                    }
                    break;

                default:
                    state = 'q_reject'; // Jika state tidak valid
            }

            createTapeDisplay(tape);

            // Menghentikan simulasi jika sudah selesai
            if (state === 'q_accept' || state === 'q_reject') {
                clearInterval(interval);
                resolve(state === 'q_accept' ? 'Jumlah a dan b sama!' : 'Jumlah a dan b tidak sama!');
            }
        }, 500); // Interval waktu antara setiap langkah mesin Turing (500 ms)
    });
}