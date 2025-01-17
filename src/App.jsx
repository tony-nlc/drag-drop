import React, { useState, useRef } from "react";
import { FaDeleteLeft  } from "react-icons/fa6";
import { RiDeleteBin2Fill } from "react-icons/ri"
import "./App.css";

const App = () => {
    const [sections, setSections] = useState([
        {
            id: "section1",
            title: "Section 1",
            contents: ["Content A", "Content B"],
        },
        {
            id: "section2",
            title: "Section 2",
            contents: ["Content X", "Content Y"],
        },
    ]);

    const dragItem = useRef(null);

    const handleDragStart = (e, type, index, parentIndex) => {
        e.stopPropagation();
        dragItem.current = { type, index, parentIndex };
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, type, dropIndex, parentIndex) => {
        e.stopPropagation();
        const dragInfo = dragItem.current;

        if (!dragInfo) return;

        const updatedSections = [...sections];

        if (type === "section" && dragInfo.type === "section") {
            const [draggedSection] = updatedSections.splice(dragInfo.index, 1);
            updatedSections.splice(dropIndex, 0, draggedSection);
        } else if (type === "content" && dragInfo.type === "content") {
            const contents = [...updatedSections[parentIndex].contents];
            const [draggedContent] = contents.splice(dragInfo.index, 1);
            contents.splice(dropIndex, 0, draggedContent);
            updatedSections[parentIndex].contents = contents;
        } else if (
            type === "content" &&
            dragInfo.type === "content" &&
            dragInfo.parentIndex !== parentIndex
        ) {
            const dragSection = updatedSections[dragInfo.parentIndex];
            const dropSection = updatedSections[parentIndex];

            const [draggedContent] = dragSection.contents.splice(
                dragInfo.index,
                1
            );
            dropSection.contents.splice(dropIndex, 0, draggedContent);
        }

        setSections(updatedSections);
        dragItem.current = null;
    };

    const addSection = () => {
        const sectionName = prompt("Enter the name of the new section:");
        if (sectionName) {
            const newSection = {
                id: `section${sections.length + 1}`,
                title: sectionName,
                contents: [],
            };
            setSections([...sections, newSection]);
        }
    };

    const deleteSection = (index) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
    };

    const addContent = (sectionIndex) => {
        const contentText = prompt("Enter content:");
        if (contentText) {
            const updatedSections = [...sections];
            updatedSections[sectionIndex].contents.push(contentText);
            setSections(updatedSections);
        }
    };

    const deleteContent = (sectionIndex, contentIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].contents = updatedSections[
            sectionIndex
        ].contents.filter((_, i) => i !== contentIndex);
        setSections(updatedSections);
    };

    return (
        <div className="container">
            <button onClick={addSection}>+ Section</button>
            {sections.map((section, sectionIndex) => (
                <div
                    key={section.id}
                    className="section"
                    draggable
                    onDragStart={(e) =>
                        handleDragStart(e, "section", sectionIndex)
                    }
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "section", sectionIndex)}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <h1>{section.title}</h1>
                        <RiDeleteBin2Fill 
                            style={{ fontSize: "50px", cursor:"pointer"}}
                            onClick={() => deleteSection(sectionIndex)}
                        />
                    </div>
                    <button onClick={() => addContent(sectionIndex)}>
                        Add Content
                    </button>
                    {section.contents.map((content, contentIndex) => (
                        <div
                            key={`${section.id}-${content}`}
                            className="content"
                            draggable
                            onDragStart={(e) =>
                                handleDragStart(
                                    e,
                                    "content",
                                    contentIndex,
                                    sectionIndex
                                )
                            }
                            onDragOver={handleDragOver}
                            onDrop={(e) =>
                                handleDrop(
                                    e,
                                    "content",
                                    contentIndex,
                                    sectionIndex
                                )
                            }
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <h2 className="text">{content}</h2>
                                <FaDeleteLeft 
                                    style={{ fontSize: "30px", color:"darkred", cursor:"pointer"}}
                                    onClick={() =>
                                        deleteContent(
                                            sectionIndex,
                                            contentIndex
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default App;
