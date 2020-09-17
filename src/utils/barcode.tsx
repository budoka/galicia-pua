import bwipJs from 'bwip-js';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import React from 'react';
import { useBarcode } from 'react-barcodes';

export function createBarcode(type: string, text: string) {
  //import { useBarcode } from 'react-barcodes';
  /*bwipjs.toBuffer(
    {
      bcid: 'code128', // Barcode type
      text: '0123456789', // Text to encode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this})
    },
    (error, buffer) => {
      console.log(buffer.byteLength);
    },
  );*/
}
