import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import logo from '../assets/logoNtagline.png'; 

const exportFunction = {

    exportToExcel : async (data, FileName) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${FileName}`);
        const headerStyle = {
          font: { bold: true, color: { argb: 'FFFFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF486AB3' } },
          alignment: { horizontal: 'center' },
        };
      
        worksheet.addRow(data[0]).eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.style = headerStyle;
        });
     
        data.slice(1).forEach(row => worksheet.addRow(row));    
        worksheet.columns.forEach(column => {
          const maxLength = column.values.reduce((max, value) => {
            return Math.max(max, value ? value.toString().length : 0);
          }, 0);
          column.width = maxLength + 2; 
        });
      
      
        const excelBuffer = await workbook.xlsx.writeBuffer();
        const fileName = `${FileName}_${dayjs().format("YYYY_MM_DD_HH_mm_ss")}.xlsx`;
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
      },
      exportToPDF : (pdfData, headers, total, pdftitle, ExportFileName) => {
        const pdfForPageCount = new jsPDF("p", "mm", "a4");
        autoTable(pdfForPageCount, {
          head: [headers],
          body: pdfData,
          startY: 20 + 15,
          theme: "striped",
          margin: { horizontal: 5 },
          didDrawPage: (data) => {
            if (data.pageNumber === 1) {
              pdfForPageCount.internal.pageCount = data.pageNumber; 
            }
            pdfForPageCount.internal.pageCount = data.pageNumber; 
          },
        });
      
        const totalPages = pdfForPageCount.internal.pageCount || 1;
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.setFontSize(12);
        pdf.text(`${pdftitle}`, 5, 10);
        pdf.text(`Total Records: ${total}`, pdf.internal.pageSize.width - 40, 10);
        pdf.text(`Total Pages: ${totalPages}`, pdf.internal.pageSize.width - 40, 20);
      
        const imgWidth = 50;
        const imgHeight = 15;
        pdf.addImage(logo, "PNG", 2, 10, imgWidth, imgHeight);
      
        autoTable(pdf, {
          head: [headers],
          body: pdfData,
          startY: 20 + imgHeight,
          theme: "striped",
          margin: { horizontal: 5 },
          didDrawPage: (data) => {
            pdf.setFontSize(10);
            pdf.text(`Page ${data.pageNumber} of ${totalPages}`, pdf.internal.pageSize.width - 30, pdf.internal.pageSize.height - 10);
          },
        });
      
        pdf.save(`${ExportFileName}_${dayjs().format("YYYY_MM_DD_HH_mm_ss")}.pdf`);
      },

      exportToExcelOnlyHeader : async (header, FileName) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${FileName}`);
        const headerStyle = {
          font: { bold: true, color: { argb: 'FFFFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF486AB3' } },
          alignment: { horizontal: 'center' },
        };
      
        const headerRow = worksheet.addRow(header);
        headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.style = headerStyle;
        });
      
        // Adjust column widths
        worksheet.columns.forEach(column => {
          const maxLength = column.values.reduce((max, value) => {
            return Math.max(max, value ? value.toString().length : 0);
          }, 0);
          column.width = maxLength + 2;
        });
      
        // Create Excel file and trigger download
        const excelBuffer = await workbook.xlsx.writeBuffer();
        const fileName = `${FileName}_${dayjs().format("YYYY_MM_DD_HH_mm_ss")}.xlsx`;
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
      },

}

export default exportFunction;
