import React, { useState } from 'react';

const Item = ({ val, del }) => {
  const { id, name, score, cls } = val;
  
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{score}</td>
      <td>{cls}</td>
      <td>
        <button onClick={() => del(id)}>Xóa</button>
      </td>
    </tr>
  );
};

const List = ({ list, del }) => {
  return (
    <table border="1" style={{ width: '100%', marginTop: '20px', textAlign: 'center' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Điểm số</th>
          <th>Lớp</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {list.map((i) => (
          <Item key={i.id} val={i} del={del} />
        ))}
      </tbody>
    </table>
  );
};

const App = () => {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [cls, setCls] = useState('');
  const [err, setErr] = useState('');
  const [type, setType] = useState('ALL');

  const add = () => {
    if (!name || !score || !cls) {
      setErr('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const num = Number(score);
    if (num < 0 || num > 10) {
      setErr('Điểm số không hợp lệ!');
      return;
    }

    setErr('');
    setList([...list, { id: Date.now(), name, score: num, cls }]);
    setName('');
    setScore('');
    setCls('');
  };

  const del = (id) => {
    setList(list.filter((i) => i.id !== id));
  };

  const filterList = list.filter((i) => {
    if (type === 'G') return i.score >= 8;
    if (type === 'F') return i.score < 5;
    return true;
  });

  const total = list.length;
  const sum = list.reduce((a, b) => a + b.score, 0);
  const avg = total > 0 ? (sum / total).toFixed(2) : 0;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Quản lý điểm sinh viên</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <input 
          placeholder="Họ tên" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ marginRight: '5px' }}
        />
        <input 
          placeholder="Điểm số" 
          type="number" 
          value={score} 
          onChange={(e) => setScore(e.target.value)} 
          style={{ marginRight: '5px' }}
        />
        <input 
          placeholder="Lớp" 
          value={cls} 
          onChange={(e) => setCls(e.target.value)} 
          style={{ marginRight: '5px' }}
        />
        <button onClick={add}>Thêm</button>
      </div>

      {err && <p style={{ color: 'red' }}>{err}</p>}

      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setType('ALL')} style={{ marginRight: '5px' }}>Tất cả</button>
        <button onClick={() => setType('G')} style={{ marginRight: '5px' }}>Giỏi</button>
        <button onClick={() => setType('F')}>Trượt</button>
      </div>

      <div>
        <strong>{`Tổng số sinh viên: ${total}`}</strong>
        <br />
        <strong>{`Điểm trung bình: ${avg}`}</strong>
      </div>

      <List list={filterList} del={del} />
    </div>
  );
};

export default App;
