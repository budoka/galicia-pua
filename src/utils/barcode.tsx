import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';

export interface IPDFData {
  destino: string;
  sector: string;
  centroDeCostos: string;
  numeroDeCaja: string;
  descripcion: string;
  codigoDeBarras: string;
  filename: string;
}

export function createPDF(format: string, data: IPDFData, width: number, scale: number = 1) {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, data.codigoDeBarras, { format });

  const barcode = canvas.toDataURL('image/png');

  if (width < 400) width = 400;
  else if (width > 1600) width = 1600;
  const doc = new jsPDF('landscape', 'px', [width * scale, (width / 1.777) * scale], true);

  doc.context2d.scale(scale, scale);

  width = doc.internal.pageSize.width;
  const height = doc.internal.pageSize.height;

  const borderLine = 1 * scale;
  const titleFontSize = (width / 33.333) * scale;
  const paragraphFontSize = (width / 50) * scale;
  const barcodeSize = {
    width: (canvas.width / (2.5 * (canvas.width / width))) * scale,
    height: (canvas.height / (2.5 * (canvas.width / width))) * scale,
  };

  console.log(canvas.width);
  console.log(barcodeSize.width);
  console.log(width);
  console.log(canvas.width / width);

  doc.setLineWidth(borderLine);
  doc.setFontSize(titleFontSize);

  // Margen
  const margin = 5 * scale;

  // Rectangulo del borde.
  doc.rect(margin, margin, width - margin * 2, height - margin * 2);
  // Linea del medio
  doc.line(margin, height / 2, width - margin, height / 2);

  const centerX = width / 2;
  const centerY = height / 2;
  const initialOffSetY = 1.5;
  let offSetY = 1;
  // Destino
  doc.text(`Destino:`, centerX - margin / 2, margin + doc.getFontSize() * (offSetY + initialOffSetY), { align: 'right' });
  doc.text(`${data.destino}`, centerX + margin / 2, margin + doc.getFontSize() * (offSetY + initialOffSetY));
  // Sector
  offSetY = 2.5;
  doc.text(`Sector:`, centerX - margin / 2, margin + doc.getFontSize() * (offSetY + initialOffSetY), { align: 'right' });
  doc.text(`${data.sector}`, centerX + margin / 2, margin + doc.getFontSize() * (offSetY + initialOffSetY));
  // Centro de Costos
  offSetY = 4;
  doc.text(`Centro de Costos:`, centerX - margin / 2, margin + doc.getFontSize() * (offSetY + initialOffSetY), { align: 'right' });
  doc.text(`${data.centroDeCostos}`, centerX + margin / 2, margin + doc.getFontSize() * (offSetY + initialOffSetY));
  // Nro. de Caja
  offSetY = 5.5;
  doc.text(`Nro. de Caja:`, centerX - margin / 2, margin + doc.getFontSize() * (offSetY + initialOffSetY), { align: 'right' });
  doc.text(`${data.numeroDeCaja}`, centerX + margin / 2, margin + doc.getFontSize() * (offSetY + initialOffSetY));
  // Descripción
  offSetY = 0;
  doc.text(`Descripción`, centerX - centerX / 2, margin + centerY + doc.getFontSize() * (offSetY + initialOffSetY), {
    align: 'center',
  });
  offSetY = 1.5;
  doc.setFontSize(paragraphFontSize);

  const size = doc.getTextDimensions(data.descripcion, {
    fontSize: paragraphFontSize,
    maxWidth: centerX - centerX / 6,
  });

  const heightParagraphLine = doc.getLineHeight();

  const descriptionLines: string[] = doc.splitTextToSize(data.descripcion, size.w);

  const currentLines = descriptionLines.length;
  const maxLines = size.h / heightParagraphLine;

  const hasEllipsis = currentLines > maxLines;

  const descriptionText = descriptionLines.slice(0, maxLines - 1);

  if (hasEllipsis) descriptionText.push('...');

  doc.text(descriptionText, centerX - centerX / 2, margin + centerY + doc.getFontSize() * (offSetY + initialOffSetY) + margin, {
    align: 'center',
    maxWidth: centerX - centerX / 6,
  });
  // Código de barras
  doc.setFontSize(titleFontSize);
  offSetY = 0;
  doc.text(`Caja`, centerX + centerX / 2, margin + centerY + doc.getFontSize() * (offSetY + initialOffSetY), {
    align: 'center',
  });
  offSetY = 1.5;
  doc.addImage(
    barcode,
    'PNG',
    centerX + centerX / 2 - barcodeSize.width / 2,
    margin + centerY + doc.getFontSize() * (offSetY + initialOffSetY) - margin * 2,
    barcodeSize.width,
    barcodeSize.height,
  );

  // Crear archivo
  const filename = `${data.filename} - ${data.numeroDeCaja}`;
  doc.save(filename);
}
