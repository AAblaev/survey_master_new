import React, { useState } from "react";
import "./TableWithGrid.css"; // Подключите файл стилей

interface IOption {
  docID: number;
  height: number;
  order: number;
  title: string;
  width: number;
  dimension: number;
}

interface ICellData {
  row: number;
  col: number;
  value: string;
}

interface Props {
  options: IOption[];
}

const TableWithGrid: React.FC<Props> = ({ options }) => {
  const dimension0Options = options.filter((option) => option.dimension === 0);
  const dimension1Options = options.filter((option) => option.dimension === 1);

  const [tableData, setTableData] = useState<ICellData[][]>(
    dimension0Options.map((d0Option) => {
      return dimension1Options.map((d1Option) => ({
        row: d0Option.docID,
        col: d1Option.docID,
        value: "",
      }));
    })
  );

  const handleCellChange = (rowIndex: number, colIndex: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][colIndex].value = newValue;
    setTableData(updatedTableData);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="empty-cell"></div>
        {dimension1Options.map((option) => (
          <div key={option.docID} className="table-header-cell">
            {option.title}
          </div>
        ))}
      </div>

      <div className="table-body">
        {tableData.map((row, rowIndex) => (
          <div key={rowIndex} className="table-row">
            <div className="table-row-header">
              {dimension0Options[rowIndex].title}
            </div>
            {row.map((cell, colIndex) => (
              <div key={colIndex} className="table-cell">
                <input
                  type="text"
                  value={cell.value}
                  onChange={handleCellChange(rowIndex, colIndex)}
                  className="text-field"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableWithGrid;
