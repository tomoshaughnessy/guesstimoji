import React from 'react';

interface Arguments {
    header: string;
    emptyMessage: string;
    onClick(index: number): void;
    selections: any[];
}

// Select component which will take in rooms or preview
const Select = ({ header, emptyMessage, onClick, selections }: Arguments) => {
    const nonEmpty = selections != null && selections.length > 0;

    return (
        <div>
            <h3>{header}</h3>
            <div id="board-select">
                {nonEmpty
                    ? selections.map((selection, index) => (
                          <button
                              id="board-select-button"
                              onClick={() => onClick(index)}
                              autoFocus={index == 1}
                              key={index}
                          >
                              {selection}
                          </button>
                      ))
                    : `${emptyMessage}`}
            </div>
        </div>
    );
};

export default Select;
