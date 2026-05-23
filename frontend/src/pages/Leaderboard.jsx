import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./Leaderboard.css";

function Leaderboard() {
  const { examId } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        setError("");

        const user = JSON.parse(localStorage.getItem("user"));

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const res = await axios.get(
          `http://localhost:5000/api/results/leaderboard/${examId}`,
          config,
        );

        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.log("Leaderboard Error:", err.response?.data || err.message);
        setError("Failed to load leaderboard.");
        setLoading(false);
      }
    };
    fetchBoard();
  }, [examId]);

  const getRankBadge = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboard</h2>

        <Link to="/student-dashboard" className="back-btn">
          ⬅ Back to Dashboard
        </Link>
      </div>

      {loading && <p className="loading">Loading leaderboard...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p className="empty">No leaderboard data yet.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Class</th>
              <th>Score</th>
              <th>Percentage</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={item._id}>
                <td className="rank">{getRankBadge(index)}</td>
                <td>{item.student?.name}</td>
                <td>{item.student?.className}</td>
                <td>
                  {item.score} / {item.total}
                </td>
                <td>{item.percentage ?? 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
