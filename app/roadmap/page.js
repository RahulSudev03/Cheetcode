"use client"
import React, { useState } from 'react';

const dataStructures = {
  "Arrays": "An array is a collection of items stored at contiguous memory locations. It is used to store elements of the same type.",
  "Hashmaps": "A HashMap is a data structure that stores key-value pairs. It allows fast access, insertion, and deletion operations.",
  "Two Pointers": "The Two Pointers technique involves using two pointers to iterate through an array or list to solve problems more efficiently.",
  "Stack": "A Stack is a linear data structure that follows the Last In First Out (LIFO) principle. It is used in many algorithms.",
  "Heap": "A Heap is a specialized tree-based data structure that satisfies the heap property. Used for implementing priority queues.",
  "Trees": "A Tree is a hierarchical data structure that consists of nodes, with a single root node and subtrees of children nodes.",
  "Tries": "A Trie is a special type of tree used to store associative data structures. It is used for dynamic spell checking, auto-complete, etc.",
  "Graphs": "A Graph is a collection of nodes connected by edges. It can represent various networks such as social networks, communication networks, etc.",
  "Backtracking": "Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally.",
  "Binary Search": "Binary Search is a search algorithm that finds the position of a target value within a sorted array.",
  "Sliding Window": "Sliding Window is a technique for solving problems involving arrays or lists by creating a 'window' that slides over the data.",
  "Linked List": "A Linked List is a linear data structure consisting of a group of nodes, where each node contains data and a reference (or link) to the next node in the sequence."
};

export default function Roadmap() {
  const [selectedStructure, setSelectedStructure] = useState(null);

  const handleClick = (structure) => {
    if (selectedStructure === structure) {
      setSelectedStructure(null); // Toggle off if clicked again
    } else {
      setSelectedStructure(structure); // Show info for selected structure
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#1e1e2f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      {/* Title */}
      <h1 style={{ color: '#00bfff', marginBottom: '20px', position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}></h1>

      {/* SVG for Straight Arrows */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#00bfff" />
          </marker>
        </defs>
        {/* Adjusted lines for arrows */}
        <line x1="50%" y1="50%" x2="50%" y2="20%" stroke="#00bfff" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#00bfff" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="#00bfff" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#00bfff" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#00bfff" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="#00bfff" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="#00bfff" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#00bfff" strokeWidth="2" markerEnd="url(#arrowhead)" />
      </svg>

      {/* Central Circular Node */}
      <div id="dataStructures" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', padding: '30px', border: '2px solid #00bfff', borderRadius: '50%', backgroundColor: '#FFD700', zIndex: '1' }}>
      <h2 style={{ margin: 0, fontWeight: 'bold', color: '#000' }}>Data Structures</h2>
      </div>

      {/* Positioned Nodes in a Circular Layout */}
      <button onClick={() => handleClick('Binary Search')} style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFE599', color: '#000', border: '1px solid #000', borderRadius: '5px', padding: '10px', fontWeight: 'bold' }}>Binary Search</button>
      <button onClick={() => handleClick('Sliding Window')} style={{ position: 'absolute', top: '25%', left: '75%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFE599', color: '#000', border: '1px solid #000', borderRadius: '5px', padding: '10px', fontWeight: 'bold' }}>Sliding Window</button>
      <button onClick={() => handleClick('Hashmaps')} style={{ position: 'absolute', top: '50%', left: '85%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFE599', color: '#000', border: '1px solid #000', borderRadius: '5px', padding: '10px', fontWeight: 'bold' }}>Hashmaps</button>
      <button onClick={() => handleClick('Graphs')} style={{ position: 'absolute', top: '75%', left: '75%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFE599', color: '#000', border: '1px solid #000', borderRadius: '5px', padding: '10px', fontWeight: 'bold' }}>Graphs</button>
      <button onClick={() => handleClick('Heap')} style={{ position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFE599', color: '#000', border: '1px solid #000', borderRadius: '5px', padding: '10px', fontWeight: 'bold' }}>Heap</button>
      <button onClick={() => handleClick('Backtracking')} style={{ position: 'absolute', top: '75%', left: '25%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFE599', color: '#000', border: '1px solid #000', borderRadius: '5px', padding: '10px', fontWeight: 'bold' }}>Backtracking</button>
      <button onClick={() => handleClick('Linked List')} style={{ position: 'absolute', top: '50%', left: '15%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFE599', color: '#000', border: '1px solid #000', borderRadius: '5px', padding: '10px', fontWeight: 'bold' }}>Linked List</button>
      <button onClick={() => handleClick('Trees')} style={{ position: 'absolute', top: '25%', left: '25%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFE599', color: '#000', border: '1px solid #000', borderRadius: '5px', padding: '10px', fontWeight: 'bold' }}>Trees</button>

      {/* Description Box */}
      {selectedStructure && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          border: '2px solid #00bfff',
          borderRadius: '10px',
          backgroundColor: 'rgba(51, 51, 51, 0.9)',
          color: '#fff',
          maxWidth: '300px',
          textAlign: 'center',
          zIndex: '2',
          fontWeight: 'bold'
        }}>
          <h3>{selectedStructure}</h3>
          <p>{dataStructures[selectedStructure]}</p>
        </div>
      )}
    </div>
  );
}
