import "../styles/home.css";

function Home() {
  return (
    <div className="home">

      <h1>Welcome to ADAid</h1>

      <p>
        A simple blockchain donation platform that uses
        Cardano transactions to make donations transparent
        and verifiable.
      </p>

      <button className="browse-btn">
        Browse Campaigns
      </button>

    </div>
  );
}

export default Home;