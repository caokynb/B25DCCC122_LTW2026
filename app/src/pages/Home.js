import { useOutletContext } from 'react-router-dom';

export const Home = () => {
  const { history } = useOutletContext();
  return (
    <section className="panel">
      <p className="eyebrow">THỬ THÁCH KIẾN THỨC LẬP TRÌNH</p>
      <h1>Ai là triệu phú</h1>
      <p>Trang chủ và luật chơi sẽ được hoàn thiện ở Bài 2.</p>
      <p>Hãy khám phá ngân hàng 15 câu hỏi để làm quen với HTML, CSS, ES6 và React.</p>
      {history.length > 0 && <p>{`Đã có ${history.length} lượt chơi.`}</p>}
    </section>
  );
};
