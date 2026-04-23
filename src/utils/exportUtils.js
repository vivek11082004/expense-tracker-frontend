// utils/exportUtils.js
// Basic Excel export utility using SheetJS (xlsx)
// You must install xlsx: npm install xlsx

import * as XLSX from 'xlsx';

export function exportToExcel(data, filename = 'export.xlsx') {

  if(!data || data.length === 0){
    alert("No data to export!");
    return;
  }
  try{
      // data: array of objects
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`, {
    bookType: 'xlsx',
    type: 'array',
  });
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("An error occurred while exporting. Please try again.");
  }

}
