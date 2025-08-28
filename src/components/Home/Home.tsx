"use client";

import Link from "next/link";

const HomePage = () => {
  return (
    <main>
      <div className="item">
        <div className="title px-4">
          <h1 className="copa-business-software">
            <span className="copa-business">Copa Business</span>
            <span className="software">Software</span>
          </h1>
        </div>

        <Link href="/auth/login" className="button first">
          <button>Login</button>
          <span className="button-effect"></span>
        </Link>

        <Link href="/privacy-policy" className="button sec">
          <button>Privacy Policy</button>
          <span className="button-effect"></span>
        </Link>

        <Link href="/terms-and-conditions" className="button third">
          <button>Terms & Conditions</button>
          <span className="button-effect"></span>
        </Link>
      </div>

      <style jsx global>{`
        :root {
          --text: hsl(0, 0%, 99%);
          --textDim: hsl(0, 0%, 60%);
          --background: hsl(0, 0%, 7%);
          --primary: hsl(46, 94%, 55%);
          --primaryBg: hsla(46, 94%, 55%, 1%);
          --primaryHi: hsla(46, 94%, 55%, 25%);
          --primaryFg: hsl(46, 94%, 55%);
          --secondary: hsl(156, 51%, 14%);
          --secondaryFg: hsl(156, 51%, 75%);
          --secondaryBg: hsla(156, 51%, 14%, 5%);
          --secondaryHi: hsla(156, 51%, 30%, 50%);
          --accent: hsl(155, 100%, 94%);
          --accentBg: hsla(155, 100%, 94%, 1%);
          --accentHi: hsla(155, 100%, 100%, 25%);
        }

        main {
          background: url("/images/home-bg.webp");
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        .item {
          font-weight: 400;
          color: var(--text);
          padding: 0 10%;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100vh;
          overflow: hidden;
        }

        .title {
          font-size: 10rem;
          font-weight: 700;
          letter-spacing: -0.8rem;
          display: flex;
          flex-direction: column;
          position: absolute;
          justify-content: center;
          align-self: center;
          height: 100%;
          z-index: 1000;
        }

        .copa-business-software {
          display: flex;
          flex-direction: column;
          margin: 0;
          line-height: 10rem;
          width: auto;
        }

        .copa-business {
          align-self: flex-start;
        }

        .software {
          color: var(--primary);
          align-self: flex-end;
        }

        .button {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: absolute;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          height: 50px;
          width: 160px;
          z-index: 9999;
        }

        button {
          height: 50px;
          width: 160px;
          clip-path: path(
            "M 0 25 C 0 -5, -5 0, 80 0 S 160 -5, 160 25, 165 50 80 50, 0 55, 0 25"
          );
          border: none;
          border-radius: 13px;
          background-color: var(--primaryBg);
          box-shadow: 0px -3px 15px 0px var(--primaryHi) inset;
          color: var(--primaryFg);
          font-size: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: absolute;
          transform: translateY(0px);
          transition: all 0.2s ease;
        }

        .button-effect {
          width: 100px;
          height: 60px;
          background-color: var(--primaryHi);
          border-radius: 100%;
          filter: blur(20px);
          position: absolute;
          bottom: -50%;
          transition: all 0.2s ease;
        }

        .button:hover > .button-effect {
          opacity: 60%;
        }

        .button:hover > button {
          transform: translateY(5px);
        }

        .button.first {
          top: 12%;
          right: 20%;
        }

        .button.sec {
          bottom: 13%;
          right: 11%;
        }

        .button.sec > button {
          background-color: var(--accentBg);
          box-shadow: 0px -3px 15px 0px var(--accentHi) inset;
          color: var(--accentFg);
        }

        .button.sec > span {
          background-color: var(--accentHi);
        }

        .button.third {
          bottom: 23%;
          left: 15%;
        }

        .button.third > button {
          background-color: var(--accentBg);
          box-shadow: 0px -3px 15px 0px var(--accentHi) inset;
          color: var(--accentFg);
        }

        .button.third > span {
          background-color: var(--accentHi);
        }

        @media screen and (max-width: 1000px) {
          .title {
            font-size: 4rem;
            line-height: ;
          }

          .copa-business-software {
            line-height: 5rem;
            letter-spacing: -0.3rem;
          }
        }
      `}</style>
    </main>
  );
};

export default HomePage;
