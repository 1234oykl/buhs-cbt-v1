
import { useEffect, useState } from "react";
import api from "../config/api";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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

        if (!user?.token) {
          setError("Unauthorized access");
          setLoading(false);
          return;
        }

        const res = await api.get(
          `/results/leaderboard/${examId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setData(res.data || []);
        setLoading(false);
      } catch (err) {
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
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">

        <h3 className="fw-bold">🏆 Leaderboard</h3>

        <Link to="/student-dashboard" className="btn btn-outline-primary">
          ⬅ Back
        </Link>

      </div>

      {/* LOADING */}
      {loading && <p>Loading leaderboard...</p>}

      {/* ERROR */}
      {error && <p className="text-danger">{error}</p>}

      {/* EMPTY */}
      {!loading && !error && data.length === 0 && (
        <p>No leaderboard data yet.</p>
      )}

      {/* TABLE */}
      {!loading && !error && data.length > 0 && (
        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">
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
                  <td>{getRankBadge(index)}</td>
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

        </div>
      )}

    </div>
  );
}

export default Leaderboard;

