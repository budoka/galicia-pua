import jsPDF from 'jspdf';
import { trim } from 'lodash';
import { createBarcode } from 'src/utils/barcode';

export interface IPDFData {
  destino: string;
  sector: string;
  centroDeCostos: string;
  numeroDeCaja: string;
  descripcion: string;
  filename: string;
}

export function createCajaPDF(format: string, data: IPDFData, width: number, scale: number = 1) {
  const barcode = createBarcode(format, data.numeroDeCaja.padStart(10, '0'));

  if (width < 400) width = 400;
  else if (width > 1600) width = 1600;
  const doc = new jsPDF('landscape', 'px', [width * scale, (width / 1.777) * scale], true);

  doc.context2d.scale(scale, scale);

  width = doc.internal.pageSize.width;
  const height = doc.internal.pageSize.height;

  const borderLine = 1 * scale;
  const titleFontSize = (width / 33.333) * scale;
  const paragraphFontSize = (width / 45) * scale;
  const barcodeSize = {
    width: (barcode.width / (2.5 * (barcode.width / width))) * scale,
    height: (barcode.height / (2.5 * (barcode.width / width))) * scale,
  };

  const centerX = width / 2;
  const centerY = height / 2;
  const initialOffSetY = 1.5;
  let offSetY = 1;
  let x = 0;
  let y = 0;
  let x2 = 0;
  let y2 = 0;

  doc.setLineWidth(borderLine);
  doc.setFontSize(titleFontSize);

  // Margen
  const margin = (width / 80) * scale;

  // Rectangulo del borde.
  x = margin;
  y = margin;
  x2 = width - margin * 2;
  y2 = height - margin * 2;
  doc.rect(x, y, x2, y2);

  // Linea horizontal
  x = margin;
  y = centerY;
  x2 = width - margin;
  y2 = centerY;
  doc.line(x, y, x2, y2);

  // Linea vertical
  x = centerX;
  y = centerY;
  x2 = centerX;
  y2 = height - margin;
  doc.line(x, y, x2, y2);

  // Destino
  x = centerX - margin / 2;
  y = margin + doc.getFontSize() * (offSetY + initialOffSetY);
  doc.text(`Destino:`, x, y, { align: 'right' });
  x = centerX + margin / 2;
  y = margin + doc.getFontSize() * (offSetY + initialOffSetY);
  const targetText = getTrimmedText(doc, data.destino, titleFontSize, centerX - margin * 4, doc.getFontSize());
  doc.text(targetText, x, y);

  // Sector
  offSetY = 2.5;
  x = centerX - margin / 2;
  y = margin + doc.getFontSize() * (offSetY + initialOffSetY);
  doc.text(`Sector:`, x, y, { align: 'right' });
  x = centerX + margin / 2;
  y = margin + doc.getFontSize() * (offSetY + initialOffSetY);
  const sectorText = getTrimmedText(doc, data.sector, titleFontSize, centerX - margin * 4, doc.getFontSize());
  doc.text(sectorText, x, y);

  // Centro de Costos
  offSetY = 4;
  x = centerX - margin / 2;
  y = margin + doc.getFontSize() * (offSetY + initialOffSetY);
  doc.text(`Centro de Costos:`, x, y, { align: 'right' });
  x = centerX + margin / 2;
  y = margin + doc.getFontSize() * (offSetY + initialOffSetY);
  const costCenterText = getTrimmedText(doc, data.centroDeCostos, titleFontSize, centerX - margin * 4, doc.getFontSize());
  doc.text(costCenterText, x, y);

  // Nro. de Caja
  offSetY = 5.5;
  x = centerX - margin / 2;
  y = margin + doc.getFontSize() * (offSetY + initialOffSetY);
  doc.text(`Nro. de Caja:`, x, y, { align: 'right' });
  x = centerX + margin / 2;
  y = margin + doc.getFontSize() * (offSetY + initialOffSetY);
  const cajaNumberText = getTrimmedText(doc, data.numeroDeCaja, titleFontSize, centerX - margin * 4, doc.getFontSize());
  doc.text(cajaNumberText, x, y);

  // Descripción
  offSetY = 0;
  x = centerX - centerX / 2;
  y = margin + centerY + doc.getFontSize() * (offSetY + initialOffSetY);
  doc.text(`Descripción`, x, y, {
    align: 'center',
  });
  offSetY = 1.5;
  x = centerX - centerX / 2;
  y = centerY + margin / 2 + doc.getFontSize() * (offSetY + initialOffSetY);
  y2 = height - margin * 2;
  doc.setFontSize(paragraphFontSize);

  const descriptionText = getTrimmedText(doc, data.descripcion, paragraphFontSize, centerX - centerX / 6, y2 - y);

  doc.text(descriptionText, x, y, {
    align: 'center',
    maxWidth: centerX - centerX / 6,
  });

  // Código de barras
  doc.setFontSize(titleFontSize);
  offSetY = 0;
  x = centerX + centerX / 2;
  y = centerY + margin + doc.getFontSize() * (offSetY + initialOffSetY);
  doc.text(`Caja`, x, y, {
    align: 'center',
  });
  offSetY = 1.5;
  x = centerX + centerX / 2 - barcodeSize.width / 2;
  y = margin + centerY + doc.getFontSize() * (offSetY + initialOffSetY) - margin * 2;
  doc.addImage(barcode.dataURL, 'PNG', x, y, barcodeSize.width, barcodeSize.height);

  // Crear archivo
  const filename = `${data.filename} - ${data.numeroDeCaja}`;
  doc.save(filename);
}

const getTrimmedText = (doc: jsPDF, text: string, fontSize: number, maxWidth: number, maxHeight: number) => {
  const blockSize = doc.getTextDimensions(text, {
    fontSize,
    maxWidth,
  });

  const lines: string[] = doc.splitTextToSize(text, blockSize.w);

  const lineHeight = blockSize.h / lines.length;

  const allLines = lines.length;

  const maxLines = maxHeight / lineHeight;

  const hasEllipsis = allLines > maxLines;

  let trimmedText = lines;

  if (hasEllipsis) {
    trimmedText = trimmedText.slice(0, maxLines);
    trimmedText.push('...');
  }

  return trimmedText.join(' ');
};
