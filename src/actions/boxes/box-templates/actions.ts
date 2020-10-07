import axios, { AxiosRequestConfig } from 'axios';
import { ObjectLiteral, QueryParams } from 'src/interfaces';
import { ThunkResult } from 'src/actions';
import { BoxTemplates, BoxTemplatesActionTypes, BoxTemplatesState } from './types';
import { API, apis } from 'src/services/api-data';
import { getAPIData } from 'src/utils/api';
import {
  BoxDetailTemplate,
  BoxDetailTemplateAPIResponse,
  BoxDocumentColumnTemplate,
  BoxDocumentTemplate,
  BoxDocumentTemplateAPIResponse,
  BoxLabelTemplate,
  BoxLabelTemplateAPIResponse,
  BoxTemplate,
  BoxTemplateAPIRequest,
  BoxTemplateAPIResponse,
} from './interfaces';
import { BoxFiltersState } from '../box-filters';
import { hashCode } from 'src/utils/string';
import { IRequestCache } from 'src/actions/interfaces';

/*
Example ...
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})*/

const reqCache: IRequestCache<any> = { cache: {} };

export const getBoxTemplates = (data: BoxFiltersState['selected']): ThunkResult => async (dispatch, getState) => {
  const state = getState();
  const isRunning = state.boxes.filters.isRunning;

  if (isRunning) return;

  const apiName = API.CAJA;
  const idMethod = 'preview';
  const api = getAPIData(apiName, idMethod);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const dataRequest: BoxTemplateAPIRequest = {
    idCaja: +data.boxType?.key!,
    tipoContenido: data.boxContentType?.value! as string,
    idPlantilla: +data.detailTemplate?.key!,
  };

  const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: dataRequest };

  const index = hashCode(config);

  if (reqCache.cache[index]) {
    console.log('Cached preview!!!');
    const cachedData = reqCache.cache[index].data;
    dispatch(success(cachedData));
    return;
  }

  dispatch(running(true));

  return await axios
    .request<BoxTemplateAPIResponse>(config)
    .then((response) => {
      let id = -1;

      // Type Guards # Cuando las response devuelvan el tipoContenido y idPlanilla, se debería corregir.
      if (!Array.isArray(response.data)) throw new Error('Unexpected response !!');

      if ((response.data as BoxDocumentTemplateAPIResponse[])[0].inclusiones) {
        const documentData: BoxDocumentTemplateAPIResponse[] = response.data as BoxDocumentTemplateAPIResponse[];

        const documentTemplate: BoxDocumentTemplate[] = documentData.map((d) => {
          return {
            id: d.id,
            description: d.descripcion,
            inclusions: d.inclusiones.map((i) => {
              return {
                title: i.descripcion,
                dataType: i.tipoDato,
                required: i.requerido,
              };
            }) as BoxDocumentColumnTemplate[],
          };
        }) as BoxDocumentTemplate[];

        reqCache.cache[index] = { data: documentTemplate };

        dispatch(success(documentTemplate));
      } else if ((response.data as BoxDetailTemplateAPIResponse[])[0].idPlantilla) {
        const detailData: BoxDetailTemplateAPIResponse[] = response.data as BoxDetailTemplateAPIResponse[];

        const detailTemplate: BoxDetailTemplate[] = detailData.map((d) => {
          id = d.idPlantilla;
          return {
            id: d.id,
            title: d.titulo,
            dataType: d.tipo,
            required: d.opcional,
            order: d.orden,
            length: d.longitud,
          } as BoxDetailTemplate;
        });

        reqCache.cache[index] = { data: detailTemplate };

        dispatch(success(detailTemplate));
      } else if ((response.data as BoxLabelTemplateAPIResponse[])[0].legacy) {
        const labelData: BoxLabelTemplateAPIResponse[] = response.data as BoxLabelTemplateAPIResponse[];

        const labelTemplate: BoxLabelTemplate[] = labelData.map((d) => {
          return {
            id: d.id,
            title: d.descripcion,
            // legacy: d.legacy,
            // version: d.version,
          } as BoxLabelTemplate;
        });

        reqCache.cache[index] = { data: labelTemplate };

        dispatch(success(labelTemplate));
      } else {
        throw new Error('Unexpected result !!');
      }
    })
    .catch((error) => {
      console.log('response error');
      dispatch(failure());
    });

  function running(running: BoxTemplatesState['isRunning']): BoxTemplatesActionTypes {
    return { type: BoxTemplates.RUNNING, payload: running };
  }

  function success(template: BoxTemplatesState['template']): BoxTemplatesActionTypes {
    return { type: BoxTemplates.GET_SUCCESS, payload: template };
  }

  function failure(): BoxTemplatesActionTypes {
    return { type: BoxTemplates.GET_FAILURE };
  }
};

export const clearBoxTemplates = (): ThunkResult => (dispatch, getState) => {
  dispatch(success());

  function success(): BoxTemplatesActionTypes {
    return { type: BoxTemplates.CLEAR };
  }
};
