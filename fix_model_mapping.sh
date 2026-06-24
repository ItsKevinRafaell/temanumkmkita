#!/bin/bash

DB_PATH="$HOME/.9router/db/data.sqlite"

echo "Membuat model mapping di 9router..."
if [ -f "$DB_PATH" ]; then
    # 1. Hapus jika sudah ada duplikasi mapping lama agar bersih
    sqlite3 "$DB_PATH" "DELETE FROM model_mappings WHERE sourceModel IN ('claude-sonnet-4-6', 'claude-3-5-sonnet-latest');"
    
    # 2. Insert mapping baru: arahkan string dari Claude Code ke model resmi Anthropic di Freemodeldev
    # Kita arahkan ke claude-3-5-sonnet-20241022 atau sesuaikan dengan model yang aktif di akun Freemodeldev kamu
    sqlite3 "$DB_PATH" "INSERT INTO model_mappings (sourceModel, targetModel, providerType) VALUES ('claude-sonnet-4-6', 'claude-3-5-sonnet-20241022', 'anthropic-compatible');"
    sqlite3 "$DB_PATH" "INSERT INTO model_mappings (sourceModel, targetModel, providerType) VALUES ('claude-3-5-sonnet-latest', 'claude-3-5-sonnet-20241022', 'anthropic-compatible');"
    
    echo "✓ Model mapping berhasil ditambahkan!"
else
    echo "✗ Database 9router tidak ditemukan."
fi

echo "Restarting 9router..."
9router stop && 9router start
echo "Selesai! Silakan coba jalankan 'claude' kembali."
