import logo from "./logo.svg";
import "./App.css";
import { Tree } from "./tree/tree";
import axios from "axios";
import { useQuery } from "react-query";
function App() {
	const treeStyle = {
		display: "block",
		width: "900px",
		height: "200vh",
	};

	const { data } = useQuery(["nodes"], () =>
		axios.get(` http://localhost:3001/nodes`)
	);
	return (
		<div className="App">
			{data ? <Tree style={treeStyle} node={data} /> : null}
		</div>
	);
}

export default App;
