import React, { useEffect, useState } from 'react';

const BarangTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ganti URL di bawah sesuai endpoint API Anda
    fetch('/api/barang')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Daftar Barang</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID Barang</th>
            <th>Nama Barang</th>
            <th>Harga Jual</th>
            <th>Tanggal Kadaluarsa</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id_barang}>
              <td>{item.id_barang}</td>
              <td>{item.nama_barang}</td>
              <td>{item.harga_jual}</td>
              <td>{item.tgl_kadaluarsa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BarangTable;
