export const a = '';

/* 
export const excelToDatabase = async (file: File, preview: BoxTemplate, boxId: number) => {
    // Se pasa el archivo a un buffer y se carga el excel del buffer
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
  
    const sheet = workbook.worksheets[0];
  
    let contentType: ContentType;
    let content: BoxDocumentAPIRequest[] | BoxDetailAPIRequest[] = [];
  
    let columnLength = 0;
  
    if (sheet.getCell(1, 1).value === COLUMN_NAME_DOCUMENT_TYPE && (preview as BoxDocumentTemplate[])[0].inclusions) {
      contentType = 'Caja con Documentos';
      columnLength = (preview as BoxDocumentTemplate[])[0].inclusions.length + 1; // Por la columna tipo de documento
    } else if (sheet.getCell(1, 1).value !== COLUMN_NAME_DOCUMENT_TYPE && (preview as BoxDetailTemplate[])[0].templateId) {
      contentType = 'Caja con Detalle';
      columnLength = (preview as BoxDetailTemplate[]).length;
    } else {
      
      throw new Error();
    }
  
    sheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      let dataRow: any = {};
      let columns: BoxDetailColumnAPIRequest[] = [];
  
      if (rowNumber > 1)
        
        row.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
          if (!cell.value || colNumber > columnLength) { 
            return
          }
          
          let columnName = sheet.getCell(1, colNumber).value?.toString()!;
          
          let value: string | number | undefined = sheet.getCell(rowNumber, colNumber).value?.toString() ?? ''; 
  
         
  
          if (!columnName) return;
  
          if (contentType === 'Caja con Documentos') {
            // DOCUMENTO
            // Parseo de datos
            columnName = _.camelCase(columnName);
            if (columnName === 'tipoDocumental') {
              columnName = 'idTipoDocumento';
              value = (preview as BoxDocumentTemplate[]).find((p) => p.description === value)?.id;
            } else if (columnName.toLowerCase().startsWith('fecha')) {
              value = formatDate(value, 'YYYY-MM-DD');
            }
            dataRow[columnName] = value;
          } else if (contentType === 'Caja con Detalle') {
            // DETALLE
            // Parseo de datos
            const columnId = (preview as BoxDetailTemplate[]).find((p) => p.title === columnName)?.id!; 
            const columnDataType = (preview as BoxDetailTemplate[]).find((p) => p.title === columnName)?.dataType!; 
            if (columnDataType.toLowerCase() === 'fecha') {
              // formatDate(editable.fechaCierre.toDate())
              //value = formatDate(value, 'DD/MM/YYYY'); // cambiar el value para q tenga el que necesito
              value = format(moment(value).toDate());
              
            }
            columns = [...columns, { valor: value, idColumna: columnId }];
          }
        });
  
      if (contentType === 'Caja con Documentos' && _.isEmpty(dataRow)) return;
      else if (contentType === 'Caja con Detalle' && _.isEmpty(columns)) return;
  
      dataRow['idCaja'] = boxId;
      dataRow['idUsuarioAlta'] = 3; // solo para documento
      dataRow['idSectorOrigen'] = 1243; // solo para documento
      dataRow['idSectorTenedor'] = 1243; // solo para documento
      dataRow['idPlantilla'] = (preview as BoxDetailTemplate[])[0].templateId; // solo para detalle
      dataRow['columnas'] = columns// Agregar metodo que revisa si faltan agregar columnas, y si faltan es porque el Excel en esa columna esta vacia, en ese caso poner valores null acorde
      content = [...content, dataRow];
  
      
    });
  
    // verifica si en el excel hay columnas vacias, en ese caso las agrega con valores null correspondientes...
    const checkColumns = (contentType: ContentType, preview: BoxTemplate, columns:  BoxDetailColumnAPIRequest[]) => {
      return columns;
    }
    
    function formatDate(value: string, format: string) {
      return value && Dayjs(value).add(3, 'hour').format(format);
    }
  
    return await guardarContenido2(contentType, content);
    
  };
  
  export const previewToExcel = async (filename: string, preview: BoxTemplate) => {
    if (!preview || preview.length === 0) return;
  
    // Excel
    const workbook = new ExcelJS.Workbook();
    // Hojas
    const previewSheet = workbook.addWorksheet('Template Carga Documentos', {
      properties: { defaultColWidth: 90 },
    });
    let documentSheet = workbook.addWorksheet('TipoDocumentoPermitido', {
      properties: { defaultColWidth: 90 },
    });
  

    // Columnas
    let columns: (Pick<BoxDocumentColumnTemplate, 'title'> | BoxDocumentColumnTemplate | BoxDetailTemplate)[] = [];
    // Lista de documentos (para caja con documentos)
    let availableDocuments: string[] = [];
  
    // Mapeo de columnas y lista de documentos
    if ((preview[0] as BoxDocumentTemplate).inclusions) {
      const documentPreview = preview as BoxDocumentTemplate[];
      availableDocuments = documentPreview.map((doc) => doc.description);
  
      const inclusions = documentPreview.map((doc) => doc.inclusions);
      columns = inclusions[0].map((c) => {
        return { ...c, title: splitStringUppercase(removeStringPrefix(c.title, 'Inclusion')) };
      });
      columns = [{ title: COLUMN_NAME_DOCUMENT_TYPE }, ...columns];
    } else if ((preview[0] as BoxDetailTemplate).templateId) {
      const detailPreview = preview as BoxDetailTemplate[];
      columns = detailPreview.map((c) => c);
    } else {
      return;
    }
  
    // Estilo del header
    previewSheet.getRow(1).font = {
      bold: true,
    };
    previewSheet.getRow(1).alignment = { horizontal: 'center' };
    // previewSheet.getRow(1).border = { bottom: { color: { argb: '000000' }, style: 'thick' } };
  
    // Workaround para iterar las celdas (eachCell)
    const maxRows = 999;
    const values = Array(maxRows).fill('');
    previewSheet.getColumn('Z').values = values;
    previewSheet.getColumn('Z').hidden = true;
  
    // Asignar valores del header (titulos de columnas)
    previewSheet.columns = columns.map((column) => {
      return {
        header: column.title,
        key: column.title,
        width: 20,
      };
    });
  
    // Iteracion de columnas para definir formatos y validaciones
    previewSheet.columns.forEach((column, index) => {
     
  
      const { dataType } = columns[index] as BoxDocumentColumnTemplate | BoxDetailTemplate;
      const { length } = columns[index] as BoxDetailTemplate;
  
      let type: DataValidation['type'];
      let formulae: DataValidation['formulae'];
      let operator: DataValidation['operator'];
      let allowBlank: DataValidation['allowBlank'];
      let error: DataValidation['error'];
      let numFmt: string;
  
      switch (dataType as DataType) {
        case undefined: {
          type = 'list';
          formulae = ['=TipoDocumentoPermitido!$A$1:$A$100'];
          error = 'El valor del campo debe ser elegido de la lista.';
          break;
        }
        case 'texto': {
          type = 'textLength';
          formulae = [length ?? ''];
          operator = length ? 'lessThanOrEqual' : undefined;
          error = `El valor del campo debe ser alfanumérico. Longitud máxima del campo: ${length ?? 'Sin máximo'}.`;
          break;
        }
        case 'entero': {
          type = 'whole';
          error = `El valor del campo debe ser un número entero. Longitud máxima del campo: ${length ?? 'Sin máximo'}.`;
          numFmt = '0';
          break;
        }
        case 'fecha': {
          type = 'date';
          error = `El valor del campo debe ser una fecha. Formato: DD/MM/AAAA.`;
          numFmt = 'dd/mm/yyyy';
          break;
        }
        default:
          break;
      }
  

  
      column.eachCell!({ includeEmpty: true }, (cell: Cell, rowNumber: number) => {
        
        if (rowNumber > 1) {
          cell.numFmt = numFmt;
          cell.dataValidation = {
            type,
            formulae,
            operator,
            allowBlank: false,
            showErrorMessage: true,
            errorStyle: 'error',
            errorTitle: 'Campo no válido',
            error,
          };
        }
      });
    });
   */
