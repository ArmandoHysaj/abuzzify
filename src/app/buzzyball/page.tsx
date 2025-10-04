import FootballNewsPage from "./football-page/footballNewsPage";
export default function FootballPage() {
  return (
    <>
      <div className="header">
        <div className="header-title">
          <h1>Check out Football Matches</h1>
        </div>
      </div>
      <div className="football-section">
        <FootballNewsPage></FootballNewsPage>
      </div>
    </>
  );
}
