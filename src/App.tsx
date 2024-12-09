import { useState } from 'react';
import './App.css';
import { Scanner } from "./parse";
import { stand, triangle } from './code';

function App() {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [select, setSelect] = useState("");
  const [output, setOutput] = useState("");
  const [outputError, setOutputError] = useState("");

  const compute = (str: string) => {
    setOutput("");
    setOutputError("");
    try {
      const x = inputA ? new Scanner(inputA).parse_term() : null;
      if (x === null) throw Error("Aの入力が必要です");
      let outputString = "";
      if (str === "stand") {
        setSelect("A ∊ OT");
        outputString = `出力：${stand(x)}`;
      } else {
        const y = inputB ? new Scanner(inputB).parse_term() : null;
        if (y === null) throw Error("Aの入力が必要です");
        setSelect("A ◁ B");
        outputString = `出力：${triangle(x, y)}`
      }
      setOutput(outputString);
    } catch (error) {
      if (error instanceof Error) setOutputError(error.message);
      else setOutputError("不明なエラー");
      console.error("Error in compute:", error);
    }
  };

  return (
    <div className="app">
      <header>多変数亜関数の標準形判定</header>
      <main>
        <p className="rdm">
          入力は、任意の0 &lt; nに対し、亜(a_n,a_&#123;n-1&#125;,...,a_2,a_1,a_0), 亜_&#123;a_n&#125;(a_&#123;n-1&#125;,...,a_2,a_1,a_0)の形式で行ってください。<br />
          _, &#123;, &#125;は省略可能です。<br />
          略記として、1 := 亜(0), n := 1 + 1 + ...(n個の1)... + 1, ω := 亜(1), Ω := 亜(1,0), I := 亜(1,0,0)が使用可能。<br />
          また、亜はaで、ωはwで、ΩはWで代用可能。
        </p>
        A:
        <input
          className="input is-primary"
          value={inputA}
          onChange={(e) => setInputA(e.target.value)}
          type="text"
          placeholder="入力A"
        />
        B:
        <input
          className="input is-primary"
          value={inputB}
          onChange={(e) => setInputB(e.target.value)}
          type="text"
          placeholder="入力B"
        />
        <div className="block">
          <button className="button is-primary" onClick={() => compute("stand")}>
            A ∊ OT
          </button>
          <button className="button is-primary" onClick={() => compute("triangle")}>
            A ◁ B
          </button>
        </div>
        <div className="box is-primary">
          {outputError !== "" ? (
            <div className="notification is-danger">{outputError}</div>
          ) : (
            <p>
              {select}<br />
              {output}
            </p>
          )}
        </div>
      </main>
      <footer>
        <a href="https://googology.fandom.com/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:%E7%AB%B9%E5%8F%96%E7%BF%81/%E5%A4%9A%E5%A4%89%E6%95%B0%E4%BA%9E%E9%96%A2%E6%95%B0" target="_blank" rel="noreferrer">ユーザーブログ:みずどら/多変数亜関数の同値な定義 | 巨大数研究 Wiki | Fandom</a>(2024/12/03 閲覧)<br />
        このページは<a href="https://creativecommons.org/licenses/by-sa/3.0/legalcode" target="_blank" rel="noreferrer">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>の下に公開されます。<br />
      </footer>
    </div>
  );
}

export default App;