import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import { Button } from "beautiful-react-ui";
import React from "react";
import "beautiful-react-diagrams/styles.css";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
export const Tree = ({ node }) => {
	const initialSchema = createSchema({
		// nodes: [
		// 	// {
		// 	// 	id: "node-1",
		// 	// 	content: "Node 1",
		// 	// 	coordinates: [150, 60],
		// 	// 	outputs: [{ id: "port-1", alignment: "top" }],
		// 	// },
		// 	// {
		// 	// 	id: "node-2",
		// 	// 	content: "Node 2",
		// 	// 	coordinates: [40, 290],
		// 	// 	inputs: [{ id: "port-2", alignment: "right" }],
		// 	// 	outputs: [{ id: "port-3", alignment: "right" }],
		// 	// },
		// ],
		nodes: node.data,

		links: [{ input: "port-1", output: "port-3" }],
	});

	//   커스텀 node
	const CustomRender = ({ id, content, body, data, inputs, outputs }) => (
		<div style={{ background: "#888" }}>
			<div style={{ textAlign: "right" }}>
				<Button
					icon="times"
					size="small"
					onClick={() => data.onClick(id)}
				/>
			</div>
			<div role="button" style={{ padding: "15px" }}>
				{content}
				{body}
			</div>
			<div
				style={{
					marginTop: "10px",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				{inputs.map((port) =>
					React.cloneElement(port, {
						style: {
							width: "25px",
							height: "25px",
							background: "#1b263b",
						},
					})
				)}
				{outputs.map((port) =>
					React.cloneElement(port, {
						style: {
							width: "25px",
							height: "25px",
							background: "#1B263B",
						},
					})
				)}
			</div>
		</div>
	);

	const UncontrolledDiagram = () => {
		// create diagrams schema
		const [schema, { onChange, addNode, removeNode }] =
			useSchema(initialSchema);

		// 노드 삭제 함수
		const deleteNodeFromSchema = (id) => {
			const nodeToRemove = schema.nodes.find((node) => node.id === id);
			removeNode(nodeToRemove);
		};
		// 노드 추가 시 이름 상태 값
		const [name, setName] = useState("");
		const [text, setText] = useState("");
		const nameChange = (e) => {
			setName(e.target.value);
		};
		const textChange = (e) => {
			setText(e.target.value);
		};

		// 노드 추가 시 등록 팝업 상태 값
		const [open, setOpen] = useState(false);

		const openModal = () => {
			setOpen(true);
		};
		const closeModal = () => {
			setOpen(false);
		};

		// 노드 추가 함수
		const addNewNode = () => {
			const nextNode = {
				id: `node-${schema.nodes.length + 1}`,
				content: `${name}`,
				body: `${text}`,
				coordinates: [
					schema.nodes[schema.nodes.length - 1].coordinates[0] + 100,
					schema.nodes[schema.nodes.length - 1].coordinates[1],
				],
				render: CustomRender,
				data: { onClick: deleteNodeFromSchema },
				inputs: [{ id: `port-${Math.random()}` }],
				outputs: [{ id: `port-${Math.random()}` }],
			};

			addNode(nextNode);

			console.log(text, name);
		};

		//  등록시 팝업 css
		const nameModal = {
			position: "fixed",
			left: "50%",
			top: "50%",
			transform: "translate(-50%, -50%)",
			padding: "100px",
			background: "rgba(255,255,255,0.6)",
			border: "1px solid #fff",
			zIndex: "50",
		};
		return (
			<>
				<div style={{ height: "100vh" }}>
					<Button color="primary" icon="plus" onClick={openModal}>
						Add new node
					</Button>
					<Diagram schema={schema} onChange={onChange} />
				</div>
				{open ? (
					<div style={nameModal}>
						<h3>등록 팝업</h3>
						<input
							onChange={nameChange}
							value={name}
							type="text"
							placeholder="제목을 입력해주세요."
						/>
						<textarea
							onChange={textChange}
							value={text}
							placeholder="내용을 입력해주세요."
						/>

						<button
							onClick={() => {
								addNewNode();
								closeModal();
							}}
						>
							등록
						</button>
						<button onClick={closeModal}>취소</button>
					</div>
				) : null}
			</>
		);
	};

	return <>{node ? <UncontrolledDiagram /> : null}</>;
};
